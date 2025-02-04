import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const GlobalSettingsContext = createContext();

const GLOBAL_SETTINGS_KEY = 'global_settings';

const defaultSettings = {
  theme: {
    buttonColor: '#007AFF',
    ringColor: '#007AFF',
    backgroundColor: '#161616',
    textColor: 'rgba(255, 255, 255, 0.9)',
    secondaryTextColor: 'rgba(255, 255, 255, 0.6)',
  }
};

export function GlobalSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem(GLOBAL_SETTINGS_KEY);
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Error loading global settings:', error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving global settings:', error);
    }
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  const updateTheme = (themeUpdates) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      theme: {
        ...prevSettings.theme,
        ...themeUpdates
      }
    }));
  };

  return (
    <GlobalSettingsContext.Provider value={{ settings, updateSettings, updateTheme }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

GlobalSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
} 