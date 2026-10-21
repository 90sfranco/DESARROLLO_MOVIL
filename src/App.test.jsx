import { act, cleanup, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useFirebaseAuth from './hooks/useFirebaseAuth.js';
import App from './App.jsx';
import { setupIonicReact } from '@ionic/react';

setupIonicReact({ animated: false });

const firebase = vi.hoisted(() => ({
  observer: null,
  unsubscribe: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}));

// JSDOM no implementa los controles de entrada de Stencil.
vi.mock('@ionic/react', async (importOriginal) => {
  const ionic = await importOriginal();
  return {
    ...ionic,
    IonInput: ({ label, value, onIonInput, type, required, minlength }) => (
      <label>{label}<input type={type} value={value} required={required} minLength={minlength}
        onChange={(event) => onIonInput({ detail: { value: event.target.value } })} /></label>
    ),
    IonTextarea: ({ label, value, onIonInput }) => (
      <label>{label}<textarea value={value}
        onChange={(event) => onIonInput({ detail: { value: event.target.value } })} /></label>
    ),
  };
});

vi.mock('./firebase/config.js', () => ({ auth: {}, configurationError: '' }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    firebase.observer = callback;
    callback(null);
    return firebase.unsubscribe;
  }),
  signInWithEmailAndPassword: firebase.login,
  createUserWithEmailAndPassword: firebase.register,
  signOut: firebase.logout,
}));

