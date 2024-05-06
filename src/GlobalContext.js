import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/reports');
        const parsedReports = response.data.map(report => ({
          ...report,
          shelterNum: parseInt(report.shelterNum, 10)
        }));
        setReports(parsedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const setReportsValue = (reports) => {
    setReports(reports);
  }

  const setIsConnectedValue = (value) => {
    setIsConnected(value);
  };

  const setIsAdminValue = (value) => {
    setIsAdmin(value);
  };

  const globalState = {
    isConnected,
    isAdmin,
    reports,
    setReportsValue,
    setIsConnectedValue,
    setIsAdminValue,
  };

  return (
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  );
};