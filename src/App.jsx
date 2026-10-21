import { useContext } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonContent, IonPage, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import { TasksProvider } from './context/TasksContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TasksList from './pages/TasksList.jsx';
import TaskForm from './pages/TaskForm.jsx';
import TaskDetail from './pages/TaskDetail.jsx';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import './App.css';

setupIonicReact();

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <IonPage><IonContent className="ion-padding">Cargando sesión…</IonContent></IonPage>;
  }

  // Cambiar de usuario desmonta las páginas y las tareas de la sesión anterior.
  return (
    <TasksProvider key={user?.uid ?? 'guest'}>
      <IonReactRouter key={user?.uid ?? 'guest'}>
        <IonRouterOutlet>
          <Route path="/login" element={user ? <Navigate to="/tasks" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/tasks" replace /> : <Register />} />
          <Route path="/tasks" element={user ? <TasksList /> : <Navigate to="/login" replace />} />
          <Route path="/tasks/new" element={user ? <TaskForm /> : <Navigate to="/login" replace />} />
          <Route path="/tasks/:id/edit" element={user ? <TaskForm /> : <Navigate to="/login" replace />} />
          <Route path="/tasks/:id" element={user ? <TaskDetail /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to={user ? '/tasks' : '/login'} replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </TasksProvider>
  );
}

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </IonApp>
  );
}
