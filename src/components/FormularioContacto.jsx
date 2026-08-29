import { useState } from 'react';

// componente para el formulario de agregar contactos
function FormularioContacto({ onAgregarContacto, onCancelar }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // validar que los campos no estén vacíos
    if (nombre.trim() === '' || telefono.trim() === '') {
      alert('Por favor completa el nombre y el teléfono.');
      return;
    }

    // crear el nuevo objeto de contacto
    const nuevoContacto = {
      id: Date.now(),
      nombre: nombre,
      telefono: telefono
    };

    // llamar a la función enviada por props
    onAgregarContacto(nuevoContacto);

    // limpiar los campos del formulario
    setNombre('');
    setTelefono('');
  };

  return (
    <form className="formulario-contacto" onSubmit={handleSubmit}>
      <h3>Agregar Nuevo Contacto</h3>
      
      <div className="campo">
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ingresa el nombre"
        />
      </div>

      <div className="campo">
        <label htmlFor="telefono">Teléfono:</label>
        <input
          id="telefono"
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ingresa el número de teléfono"
        />
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="btn-guardar">
          Guardar Contacto
        </button>
        {onCancelar && (
          <button type="button" className="btn-cancelar" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default FormularioContacto;