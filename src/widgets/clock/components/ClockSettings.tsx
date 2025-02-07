import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { ClockSettings as ClockSettingsType, ClockDisplayMode, ClockThemeMode } from '../../shared/types';
import { useGlobalContext } from '../../../contexts/GlobalContext';

const ClockSettings: React.FC<WidgetSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose,
  availableModes = []
}) => {
  const { theme } = useGlobalContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      [e.target.name]: e.target.checked
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="settings-header">
        <h2 className="settings-title">Clock Settings</h2>
        <button className="settings-close" onClick={onClose} aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="settings-content">
        <div className="settings-section">
          <h3 className="settings-section-title">Display</h3>
          {availableModes.length > 0 && (
            <div className="settings-option">
              <span className="settings-option-label">Mode</span>
              <select
                name="displayMode"
                value={settings.displayMode || 'digital'}
                onChange={handleSelectChange}
                className="settings-select"
              >
                {availableModes.map(mode => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="settings-option">
            <span className="settings-option-label">Theme</span>
            <select
              name="theme"
              value={settings.theme || 'modern'}
              onChange={handleSelectChange}
              className="settings-select"
            >
              <option value="minimal">Minimal</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Time Format</h3>
          <div className="settings-option">
            <span className="settings-option-label">24-Hour Format</span>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.use24Hour}
                onChange={handleChange}
                name="use24Hour"
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-option">
            <span className="settings-option-label">Show Seconds</span>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.showSeconds}
                onChange={handleChange}
                name="showSeconds"
              />
              <span className="slider"></span>
            </label>
          </div>

          {settings.showSeconds && (
            <div className="settings-option">
              <span className="settings-option-label">Show Milliseconds</span>
              <label className="settings-switch">
                <input
                  type="checkbox"
                  checked={settings.showMilliseconds}
                  onChange={handleChange}
                  name="showMilliseconds"
                />
                <span className="slider"></span>
              </label>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Date</h3>
          <div className="settings-option">
            <span className="settings-option-label">Show Date</span>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.showDate}
                onChange={handleChange}
                name="showDate"
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClockSettings; 