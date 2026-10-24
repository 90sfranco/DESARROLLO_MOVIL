import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { firestore } from '../firebase/config.js';
import { mergeProgress, sameProgress } from '../data/missions.js';

export default function useProgress(user) {
  const storageKey = `parcial2:progress:${user.uid}`;
  const [localError, setLocalError] = useState('');
  const [progress, setProgress] = useState(() => {
    try { return mergeProgress(JSON.parse(localStorage.getItem(storageKey))); }
    catch { return mergeProgress(); }
  });
  const current = useRef(progress);
  const alive = useRef(false);
  const syncing = useRef(false);
  const syncAgain = useRef(false);
  const [syncStatus, setSyncStatus] = useState('Pendiente de enviar a Firebase');
  const [cloudError, setCloudError] = useState('');

  const save = useCallback(next => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setLocalError('');
    } catch {
      setLocalError('No se pudo guardar el progreso local. Libera espacio y vuelve a intentarlo.');
      return false;
    }
    if (!sameProgress(current.current, next)) {
      current.current = next;
      setProgress(next);
    }
    return true;
  }, [storageKey]);

  const sync = useCallback(async function sendProgress() {
    if (!firestore || !alive.current) return;
    if (syncing.current) { syncAgain.current = true; return; }
    syncing.current = true;
    setSyncStatus('Enviando a Firebase…');
    setCloudError('');
    const sent = current.current;
    try {
      const progressRef = doc(firestore, 'parcial2Progress', user.uid);
      const rankingRef = doc(firestore, 'parcial2Ranking', user.uid);
      const merged = await runTransaction(firestore, async transaction => {
        const snapshot = await transaction.get(progressRef);
        const next = mergeProgress(snapshot.data(), sent);
        transaction.set(progressRef, next);
        // El ranking expone un alias y puntos, nunca el correo ni la fotografía.
        transaction.set(rankingRef, { name: `Jugador ${user.uid.slice(0, 6)}`, points: next.points });
        return next;
      });
      if (!alive.current) return;
      save(mergeProgress(current.current, merged));
      setSyncStatus(sameProgress(current.current, merged) ? 'Guardado en Firebase y local' : 'Cambios pendientes de enviar');
    } catch (error) {
      if (!alive.current) return;
      setSyncStatus('Pendiente de enviar a Firebase');
      setCloudError(error.code === 'permission-denied'
        ? 'Firebase rechazó el acceso. Revisa las reglas de Firestore para el parcial.'
        : 'No se pudo enviar a Firebase. El progreso local se conserva; puedes reintentar.');
    } finally {
      syncing.current = false;
      if (alive.current && syncAgain.current) {
        syncAgain.current = false;
        void sendProgress();
      }
    }
  }, [save, user.uid]);

  useEffect(() => {
    alive.current = true;
    window.addEventListener('online', sync);
    const unsubscribe = onSnapshot(doc(firestore, 'parcial2Progress', user.uid), snapshot => {
      if (snapshot.exists()) save(mergeProgress(current.current, snapshot.data()));
    }, () => setCloudError('No se pudo leer el progreso remoto. Revisa tu conexión y las reglas de Firestore.'));
    return () => {
      alive.current = false;
      window.removeEventListener('online', sync);
      unsubscribe();
    };
  }, [save, sync, user.uid]);

  useEffect(() => { void sync(); }, [progress, sync]);

  const complete = useCallback(id => {
    if (current.current.missions.find(m => m.id === id)?.completed) return false;
    if (id === 3 && !current.current.missions[1].completed) return false;
    const next = mergeProgress(current.current, { missions: [{ id, completed: true }] });
    return save(next) ? next : false;
  }, [save]);

  return { progress, complete, sync, syncStatus, error: localError || cloudError };
}
