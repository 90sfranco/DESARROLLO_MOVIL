import { useContext } from 'react';
import {
  IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonPage, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import AppNavigation from '../components/AppNavigation.jsx';
import SessionFooter from '../components/SessionFooter.jsx';
import { TasksContext } from '../context/TasksContext.jsx';

export default function TasksList() {
  const { tasks, toggleTask, deleteTask, loading, pending, error, disabled } = useContext(TasksContext);

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Mis tareas</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <div className="page-container">
          <AppNavigation />
          <div className="section-heading">
            <h1>Lista de tareas</h1>
            <IonButton className="section-heading-button" disabled={disabled} routerLink="/tasks/new">Agregar tarea</IonButton>
          </div>
          {!loading && tasks.length === 0 && <p>No hay tareas. Agrega la primera.</p>}
          {loading && <p>Cargando tareas…</p>}
          {pending && <p>Guardando cambios…</p>}
          {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
          <IonList>
            {tasks.map((task) => (
              <IonItem key={task.id}>
                <IonLabel>
                  <h2 className={task.completed ? 'completed' : ''}>{task.title}</h2>
                  <p>{task.completed ? 'Completada' : 'Pendiente'}</p>
                  <div className="task-actions">
                    <IonButton disabled={disabled} size="small" fill="outline" routerLink={`/tasks/${task.id}`}>Ver detalle</IonButton>
                    <IonButton disabled={disabled} size="small" fill="outline" routerLink={`/tasks/${task.id}/edit`}>Editar</IonButton>
                    <IonButton disabled={disabled} size="small" color={task.completed ? 'medium' : 'success'} onClick={() => toggleTask(task.id)}>
                      {task.completed ? 'Marcar pendiente' : 'Completar'}
                    </IonButton>
                    <IonButton disabled={disabled} size="small" color="danger" onClick={() => deleteTask(task.id)}>Eliminar</IonButton>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
      <SessionFooter />
    </IonPage>
  );
}
