import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

export default function Home() {
  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Challenge 07</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <h1>Sensores y funciones nativas</h1>
        <p>Selecciona un ejemplo de la clase.</p>
        <IonButton expand="block" routerLink="/geolocation">Geolocalización</IonButton>
        <IonButton expand="block" routerLink="/camera">Cámara</IonButton>
        <IonButton expand="block" routerLink="/motion">Movimiento</IonButton>
        <IonButton expand="block" routerLink="/device">Dispositivo</IonButton>
        <IonButton expand="block" routerLink="/haptics">Vibración</IonButton>
        <IonButton expand="block" routerLink="/filesystem">Archivos</IonButton>
        <IonButton expand="block" routerLink="/local-notifications">Notificaciones locales</IonButton>
        <IonButton expand="block" routerLink="/push-notifications">Notificaciones push</IonButton>
      </IonContent>
    </IonPage>
  );
}
