import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import useLocalNotifications from '../hooks/useLocalNotifications.js';

export default function LocalNotificationsPage() {
  const { supported, permission, message, error, requestPermission, sendNotification, cancelNotification } = useLocalNotifications();
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Notificaciones locales</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        {!supported && <p>Este plugin requiere la app instalada en Android o iOS.</p>}
        <p>Permiso: {permission}</p>
        <IonButton disabled={!supported} onClick={requestPermission}>Solicitar permiso</IonButton>
        <IonButton disabled={!supported} onClick={() => sendNotification()}>Enviar ahora</IonButton>
        <IonButton disabled={!supported} onClick={() => sendNotification(5)}>Programar en 5 segundos</IonButton>
        <IonButton disabled={!supported} onClick={cancelNotification}>Cancelar programación</IonButton>
        <p>{message}</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
