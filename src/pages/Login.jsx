import { useState } from 'react';
import { useIonRouter } from '@ionic/react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

function Login({ onLogin }) {
  const router = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (email === 'user@mail.com' && password === '123') {
      localStorage.setItem('logged', 'true');
      onLogin();
      router.push('/list', 'root', 'replace');
      return;
    }

    setError('Los datos no son correctos.');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="login-page">
          <h1>Iniciar sesión</h1>

          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              placeholder="user@mail.com"
              onIonInput={(event) => setEmail(event.detail.value ?? '')}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              placeholder="123"
              onIonInput={(event) => setPassword(event.detail.value ?? '')}
            />
          </IonItem>

          <IonButton expand="block" onClick={handleLogin}>
            Login
          </IonButton>

          {error && <IonText color="danger"><p>{error}</p></IonText>}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Login;
