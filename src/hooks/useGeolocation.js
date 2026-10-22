import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export default function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');
  const [tracking, setTracking] = useState(false);
  const watch = useRef(null);

  async function getCurrentLocation() {
    setError('');
    try {
      const result = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
      setPosition(result.coords);
    } catch (err) { setError(err.message); }
  }

  async function startTracking() {
    if (watch.current) return;
    setError('');
    // Guardar la promesa permite detener también una suscripción aún en creación.
    const pending = Geolocation.watchPosition({ enableHighAccuracy: true, timeout: 15000 }, (result, err) => {
      if (err) setError(err.message);
      else if (result) { setPosition(result.coords); setError(''); }
    });
    watch.current = pending;
    setTracking(true);
    try { await pending; }
    catch (err) {
      if (watch.current === pending) { watch.current = null; setTracking(false); }
      setError(err.message);
    }
  }

  async function stopTracking() {
    const pending = watch.current;
    watch.current = null;
    setTracking(false);
    if (pending) {
      try { await Geolocation.clearWatch({ id: await pending }); }
      catch (err) { setError(err.message); }
    }
  }

  useEffect(() => () => {
    if (watch.current) watch.current.then(id => Geolocation.clearWatch({ id })).catch(() => {});
  }, []);
  return { position, error, tracking, getCurrentLocation, startTracking, stopTracking };
}
