import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Phone, CreditCard, X } from 'lucide-react';
import { obtenerPacientes, guardarPacientes } from '../utils/storage';

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cc, setCc] = useState('');
  const [telefono, setTelefono] = useState('');
  
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const datos = obtenerPacientes();
    setPacientes(datos);
  }, []);

  const handleGuardarPaciente = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !apellido.trim() || !cc.trim() || !telefono.trim()) {
      alert('Por favor complete todos los campos');
      return;
    }

    const nuevoPaciente = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      cc: cc.trim(),
      telefono: telefono.trim()
    };

    const nuevaLista = [nuevoPaciente, ...pacientes];
    setPacientes(nuevaLista);
    guardarPacientes(nuevaLista);

    setNombre('');
    setApellido('');
    setCc('');
    setTelefono('');
    setMostrarModal(false);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="app-content">
      <button
        className="btn-block btn-success"
        style={{ marginBottom: '16px' }}
        onClick={() => setMostrarModal(true)}
      >
        <UserPlus size={18} />
        Registrar Nuevo Paciente
      </button>

      {/* Lista de Pacientes */}
      {pacientes.map((paciente) => (
        <div key={paciente.id} className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Users size={18} color="var(--primary-color)" /> {paciente.nombre} {paciente.apellido}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <CreditCard size={16} />
              <span><strong>CC:</strong> {paciente.cc}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Phone size={16} />
              <span><strong>Teléfono:</strong> {paciente.telefono}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Modal Registrar Paciente */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Paciente</h2>
              <button className="modal-close-btn" onClick={() => setMostrarModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuardarPaciente}>
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  className="form-input"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>CC (Cédula) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-block btn-primary" style={{ marginTop: '16px' }}>
                Guardar Paciente
              </button>
            </form>
          </div>
        </div>
      )}

      {showToast && (
        <div className="toast-container">
          Paciente registrado en localStorage
        </div>
      )}
    </div>
  );
}

export default Pacientes;
