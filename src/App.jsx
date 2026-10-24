import { useContext } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonContent, IonPage, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import { MissionsProvider } from './context/MissionsContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Missions from './pages/Missions.jsx';
import Results from './pages/Results.jsx';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import './App.css';

setupIonicReact();

function Routes({ user }) {
  return <IonReactRouter>
    <IonRouterOutlet>
      <Route path="/login" element={user ? <Navigate to="/missions" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/missions" replace /> : <Register />} />
      <Route path="/missions" element={user ? <Missions /> : <Navigate to="/login" replace />} />
      <Route path="/results" element={user ? <Results /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? '/missions' : '/login'} replace />} />
    </IonRouterOutlet>
  </IonReactRouter>;
}
function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <IonPage><IonContent className="ion-padding">Cargando sesión…</IonContent></IonPage>;
  return user
    ? <MissionsProvider key={user.uid}><Routes user={user} /></MissionsProvider>
    : <Routes key="guest" user={null} />;
}
export default function App() {
  return <IonApp><AuthProvider><AppRoutes /></AuthProvider></IonApp>;
}
