import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useIonViewWillLeave } from '@ionic/react';
import usePushNotifications from '../hooks/usePushNotifications.js';

export default function PushNotificationsPage() {
  const { supported, token, notification, error, status, register, stop } = usePushNotifications();
  useIonViewWillLeave(() => { void stop(); });
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Notificaciones push</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        {!supported && <p>Las notificaciones push requieren la app instalada y Firebase configurado. Este plugin no funciona en navegador.</p>}
        <IonButton disabled={!supported} onClick={register}>Activar push</IonButton>
        <p>Estado: {status}</p>
        {token && <><p>Token del dispositivo:</p><pre>{token}</pre></>}
        {notification && <><h2>{notification.title}</h2><p>{notification.body}</p></>}
        <p>En Android, usa el token de registro para enviar un mensaje de prueba desde Firebase Messaging.</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
