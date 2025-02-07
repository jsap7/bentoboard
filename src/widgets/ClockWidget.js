import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BaseWidget from '../components/BaseWidget';

// Clock Settings Component
const ClockSettings = ({ settings, onSettingsChange, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (e) => {
    const newSettings = {
      ...localSettings,
      [e.target.name]: e.target.checked
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2 className="settings-title">Clock Settings</h2>
        <button className="settings-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="settings-body">
        <label>
          <input
            type="checkbox"
            name="showSeconds"
            checked={localSettings.showSeconds}
            onChange={handleChange}
          />
          Show Seconds
        </label>
        <label>
          <input
            type="checkbox"
            name="showDate"
            checked={localSettings.showDate}
            onChange={handleChange}
          />
          Show Date
        </label>
      </div>
    </div>
  );
};

const ClockWidget = ({ 
  id,
  style, 
  onResize,
  onDrag,
  onClose,
  gridPosition,
  gridSize
}) => {
  const [time, setTime] = useState(new Date());
  const [settings, setSettings] = useState({
    showSeconds: true,
    showDate: true
  });

  // Memoize time update interval
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
    };
    
    // Initial update
    updateTime();
    
    // Set interval for updates
    const timer = setInterval(updateTime, settings.showSeconds ? 1000 : 60000);

    return () => clearInterval(timer);
  }, [settings.showSeconds]); // Only recreate interval when showSeconds changes

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  // Memoize time formatting options
  const timeOptions = useMemo(() => ({
    hour: '2-digit',
    minute: '2-digit',
    ...(settings.showSeconds && { second: '2-digit' })
  }), [settings.showSeconds]);

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: '8px'
  };

  const timeStyle = {
    fontSize: '2.5em',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  };

  const dateStyle = {
    fontSize: '1.1em',
    opacity: 0.8
  };

  return (
    <BaseWidget
      id={id}
      title="Clock"
      style={style}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onResize={onResize}
      onDrag={onDrag}
      onClose={onClose}
      gridPosition={gridPosition}
      gridSize={gridSize}
      SettingsComponent={ClockSettings}
    >
      <div style={contentStyle}>
        <div style={timeStyle}>
          {time.toLocaleTimeString([], timeOptions)}
        </div>
        {settings.showDate && (
          <div style={dateStyle}>
            {time.toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

// Add widget configuration
ClockWidget.widgetConfig = {
  defaultSize: { width: 2, height: 2 },
  title: 'Clock',
  description: 'Displays current time and date'
};

export default ClockWidget; 