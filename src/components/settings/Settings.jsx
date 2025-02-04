import React, { useState, useEffect } from 'react';
import { useSettings, TimerModes, InputMethods } from '../../context/SettingsContext';
import './Settings.css';

const Settings = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const handleInputMethodChange = (e) => {
    updateSettings({
      ...settings,
      inputMethod: e.target.value
    });
  };

  const handleThemeChange = (color) => {
    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        buttonColor: color
      }
    });
  };

  const handleModeChange = (e) => {
    updateSettings({
      ...settings,
      timerMode: e.target.value
    });
  };

  const colors = [
    // Reds
    '#FF0000', // Pure Red
    '#FF3333', // Bright Red
    '#FF4D4D', // Vibrant Red
    '#FF6666', // Strong Red
    '#FF8080', // Light Red
    
    // Oranges  
    '#FF8C00', // Dark Orange
    '#FFA033', // Strong Orange
    '#FFB347', // Bright Orange
    '#FFC266', // Vibrant Orange
    '#FFD180', // Light Orange
    
    // Yellows
    '#FFD700', // Golden Yellow
    '#FFDD33', // Strong Yellow
    '#FFE347', // Bright Yellow
    '#FFE866', // Vibrant Yellow
    '#FFED80', // Light Yellow
    
    // Greens
    '#32CD32', // Pure Green
    '#47D147', // Strong Green
    '#5CD65C', // Bright Green
    '#70DB70', // Vibrant Green
    '#85E085', // Light Green
    
    // Blues
    '#1E90FF', // Pure Blue
    '#3D9EFF', // Strong Blue
    '#5CACFF', // Bright Blue
    '#7ABAFF', // Vibrant Blue
    '#99C9FF', // Light Blue
    
    // Violets
    '#8A2BE2', // Pure Violet
    '#9D44E6', // Strong Violet
    '#AF5DEA', // Bright Violet
    '#C176EE', // Vibrant Violet
    '#D38FF2', // Light Violet
  ];

  return (
    <div className={`settings-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div 
        className={`settings-sidebar ${isVisible ? 'visible' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">Timer Settings</h2>
          <button className="settings-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Timer Mode</div>
          <div className="mode-selector">
            <button
              className={`mode-button ${settings.timerMode === TimerModes.TIMER ? 'active' : ''}`}
              onClick={() => updateSettings({ ...settings, timerMode: TimerModes.TIMER })}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Timer
            </button>
            <button
              className={`mode-button ${settings.timerMode === TimerModes.STOPWATCH ? 'active' : ''}`}
              onClick={() => updateSettings({ ...settings, timerMode: TimerModes.STOPWATCH })}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 8 14"/>
              </svg>
              Stopwatch
            </button>
            <button
              className={`mode-button ${settings.timerMode === TimerModes.ALARM ? 'active' : ''}`}
              onClick={() => updateSettings({ ...settings, timerMode: TimerModes.ALARM })}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
              Alarm
            </button>
          </div>
        </div>

        <div className={`settings-section ${settings.timerMode === TimerModes.TIMER ? 'timer-mode' : ''}`}>
          <div className="settings-section-title">Input Method</div>
          <div className="input-method-selector">
            <button
              className={`input-button ${settings.inputMethod === InputMethods.DIRECT ? 'active' : ''}`}
              onClick={() => updateSettings({ ...settings, inputMethod: InputMethods.DIRECT })}
              disabled={settings.timerMode !== TimerModes.TIMER}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="6" width="16" height="12" rx="2"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Direct
            </button>
            <button
              className={`input-button ${settings.inputMethod === InputMethods.DIAL ? 'active' : ''}`}
              onClick={() => updateSettings({ ...settings, inputMethod: InputMethods.DIAL })}
              disabled={settings.timerMode !== TimerModes.TIMER}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
              </svg>
              Dial
            </button>
            <button
              className={`input-button ${settings.inputMethod === InputMethods.SCROLL ? 'active' : ''}`}
              onClick={() => updateSettings({ ...settings, inputMethod: InputMethods.SCROLL })}
              disabled={settings.timerMode !== TimerModes.TIMER}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="12" height="16" rx="2"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
              </svg>
              Scroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 