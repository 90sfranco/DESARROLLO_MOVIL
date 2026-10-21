import { createContext } from 'react';
import useFirebaseAuth from '../hooks/useFirebaseAuth.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const authentication = useFirebaseAuth();

  return (
    <AuthContext.Provider value={authentication}>
      {children}
    </AuthContext.Provider>
  );
}
