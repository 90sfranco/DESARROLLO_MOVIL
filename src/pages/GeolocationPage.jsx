import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useIonViewWillLeave } from '@ionic/react';
import useGeolocation from '../hooks/useGeolocation.js';

export default function GeolocationPage() {
  const { position, error, tracking, getCurrentLocation, startTracking, stopTracking } = useGeolocation();
  useIonViewWillLeave(() => { void stopTracking(); });
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Geolocalización</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={getCurrentLocation}>Obtener ubicación</IonButton>
        <IonButton disabled={tracking} onClick={startTracking}>Iniciar seguimiento</IonButton>
        <IonButton disabled={!tracking} onClick={stopTracking}>Detener</IonButton>
        <p>Seguimiento: {tracking ? 'Activo' : 'Detenido'}</p>
        {position && <>
          <p>Latitud: {position.latitude}</p><p>Longitud: {position.longitude}</p>
          <p>Precisión: {position.accuracy} m</p>
        </>}
        <p>Permite el acceso a la ubicación. En navegador se requiere localhost o HTTPS.</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
