import { IonItem, IonLabel, IonList } from '@ionic/react';
import TaskItem from './TaskItem.jsx';

function TaskList({ tareas, onCompletarTarea, onEliminarTarea }) {
  if (tareas.length === 0) {
    return (
      <IonItem>
        <IonLabel>No hay tareas pendientes.</IonLabel>
      </IonItem>
    );
  }

  return (
    <IonList className="task-list">
      {tareas.map((tarea) => (
        <TaskItem
          key={tarea.id}
          tarea={tarea}
          onCompletar={onCompletarTarea}
          onEliminar={onEliminarTarea}
        />
      ))}
    </IonList>
  );
}

export default TaskList;
