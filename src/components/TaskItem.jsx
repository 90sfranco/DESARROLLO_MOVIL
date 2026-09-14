import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonItem,
  IonLabel,
} from '@ionic/react';

function TaskItem({ tarea, onCompletar, onEliminar }) {
  return (
    <IonCard className="task-card">
      <IonCardContent>
        <IonItem lines="none">
          <IonCheckbox
            slot="start"
            checked={tarea.completada}
            onIonChange={() => onCompletar(tarea.id)}
          />

          <IonLabel>
            {tarea.nombre}
            {tarea.completada && ' - completada'}
          </IonLabel>

          <IonButton
            slot="end"
            color="danger"
            onClick={() => onEliminar(tarea.id)}
          >
            Eliminar
          </IonButton>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
}

export default TaskItem;