beforeEach(() => {
  window.matchMedia = vi.fn(() => ({
    matches: false, addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
  window.history.replaceState({}, '', '/login');
  firebase.login.mockResolvedValue({});
  firebase.register.mockResolvedValue({});
  firebase.logout.mockResolvedValue(undefined);
});

afterEach(cleanup);

async function input(label, value) {
  const field = await waitFor(() => within(currentPage()).getByLabelText(label));
  fireEvent.change(field, { target: { value } });
}

function currentPage() {
  return document.querySelector('ion-router-outlet > .ion-page:not(.ion-page-hidden)');
}

async function clickButton(text) {
  const button = await waitFor(() => {
    const buttons = Array.from(currentPage()?.querySelectorAll('ion-button') ?? []);
    const target = buttons.find((element) => element.textContent.trim() === text);
    expect(target, `No se encontró el botón ${text}`).toBeTruthy();
    return target;
  });
  fireEvent.click(button);
  await act(async () => {});
}

describe('Autenticación con Firebase', () => {
  it('restaura la sesión del observador y cancela la suscripción al desmontar', () => {
    const { result, unmount } = renderHook(useFirebaseAuth);
    expect(result.current.loading).toBe(false);
    act(() => firebase.observer({ uid: 'usuario-1', email: 'test@example.com' }));
    expect(result.current.user.uid).toBe('usuario-1');
    unmount();
    expect(firebase.unsubscribe).toHaveBeenCalled();
  });

  it('envía login y registro al SDK y presenta errores sin autenticar al usuario', async () => {
    const { result } = renderHook(useFirebaseAuth);
    firebase.login.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    await act(async () => {
      expect(await result.current.login(' test@example.com ', 'incorrecta')).toBe(false);
    });
    expect(firebase.login).toHaveBeenCalledWith({}, 'test@example.com', 'incorrecta');
    expect(result.current.user).toBeNull();
    expect(result.current.error).toContain('no son correctos');
    expect(result.current.pending).toBe(false);
    await act(async () => {
      expect(await result.current.register(' test@example.com ', 'seis123')).toBe(true);
    });
    expect(firebase.register).toHaveBeenCalledWith({}, 'test@example.com', 'seis123');
    expect(result.current.error).toBe('');
  });

  it('mantiene la sesión si Firebase rechaza el cierre y permite volver a intentarlo', async () => {
    const { result } = renderHook(useFirebaseAuth);
    act(() => firebase.observer({ uid: 'usuario-1' }));
    firebase.logout.mockRejectedValueOnce({ code: 'auth/network-request-failed' });
    await act(async () => {
      expect(await result.current.logout()).toBe(false);
    });
    expect(result.current.user.uid).toBe('usuario-1');
    expect(result.current.error).toContain('conexión');
    await act(async () => {
      await result.current.logout();
      firebase.observer(null);
    });
    expect(result.current.user).toBeNull();
  });
});

describe('Páginas y tareas', () => {
  it('conecta los formularios de login y registro con el contexto de autenticación', async () => {
    render(<App />);
    await input('Correo electrónico', 'test@example.com');
    await input('Contraseña', 'incorrecta');
    firebase.login.mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    fireEvent.submit(currentPage().querySelector('form'));
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('no son correctos'));
    await clickButton('Crear una cuenta');
    await waitFor(() => expect(window.location.pathname).toBe('/register'));
    await input('Correo electrónico', 'nuevo@example.com');
    await input('Contraseña (mínimo 6 caracteres)', 'clave123');
    fireEvent.submit(currentPage().querySelector('form'));
    await waitFor(() => expect(firebase.register).toHaveBeenCalledWith({}, 'nuevo@example.com', 'clave123'));
    await act(async () => firebase.observer({ uid: 'nuevo', email: 'nuevo@example.com' }));
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
    await waitFor(() => expect(currentPage()?.textContent).toContain('nuevo@example.com'));
  });

  it('muestra una tarea inexistente sin fallar al abrir una URL directa', async () => {
    render(<App />);
    await act(async () => firebase.observer({ uid: 'usuario-1', email: 'test@example.com' }));
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
    window.history.pushState({}, '', '/tasks/no-existe/edit');
    await act(async () => window.dispatchEvent(new PopStateEvent('popstate')));
    expect(await screen.findByText('La tarea no existe.')).toBeTruthy();
    expect(currentPage().querySelector('form')).toBeNull();
    await clickButton('Volver a la lista');
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
  });

  it('protege las rutas sin sesión, incluido el detalle', async () => {
    window.history.replaceState({}, '', '/tasks/no-existe');
    render(<App />);
    await waitFor(() => expect(window.location.pathname).toBe('/login'));
    expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy();
  });

  it('comparte agregar, detalle, edición, completar y eliminar; limpia tareas al salir', async () => {
    render(<App />);
    await act(async () => firebase.observer({ uid: 'usuario-1', email: 'test@example.com' }));
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
    await clickButton('Agregar tarea');
    await waitFor(() => expect(window.location.pathname).toBe('/tasks/new'));
    await input('Título', '   ');
    fireEvent.submit(currentPage().querySelector('form'));
    expect(screen.getByRole('alert').textContent).toContain('título');
    await input('Título', '  Preparar entrega  ');
    fireEvent.submit(currentPage().querySelector('form'));
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
    await waitFor(() => expect(currentPage()?.textContent).toContain('Preparar entrega'));
    await clickButton('Ver detalle');
    await waitFor(() => expect(currentPage().textContent).toContain('Sin descripción.'));
    await clickButton('Editar tarea');
    await waitFor(() => expect(window.location.pathname).toMatch(/\/edit$/));
    await input('Título', 'Entrega revisada');
    fireEvent.submit(currentPage().querySelector('form'));
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
    await waitFor(() => expect(currentPage()?.textContent).toContain('Entrega revisada'));
    await clickButton('Completar');
    expect(currentPage().textContent).toContain('Completada');
    await clickButton('Marcar pendiente');
    expect(currentPage().textContent).toContain('Pendiente');
    await clickButton('Eliminar');
    expect(currentPage().textContent).toContain('No hay tareas');
    await clickButton('Agregar tarea');
    await waitFor(() => expect(window.location.pathname).toBe('/tasks/new'));
    await waitFor(() => expect(currentPage()?.querySelector('input')?.value).toBe(''));
    await input('Título', 'Tarea privada');
    fireEvent.submit(currentPage().querySelector('form'));
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
    await clickButton('Cerrar sesión');
    expect(firebase.logout).toHaveBeenCalled();
    await act(async () => firebase.observer(null));
    await waitFor(() => expect(window.location.pathname).toBe('/login'));
    await act(async () => firebase.observer({ uid: 'usuario-2', email: 'otro@example.com' }));
    await waitFor(() => expect(window.location.pathname).toBe('/tasks'));
    expect(currentPage().textContent).toContain('No hay tareas');
    expect(document.body.textContent).not.toContain('Tarea privada');
  });
});
