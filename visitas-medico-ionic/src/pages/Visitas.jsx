import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  useIonRouter,
  useIonViewWillEnter
} from '@ionic/react';
import { personOutline, funnelOutline, chevronForwardOutline } from 'ionicons/icons';
import { obtenerVisitas } from '../utils/storage';
import './Visitas.css';

function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const router = useIonRouter();

  useIonViewWillEnter(() => {
    const datos = obtenerVisitas();
    setVisitas(datos);
  });

  const visitasFiltradas =
    filtro === 'todas'
      ? visitas
      : visitas.filter((v) => v.estado === filtro);

  const handleSeleccionarVisita = (id) => {
    router.push(`/tabs/visitas/${id}`, 'forward');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="ion-text-center main-title">VISITAS DEL DÍA</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Filtro de Visitas */}
        <div className="filter-section">
          <div className="filter-header">
            <IonIcon icon={funnelOutline} className="filter-icon" />
            <h3 className="filter-title">Filtrar Visitas</h3>
          </div>

          <IonSegment
            value={filtro}
            onIonChange={(e) => setFiltro(e.detail.value)}
            scrollable
          >
            <IonSegmentButton value="todas">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pendiente">
              <IonLabel>Pendiente</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="en_camino">
              <IonLabel>En camino</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="finalizada">
              <IonLabel>Finalizada</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Lista de Visitas */}
        {visitasFiltradas.length === 0 ? (
          <div className="empty-state ion-text-center ion-padding">
            <p>No hay visitas registradas para este filtro.</p>
          </div>
        ) : (
          visitasFiltradas.map((visita) => (
            <IonCard
              key={visita.id}
              className="visit-card"
              button
              onClick={() => handleSeleccionarVisita(visita.id)}
            >
              <IonCardHeader>
                <div className="card-header-flex">
                  <div>
                    {/* Nombre del Paciente */}
                    <IonCardTitle className="patient-name">
                      <IonIcon icon={personOutline} /> {visita.paciente}
                    </IonCardTitle>
                    {/* Texto abajo del nombre: Hora y Estado (sin píldora al extremo derecho) */}
                    <IonCardSubtitle className="visit-info-sub">
                      Hora: {visita.hora} | Estado: {visita.estado}
                    </IonCardSubtitle>
                  </div>
                  <IonIcon icon={chevronForwardOutline} color="medium" />
                </div>
              </IonCardHeader>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
}

export default Visitas;
