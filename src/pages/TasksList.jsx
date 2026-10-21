import { useContext } from 'react';
import {
  IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList,
  IonPage, IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';
import { TasksContext } from '../context/TasksContext.jsx';

export default function TasksList() {
  const { user, logout, pending, error } = useContext(AuthContext);
  const { tasks, toggleTask, deleteTask } = useContext(TasksContext);

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Mis tareas</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <div className="page-container">
          <p className="user-email">{user.email}</p>
          <IonButton color="danger" fill="outline" onClick={logout} disabled={pending}>
            {pending ? 'Cerrando…' : 'Cerrar sesión'}
          </IonButton>
          {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
          <h1>Lista de tareas</h1>
          <IonButton routerLink="/tasks/new">Agregar tarea</IonButton>
          {tasks.length === 0 && <p>No hay tareas. Agrega la primera.</p>}
          <IonList>
            {tasks.map((task) => (
              <IonItem key={task.id}>
                <IonLabel>
                  <h2 className={task.completed ? 'completed' : ''}>{task.title}</h2>
                  <p>{task.completed ? 'Completada' : 'Pendiente'}</p>
                  <div className="task-actions">
                    <IonButton size="small" fill="outline" routerLink={`/tasks/${task.id}`}>Ver detalle</IonButton>
                    <IonButton size="small" fill="outline" routerLink={`/tasks/${task.id}/edit`}>Editar</IonButton>
                    <IonButton size="small" color={task.completed ? 'medium' : 'success'} onClick={() => toggleTask(task.id)}>
                      {task.completed ? 'Marcar pendiente' : 'Completar'}
                    </IonButton>
                    <IonButton size="small" color="danger" onClick={() => deleteTask(task.id)}>Eliminar</IonButton>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
}
