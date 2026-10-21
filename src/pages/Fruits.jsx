import { useContext, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { AuthContext } from '../context/AuthContext.jsx';
import AppNavigation from '../components/AppNavigation.jsx';
import SessionFooter from '../components/SessionFooter.jsx';
import useDexie from '../hooks/useDexie.js';

export default function Fruits() {
  const { user } = useContext(AuthContext);
  const { results, loading, pending, error, add, update, remove } = useDexie(user.uid);
  const [nombre, setNombre] = useState('');
  const [editing, setEditing] = useState(null);
  const [validation, setValidation] = useState('');

  function clearForm() {
    setNombre(''); setEditing(null); setValidation('');
  }
  async function handleSave(event) {
    event.preventDefault();
    if (pending) return;
    if (!nombre.trim()) { setValidation('Escribe el nombre de la fruta.'); return; }
    setValidation('');
    const saved = editing === null ? await add(nombre) : await update(editing, nombre);
    if (saved) clearForm();
  }
  async function handleDelete(id) {
    if (pending) return;
    if (await remove(id) && id === editing) clearForm();
  }
  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Frutas</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding"><div className="page-container">
        <AppNavigation />
        <div className="section-heading">
          <h1>Mis frutas</h1>
          <IonButton className="section-heading-button" type="submit" form="fruits-form" disabled={pending}>
            {editing === null ? 'Agregar fruta' : 'Guardar fruta'}
          </IonButton>
        </div>
        <p>Guardadas en este dispositivo. Puedes administrarlas sin conexión.</p>
        <form id="fruits-form" onSubmit={handleSave}>
          <IonInput label="Nombre de la fruta" labelPlacement="stacked" required disabled={pending} value={nombre}
            onIonInput={(event) => setNombre(event.detail.value ?? '')} />
          {editing !== null && <IonButton fill="clear" onClick={clearForm}>Cancelar edición</IonButton>}
        </form>
        {(validation || error) && <IonText color="danger"><p role="alert">{validation || error}</p></IonText>}
        {loading && <p>Cargando frutas…</p>}
        {!loading && results.length === 0 && <p>No hay frutas. Agrega la primera.</p>}
        <IonList>{results.map((fruit) => (
          <IonItem key={fruit.id}><IonLabel><h2>{fruit.nombre}</h2>
            <div className="task-actions">
              <IonButton size="small" disabled={pending} onClick={() => { setEditing(fruit.id); setNombre(fruit.nombre); setValidation(''); }}>Editar</IonButton>
              <IonButton size="small" color="danger" disabled={pending} onClick={() => handleDelete(fruit.id)}>Eliminar</IonButton>
            </div>
          </IonLabel></IonItem>
        ))}</IonList>
      </div></IonContent>
      <SessionFooter />
    </IonPage>
  );
}
