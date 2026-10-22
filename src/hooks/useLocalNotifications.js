import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export default function useLocalNotifications() {
  const [permission, setPermission] = useState('Sin solicitar');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supported = Capacitor.isNativePlatform();
  async function requestPermission() {
    setError('');
    try {
      const result = await LocalNotifications.requestPermissions();
      setPermission(result.display);
      return result.display === 'granted';
    } catch (err) { setError(err.message); return false; }
  }
  async function sendNotification(seconds = 0) {
    setError(''); setMessage('');
    if (!await requestPermission()) return;
    try {
      await LocalNotifications.schedule({ notifications: [{
        id: 7, title: 'Challenge 07', body: 'Ejemplo de notificación local',
        ...(seconds > 0 ? { schedule: { at: new Date(Date.now() + seconds * 1000) } } : {}),
      }] });
      setMessage(seconds ? 'Notificación programada; el sistema puede retrasar la entrega.' : 'Notificación enviada al sistema.');
    } catch (err) { setError(err.message); }
  }
  async function cancelNotification() {
    setError(''); setMessage('');
    try { await LocalNotifications.cancel({ notifications: [{ id: 7 }] }); setMessage('Programación cancelada.'); }
    catch (err) { setError(err.message); }
  }
  return { supported, permission, message, error, requestPermission, sendNotification, cancelNotification };
}
