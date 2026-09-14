import { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

function TaskForm({ onAgregarTarea }) {
  const [nombre, setNombre] = useState('');

  const agregarTarea = () => {
    if (nombre.trim() === '') {
      return;
    }

    onAgregarTarea(nombre.trim());
    setNombre('');
  };

  return (
    <div className="task-form">
      <IonItem>
        <IonLabel position="stacked">Nueva tarea</IonLabel>
        <IonInput
          value={nombre}
          placeholder="Escribe una tarea"
          onIonInput={(evento) => setNombre(evento.detail.value ?? '')}
        />
      </IonItem>

      <IonButton onClick={agregarTarea}>Agregar tarea</IonButton>
    </div>
  );
}

export default TaskForm;
