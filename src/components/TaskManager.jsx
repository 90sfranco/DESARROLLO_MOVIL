import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import TaskForm from './TaskForm.jsx';
import TaskList from './TaskList.jsx';

function TaskManager() {
  const [tareas, setTareas] = useState([]);

  const agregarTarea = (nombre) => {
    const nuevaTarea = {
      id: Date.now(),
      nombre,
      completada: false,
    };

    setTareas((tareasAnteriores) => [...tareasAnteriores, nuevaTarea]);
  };

  const completarTarea = (id) => {
    setTareas((tareasAnteriores) => tareasAnteriores.map((tarea) => (
      tarea.id === id
        ? { ...tarea, completada: !tarea.completada }
        : tarea
    )));
  };

  const eliminarTarea = (id) => {
    setTareas((tareasAnteriores) => tareasAnteriores.filter((tarea) => tarea.id !== id));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding task-manager-content">
        <div className="task-manager">
          <TaskForm onAgregarTarea={agregarTarea} />

          <TaskList
            tareas={tareas}
            onCompletarTarea={completarTarea}
            onEliminarTarea={eliminarTarea}
          />
        </div>
      </IonContent>
    </IonPage>
  );
}

export default TaskManager;
