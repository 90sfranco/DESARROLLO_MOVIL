import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Identificadores públicos del cliente; el acceso a los datos lo controlan las reglas de Firebase.
const config = {
  "apiKey": "AIzaSyDIFZPzGXeemCMBcbbltmzrCms6fJI_6CE",
  "authDomain": "challenge-05-franco.firebaseapp.com",
  "projectId": "challenge-05-franco",
  "appId": "529322238960:web:21d29aab33384b9ccf7335"
};

let auth = null;
let firestore = null;
let configurationError = '';
try {
  const app = initializeApp(config);
  auth = getAuth(app);
  firestore = getFirestore(app);
} catch {
  configurationError = 'No se pudo iniciar Firebase con la configuración incluida en la app.';
}
export { auth, firestore, configurationError };
