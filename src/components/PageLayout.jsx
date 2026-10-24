import { useContext } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function PageLayout({ title, children }) {
  const { logout, pending, error } = useContext(AuthContext);
  return <IonPage>
    <IonHeader><IonToolbar>
      <IonTitle>{title}</IonTitle>
      <IonButtons slot="end"><IonButton onClick={logout} disabled={pending}>Salir</IonButton></IonButtons>
    </IonToolbar></IonHeader>
    <IonContent className="ion-padding">
      <main className="page-container">
        <nav aria-label="Navegación principal">
          <IonButton fill="clear" routerLink="/missions">Misiones</IonButton>
          <IonButton fill="clear" routerLink="/results">Resultados y ranking</IonButton>
        </nav>
        {error && <p role="alert" className="error">{error}</p>}
        {children}
      </main>
    </IonContent>
  </IonPage>;
}
