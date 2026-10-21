import { useContext, useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonInput, IonPage,
  IonText, IonTitle, IonToolbar, useIonViewWillEnter,
} from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, pending, error, clearError } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useIonViewWillEnter(() => {
    clearError();
    setPassword('');
  });

  async function handleRegister(event) {
    event.preventDefault();
    await register(email, password);
  }

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Registro</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <div className="page-container auth-page">
          <h1>Crear cuenta</h1>
          <form onSubmit={handleRegister}>
            <IonInput label="Correo electrónico" labelPlacement="stacked" type="email"
              autocomplete="email" required value={email}
              onIonInput={(event) => setEmail(event.detail.value ?? '')} />
            <IonInput label="Contraseña (mínimo 6 caracteres)" labelPlacement="stacked"
              type="password" autocomplete="new-password" minlength={6} required value={password}
              onIonInput={(event) => setPassword(event.detail.value ?? '')} />
            {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
            <IonButton expand="block" type="submit" disabled={pending}>
              {pending ? 'Registrando…' : 'Registrarse'}
            </IonButton>
          </form>
          <IonButton expand="block" fill="clear" routerLink="/login" routerDirection="back" disabled={pending}>
            Volver al login
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
