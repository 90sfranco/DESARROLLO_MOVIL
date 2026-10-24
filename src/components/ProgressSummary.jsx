import { useContext } from 'react';
import { IonButton, IonProgressBar } from '@ionic/react';
import { MissionsContext } from '../context/MissionsContext.jsx';
import { MISSIONS } from '../data/missions.js';

export default function ProgressSummary() {
  const { progress, sync, syncStatus, error } = useContext(MissionsContext);
  const completed = progress.missions.filter(m => m.completed).length;
  return <section aria-label="Tu progreso">
    <h2>{progress.points} puntos</h2>
    <p>{completed} / {MISSIONS.length} misiones completadas · {Math.round(completed / MISSIONS.length * 100)} %</p>
    <IonProgressBar value={completed / MISSIONS.length} aria-label="Progreso de misiones" />
    <p role="status">{syncStatus}</p>
    {error && <p className="error" role="alert">{error}</p>}
    <IonButton className="progress-action" fill="outline" onClick={sync} disabled={syncStatus === 'Enviando a Firebase…'}>
      Sincronizar puntos
    </IonButton>
  </section>;
}
