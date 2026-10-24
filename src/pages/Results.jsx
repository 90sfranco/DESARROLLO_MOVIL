import { useContext } from 'react';
import { IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';
import { MissionsContext } from '../context/MissionsContext.jsx';
import PageLayout from '../components/PageLayout.jsx';
import ProgressSummary from '../components/ProgressSummary.jsx';
import useRanking from '../hooks/useRanking.js';
import { MISSIONS } from '../data/missions.js';

export default function Results() {
  const { user } = useContext(AuthContext);
  const { progress } = useContext(MissionsContext);
  const { ranking, loading, error } = useRanking(user, progress.points);
  const count = progress.missions.filter(m => m.completed).length;
  return <PageLayout title="Resultados">
    <h1>Tus resultados</h1>
    <ProgressSummary />
    <p><strong>Estado general: </strong>{count === MISSIONS.length ? 'Todas las misiones completadas' : count ? 'En progreso' : 'Sin comenzar'}</p>
    <IonList>
      {MISSIONS.map(mission => <IonItem key={mission.id}>
        <IonLabel>{mission.title}</IonLabel>
        <IonNote slot="end">{progress.missions.find(m => m.id === mission.id)?.completed ? 'Completada' : 'Pendiente'}</IonNote>
      </IonItem>)}
    </IonList>
    <h2>Ranking · Top 5</h2>
    <p>Tu puntaje frente a los cuatro mejores participantes disponibles. Los empates se ordenan por identificador de usuario.</p>
    {loading ? <p>Cargando participantes…</p> : error ? <p role="alert" className="error">{error}</p> : <>
      <IonList>
        {ranking.map((player, index) => <IonItem key={player.uid} color={player.uid === user.uid ? 'light' : undefined}>
          <IonLabel>{index + 1}. {player.uid === user.uid ? 'Tú' : player.name}</IonLabel>
          <IonNote slot="end">{player.points} puntos</IonNote>
        </IonItem>)}
      </IonList>
      {ranking.length < 5 && <p>Hay {ranking.length} de 5 participantes disponibles. El ranking se completa cuando más usuarios reales ingresan a la app.</p>}
    </>}
  </PageLayout>;
}
