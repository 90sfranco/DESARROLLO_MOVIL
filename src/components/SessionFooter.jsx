import { useContext } from 'react';
import { IonButton, IonFooter, IonToolbar } from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function SessionFooter() {
  const { logout, pending } = useContext(AuthContext);
  return (
    <IonFooter className="ion-no-border">
      <IonToolbar className="session-footer">
        <IonButton color="danger" fill="outline" onClick={logout} disabled={pending}>
          {pending ? 'Cerrando…' : 'Cerrar sesión'}
        </IonButton>
      </IonToolbar>
    </IonFooter>
  );
}
