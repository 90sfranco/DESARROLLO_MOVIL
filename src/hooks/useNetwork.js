import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

export default function useNetwork() {
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let listener;
    let receivedChange = false;
    function updateStatus(status) {
      if (!active) return;
      setIsOnline(status.connected);
      setChecking(false);
      setError('');
    }
    async function start() {
      try {
        listener = await Network.addListener('networkStatusChange', (status) => {
          receivedChange = true;
          updateStatus(status);
        });
        if (!active) {
          await listener.remove();
          return;
        }
        const status = await Network.getStatus();
        if (!receivedChange) updateStatus(status);
      } catch {
        if (active) {
          setChecking(false);
          setIsOnline(false);
          setError('No se pudo comprobar la conexión.');
        }
      }
    }
    start();
    return () => {
      active = false;
      listener?.remove();
    };
  }, []);

  return { isOnline, checking, error };
}
