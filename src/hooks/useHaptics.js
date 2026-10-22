import { useState } from 'react';
import { Haptics } from '@capacitor/haptics';

export default function useHaptics() {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function impact(style) {
    setError(''); setMessage('');
    try { await Haptics.impact({ style }); setMessage('Solicitud de impacto enviada.'); }
    catch (err) { setError(err.message); }
  }
  async function notify(type) {
    setError(''); setMessage('');
    try { await Haptics.notification({ type }); setMessage('Solicitud de aviso enviada.'); }
    catch (err) { setError(err.message); }
  }
  async function vibrate() {
    setError(''); setMessage('');
    try { await Haptics.vibrate({ duration: 300 }); setMessage('Solicitud de vibración enviada.'); }
    catch (err) { setError(err.message); }
  }
  return { error, message, impact, notify, vibrate };
}
