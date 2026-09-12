import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, User, LogIn } from 'lucide-react';
import { guardarSesion } from '../utils/storage';

function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!usuario.trim() || !password.trim()) {
      setMensajeToast('Por favor, ingrese usuario y contraseña');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      return;
    }

    const usuarioValido = usuario === 'medico' || usuario === 'medico@salud.com';
    const passwordValida = password === '123456' || password === 'admin';

    if (usuarioValido && passwordValida) {
      guardarSesion(usuario);
      if (onLoginSuccess) onLoginSuccess();
      navigate('/visitas', { replace: true });
    } else {
      setMensajeToast('Credenciales incorrectas. Verifique e intente de nuevo.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  return (
    <div className="app-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', paddingBottom: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '380px', textAlign: 'center', padding: '24px 20px', borderRadius: '16px' }}>
        <div style={{
          backgroundColor: 'var(--primary-color)',
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#ffffff'
        }}>
          <Stethoscope size={36} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '4px' }}>Visitas Médicas</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>Acceso para Personal Médico</p>

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} /> Usuario / Correo
            </label>
            <input
              type="text"
              className="form-input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ej: medico"
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} /> Contraseña
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ej: 123456"
            />
          </div>

          <button type="submit" className="btn-block btn-primary">
            <LogIn size={20} />
            Iniciar Sesión
          </button>
        </form>
      </div>

      {showToast && (
        <div className="toast-container toast-danger">
          {mensajeToast}
        </div>
      )}
    </div>
  );
}

export default Login;
