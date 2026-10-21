import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonButton, IonContent, IonHeader, IonInput, IonPage, IonText,
  IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter,
} from '@ionic/react';
import { TasksContext } from '../context/TasksContext.jsx';

export default function TaskForm() {
  const { id } = useParams();
  const router = useIonRouter();
  const { tasks, addTask, editTask } = useContext(TasksContext);
  const task = tasks.find((item) => item.id === id);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [error, setError] = useState('');

  useIonViewWillEnter(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setError('');
  });

  function handleSave(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Escribe un título para la tarea.');
      return;
    }
    if (id) {
      editTask(id, title, description);
    } else {
      addTask(title, description);
    }
    router.push('/tasks', 'back', 'replace');
  }

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>{id ? 'Editar tarea' : 'Agregar tarea'}</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <div className="page-container">
          {id && !task ? <p>La tarea no existe.</p> : (
            <form onSubmit={handleSave}>
              <IonInput label="Título" labelPlacement="stacked" required value={title}
                onIonInput={(event) => setTitle(event.detail.value ?? '')} />
              <IonTextarea label="Descripción" labelPlacement="stacked" autoGrow value={description}
                onIonInput={(event) => setDescription(event.detail.value ?? '')} />
              {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
              <IonButton expand="block" type="submit">Guardar tarea</IonButton>
            </form>
          )}
          <IonButton fill="clear" routerLink="/tasks" routerDirection="back">Volver a la lista</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
