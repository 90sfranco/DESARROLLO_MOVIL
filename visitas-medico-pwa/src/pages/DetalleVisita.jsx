import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, CreditCard, Phone, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';
import { obtenerVisitaPorId, actualizarEstadoVisita } from '../utils/storage';

function DetalleVisita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visita, setVisita] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  useEffect(() => {
    if (id) {
      const v = obtenerVisitaPorId(id);
      if (v) {
        setVisita(v);
      }
    }
  }, [id]);

  if (!visita) {
    return (
      <div className="app-content" style={{ textAlign: 'center', paddingTop: '40px' }}>
        <p>Visita no encontrada.</p>
        <button
          className="btn-block btn-primary"
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/visitas')}
        >
          Volver a Visitas
        </button>
      </div>
    );
  }

  const cambiarEstado = (nuevoEstado) => {
    const listaActualizada = actualizarEstadoVisita(visita.id, nuevoEstado);
    const vActualizada = listaActualizada.find(v => v.id === visita.id);
    if (vActualizada) {
      setVisita(vActualizada);
      setMensajeToast(`Estado cambiado a "${nuevoEstado}"`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  return (
    <div className="app-content">
      {/* Botón Atrás */}
      <div style={{ marginBottom: '12px' }}>
        <button
          onClick={() => navigate('/visitas')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: '600',
            fontSize: '0.95rem',
            cursor: 'pointer',
            padding: '4px 0'
          }}
        >
          <ChevronLeft size={20} /> Volver a Visitas
        </button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <User size={22} color="var(--primary-color)" /> {visita.paciente}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <User size={18} color="var(--primary-color)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Nombre Completo</span>
              <span style={{ fontWeight: '600' }}>{visita.nombre} {visita.apellido}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CreditCard size={18} color="var(--primary-color)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Cédula (CC)</span>
              <span style={{ fontWeight: '600' }}>{visita.cc}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Phone size={18} color="var(--primary-color)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Teléfono</span>
              <span style={{ fontWeight: '600' }}>{visita.telefono}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={18} color="var(--primary-color)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Hora</span>
              <span style={{ fontWeight: '600' }}>{visita.hora}</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estado Actual</span>
            <strong style={{ fontSize: '1rem', textTransform: 'capitalize' }}>{visita.estado.replace('_', ' ')}</strong>
          </div>
        </div>

        {/* Sección Cambiar Estado */}
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>Cambiar Estado:</h4>
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className={visita.estado === 'pendiente' ? 'btn-solid-warning' : 'btn-outline-warning'}
              onClick={() => cambiarEstado('pendiente')}
              style={{ padding: '8px 14px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer' }}
            >
              Pendiente
            </button>

            <button
              className={visita.estado === 'en_camino' ? 'btn-solid-primary' : 'btn-outline-primary'}
              onClick={() => cambiarEstado('en_camino')}
              style={{ padding: '8px 14px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer' }}
            >
              En camino
            </button>

            <button
              className={visita.estado === 'finalizada' ? 'btn-solid-success' : 'btn-outline-success'}
              onClick={() => cambiarEstado('finalizada')}
              style={{ padding: '8px 14px', borderRadius: '20px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <CheckCircle2 size={16} /> Finalizada
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast-container">
          {mensajeToast}
        </div>
      )}
    </div>
  );
}

export default DetalleVisita;
