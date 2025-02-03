import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();
const SETTINGS_STORAGE_KEY = 'timer_settings';

export const InputMethods = {
  DIRECT: 'direct',
  DIAL: 'dial',
  SCROLL: 'scroll',
};

export const defaultTheme = {
  ringColor: '#007AFF',
  buttonColor: '#007AFF',
  backgroundColor: '#161616',
};

export const ThemePresets = {
  BLUE: {
    name: 'Blue',
    ringColor: '#007AFF',
    buttonColor: '#007AFF',
    backgroundColor: '#161616',
  },
  PURPLE: {
    name: 'Purple',
    ringColor: '#AF52DE',
    buttonColor: '#AF52DE',
    backgroundColor: '#161616',
  },
  GREEN: {
    name: 'Green',
    ringColor: '#32D74B',
    buttonColor: '#32D74B',
    backgroundColor: '#161616',
  },
  ORANGE: {
    name: 'Orange',
    ringColor: '#FF9500',
    buttonColor: '#FF9500',
    backgroundColor: '#161616',
  },
};

const defaultSettings = {
  inputMethod: InputMethods.SCROLL,
  theme: defaultTheme,
  showSeconds: true,
};

const loadSavedSettings = () => {
  if (typeof window === 'undefined') return defaultSettings;
  
  try {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return {
        ...defaultSettings,
        ...parsed,
        theme: {
          ...defaultTheme,
          ...(parsed.theme || {}),
        },
      };
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => loadSavedSettings());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedSettings = loadSavedSettings();
    setSettings(savedSettings);
    setIsInitialized(true);
  }, []);

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
        theme: {
          ...prev.theme,
          ...(newSettings.theme || {}),
        },
      };
      
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
      
      return updated;
    });
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 