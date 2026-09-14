// componente que representa a cada contacto de la lista
function ItemContacto({ contacto, onEliminar }) {
  return (
    <div className="item-contacto">
      <div className="info-contacto">
        <h4 className="nombre-contacto">{contacto.nombre}</h4>
        <p className="telefono-contacto">📞 {contacto.telefono}</p>
      </div>
      <button 
        className="btn-eliminar"
        onClick={() => onEliminar(contacto.id)}
      >
        Eliminar
      </button>
    </div>
  );
}

export default ItemContacto;
