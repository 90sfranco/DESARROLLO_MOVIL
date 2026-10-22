import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { ImpactStyle, NotificationType } from '@capacitor/haptics';
import useHaptics from '../hooks/useHaptics.js';

export default function HapticsPage() {
  const { error, message, impact, notify, vibrate } = useHaptics();
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Vibración</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => impact(ImpactStyle.Light)}>Impacto suave</IonButton>
        <IonButton onClick={() => impact(ImpactStyle.Heavy)}>Impacto fuerte</IonButton>
        <IonButton onClick={() => notify(NotificationType.Success)}>Éxito</IonButton>
        <IonButton onClick={() => notify(NotificationType.Error)}>Error</IonButton>
        <IonButton onClick={vibrate}>Vibrar</IonButton>
        <p>{message}</p><p>Requiere un dispositivo con vibrador. Una solicitud aceptada no confirma que haya vibración física.</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
