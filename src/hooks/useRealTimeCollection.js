import { useEffect, useState } from 'react';
import { onValue, push, ref, remove as removeRecord, set, update as updateRecord } from 'firebase/database';
import { realtime } from '../firebase/config.js';

export default function useRealTimeCollection(table, isOnline) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!table || !realtime || !isOnline) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    return onValue(ref(realtime, table), (snapshot) => {
      const values = snapshot.val() ?? {};
      setResults(Object.entries(values).map(([id, data]) => ({ ...data, id })));
      setLoading(false);
    }, (err) => {
      setError(`No se pudieron cargar las tareas (${err.code}).`);
      setLoading(false);
    });
  }, [table, isOnline]);

  async function save(id, data) {
    if (!table || !isOnline || !realtime) return false;
    setPending(true);
    setError('');
    try {
      if (id) {
        await updateRecord(ref(realtime, `${table}/${id}`), data);
      } else {
        await set(push(ref(realtime, table)), data);
      }
      return true;
    } catch (err) {
      setError(`No se pudo guardar la tarea (${err.code ?? 'error de conexión'}).`);
      return false;
    } finally {
      setPending(false);
    }
  }

  async function remove(id) {
    if (!table || !isOnline || !realtime) return false;
    setPending(true);
    setError('');
    try {
      await removeRecord(ref(realtime, `${table}/${id}`));
      return true;
    } catch (err) {
      setError(`No se pudo eliminar la tarea (${err.code ?? 'error de conexión'}).`);
      return false;
    } finally {
      setPending(false);
    }
  }

  return {
    results, loading, pending, available: Boolean(realtime),
    error: realtime ? error : 'Configura VITE_FIREBASE_DATABASE_URL para usar las tareas.',
    add: (data) => save(null, data), update: (id, data) => save(id, data), remove,
  };
}
