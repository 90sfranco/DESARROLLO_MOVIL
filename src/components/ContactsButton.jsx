import { IonButton, IonIcon } from '@ionic/react';
import { peopleOutline } from 'ionicons/icons';

export default function ContactsButton() {
  return (
    <IonButton className="contacts-link" fill="outline" routerLink="/contacts" aria-label="Contactos" title="Contactos">
      <IonIcon slot="icon-only" icon={peopleOutline} aria-hidden="true" />
    </IonButton>
  );
}
