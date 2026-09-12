// Llaves aisladas de localStorage para la aplicación PWA
const VISITAS_KEY = 'visitas_medicas_pwa_v1';
const PACIENTES_KEY = 'pacientes_medicos_pwa_v1';
const USUARIO_KEY = 'usuario_medico_pwa_v1';
const IS_LOGGED_IN_KEY = 'is_logged_in_pwa_v1';

// Lista inicial de visitas
const VISITAS_INICIALES = [
  {
    id: '1',
    nombre: 'Hugo',
    apellido: 'Franco',
    paciente: 'Hugo Franco',
    cc: '123456789',
    telefono: '3101234567',
    hora: '08:30 AM',
    estado: 'pendiente'
  },
  {
    id: '2',
    nombre: 'Paco',
    apellido: 'Ortiz',
    paciente: 'Paco Ortiz',
    cc: '234567890',
    telefono: '3152345678',
    hora: '10:15 AM',
    estado: 'en_camino'
  },
  {
    id: '3',
    nombre: 'Luis',
    apellido: 'Rodriguez',
    paciente: 'Luis Rodriguez',
    cc: '345678901',
    telefono: '3203456789',
    hora: '02:00 PM',
    estado: 'finalizada'
  }
];

// Lista inicial de pacientes para la PWA
const PACIENTES_INICIALES = [
  {
    id: '1',
    nombre: 'Hugo',
    apellido: 'Franco',
    cc: '123456789',
    telefono: '3101234567'
  },
  {
    id: '2',
    nombre: 'Paco',
    apellido: 'Ortiz',
    cc: '234567890',
    telefono: '3152345678'
  },
  {
    id: '3',
    nombre: 'Luis',
    apellido: 'Rodriguez',
    cc: '345678901',
    telefono: '3203456789'
  }
];

// --- FUNCIONES PARA VISITAS ---

export function obtenerVisitas() {
  const datos = localStorage.getItem(VISITAS_KEY);
  if (!datos) {
    guardarVisitas(VISITAS_INICIALES);
    return VISITAS_INICIALES;
  }
  return JSON.parse(datos);
}

export function guardarVisitas(visitas) {
  localStorage.setItem(VISITAS_KEY, JSON.stringify(visitas));
}

export function obtenerVisitaPorId(id) {
  const visitas = obtenerVisitas();
  return visitas.find(v => v.id === id);
}

export function actualizarEstadoVisita(id, nuevoEstado) {
  const visitas = obtenerVisitas();
  let visitaActualizada = null;

  const nuevaLista = visitas.map(v => {
    if (v.id === id) {
      visitaActualizada = { ...v, estado: nuevoEstado };
      return visitaActualizada;
    }
    return v;
  });

  guardarVisitas(nuevaLista);
  return nuevaLista;
}

// --- FUNCIONES PARA PACIENTES ---

export function obtenerPacientes() {
  const datos = localStorage.getItem(PACIENTES_KEY);
  if (!datos) {
    guardarPacientes(PACIENTES_INICIALES);
    return PACIENTES_INICIALES;
  }
  return JSON.parse(datos);
}

export function guardarPacientes(pacientes) {
  localStorage.setItem(PACIENTES_KEY, JSON.stringify(pacientes));
}

// --- FUNCIONES DE SESIÓN ---

export function guardarSesion(usuario) {
  localStorage.setItem(USUARIO_KEY, usuario);
  localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
}

export function obtenerSesion() {
  const isLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
  const usuario = localStorage.getItem(USUARIO_KEY) || '';
  return { isLoggedIn, usuario };
}

export function cerrarSesion() {
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}
