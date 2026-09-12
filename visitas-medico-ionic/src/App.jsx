import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import MainTabs from './pages/MainTabs';
import { obtenerSesion } from './utils/storage';

/* Core CSS de Ionic */
import '@ionic/react/css/core.css';

/* Estilos básicos de Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Utilidades opcionales */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Paleta de Modo Oscuro */
import '@ionic/react/css/palettes/dark.system.css';

/* Variables de tema */
import './theme/variables.css';

setupIonicReact();

function App() {
  const { isLoggedIn } = obtenerSesion();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/tabs/*" element={<MainTabs />} />
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/tabs/visitas" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
