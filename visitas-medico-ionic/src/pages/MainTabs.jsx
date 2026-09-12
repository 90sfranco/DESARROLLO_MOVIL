import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet
} from '@ionic/react';
import { calendarOutline, peopleOutline, personOutline } from 'ionicons/icons';

import Visitas from './Visitas';
import DetalleVisita from './DetalleVisita';
import Pacientes from './Pacientes';
import Perfil from './Perfil';

function MainTabs() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Routes>
          <Route path="visitas" element={<Visitas />} />
          <Route path="visitas/:id" element={<DetalleVisita />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="" element={<Navigate to="visitas" replace />} />
          <Route path="*" element={<Navigate to="visitas" replace />} />
        </Routes>
      </IonRouterOutlet>

      {/* Pestañas requeridas: Visitas | Pacientes | Perfil */}
      <IonTabBar slot="bottom">
        <IonTabButton tab="visitas" href="/tabs/visitas">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Visitas</IonLabel>
        </IonTabButton>

        <IonTabButton tab="pacientes" href="/tabs/pacientes">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Pacientes</IonLabel>
        </IonTabButton>

        <IonTabButton tab="perfil" href="/tabs/perfil">
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

export default MainTabs;
