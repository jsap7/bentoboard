import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: 'dark',
    accentColor: '#6366f1',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    header: '#232323'  // Added for header background
  });

  const [dashboardState, setDashboardState] = useState({
    widgets: [], // Array of widget configurations
    layout: {
      columns: 12,
      rows: 6,     // Changed from 8 to 6 rows
      rowHeight: 160, // Increased height for better proportions
      gap: 16
    }
  });

  const value = {
    theme,
    setTheme,
    dashboardState,
    setDashboardState
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}; 