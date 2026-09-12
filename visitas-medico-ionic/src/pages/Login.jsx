import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonIcon,
  IonCardContent,
  useIonRouter
} from '@ionic/react';
import { medicalOutline, lockClosedOutline, personOutline, logInOutline } from 'ionicons/icons';
import { guardarSesion } from '../utils/storage';
import './Login.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  const router = useIonRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!usuario.trim() || !password.trim()) {
      setMensajeToast('Por favor, ingrese usuario y contraseña');
      setShowToast(true);
      return;
    }

    const usuarioValido = usuario === 'medico' || usuario === 'medico@salud.com';
    const passwordValida = password === '123456' || password === 'admin';

    if (usuarioValido && passwordValida) {
      guardarSesion(usuario);
      router.push('/tabs/visitas', 'forward', 'replace');
    } else {
      setMensajeToast('Credenciales incorrectas. Verifique e intente de nuevo.');
      setShowToast(true);
    }
  };

  return (
    <IonPage className="login-page">
      <IonContent className="ion-padding ion-text-center">
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardHeader>
              <div className="login-icon-wrapper">
                <IonIcon icon={medicalOutline} className="medical-icon" />
              </div>
              <IonCardTitle className="login-title">Visitas Médicas</IonCardTitle>
              <p className="login-subtitle">Acceso para Personal Médico</p>
            </IonCardHeader>

            <IonCardContent>
              <form onSubmit={handleLogin}>
                {/* Campo Usuario */}
                <IonItem className="login-item" lines="full">
                  <IonIcon slot="start" icon={personOutline} />
                  <IonLabel position="floating">Usuario / Correo</IonLabel>
                  <IonInput
                    type="text"
                    value={usuario}
                    onIonInput={(e) => setUsuario(e.detail.value)}
                  />
                </IonItem>

                {/* Campo Contraseña */}
                <IonItem className="login-item" lines="full">
                  <IonIcon slot="start" icon={lockClosedOutline} />
                  <IonLabel position="floating">Contraseña</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value)}
                  />
                </IonItem>

                {/* Botón de Ingreso */}
                <IonButton
                  expand="block"
                  type="submit"
                  className="login-button ion-margin-top"
                  shape="round"
                >
                  <IonIcon slot="start" icon={logInOutline} />
                  Iniciar Sesión
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

        {/* IonToast para credenciales incorrectas */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={mensajeToast}
          duration={3000}
          color="danger"
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
}

export default Login;
