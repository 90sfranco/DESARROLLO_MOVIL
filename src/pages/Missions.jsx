import { useContext } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, useIonViewWillLeave } from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';
import { MissionsContext } from '../context/MissionsContext.jsx';
import PageLayout from '../components/PageLayout.jsx';
import ProgressSummary from '../components/ProgressSummary.jsx';
import useEvidence from '../hooks/useEvidence.js';
import useMissionSensors from '../hooks/useMissionSensors.js';
import { MISSIONS, STILL_SECONDS, TARGET_METERS } from '../data/missions.js';

export default function Missions() {
  const { user } = useContext(AuthContext);
  const { progress, completeMission, notifications } = useContext(MissionsContext);
  const evidence = useEvidence(user.uid, completeMission);
  const sensors = useMissionSensors(completeMission);
  const completed = id => progress.missions.find(m => m.id === id)?.completed;
  useIonViewWillLeave(() => sensors.stop());

  return <PageLayout title="Misiones">
    <h1>Completa tus misiones</h1>
    <ProgressSummary />
    <IonButton className="progress-action" fill="outline"
      onClick={notifications.enabled ? notifications.disable : notifications.enable}
      disabled={notifications.pending}>
      {notifications.enabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
    </IonButton>
    {notifications.notice && <p role="status">{notifications.notice}</p>}
    {notifications.error && <p role="alert" className="error">{notifications.error}</p>}
    {MISSIONS.map(mission => <IonCard key={mission.id}>
      <IonCardHeader><IonCardTitle>{mission.id}. {mission.title}</IonCardTitle></IonCardHeader>
      <IonCardContent>
        <p>{mission.description}</p>
        <p><strong>{completed(mission.id) ? 'Completada' : 'Pendiente'}</strong> · {mission.points} puntos</p>
        {mission.id === 1 && <>
          {evidence.photo && <img className="evidence" src={evidence.photo} alt="Fotografía guardada como evidencia de la misión" />}
          <IonButton onClick={evidence.takePhoto} disabled={completed(1) || evidence.busy || Boolean(sensors.active)}>
            {evidence.busy ? 'Guardando imagen…' : 'Tomar y guardar foto'}
          </IonButton>
          {evidence.error && <p role="alert" className="error">{evidence.error}</p>}
        </>}
        {mission.id === 2 && <>
          <p>Desplazamiento: {sensors.distance.toFixed(1)} / {TARGET_METERS} m</p>
          {sensors.accuracy !== null && <p>Precisión GPS: ±{Math.round(sensors.accuracy)} m</p>}
          <IonButton onClick={sensors.startWalking} disabled={completed(2) || Boolean(sensors.active) || evidence.busy}>
            Iniciar recorrido
          </IonButton>
        </>}
        {mission.id === 3 && <>
          {!completed(2) && <p>Se habilita al completar el recorrido de {TARGET_METERS} metros.</p>}
          <p>Tiempo quieto: {completed(3) ? STILL_SECONDS : sensors.seconds} / {STILL_SECONDS} segundos</p>
          <IonButton onClick={sensors.startStillness} disabled={!completed(2) || completed(3) || Boolean(sensors.active) || evidence.busy}>
            Iniciar permanencia
          </IonButton>
        </>}
      </IonCardContent>
    </IonCard>)}
    {sensors.active && <IonButton color="medium" onClick={sensors.stop}>Detener misión</IonButton>}
    {sensors.message && <p role="status">{sensors.message}</p>}
    {sensors.error && <p role="alert" className="error">{sensors.error}</p>}
    <IonButton expand="block" routerLink="/results">Ver resultados y ranking</IonButton>
  </PageLayout>;
}
