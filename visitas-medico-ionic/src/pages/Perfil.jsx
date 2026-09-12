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
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonBadge,
  useIonRouter,
  useIonViewWillEnter
} from '@ionic/react';
import { logOutOutline, personCircleOutline, medicalOutline, clipboardOutline } from 'ionicons/icons';
import { obtenerSesion, cerrarSesion, obtenerVisitas, obtenerPacientes } from '../utils/storage';

function Perfil() {
  const [usuario, setUsuario] = useState('');
  const [conteoVisitas, setConteoVisitas] = useState({ pendientes: 0, enCamino: 0, finalizadas: 0, total: 0 });
  const [totalPacientes, setTotalPacientes] = useState(0);

  const router = useIonRouter();

  const cargarInformacion = () => {
    const sesion = obtenerSesion();
    setUsuario(sesion.usuario || 'Dr. Médico');

    const visitas = obtenerVisitas();
    const pendientes = visitas.filter((v) => v.estado === 'pendiente').length;
    const enCamino = visitas.filter((v) => v.estado === 'en_camino').length;
    const finalizadas = visitas.filter((v) => v.estado === 'finalizada').length;

    setConteoVisitas({
      pendientes: pendientes,
      enCamino: enCamino,
      finalizadas: finalizadas,
      total: visitas.length
    });

    const pacientes = obtenerPacientes();
    setTotalPacientes(pacientes.length);
  };

  useIonViewWillEnter(() => {
    cargarInformacion();
  });

  const handleCerrarSesion = () => {
    cerrarSesion();
    router.push('/login', 'back', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PERFIL</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="ion-text-center">
          <IonCardHeader>
            <div style={{ fontSize: '72px', color: 'var(--ion-color-primary)' }}>
              <IonIcon icon={personCircleOutline} />
            </div>
            <IonCardTitle>{usuario}</IonCardTitle>
            <IonCardSubtitle>
              Dr. John Franco
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <h3>
              <IonIcon icon={clipboardOutline} /> Resumen del Día
            </h3>

            <IonList lines="full">
              <IonItem>
                <IonLabel>Visitas Pendientes</IonLabel>
                <IonBadge slot="end" color="warning">
                  {conteoVisitas.pendientes}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Visitas En Camino</IonLabel>
                <IonBadge slot="end" color="primary">
                  {conteoVisitas.enCamino}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel>Visitas Finalizadas</IonLabel>
                <IonBadge slot="end" color="success">
                  {conteoVisitas.finalizadas}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel><strong>Total Visitas</strong></IonLabel>
                <IonBadge slot="end" color="dark">
                  {conteoVisitas.total}
                </IonBadge>
              </IonItem>

              <IonItem>
                <IonLabel><strong>Pacientes Registrados</strong></IonLabel>
                <IonBadge slot="end" color="tertiary">
                  {totalPacientes}
                </IonBadge>
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              color="danger"
              className="ion-margin-top"
              onClick={handleCerrarSesion}
              shape="round"
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Cerrar Sesión
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}

export default Perfil;
