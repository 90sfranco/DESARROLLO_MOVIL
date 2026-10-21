import { createContext } from 'react';
import useNetwork from '../hooks/useNetwork.js';

export const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const network = useNetwork();
  return <NetworkContext.Provider value={network}>{children}</NetworkContext.Provider>;
}
