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
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonModal,
  IonInput,
  IonToast,
  useIonViewWillEnter
} from '@ionic/react';
import {
  peopleOutline,
  callOutline,
  cardOutline,
  personAddOutline
} from 'ionicons/icons';
import { obtenerPacientes, guardarPacientes } from '../utils/storage';

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);

  // Formulario para nuevo paciente
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cc, setCc] = useState('');
  const [telefono, setTelefono] = useState('');

  const [showToast, setShowToast] = useState(false);

  useIonViewWillEnter(() => {
    const datos = obtenerPacientes();
    setPacientes(datos);
  });

  const handleGuardarPaciente = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !apellido.trim() || !cc.trim() || !telefono.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    const nuevoPaciente = {
      id: Date.now().toString(),
      nombre: nombre,
      apellido: apellido,
      cc: cc,
      telefono: telefono
    };

    const nuevaLista = [nuevoPaciente, ...pacientes];
    setPacientes(nuevaLista);
    guardarPacientes(nuevaLista);

    // Limpiar formulario
    setNombre('');
    setApellido('');
    setCc('');
    setTelefono('');
    setMostrarModal(false);

    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>PACIENTES</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          color="success"
          className="ion-margin-bottom"
          onClick={() => setMostrarModal(true)}
          shape="round"
        >
          <IonIcon slot="start" icon={personAddOutline} />
          Registrar Nuevo Paciente
        </IonButton>

        {/* Lista de Pacientes */}
        {pacientes.map((paciente) => (
          <IonCard key={paciente.id}>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={peopleOutline} color="primary" /> {paciente.nombre} {paciente.apellido}
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonIcon slot="start" icon={cardOutline} size="small" />
                  <IonLabel>
                    <p><strong>CC:</strong> {paciente.cc}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon slot="start" icon={callOutline} size="small" />
                  <IonLabel>
                    <p><strong>Teléfono:</strong> {paciente.telefono}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        ))}

        {/* Modal Registrar Paciente */}
        <IonModal isOpen={mostrarModal} onDidDismiss={() => setMostrarModal(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Nuevo Paciente</IonTitle>
              <IonButton slot="end" fill="clear" color="light" onClick={() => setMostrarModal(false)}>
                Cerrar
              </IonButton>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <form onSubmit={handleGuardarPaciente}>
              <IonItem lines="full">
                <IonLabel position="floating">Nombre *</IonLabel>
                <IonInput
                  type="text"
                  value={nombre}
                  onIonInput={(e) => setNombre(e.detail.value)}
                  required
                />
              </IonItem>

              <IonItem lines="full">
                <IonLabel position="floating">Apellido *</IonLabel>
                <IonInput
                  type="text"
                  value={apellido}
                  onIonInput={(e) => setApellido(e.detail.value)}
                  required
                />
              </IonItem>

              <IonItem lines="full">
                <IonLabel position="floating">CC (Cédula) *</IonLabel>
                <IonInput
                  type="text"
                  value={cc}
                  onIonInput={(e) => setCc(e.detail.value)}
                  required
                />
              </IonItem>

              <IonItem lines="full">
                <IonLabel position="floating">Teléfono *</IonLabel>
                <IonInput
                  type="tel"
                  value={telefono}
                  onIonInput={(e) => setTelefono(e.detail.value)}
                  required
                />
              </IonItem>

              <IonButton
                expand="block"
                type="submit"
                color="primary"
                className="ion-margin-top"
                shape="round"
              >
                Guardar Paciente
              </IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Paciente registrado en localStorage"
          duration={2000}
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
}

export default Pacientes;
