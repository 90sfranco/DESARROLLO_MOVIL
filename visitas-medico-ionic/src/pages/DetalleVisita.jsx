import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonToast,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import {
  personOutline,
  timeOutline,
  callOutline,
  cardOutline,
  checkmarkDoneCircleOutline
} from 'ionicons/icons';
import { obtenerVisitaPorId, actualizarEstadoVisita } from '../utils/storage';
import './DetalleVisita.css';

function DetalleVisita() {
  const { id } = useParams();
  const [visita, setVisita] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  useEffect(() => {
    if (id) {
      const v = obtenerVisitaPorId(id);
      if (v) {
        setVisita(v);
      }
    }
  }, [id]);

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/visitas" text="Atrás" />
            </IonButtons>
            <IonTitle>Detalle de Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding ion-text-center">
          <p>Visita no encontrada.</p>
        </IonContent>
      </IonPage>
    );
  }

  // Cambiar directamente a un estado al presionar los botones
  const cambiarEstado = (nuevoEstado) => {
    const actualizada = actualizarEstadoVisita(visita.id, nuevoEstado);
    if (actualizada) {
      setVisita(actualizada);
      setMensajeToast(`Estado cambiado a "${nuevoEstado}"`);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/visitas" text="Visitas" />
          </IonButtons>
          <IonTitle>Detalle de la Visita</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="detail-card">
          <IonCardHeader>
            <IonCardTitle className="detail-title">
              <IonIcon icon={personOutline} /> {visita.paciente}
            </IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            {/* Lista solo con los campos permitidos*/}
            <IonList lines="full">
              <IonItem>
                <IonIcon slot="start" icon={personOutline} color="primary" />
                <IonLabel>
                  <h3>Nombre Completo</h3>
                  <p>{visita.nombre} {visita.apellido}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonIcon slot="start" icon={cardOutline} color="primary" />
                <IonLabel>
                  <h3>Cédula (CC)</h3>
                  <p>{visita.cc}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonIcon slot="start" icon={callOutline} color="primary" />
                <IonLabel>
                  <h3>Teléfono</h3>
                  <p>{visita.telefono}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonIcon slot="start" icon={timeOutline} color="primary" />
                <IonLabel>
                  <h3>Hora</h3>
                  <p>{visita.hora}</p>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <h3>Estado Actual</h3>
                  <p><strong>{visita.estado}</strong></p>
                </IonLabel>
              </IonItem>
            </IonList>

            <div className="status-change-section ion-margin-top">
              <h4 className="section-subtitle">Cambiar Estado:</h4>

              <div className="status-buttons-grid">
                <IonButton
                  size="default"
                  fill={visita.estado === 'pendiente' ? 'solid' : 'outline'}
                  color="warning"
                  onClick={() => cambiarEstado('pendiente')}
                >
                  Pendiente
                </IonButton>

                <IonButton
                  size="default"
                  fill={visita.estado === 'en_camino' ? 'solid' : 'outline'}
                  color="primary"
                  onClick={() => cambiarEstado('en_camino')}
                >
                  En camino
                </IonButton>

                <IonButton
                  size="default"
                  fill={visita.estado === 'finalizada' ? 'solid' : 'outline'}
                  color="success"
                  onClick={() => cambiarEstado('finalizada')}
                >
                  <IonIcon slot="start" icon={checkmarkDoneCircleOutline} />
                  Finalizada
                </IonButton>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Notificación Toast */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={mensajeToast}
          duration={2000}
          color="dark"
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
}

export default DetalleVisita;
