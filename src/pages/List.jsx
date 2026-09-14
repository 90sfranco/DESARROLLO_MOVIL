import { useIonRouter } from '@ionic/react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

function List({ onLogout }) {
  const router = useIonRouter();

  const handleLogout = () => {
    localStorage.removeItem('logged');
    onLogout();
    router.push('/login', 'back', 'replace');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>List</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="list-page">
          <h1>Lista</h1>
          <IonButton expand="block" color="danger" onClick={handleLogout}>
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default List;
