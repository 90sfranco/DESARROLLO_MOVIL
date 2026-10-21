import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let auth = null;
let firestore = null;
let realtime = null;
let configurationError = '';

if (Object.values(firebaseConfig).every(Boolean)) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
    if (databaseURL) realtime = getDatabase(app, databaseURL);
  } catch {
    configurationError = 'La configuración de Firebase no es válida. Revisa el archivo .env.';
  }
} else {
  configurationError = 'Falta configurar Firebase. Copia .env.example a .env y completa los datos de tu app web.';
}

export { auth, firestore, realtime, configurationError };
