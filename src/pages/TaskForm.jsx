import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonButton, IonContent, IonHeader, IonInput, IonPage, IonText,
  IonTextarea, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter,
} from '@ionic/react';
import { TasksContext } from '../context/TasksContext.jsx';
import AppNavigation from '../components/AppNavigation.jsx';
import SessionFooter from '../components/SessionFooter.jsx';

function TaskEditor({ id, task }) {
  const router = useIonRouter();
  const { addTask, editTask, disabled } = useContext(TasksContext);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [error, setError] = useState('');

  useIonViewWillEnter(() => {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setError('');
  });

  async function handleSave(event) {
    event.preventDefault();
    if (disabled) return;
    if (!title.trim()) {
      setError('Escribe un título para la tarea.');
      return;
    }
    setError('');
    const saved = id ? await editTask(id, title, description) : await addTask(title, description);
    if (saved) router.push('/tasks', 'back', 'replace');
  }

  return (
    <form onSubmit={handleSave}>
      <IonInput label="Título" labelPlacement="stacked" required disabled={disabled} value={title}
        onIonInput={(event) => setTitle(event.detail.value ?? '')} />
      <IonTextarea label="Descripción" labelPlacement="stacked" autoGrow disabled={disabled} value={description}
        onIonInput={(event) => setDescription(event.detail.value ?? '')} />
      {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
      <IonButton expand="block" type="submit" disabled={disabled}>Guardar tarea</IonButton>
    </form>
  );
}

export default function TaskForm() {
  const { id } = useParams();
  const { tasks, loading, error } = useContext(TasksContext);
  const task = tasks.find((item) => item.id === id);
  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>{id ? 'Editar tarea' : 'Agregar tarea'}</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding"><div className="page-container">
        <AppNavigation />
        {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
        {id && !task ? <p>{loading ? 'Cargando tarea…' : 'La tarea no existe.'}</p> : <TaskEditor key={id ?? 'new'} id={id} task={task} />}
        <IonButton fill="clear" routerLink="/tasks" routerDirection="back">Volver a la lista</IonButton>
      </div></IonContent>
      <SessionFooter />
    </IonPage>
  );
}
