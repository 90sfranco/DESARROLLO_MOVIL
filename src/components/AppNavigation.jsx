import { useContext } from 'react';
import { IonButton, IonText } from '@ionic/react';
import ContactsButton from './ContactsButton.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { NetworkContext } from '../context/NetworkContext.jsx';

export default function AppNavigation() {
  const { user, error } = useContext(AuthContext);
  const network = useContext(NetworkContext);
  return (
    <>
      <p className="user-email">{user.email}</p>
      <nav className="section-navigation" aria-label="Secciones">
        <IonButton fill="outline" routerLink="/tasks">Tareas</IonButton>
        <IonButton fill="outline" routerLink="/fruits">Frutas</IonButton>
        <ContactsButton />
      </nav>
      <p role="status">{network.checking ? 'Comprobando conexión…' : network.isOnline ? 'Con conexión' : 'Sin conexión: las acciones de contactos y tareas están deshabilitadas. Frutas sigue disponible.'}</p>
      {(error || network.error) && <IonText color="danger"><p role="alert">{error || network.error}</p></IonText>}
    </>
  );
}
