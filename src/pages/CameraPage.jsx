import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { CameraSource } from '@capacitor/camera';
import useCamera from '../hooks/useCamera.js';

export default function CameraPage() {
  const { photo, error, takePhoto } = useCamera();
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Cámara</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => takePhoto(CameraSource.Camera)}>Tomar foto</IonButton>
        <IonButton onClick={() => takePhoto(CameraSource.Photos)}>Elegir foto</IonButton>
        {photo && <img className="photo" src={photo} alt="Foto seleccionada" />}
        <p>En navegador se abre el selector de archivos; en el teléfono se usa la cámara o galería.</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
