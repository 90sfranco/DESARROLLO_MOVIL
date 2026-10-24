import { useCallback, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Geolocation } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';
import { Haptics } from '@capacitor/haptics';
import { distanceInMeters, MOTION_THRESHOLD, STILL_SECONDS, TARGET_METERS } from '../data/missions.js';

export default function useMissionSensors(completeMission) {
  const [active, setActive] = useState('');
  const [distance, setDistance] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const session = useRef(0);
  const alive = useRef(false);
  const appVisible = useRef(true);
  const mode = useRef('');
  const gps = useRef(null);
  const motion = useRef(null);
  const timer = useRef(null);
  const complete = useRef(completeMission);
  useEffect(() => { complete.current = completeMission; }, [completeMission]);

  const stop = useCallback(() => {
    session.current += 1;
    mode.current = '';
    if (gps.current) gps.current.then(id => Geolocation.clearWatch({ id })).catch(() => {});
    if (motion.current) motion.current.then(listener => listener.remove()).catch(() => {});
    gps.current = null; motion.current = null;
    clearInterval(timer.current); timer.current = null;
    if (alive.current) { setActive(''); setSeconds(0); }
  }, []);

  useEffect(() => {
    alive.current = true;
    function visibilityChanged(visible) {
      appVisible.current = visible;
      if (!visible && ['gps', 'still'].includes(mode.current)) {
        stop();
        setMessage('La misión se detuvo al salir de la app o bloquear la pantalla. Iníciala de nuevo.');
      }
    }
    const onVisibility = () => visibilityChanged(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    const appListener = App.addListener('appStateChange', state => visibilityChanged(state.isActive));
    return () => {
      alive.current = false; stop();
      document.removeEventListener('visibilitychange', onVisibility);
      appListener.then(listener => listener.remove()).catch(() => {});
    };
  }, [stop]);

  async function startWalking() {
    if (mode.current) return;
    setError(''); setMessage('Solicitando ubicación…');
    const attempt = ++session.current;
    mode.current = 'preparing'; setActive('preparing');
    try {
      if (Capacitor.isNativePlatform()) {
        const permission = await Geolocation.requestPermissions({ permissions: ['location'] });
        if (permission.location !== 'granted') throw new Error('Habilita la ubicación precisa en los ajustes del teléfono.');
      }
      if (!alive.current || attempt !== session.current) return;
      if (!appVisible.current) { stop(); return; }
      let origin = null;
      setDistance(0); setAccuracy(null);
      mode.current = 'gps'; setActive('gps');
      setMessage('Esperando una ubicación precisa. Realiza la misión al aire libre.');
      const pending = Geolocation.watchPosition({
        enableHighAccuracy: true, maximumAge: 0, timeout: 15000, minimumUpdateInterval: 1000,
      }, (position, err) => {
        if (!alive.current || session.current !== attempt) return;
        if (err) { stop(); setError(err.message || 'No se pudo obtener la ubicación.'); return; }
        if (!position || document.hidden || !appVisible.current) return;
        const coords = position.coords;
        if (!Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) return;
        setAccuracy(coords.accuracy);
        if (!Number.isFinite(coords.accuracy) || coords.accuracy > 20 || Date.now() - position.timestamp > 15000) {
          setMessage('Esperando una lectura reciente con precisión de 20 m o mejor.');
          return;
        }
        if (!origin) {
          origin = coords;
          setMessage(`Posición inicial registrada. Aléjate ${TARGET_METERS} metros de este punto.`);
        }
        const meters = distanceInMeters(origin, coords);
        setDistance(meters);
        if (meters >= TARGET_METERS) {
          stop();
          if (complete.current(2)) setMessage('Movimiento completado. Ya puedes iniciar la permanencia activa.');
          else setError('No se pudo guardar el progreso del recorrido. Vuelve a intentarlo.');
        }
      });
      gps.current = pending;
      await pending;
      // El callback puede completar/cancelar antes de que se resuelva el identificador.
      if (attempt !== session.current) {
        if (gps.current === pending) gps.current = null;
        await Geolocation.clearWatch({ id: await pending });
      }
    } catch (err) {
      if (attempt === session.current) { stop(); setError(err.message || 'No se pudo activar el GPS.'); }
    }
  }

  async function startStillness() {
    if (mode.current) return;
    setError(''); setMessage('Activando acelerómetro…');
    const attempt = ++session.current;
    mode.current = 'preparing'; setActive('preparing');
    try {
      if (typeof window.DeviceMotionEvent?.requestPermission === 'function') {
        const permission = await window.DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') throw new Error('Permiso de movimiento denegado.');
      }
      if (!alive.current || attempt !== session.current) return;
      if (!appVisible.current) { stop(); return; }
      mode.current = 'still'; setActive('still'); setSeconds(0);
      setMessage('Mantén el teléfono quieto y la app abierta. Esperando datos del acelerómetro…');
      let stillSince = null;
      let lastSample = 0;
      const startedAt = performance.now();
      const pending = Motion.addListener('accel', async event => {
        if (!alive.current || session.current !== attempt || document.hidden || !appVisible.current) return;
        const a = event.acceleration;
        const g = event.accelerationIncludingGravity;
        let magnitude;
        if (a && [a.x, a.y, a.z].every(Number.isFinite)) {
          magnitude = Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);
        } else if (g && [g.x, g.y, g.z].every(Number.isFinite)) {
          magnitude = Math.abs(Math.hypot(g.x, g.y, g.z) - 9.81);
        } else return;
        const now = performance.now();
        // Sin muestras recientes no hay evidencia de permanencia continua.
        if (now - lastSample > 1000 || magnitude > MOTION_THRESHOLD) stillSince = null;
        lastSample = now;
        if (magnitude > MOTION_THRESHOLD) {
          setSeconds(0); setMessage('Se detectó movimiento. El conteo vuelve a empezar.'); return;
        }
        stillSince ??= now;
        const elapsed = (now - stillSince) / 1000;
        setSeconds(Math.min(STILL_SECONDS, Math.floor(elapsed)));
        setMessage('Sin movimiento. Conserva el teléfono quieto.');
        if (elapsed >= STILL_SECONDS) {
          stop();
          const finishAttempt = session.current;
          try {
            await Haptics.vibrate({ duration: 600 });
            if (!alive.current || finishAttempt !== session.current || document.hidden || !appVisible.current) return;
            if (complete.current(3)) setMessage('Permanencia completada: 10 segundos quieto y vibración enviada.');
            else setError('No se pudo guardar el progreso de la permanencia. Vuelve a intentarlo.');
          } catch (err) { if (alive.current) setError(`No se pudo activar la vibración: ${err.message}`); }
        }
      });
      motion.current = pending;
      await pending;
      if (attempt !== session.current) {
        if (motion.current === pending) motion.current = null;
        await (await pending).remove(); return;
      }
      timer.current = setInterval(() => {
        const now = performance.now();
        if (!lastSample && now - startedAt > 5000) {
          stop(); setError('No llegan datos del acelerómetro. Usa un teléfono con el sensor habilitado.');
        } else if (lastSample && now - lastSample > 1000) {
          stillSince = null; setSeconds(0);
          setMessage('El sensor dejó de enviar datos. El conteo se reinicia hasta recibir nuevas lecturas.');
        }
      }, 250);
    } catch (err) {
      if (attempt === session.current) { stop(); setError(err.message || 'No se pudo activar el acelerómetro.'); }
    }
  }
  return { active, distance, accuracy, seconds, message, error, startWalking, startStillness, stop };
}
