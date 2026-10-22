import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home.jsx';
import GeolocationPage from './pages/GeolocationPage.jsx';
import CameraPage from './pages/CameraPage.jsx';
import MotionPage from './pages/MotionPage.jsx';
import DevicePage from './pages/DevicePage.jsx';
import HapticsPage from './pages/HapticsPage.jsx';
import FilesystemPage from './pages/FilesystemPage.jsx';
import LocalNotificationsPage from './pages/LocalNotificationsPage.jsx';
import PushNotificationsPage from './pages/PushNotificationsPage.jsx';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import './App.css';

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" element={<Home />} />
          <Route path="/geolocation" element={<GeolocationPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/motion" element={<MotionPage />} />
          <Route path="/device" element={<DevicePage />} />
          <Route path="/haptics" element={<HapticsPage />} />
          <Route path="/filesystem" element={<FilesystemPage />} />
          <Route path="/local-notifications" element={<LocalNotificationsPage />} />
          <Route path="/push-notifications" element={<PushNotificationsPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
