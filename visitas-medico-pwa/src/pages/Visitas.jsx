import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, User, ChevronRight } from 'lucide-react';
import { obtenerVisitas } from '../utils/storage';

function Visitas() {
  const [visitas, setVisitas] = useState([]);
  const [filtro, setFiltro] = useState('todas');
  const navigate = useNavigate();

  useEffect(() => {
    const datos = obtenerVisitas();
    setVisitas(datos);
  }, []);

  const visitasFiltradas =
    filtro === 'todas'
      ? visitas
      : visitas.filter((v) => v.estado === filtro);

  return (
    <div className="app-content">
      {/* Filtro de Visitas */}
      <div className="filter-section">
        <div className="filter-header">
          <Filter size={20} />
          <span>Filtrar Visitas</span>
        </div>

        <div className="segment-container">
          <button
            className={`segment-btn ${filtro === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas
          </button>
          <button
            className={`segment-btn ${filtro === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFiltro('pendiente')}
          >
            Pendiente
          </button>
          <button
            className={`segment-btn ${filtro === 'en_camino' ? 'active' : ''}`}
            onClick={() => setFiltro('en_camino')}
          >
            En camino
          </button>
          <button
            className={`segment-btn ${filtro === 'finalizada' ? 'active' : ''}`}
            onClick={() => setFiltro('finalizada')}
          >
            Finalizada
          </button>
        </div>
      </div>

      {/* Lista de Visitas */}
      {visitasFiltradas.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-muted)' }}>
          <p style={{ fontStyle: 'italic' }}>No hay visitas registradas para este filtro.</p>
        </div>
      ) : (
        visitasFiltradas.map((visita) => (
          <div
            key={visita.id}
            className="card card-clickable visit-card-item"
            onClick={() => navigate(`/visitas/${visita.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={18} color="var(--primary-color)" /> {visita.paciente}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Hora: {visita.hora} | Estado: <strong style={{ textTransform: 'capitalize' }}>{visita.estado.replace('_', ' ')}</strong>
                </p>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Visitas;
