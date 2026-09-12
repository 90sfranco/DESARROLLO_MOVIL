import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, ClipboardList, LogOut } from 'lucide-react';
import { obtenerSesion, cerrarSesion, obtenerVisitas, obtenerPacientes } from '../utils/storage';

function Perfil({ onLogout }) {
  const [usuario, setUsuario] = useState('');
  const [conteoVisitas, setConteoVisitas] = useState({ pendientes: 0, enCamino: 0, finalizadas: 0, total: 0 });
  const [totalPacientes, setTotalPacientes] = useState(0);
  const navigate = useNavigate();

  const cargarInformacion = () => {
    const sesion = obtenerSesion();
    setUsuario(sesion.usuario || 'Dr. Médico');

    const visitas = obtenerVisitas();
    const pendientes = visitas.filter((v) => v.estado === 'pendiente').length;
    const enCamino = visitas.filter((v) => v.estado === 'en_camino').length;
    const finalizadas = visitas.filter((v) => v.estado === 'finalizada').length;

    setConteoVisitas({
      pendientes: pendientes,
      enCamino: enCamino,
      finalizadas: finalizadas,
      total: visitas.length
    });

    const pacientes = obtenerPacientes();
    setTotalPacientes(pacientes.length);
  };

  useEffect(() => {
    cargarInformacion();
  }, []);

  const handleCerrarSesion = () => {
    cerrarSesion();
    if (onLogout) onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-content">
      <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
        <div style={{ color: 'var(--primary-color)', display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <UserCircle size={72} />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>{usuario}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Dr. John Franco</p>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
            <ClipboardList size={18} color="var(--primary-color)" /> Resumen del Día
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
              <span>Visitas Pendientes</span>
              <span className="badge badge-warning">{conteoVisitas.pendientes}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
              <span>Visitas En Camino</span>
              <span className="badge badge-primary">{conteoVisitas.enCamino}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
              <span>Visitas Finalizadas</span>
              <span className="badge badge-success">{conteoVisitas.finalizadas}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: '700', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
              <span>Total Visitas</span>
              <span className="badge badge-dark">{conteoVisitas.total}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: '700' }}>
              <span>Pacientes Registrados</span>
              <span className="badge badge-tertiary">{totalPacientes}</span>
            </div>
          </div>

          <button
            className="btn-block btn-danger"
            style={{ marginTop: '24px' }}
            onClick={handleCerrarSesion}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
