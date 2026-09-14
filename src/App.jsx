import { useState } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login.jsx';
import List from './pages/List.jsx';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './App.css';

setupIonicReact();

function App() {
  const [logged, setLogged] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('logged') === 'true',
  );

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            path="/"
            element={<Navigate to={logged ? '/list' : '/login'} replace />}
          />
          <Route
            path="/login"
            element={logged ? <Navigate to="/list" replace /> : <Login onLogin={() => setLogged(true)} />}
          />
          <Route
            path="/list"
            element={logged ? <List onLogout={() => setLogged(false)} /> : <Navigate to="/login" replace />}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
