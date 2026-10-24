import { useContext, useState } from 'react';
import {
  IonButton, IonContent, IonHeader, IonInput, IonPage,
  IonText, IonTitle, IonToolbar, useIonViewWillEnter,
} from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, pending, error, clearError } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useIonViewWillEnter(() => {
    clearError();
    setPassword('');
  });

  async function handleLogin(event) {
    event.preventDefault();
    await login(email, password);
  }

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Login</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <div className="page-container auth-page">
          <h1>Iniciar sesión</h1>
          <form onSubmit={handleLogin}>
            <IonInput label="Correo electrónico" labelPlacement="stacked" type="email"
              autocomplete="email" required value={email}
              onIonInput={(event) => setEmail(event.detail.value ?? '')} />
            <IonInput label="Contraseña" labelPlacement="stacked" type="password"
              autocomplete="current-password" required value={password}
              onIonInput={(event) => setPassword(event.detail.value ?? '')} />
            {error && <IonText color="danger"><p role="alert">{error}</p></IonText>}
            <IonButton expand="block" type="submit" disabled={pending}>
              {pending ? 'Ingresando…' : 'Ingresar'}
            </IonButton>
          </form>
          <IonButton expand="block" fill="clear" routerLink="/register" disabled={pending}>
            Crear una cuenta
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
