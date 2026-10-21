import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { TasksContext } from '../context/TasksContext.jsx';

export default function TaskDetail() {
  const { id } = useParams();
  const { tasks } = useContext(TasksContext);
  const task = tasks.find((item) => item.id === id);

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Detalle de tarea</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <div className="page-container">
          {task ? (
            <>
              <h1>{task.title}</h1>
              <p className="task-description">{task.description || 'Sin descripción.'}</p>
              <p>Estado: {task.completed ? 'Completada' : 'Pendiente'}</p>
              <IonButton routerLink={`/tasks/${task.id}/edit`}>Editar tarea</IonButton>
            </>
          ) : <p>La tarea no existe.</p>}
          <IonButton fill="clear" routerLink="/tasks" routerDirection="back">Volver a la lista</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
