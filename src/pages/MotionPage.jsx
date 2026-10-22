import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useIonViewWillLeave } from '@ionic/react';
import useAccelerometer from '../hooks/useAccelerometer.js';

export default function MotionPage() {
  const { acceleration, orientation, magnitude, active, error, start, stop } = useAccelerometer();
  useIonViewWillLeave(() => { void stop(); });
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Movimiento</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton disabled={active} onClick={start}>Iniciar</IonButton>
        <IonButton disabled={!active} onClick={stop}>Detener</IonButton>
        <p>Escucha: {active ? 'Activa' : 'Detenida'}</p>
        {!acceleration && <p>Sin lecturas del acelerómetro. Prueba en un teléfono con sensores y permisos.</p>}
        {acceleration && <>
          <p>X: {acceleration.x ?? 'No disponible'} m/s²</p>
          <p>Y: {acceleration.y ?? 'No disponible'} m/s²</p>
          <p>Z: {acceleration.z ?? 'No disponible'} m/s²</p>
          <p>Magnitud (suma absoluta): {magnitude.toFixed(2)}</p>
          <p>Movimiento: {magnitude > 2 ? 'Sí' : 'No'}</p>
          {magnitude > 18 && <p>¡Agitación detectada!</p>}
        </>}
        {orientation && <>
          <p>Alfa: {orientation.alpha ?? 'No disponible'}°</p>
          <p>Beta: {orientation.beta ?? 'No disponible'}°</p>
          <p>Gamma: {orientation.gamma ?? 'No disponible'}°</p>
        </>}
        <p>Los umbrales 2 y 18 siguen el ejemplo de clase. En navegador se requiere localhost o HTTPS.</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
