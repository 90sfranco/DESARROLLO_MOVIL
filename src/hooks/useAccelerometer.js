import { useEffect, useRef, useState } from 'react';
import { Motion } from '@capacitor/motion';

export default function useAccelerometer() {
  const [acceleration, setAcceleration] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const listeners = useRef([]);
  const starting = useRef(false);

  async function start() {
    if (starting.current || listeners.current.length) return;
    starting.current = true;
    setError('');
    try {
      for (const eventType of [window.DeviceMotionEvent, window.DeviceOrientationEvent]) {
        if (typeof eventType?.requestPermission === 'function') {
          const permission = await eventType.requestPermission();
          if (permission !== 'granted') throw new Error('Permiso de movimiento denegado.');
        }
      }
      if (!starting.current) return;
      listeners.current = [
        Motion.addListener('accel', event => {
          const value = event.acceleration;
          setAcceleration(value && [value.x, value.y, value.z].some(Number.isFinite) ? value : null);
        }),
        Motion.addListener('orientation', event => setOrientation(event)),
      ];
      await Promise.all(listeners.current);
      setActive(starting.current);
    } catch (err) { await stop(); setError(err.message); }
    finally { starting.current = false; }
  }

  async function stop() {
    starting.current = false;
    const pending = listeners.current;
    listeners.current = [];
    setActive(false);
    await Promise.all(pending.map(async item => {
      try { await (await item).remove(); } catch (err) { setError(err.message); }
    }));
  }

  useEffect(() => () => {
    starting.current = false;
    listeners.current.forEach(item => item.then(listener => listener.remove()).catch(() => {}));
  }, []);
  const magnitude = acceleration
    ? Math.abs(acceleration.x ?? 0) + Math.abs(acceleration.y ?? 0) + Math.abs(acceleration.z ?? 0)
    : 0;
  return { acceleration, orientation, magnitude, active, error, start, stop };
}
