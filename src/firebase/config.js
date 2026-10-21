import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let auth = null;
let configurationError = '';

if (Object.values(firebaseConfig).every(Boolean)) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch {
    configurationError = 'La configuración de Firebase no es válida. Revisa el archivo .env.';
  }
} else {
  configurationError = 'Falta configurar Firebase. Copia .env.example a .env y completa los datos de tu app web.';
}

export { auth, configurationError };
