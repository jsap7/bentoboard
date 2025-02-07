import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { ClockSettings as ClockSettingsType, ClockDisplayMode } from '../../shared/types';
import { useGlobalContext } from '../../../context/GlobalContext';

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

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      displayMode: e.target.value as ClockDisplayMode
    });
  };

  return (
    <>
      <div className="settings-header">
        <h2 className="settings-title">Clock</h2>
        <button className="settings-close" onClick={onClose} aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="settings-content" style={{ '--accent-color': theme.accentColor } as React.CSSProperties}>
        {availableModes.length > 0 && (
          <div className="settings-section">
            <h3 className="settings-section-title">Display</h3>
            <div className="settings-option">
              <span className="settings-option-label">Mode</span>
              <select
                value={settings.displayMode || 'digital'}
                onChange={handleModeChange}
                className="settings-select"
              >
                {availableModes.map(mode => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h3 className="settings-section-title">Options</h3>
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
        </div>
      </div>
    </>
  );
};

export default ClockSettings; 