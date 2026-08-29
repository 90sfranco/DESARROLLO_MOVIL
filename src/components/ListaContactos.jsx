import ItemContacto from './ItemContacto';

// componente para renderizar la lista completa de contactos
function ListaContactos({ contactos, onEliminarContacto }) {
  if (contactos.length === 0) {
    return (
      <div className="mensaje-vacio">
        <p>No tienes contactos en la agenda.</p>
      </div>
    );
  }

  return (
    <div className="lista-contactos">
      <h3>Contactos ({contactos.length})</h3>
      {contactos.map((contacto) => (
        <ItemContacto
          key={contacto.id}
          contacto={contacto}
          onEliminar={onEliminarContacto}
        />
      ))}
    </div>
  );
}

export default ListaContactos;
