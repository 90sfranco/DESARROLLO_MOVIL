import { createContext, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';
import useProgress from '../hooks/useProgress.js';
import useLocalNotifications from '../hooks/useLocalNotifications.js';

export const MissionsContext = createContext(null);

export function MissionsProvider({ children }) {
  const { user } = useContext(AuthContext);
  const saved = useProgress(user);
  const notifications = useLocalNotifications();
  function completeMission(id) {
    const next = saved.complete(id);
    if (next) {
      const remaining = next.missions.filter(m => !m.completed).length;
      void notifications.missionCompleted(id, remaining);
    }
    return Boolean(next);
  }
  return <MissionsContext.Provider value={{ ...saved, completeMission, notifications }}>
    {children}
  </MissionsContext.Provider>;
}
