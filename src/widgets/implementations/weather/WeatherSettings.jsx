import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BaseWidgetSettings from '../../core/BaseWidgetSettings';
import './WeatherSettings.css';

const WeatherSettings = ({ settings = {}, onSettingsChange, onClose }) => {
  const [location, setLocation] = useState(settings.location || 'auto');
  const [customCoordinates, setCustomCoordinates] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [error, setError] = useState('');

  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (customCoordinates.trim()) {
      try {
        // Parse coordinates in format "latitude,longitude" or "latitude longitude"
        const [lat, lon] = customCoordinates.trim().split(/[,\s]+/).map(Number);
        
        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          setError('Invalid coordinates. Please enter valid latitude and longitude.');
          return;
        }

        handleSettingChange('coordinates', { latitude: lat, longitude: lon });
        handleSettingChange('location', 'custom');
        setIsEditingLocation(false);
        setError('');
      } catch (err) {
        setError('Invalid coordinates format. Please use "latitude,longitude".');
      }
    }
  };

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleSettingChange('coordinates', { latitude, longitude });
        handleSettingChange('location', 'auto');
        setError('');
      },
      (err) => {
        setError('Unable to get your location. Please enter coordinates manually.');
        console.error('Geolocation error:', err);
      }
    );
  };

  return (
    <BaseWidgetSettings onClose={onClose} title="Weather Settings">
      <div className="weather-settings">
        <div className="settings-section">
          <h3>Location</h3>
          {isEditingLocation ? (
            <form onSubmit={handleLocationSubmit} className="location-form">
              <div className="location-input-group">
                <input
                  type="text"
                  value={customCoordinates}
                  onChange={(e) => setCustomCoordinates(e.target.value)}
                  placeholder="Enter coordinates (e.g., 40.7128,-74.0060)"
                  className="location-input"
                />
                {error && <div className="location-error">{error}</div>}
              </div>
              <div className="location-actions">
                <button type="submit" className="location-save">Save</button>
                <button 
                  type="button" 
                  className="location-cancel"
                  onClick={() => {
                    setIsEditingLocation(false);
                    setError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="location-display">
              <span>
                {location === 'auto' ? 'Using Current Location' : 
                  settings.coordinates ? 
                    `${settings.coordinates.latitude.toFixed(4)}, ${settings.coordinates.longitude.toFixed(4)}` :
                    'No location set'
                }
              </span>
              <button 
                className="location-edit"
                onClick={() => {
                  setCustomCoordinates(
                    settings.coordinates ? 
                      `${settings.coordinates.latitude},${settings.coordinates.longitude}` : 
                      ''
                  );
                  setIsEditingLocation(true);
                }}
              >
                Edit
              </button>
            </div>
          )}
          <button
            className="use-auto-location"
            onClick={handleUseLocation}
          >
            Use My Location
          </button>
        </div>

        <div className="settings-section">
          <h3>Display</h3>
          <div className="setting-item">
            <label>Temperature Units</label>
            <select
              value={settings.units || 'metric'}
              onChange={(e) => handleSettingChange('units', e.target.value)}
            >
              <option value="metric">Celsius (°C)</option>
              <option value="imperial">Fahrenheit (°F)</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Show Forecast</label>
            <input
              type="checkbox"
              checked={settings.showForecast ?? true}
              onChange={(e) => handleSettingChange('showForecast', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Updates</h3>
          <div className="setting-item">
            <label>Update Interval</label>
            <select
              value={settings.updateInterval || 5}
              onChange={(e) => handleSettingChange('updateInterval', Number(e.target.value))}
            >
              <option value={5}>5 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>
        </div>
      </div>
    </BaseWidgetSettings>
  );
};

WeatherSettings.propTypes = {
  settings: PropTypes.shape({
    location: PropTypes.string,
    coordinates: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    units: PropTypes.oneOf(['metric', 'imperial']),
    showForecast: PropTypes.bool,
    updateInterval: PropTypes.number
  }),
  onSettingsChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default WeatherSettings; 