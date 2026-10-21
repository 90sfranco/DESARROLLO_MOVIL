import { useCallback, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config.js';

export default function useCollection(table, isOnline) {
  const [results, setResults] = useState([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const getAll = useCallback(async () => {
    if (!isOnline || !firestore) return false;
    setPending(true);
    setError('');
    try {
      const snapshot = await getDocs(collection(firestore, table));
      setResults(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })));
      return true;
    } catch (err) {
      setError(`No se pudieron cargar los contactos (${err.code ?? 'error de conexión'}).`);
      return false;
    } finally {
      setPending(false);
    }
  }, [table, isOnline]);

  async function save(id, data) {
    if (!isOnline || !firestore) return false;
    setPending(true);
    setError('');
    try {
      if (id) {
        await updateDoc(doc(firestore, table, id), data);
        setResults((items) => items.map((item) => item.id === id ? { ...item, ...data } : item));
      } else {
        const created = await addDoc(collection(firestore, table), data);
        setResults((items) => [...items, { ...data, id: created.id }]);
      }
      return true;
    } catch (err) {
      setError(`No se pudo guardar el contacto (${err.code ?? 'error de conexión'}).`);
      return false;
    } finally {
      setPending(false);
    }
  }

  async function remove(id) {
    if (!isOnline || !firestore) return false;
    setPending(true);
    setError('');
    try {
      await deleteDoc(doc(firestore, table, id));
      setResults((items) => items.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      setError(`No se pudo eliminar el contacto (${err.code ?? 'error de conexión'}).`);
      return false;
    } finally {
      setPending(false);
    }
  }

  return {
    results, pending, error: firestore ? error : 'Revisa la configuración de Firebase.', getAll,
    add: (data) => save(null, data), update: (id, data) => save(id, data), remove,
  };
}
