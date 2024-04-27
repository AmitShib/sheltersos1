import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const setIsConnectedValue = (value) => {
    setIsConnected(value);
  };

  const setIsAdminValue = (value) => {
    setIsAdmin(value);
  };

  const globalState = {
    isConnected,
    isAdmin,
    setIsConnectedValue,
    setIsAdminValue,
  };

  return (
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  );
};