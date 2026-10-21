import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../database/db.js';

export default function useDexie(userId) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const data = useLiveQuery(async () => {
    try {
      const results = await db.fruits.where('userId').equals(userId).toArray();
      return { results, error: '' };
    } catch {
      return { results: [], error: 'No se pudo abrir la base de datos local.' };
    }
  }, [userId]);

  async function save(id, nombre) {
    setPending(true);
    setError('');
    try {
      if (id !== null) {
        const fruit = await db.fruits.get(id);
        if (!fruit || fruit.userId !== userId) throw new Error('Fruta inexistente');
        await db.fruits.update(id, { nombre: nombre.trim() });
      } else {
        await db.fruits.add({ userId, nombre: nombre.trim() });
      }
      return true;
    } catch {
      setError('No se pudo guardar la fruta en este dispositivo.');
      return false;
    } finally {
      setPending(false);
    }
  }
  async function remove(id) {
    setPending(true);
    setError('');
    try {
      const fruit = await db.fruits.get(id);
      if (!fruit || fruit.userId !== userId) throw new Error('Fruta inexistente');
      await db.fruits.delete(id);
      return true;
    } catch {
      setError('No se pudo eliminar la fruta.');
      return false;
    } finally {
      setPending(false);
    }
  }
  return {
    results: data?.results ?? [], loading: data === undefined, pending, error: data?.error || error,
    add: (nombre) => save(null, nombre), update: (id, nombre) => save(id, nombre), remove,
  };
}
