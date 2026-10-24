import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '../firebase/config.js';

export default function useRanking(user, points) {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => onSnapshot(
    query(collection(firestore, 'parcial2Ranking'), orderBy('points', 'desc'), limit(5)),
    snapshot => {
      setPlayers(snapshot.docs.map(item => ({ uid: item.id, ...item.data() })));
      setLoading(false); setError('');
    }, () => {
      setLoading(false);
      setError('No se pudo cargar el ranking de Firebase. Revisa la conexión y los permisos.');
    },
  ), []);
  const others = players.filter(player => player.uid !== user.uid).slice(0, 4);
  const ranking = [...others, { uid: user.uid, name: 'Tú', points }]
    .sort((a, b) => b.points - a.points || a.uid.localeCompare(b.uid));
  return { ranking, loading, error };
}
