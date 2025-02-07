import React, { useState } from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import '../styles/ClockWidget.css';

interface ClockSettings {
  showSeconds: boolean;
  showDate: boolean;
  use24Hour: boolean;
}

const ClockSettings: React.FC<WidgetSettingsProps> = ({ 
  settings, 
  onSettingsChange, 
  onClose 
}) => {
  const [localSettings, setLocalSettings] = useState<ClockSettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="clock-settings-body">
        <div className="clock-settings-option">
          <input
            type="checkbox"
            id="showSeconds"
            name="showSeconds"
            checked={localSettings.showSeconds}
            onChange={handleChange}
          />
          <label htmlFor="showSeconds">Show Seconds</label>
        </div>
        <div className="clock-settings-option">
          <input
            type="checkbox"
            id="showDate"
            name="showDate"
            checked={localSettings.showDate}
            onChange={handleChange}
          />
          <label htmlFor="showDate">Show Date</label>
        </div>
        <div className="clock-settings-option">
          <input
            type="checkbox"
            id="use24Hour"
            name="use24Hour"
            checked={localSettings.use24Hour}
            onChange={handleChange}
          />
          <label htmlFor="use24Hour">Use 24-Hour Format</label>
        </div>
      </div>
    </div>
  );
};

export default ClockSettings; 