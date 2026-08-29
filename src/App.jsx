import { useState, useEffect } from 'react';
import ListaContactos from './components/ListaContactos';
import FormularioContacto from './components/FormularioContacto';
import './App.css';

function App() {
  // estado para simular la carga al inicio
  const [cargando, setCargando] = useState(true);

  // estado para almacenar la lista de contactos
  const [contactos, setContactos] = useState([]);

  // estado para alternar la visibilidad del formulario de agregar
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // useEffect para simular una petición
  useEffect(() => {
    // datos estáticos
    const datosSemilla = [
      { id: 1, nombre: 'David Franco', telefono: '315 555 9999' },
      { id: 2, nombre: 'Nayleth Pabón', telefono: '310 444 888' },
      { id: 3, nombre: 'Yamileth Rojas', telefono: '301 333 777' }
    ];

    // simular un tiempo de carga de 2 segundos
    const temporizador = setTimeout(() => {
      setContactos(datosSemilla);
      setCargando(false);
    }, 2000);

    // función para desmontar el temporizador
    return () => clearTimeout(temporizador);
  }, []);

  // función para agregar nuevo contacto al arreglo
  const agregarContacto = (nuevoContacto) => {
    setContactos((prevContactos) => [...prevContactos, nuevoContacto]);
    setMostrarFormulario(false); // ocultar el formulario después de guardar
  };

  // función para eliminar un contacto por id
  const eliminarContacto = (id) => {
    setContactos((prevContactos) => prevContactos.filter((c) => c.id !== id));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>👥 Agenda de Contactos</h1>
      </header>

      {/*simulación de carga inicial*/}
      <main className="app-main">
        {cargando ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Cargando información desde el servidor...</p>
          </div>
        ) : (
          <>
            {/* botón para habilitar el form */}
            <div className="acciones-top">
              <button
                className="btn-toggle-form"
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
              >
                {mostrarFormulario ? 'X Cerrar Formulario' : '+ Agregar Contacto'}
              </button>
            </div>

            {/* form de agregar contacto*/}
            {mostrarFormulario && (
              <FormularioContacto
                onAgregarContacto={agregarContacto}
                onCancelar={() => setMostrarFormulario(false)}
              />
            )}

            {/* comp que renderiza la lista completa de contactos */}
            <ListaContactos
              contactos={contactos}
              onEliminarContacto={eliminarContacto}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
