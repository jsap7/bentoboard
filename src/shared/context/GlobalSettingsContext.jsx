import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const defaultSettings = {
  theme: {
    buttonColor: '#FF6B6B',
    ringColor: '#FF6B6B'
  }
};

const GlobalSettingsContext = createContext();

export const useGlobalSettings = () => {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
};

export const GlobalSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);

  const updateTheme = (theme) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...theme
      }
    }));
  };

  return (
    <GlobalSettingsContext.Provider value={{ settings, updateTheme }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

GlobalSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
}; 