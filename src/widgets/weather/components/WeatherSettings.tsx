import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { WeatherSettings as WeatherSettingsType } from '../utils/types';
import { getCurrentLocation } from '../utils/weatherUtils';
import './WeatherSettings.css';

const WeatherSettings: React.FC<WidgetSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose,
  availableModes
}) => {
  const weatherSettings = settings as WeatherSettingsType;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    const numValue = type === 'number' ? parseInt(value, 10) : undefined;

    if (name === 'useCurrentLocation' && (e.target as HTMLInputElement).checked) {
      getCurrentLocation()
        .then(location => {
          onSettingsChange({
            ...weatherSettings,
            useCurrentLocation: true,
            location
          });
        })
        .catch(error => {
          console.error('Failed to get location:', error);
          onSettingsChange({
            ...weatherSettings,
            useCurrentLocation: false
          });
        });
    } else {
      onSettingsChange({
        ...weatherSettings,
        [name]: numValue ?? newValue
      });
    }
  };

  return (
    <div className="weather-settings">
      <div className="settings-header">
        <h2>Weather Settings</h2>
        <button onClick={onClose} className="settings-close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-group">
          <h3>Display Options</h3>
          <div className="settings-description">Customize how the weather information is shown</div>
          {availableModes && availableModes.length > 0 && (
            <div className="settings-row">
              <div className="settings-label">
                <span>Display Mode</span>
                <span className="settings-hint">Choose between detailed or minimal view</span>
              </div>
              <select
                name="displayMode"
                value={weatherSettings.displayMode}
                onChange={handleChange}
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
          
          <div className="settings-row">
            <div className="settings-label">
              <span>Temperature Unit</span>
              <span className="settings-hint">Select your preferred temperature scale</span>
            </div>
            <select
              name="unit"
              value={weatherSettings.unit}
              onChange={handleChange}
              className="settings-select"
            >
              <option value="fahrenheit">Fahrenheit (°F)</option>
              <option value="celsius">Celsius (°C)</option>
            </select>
          </div>
        </div>

        <div className="settings-group">
          <h3>Location Settings</h3>
          <div className="settings-description">Configure how your location is determined</div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Use Current Location</span>
              <span className="settings-hint">Automatically detect your location</span>
            </div>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                name="useCurrentLocation"
                checked={weatherSettings.useCurrentLocation}
                onChange={handleChange}
              />
              <span className="toggle"></span>
            </label>
          </div>
          
          {!weatherSettings.useCurrentLocation && (
            <div className="settings-row">
              <div className="settings-label">
                <span>Manual Location</span>
                <span className="settings-hint">Enter coordinates (e.g., 40.7128,-74.0060)</span>
              </div>
              <input
                type="text"
                name="location"
                value={weatherSettings.location || ''}
                onChange={handleChange}
                placeholder="Latitude,Longitude"
                className="settings-input"
              />
            </div>
          )}
        </div>

        <div className="settings-group">
          <h3>Update Settings</h3>
          <div className="settings-description">Control how often the weather data refreshes</div>
          <div className="settings-row">
            <div className="settings-label">
              <span>Auto Refresh</span>
              <span className="settings-hint">Automatically update weather data</span>
            </div>
            <label className="settings-checkbox">
              <input
                type="checkbox"
                name="autoRefresh"
                checked={weatherSettings.autoRefresh}
                onChange={handleChange}
              />
              <span className="toggle"></span>
            </label>
          </div>
          
          {weatherSettings.autoRefresh && (
            <div className="settings-row">
              <div className="settings-label">
                <span>Refresh Interval</span>
                <span className="settings-hint">How often to update (in minutes)</span>
              </div>
              <input
                type="number"
                name="refreshInterval"
                value={weatherSettings.refreshInterval}
                onChange={handleChange}
                min="5"
                max="60"
                className="settings-input"
                style={{ width: '80px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherSettings; 