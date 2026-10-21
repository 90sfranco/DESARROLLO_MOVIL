import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, configurationError } from '../firebase/config.js';

function authErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Escribe un correo electrónico válido.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'El correo o la contraseña no son correctos.';
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado.';
    case 'auth/weak-password':
      return 'La contraseña debe cumplir la política del proyecto (mínimo 6 caracteres).';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta de nuevo más tarde.';
    case 'auth/network-request-failed':
      return 'No se pudo conectar con Firebase. Revisa tu conexión.';
    case 'auth/operation-not-allowed':
      return 'Habilita Email/Password en Firebase Authentication.';
    case 'auth/invalid-api-key':
    case 'auth/configuration-not-found':
      return 'Revisa la configuración del proyecto Firebase y activa Authentication.';
    default:
      return 'No se pudo completar la operación. Intenta de nuevo.';
  }
}

export default function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(configurationError);

  useEffect(() => {
    if (!auth) return;

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (firebaseError) => {
      setError(authErrorMessage(firebaseError));
      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    if (!auth) {
      setError(configurationError);
      return false;
    }
    setError('');
    setPending(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (firebaseError) {
      setError(authErrorMessage(firebaseError));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function register(email, password) {
    if (!auth) {
      setError(configurationError);
      return false;
    }
    setError('');
    setPending(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      return true;
    } catch (firebaseError) {
      setError(authErrorMessage(firebaseError));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    if (!auth) return false;
    setError('');
    setPending(true);
    try {
      await signOut(auth);
      return true;
    } catch (firebaseError) {
      setError(authErrorMessage(firebaseError));
      return false;
    } finally {
      setPending(false);
    }
  }

  function clearError() {
    setError(configurationError);
  }

  return { user, loading, pending, error, login, register, logout, clearError };
}
