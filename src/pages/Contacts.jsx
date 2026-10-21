import { useContext, useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';
import { NetworkContext } from '../context/NetworkContext.jsx';
import AppNavigation from '../components/AppNavigation.jsx';
import SessionFooter from '../components/SessionFooter.jsx';
import useCollection from '../hooks/useCollection.js';

export default function Contacts() {
  const { user } = useContext(AuthContext);
  const { isOnline } = useContext(NetworkContext);
  const { results, pending, error, getAll, add, update, remove } = useCollection(`users/${user.uid}/contacts`, isOnline);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editing, setEditing] = useState(null);
  const [validation, setValidation] = useState('');
  const disabled = !isOnline || pending;

  useEffect(() => { getAll(); }, [getAll]);

  function clearForm() {
    setName('');
    setPhone('');
    setEditing(null);
    setValidation('');
  }
  async function handleSave(event) {
    event.preventDefault();
    if (disabled) return;
    if (!name.trim() || !phone.trim()) {
      setValidation('Escribe el nombre y el teléfono.');
      return;
    }
    setValidation('');
    const data = { name: name.trim(), phone: phone.trim() };
    const saved = editing ? await update(editing, data) : await add(data);
    if (saved) clearForm();
  }
  async function handleDelete(id) {
    if (disabled) return;
    if (await remove(id) && id === editing) clearForm();
  }

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Contactos</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding"><div className="page-container">
        <AppNavigation />
        <div className="section-heading">
          <h1>Mis contactos</h1>
          <IonButton className="section-heading-button" type="submit" form="contacts-form" disabled={disabled}>
            {editing ? 'Guardar contacto' : 'Agregar contacto'}
          </IonButton>
        </div>
        <form id="contacts-form" onSubmit={handleSave}>
          <IonInput label="Nombre" labelPlacement="stacked" required disabled={disabled} value={name}
            onIonInput={(event) => setName(event.detail.value ?? '')} />
          <IonInput label="Teléfono" labelPlacement="stacked" type="tel" required disabled={disabled} value={phone}
            onIonInput={(event) => setPhone(event.detail.value ?? '')} />
          {editing && <IonButton fill="clear" onClick={clearForm}>Cancelar edición</IonButton>}
        </form>
        {(validation || error) && <IonText color="danger"><p role="alert">{validation || error}</p></IonText>}
        <IonButton fill="outline" onClick={getAll} disabled={disabled}>Actualizar lista</IonButton>
        {pending && <p>Cargando contactos…</p>}
        {!pending && results.length === 0 && <p>No hay contactos cargados.</p>}
        <IonList>{results.map((contact) => (
          <IonItem key={contact.id}><IonLabel>
            <h2>{contact.name}</h2><p>{contact.phone}</p>
            <div className="task-actions">
              <IonButton size="small" disabled={disabled} onClick={() => {
                setEditing(contact.id); setName(contact.name); setPhone(contact.phone); setValidation('');
              }}>Editar</IonButton>
              <IonButton size="small" color="danger" disabled={disabled} onClick={() => handleDelete(contact.id)}>Eliminar</IonButton>
            </div>
          </IonLabel></IonItem>
        ))}</IonList>
      </div></IonContent>
      <SessionFooter />
    </IonPage>
  );
}
