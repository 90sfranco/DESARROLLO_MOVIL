import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { IonButton, IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import AppNavigation from '../components/AppNavigation.jsx';
import SessionFooter from '../components/SessionFooter.jsx';
import { TasksContext } from '../context/TasksContext.jsx';

export default function TaskDetail() {
  const { id } = useParams();
  const { tasks, loading, error, disabled } = useContext(TasksContext);
  const task = tasks.find((item) => item.id === id);

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Detalle de tarea</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <div className="page-container">
          <AppNavigation />
          {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
          {loading && !task ? <p>Cargando tarea…</p> : task ? (
            <>
              <h1>{task.title}</h1>
              <p className="task-description">{task.description || 'Sin descripción.'}</p>
              <p>Estado: {task.completed ? 'Completada' : 'Pendiente'}</p>
              <IonButton disabled={disabled} routerLink={`/tasks/${task.id}/edit`}>Editar tarea</IonButton>
            </>
          ) : <p>La tarea no existe.</p>}
          <IonButton fill="clear" routerLink="/tasks" routerDirection="back">Volver a la lista</IonButton>
        </div>
      </IonContent>
      <SessionFooter />
    </IonPage>
  );
}
