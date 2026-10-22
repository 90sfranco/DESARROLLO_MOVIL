import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonTextarea } from '@ionic/react';
import { useState } from 'react';
import useFilesystem from '../hooks/useFilesystem.js';

export default function FilesystemPage() {
  const [text, setText] = useState('Hola desde el Challenge 07');
  const { content, files, error, message, writeFile, readFile, listFiles, deleteFile } = useFilesystem();
  return (
    <IonPage>
      <IonHeader><IonToolbar>
        <IonButtons slot="start"><IonBackButton defaultHref="/home" /></IonButtons>
        <IonTitle>Archivos</IonTitle>
      </IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <p>Archivo propio: challenge07/nota.txt</p>
        <IonTextarea label="Contenido" labelPlacement="stacked" fill="outline" value={text} onIonInput={event => setText(event.detail.value ?? '')} />
        <IonButton onClick={() => writeFile(text)}>Guardar</IonButton>
        <IonButton onClick={readFile}>Leer</IonButton>
        <IonButton onClick={listFiles}>Listar</IonButton>
        <IonButton color="danger" onClick={deleteFile}>Eliminar</IonButton>
        <p>{message}</p><pre>{content}</pre>
        <ul>{files.map(file => <li key={file.name}>{file.name}</li>)}</ul>
        <p>Se guarda en el almacenamiento privado de la app; en web, en el almacenamiento del navegador.</p>
        {error && <p role="alert">{error}</p>}
      </IonContent>
    </IonPage>
  );
}
