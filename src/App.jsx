import { IonApp, setupIonicReact } from '@ionic/react';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './App.css';
import TaskManager from './components/TaskManager.jsx';

setupIonicReact();

function App() {
  return (
    <IonApp>
      <TaskManager />
    </IonApp>
  );
}

export default App;
