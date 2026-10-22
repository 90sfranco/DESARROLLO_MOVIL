import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import useDevice from '../hooks/useDevice.js';

export default function DevicePage() {
  const { info, battery, deviceId, error, loadDeviceData } = useDevice();
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Dispositivo</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={loadDeviceData}>Consultar dispositivo</IonButton>
        {info && <>
          <p>Modelo: {info.model}</p><p>Plataforma: {info.platform}</p>
          <p>Sistema: {info.operatingSystem} {info.osVersion}</p>
        </>}
        {deviceId && <p>ID: {deviceId}</p>}
        {battery && <>
          <p>Batería: {typeof battery.batteryLevel === 'number' ? `${Math.round(battery.batteryLevel * 100)} %` : 'No disponible'}</p>
          <p>Cargando: {typeof battery.isCharging === 'boolean' ? (battery.isCharging ? 'Sí' : 'No') : 'No disponible'}</p>
        </>}
        <p>El navegador puede limitar los datos de batería y del equipo.</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
