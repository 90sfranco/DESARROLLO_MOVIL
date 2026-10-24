import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';

const preferenceKey = 'parcial2:notifications-enabled';

export default function useLocalNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [pending, setPending] = useState(Capacitor.isNativePlatform());
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const enabledRef = useRef(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let active = true;
    async function refreshPermission() {
      try {
        const permission = await LocalNotifications.checkPermissions();
        if (!active) return;
        const allowed = permission.display === 'granted' && localStorage.getItem(preferenceKey) !== 'false';
        enabledRef.current = allowed;
        setEnabled(allowed);
        setError('');
      } catch (err) {
        if (active) setError(`No se pudo consultar el permiso de notificaciones: ${err.message}`);
      } finally {
        if (active) setPending(false);
      }
    }
    void refreshPermission();
    const listener = App.addListener('appStateChange', state => {
      if (state.isActive) void refreshPermission();
    });
    return () => {
      active = false;
      listener.then(handle => handle.remove()).catch(() => {});
    };
  }, []);

  async function enable() {
    if (pending) return false;
    setError('');
    if (!Capacitor.isNativePlatform()) {
      setError('Las notificaciones locales se reciben en la aplicación Android.');
      return false;
    }
    setPending(true);
    try {
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        enabledRef.current = false;
        setEnabled(false);
        throw new Error('Permite las notificaciones en los ajustes del teléfono.');
      }
      localStorage.setItem(preferenceKey, 'true');
      enabledRef.current = true;
      setEnabled(true);
      setNotice('Notificaciones activadas.');
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { setPending(false); }
  }

  async function disable() {
    if (pending) return false;
    setPending(true); setError('');
    try {
      localStorage.setItem(preferenceKey, 'false');
      enabledRef.current = false;
      setEnabled(false);
      await LocalNotifications.cancelAll();
      setNotice('Notificaciones desactivadas.');
      return true;
    } catch (err) { setError(`No se pudieron desactivar todas las notificaciones: ${err.message}`); return false; }
    finally { setPending(false); }
  }

  async function missionCompleted(id, remaining) {
    setNotice(remaining === 1 ? 'Has completado una misión. Te falta 1 misión para completar.' : 'Has completado una misión.');
    if (!Capacitor.isNativePlatform() || !enabledRef.current) return;
    try {
      const permission = await LocalNotifications.checkPermissions();
      if (permission.display !== 'granted') {
        enabledRef.current = false;
        setEnabled(false);
        setError('Activa las notificaciones para recibir los avisos del sistema.');
        return;
      }
      if (!enabledRef.current) return;
      const notifications = [{ id: 200 + id, title: 'Misiones', body: 'Has completado una misión' }];
      if (remaining === 1) notifications.push({ id: 210 + id, title: 'Misiones', body: 'Te falta 1 misión para completar' });
      await LocalNotifications.schedule({ notifications });
      if (!enabledRef.current) {
        await LocalNotifications.cancel({ notifications: notifications.map(({ id }) => ({ id })) });
      }
      setError('');
    } catch (err) { setError(`No se pudo mostrar la notificación: ${err.message}`); }
  }
  return { enabled, pending, enable, disable, missionCompleted, notice, error };
}
