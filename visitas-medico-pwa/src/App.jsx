import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Calendar, Users, User } from 'lucide-react';
import Login from './pages/Login';
import Visitas from './pages/Visitas';
import DetalleVisita from './pages/DetalleVisita';
import Pacientes from './pages/Pacientes';
import Perfil from './pages/Perfil';
import { obtenerSesion } from './utils/storage';

function AppLayout() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = () => {
    const session = obtenerSesion();
    setIsLoggedIn(session.isLoggedIn);
  };

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/visitas/')) return 'DETALLE DE LA VISITA';
    if (path === '/visitas') return 'VISITAS DEL DÍA';
    if (path === '/pacientes') return 'PACIENTES';
    if (path === '/perfil') return 'PERFIL';
    return 'VISITAS MÉDICAS PWA';
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && (
        <header className="app-header">
          <h1>{getHeaderTitle()}</h1>
        </header>
      )}

      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/visitas" replace />
            ) : (
              <Login onLoginSuccess={checkAuth} />
            )
          }
        />

        <Route
          path="/visitas"
          element={
            isLoggedIn ? <Visitas /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/visitas/:id"
          element={
            isLoggedIn ? <DetalleVisita /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/pacientes"
          element={
            isLoggedIn ? <Pacientes /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/perfil"
          element={
            isLoggedIn ? <Perfil onLogout={checkAuth} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/visitas" replace /> : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Bottom Tab Bar for Logged-In users */}
      {isLoggedIn && !isLoginPage && (
        <nav className="app-bottom-bar">
          <Link
            to="/visitas"
            className={`tab-button ${location.pathname.startsWith('/visitas') ? 'active' : ''}`}
          >
            <Calendar />
            <span>Visitas</span>
          </Link>

          <Link
            to="/pacientes"
            className={`tab-button ${location.pathname === '/pacientes' ? 'active' : ''}`}
          >
            <Users />
            <span>Pacientes</span>
          </Link>

          <Link
            to="/perfil"
            className={`tab-button ${location.pathname === '/perfil' ? 'active' : ''}`}
          >
            <User />
            <span>Perfil</span>
          </Link>
        </nav>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
