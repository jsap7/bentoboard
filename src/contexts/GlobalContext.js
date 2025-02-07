import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalContext = createContext({
  theme: {
    mode: 'dark',
    accentColor: '#6366f1',
    accentColorHover: '#4f46e5',
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
  },
  setTheme: (theme) => {},
  dashboardState: {
    widgets: [],
    layout: {
      columns: 12,
      rows: 6,
      rowHeight: 160,
      gap: 16
    }
  },
  setDashboardState: (state) => {}
});

export const useGlobalContext = () => useContext(GlobalContext);

// Curated list of Google Fonts with their properties
export const availableFonts = [
  {
    family: 'Prompt',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap'
  },
  {
    family: 'Lexend',
    category: 'sans-serif',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap'
  },
  {
    family: 'Comfortaa',
    category: 'display',
    weights: [400, 500, 600, 700],
    url: 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap'
  },
  {
    family: 'Lilita One',
    category: 'display',
    weights: [400],
    url: 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap'
  },
  {
    family: 'Rowdies',
    category: 'display',
    weights: [400, 700],
    url: 'https://fonts.googleapis.com/css2?family=Rowdies:wght@400;700&display=swap'
  },
  {
    family: 'Passion One',
    category: 'display',
    weights: [400, 700],
    url: 'https://fonts.googleapis.com/css2?family=Passion+One:wght@400;700&display=swap'
  },
  {
    family: 'Righteous',
    category: 'display',
    weights: [400],
    url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap'
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
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('bentoboard-theme');
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
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

  useEffect(() => {
    try {
      localStorage.setItem('bentoboard-theme', JSON.stringify(theme));
    } catch (error) {
      console.warn('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('bentoboard-dashboard', JSON.stringify(dashboardState));
    } catch (error) {
      console.warn('Error saving dashboard state to localStorage:', error);
    }
  }, [dashboardState]);

  return (
    <GlobalContext.Provider value={{ theme, setTheme, dashboardState, setDashboardState }}>
      {children}
    </GlobalContext.Provider>
  );
}; 