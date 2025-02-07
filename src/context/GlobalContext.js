import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

// Curated list of Google Fonts with their properties
export const availableFonts = [
  {
    family: 'League Spartan',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;500;600;700&display=swap'
  },
  {
    family: 'Space Grotesk',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap'
  },
  {
    family: 'Outfit',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap'
  },
  {
    family: 'Inter',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  },
  {
    family: 'Plus Jakarta Sans',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap'
  }
];

const defaultTheme = {
  mode: 'dark',
  accentColor: '#6366f1',
  background: '#151515',
  surface: '#2d2d2d',
  text: '#ffffff',
  header: '#181818',
  font: {
    family: 'League Spartan',
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    letterSpacing: '-0.01em',
    features: {
      stylistic: true,
      contextual: true
    }
  }
};

const defaultDashboardState = {
  widgets: [],
  layout: {
    columns: 12,
    rows: 6,
    rowHeight: 160,
    gap: 16
  }
};

export const GlobalProvider = ({ children }) => {
  // Initialize state from localStorage or use defaults
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('bentoboard-theme');
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        // Ensure font settings exist
        return {
          ...defaultTheme,
          ...parsed,
          font: {
            ...defaultTheme.font,
            ...(parsed.font || {})
          }
        };
      }
    } catch (error) {
      console.warn('Error loading theme from localStorage:', error);
    }
    return defaultTheme;
  });

  const [dashboardState, setDashboardState] = useState(() => {
    try {
      const savedDashboardState = localStorage.getItem('bentoboard-dashboard');
      return savedDashboardState ? JSON.parse(savedDashboardState) : defaultDashboardState;
    } catch (error) {
      console.warn('Error loading dashboard state from localStorage:', error);
      return defaultDashboardState;
    }
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('bentoboard-theme', JSON.stringify(theme));
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  // Save dashboard state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('bentoboard-dashboard', JSON.stringify(dashboardState));
    } catch (error) {
      console.warn('Error saving dashboard state to localStorage:', error);
    }
  }, [dashboardState]);

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