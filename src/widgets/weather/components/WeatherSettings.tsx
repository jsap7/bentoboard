import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { WeatherSettings as WeatherSettingsType } from '../utils/types';
import { getCurrentLocation } from '../utils/weatherUtils';
import SettingsBase, { SettingsSection, SettingsRow } from '../../shared/components/SettingsBase';
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
    <SettingsBase title="Weather Settings" onClose={onClose}>
      <SettingsSection 
        title="Display Options" 
        description="Customize how the weather information is shown"
      >
        {availableModes && availableModes.length > 0 && (
          <SettingsRow
            label="Display Mode"
            hint="Choose between detailed or minimal view"
          >
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
          </SettingsRow>
        )}
        
        <SettingsRow
          label="Temperature Unit"
          hint="Select your preferred temperature scale"
        >
          <select
            name="unit"
            value={weatherSettings.unit}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="celsius">Celsius (°C)</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Location Settings"
        description="Configure how your location is determined"
      >
        <SettingsRow
          label="Use Current Location"
          hint="Automatically detect your location"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              name="useCurrentLocation"
              checked={weatherSettings.useCurrentLocation}
              onChange={handleChange}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
        
        {!weatherSettings.useCurrentLocation && (
          <SettingsRow
            label="Manual Location"
            hint="Enter coordinates (e.g., 40.7128,-74.0060)"
          >
            <input
              type="text"
              name="location"
              value={weatherSettings.location || ''}
              onChange={handleChange}
              placeholder="Latitude,Longitude"
              className="settings-input"
            />
          </SettingsRow>
        )}
      </SettingsSection>

      <SettingsSection 
        title="Update Settings"
        description="Control how often the weather data refreshes"
      >
        <SettingsRow
          label="Auto Refresh"
          hint="Automatically update weather data"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              name="autoRefresh"
              checked={weatherSettings.autoRefresh}
              onChange={handleChange}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
        
        {weatherSettings.autoRefresh && (
          <SettingsRow
            label="Refresh Interval"
            hint="How often to update (in minutes)"
          >
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
          </SettingsRow>
        )}
      </SettingsSection>
    </SettingsBase>
  );
};

export default WeatherSettings; 