import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

export default function usePushNotifications() {
  const [token, setToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('Sin registrar');
  const listeners = useRef([]);
  const supported = Capacitor.isNativePlatform();
  const busy = useRef(false);

  async function register() {
    if (!supported || busy.current) return;
    busy.current = true;
    setError(''); setStatus('Solicitando permiso…');
    try {
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') throw new Error('Permiso de notificaciones denegado.');
      if (!busy.current) return;
      if (!listeners.current.length) {
        listeners.current = [
          PushNotifications.addListener('registration', value => { setToken(value.value); setStatus('Registrado'); }),
          PushNotifications.addListener('registrationError', err => { setError(err.error); setStatus('Error de registro'); }),
          PushNotifications.addListener('pushNotificationReceived', value => setNotification(value)),
          PushNotifications.addListener('pushNotificationActionPerformed', action => setNotification(action.notification)),
        ];
        await Promise.all(listeners.current);
      }
      if (!busy.current) return;
      setStatus('Esperando token…');
      await PushNotifications.register();
    } catch (err) { setError(err.message); setStatus('No registrado'); }
    finally { busy.current = false; }
  }

  async function stop() {
    busy.current = false;
    const pending = listeners.current;
    listeners.current = [];
    await Promise.all(pending.map(async item => {
      try { await (await item).remove(); } catch (err) { setError(err.message); }
    }));
  }
  useEffect(() => () => {
    busy.current = false;
    listeners.current.forEach(item => item.then(listener => listener.remove()).catch(() => {}));
  }, []);
  return { supported, token, notification, error, status, register, stop };
}
