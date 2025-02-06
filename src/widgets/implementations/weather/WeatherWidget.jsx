import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import WeatherSettings from './WeatherSettings';
import WeatherDisplay from './components/WeatherDisplay';
import { useGlobalSettings } from '../../../shared/context/GlobalSettingsContext';
import './WeatherWidget.css';

const API_BASE = 'https://api.weather.gov';
const USER_AGENT = '(desktop-dashboard, github.com/joshuasapirstein/desktop)';

const WeatherWidget = ({ id, onClose, onMinimize, settings = {}, onSettingsChange }) => {
  const { settings: globalSettings } = useGlobalSettings();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Get user's location if set to auto
  useEffect(() => {
    if (settings.location === 'auto') {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Round coordinates to 2 decimal places to get metro area
            const roundedLat = Math.round(latitude * 100) / 100;
            const roundedLong = Math.round(longitude * 100) / 100;
            
            // Reverse geocode to get city name
            const response = await fetch(
              `https://api.weather.gov/points/${roundedLat},${roundedLong}`,
              {
                headers: {
                  'User-Agent': USER_AGENT
                }
              }
            );
            
            if (!response.ok) throw new Error('Failed to reverse geocode location');
            
            const data = await response.json();
            handleSettingChange('coordinates', { 
              latitude: roundedLat,
              longitude: roundedLong
            });
          } catch (err) {
            setError('Unable to determine your location. Please enter it manually.');
            console.error('Location error:', err);
          }
        },
        (err) => {
          setError('Unable to get your location. Please enter it manually.');
          console.error('Geolocation error:', err);
        }
      );
    }
  }, [settings.location]);

  // Get grid data when coordinates change
  useEffect(() => {
    const fetchGridData = async () => {
      if (!settings.coordinates) return;
      
      try {
        const { latitude, longitude } = settings.coordinates;
        const response = await fetch(
          `${API_BASE}/points/${latitude},${longitude}`,
          {
            headers: {
              'User-Agent': USER_AGENT
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch grid data');
        
        const data = await response.json();
        setGridData(data);
      } catch (err) {
        setError('Failed to get weather grid data');
        console.error('Grid data fetch error:', err);
      }
    };

    fetchGridData();
  }, [settings.coordinates]);

  // Fetch weather data using grid data
  useEffect(() => {
    const fetchWeather = async () => {
      if (!gridData) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get forecast data
        const forecastResponse = await fetch(
          gridData.properties.forecast,
          {
            headers: {
              'User-Agent': USER_AGENT
            }
          }
        );
        
        if (!forecastResponse.ok) throw new Error('Failed to fetch forecast');
        
        const forecastData = await forecastResponse.json();

        // Get hourly forecast for more detailed current conditions
        const hourlyResponse = await fetch(
          gridData.properties.forecastHourly,
          {
            headers: {
              'User-Agent': USER_AGENT
            }
          }
        );
        
        if (!hourlyResponse.ok) throw new Error('Failed to fetch hourly forecast');
        
        const hourlyData = await hourlyResponse.json();

        // Format the data for our display
        const current = hourlyData.properties.periods[0];
        const daily = forecastData.properties.periods.filter(period => period.isDaytime);

        // Parse wind speed to number
        const parseWindSpeed = (speedStr) => {
          const match = speedStr.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };

        setWeatherData({
          current: {
            temp: current.temperature,
            feels_like: current.temperature,
            humidity: current.relativeHumidity.value,
            wind_speed: parseWindSpeed(current.windSpeed),
            wind_direction: current.windDirection,
            pressure: current.pressure?.value,
            visibility: current.visibility?.value,
            precipitation: current.probabilityOfPrecipitation?.value || 0,
            weather: [{
              main: current.shortForecast,
              description: current.detailedForecast || current.shortForecast,
              icon: current.icon
            }]
          },
          daily: daily.map(day => ({
            temp: {
              min: day.temperature,
              max: day.temperature
            },
            precipitation: day.probabilityOfPrecipitation?.value || 0,
            wind_speed: parseWindSpeed(day.windSpeed),
            wind_direction: day.windDirection,
            weather: [{
              main: day.shortForecast,
              description: day.detailedForecast,
              icon: day.icon
            }]
          })).slice(0, 5),
          location: {
            name: gridData.properties.relativeLocation.properties.city,
            state: gridData.properties.relativeLocation.properties.state
          }
        });
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
    // Set up polling based on settings
    const interval = setInterval(fetchWeather, (settings.updateInterval || 5) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [gridData, settings.updateInterval]);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      if (!settings.coordinates) return;
      
      try {
        const { latitude, longitude } = settings.coordinates;
        const response = await fetch(
          `${API_BASE}/alerts/active?point=${latitude},${longitude}`,
          {
            headers: {
              'User-Agent': USER_AGENT
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch alerts');
        
        const data = await response.json();
        setAlerts(data.features.map(feature => ({
          id: feature.properties.id,
          event: feature.properties.event,
          headline: feature.properties.headline,
          description: feature.properties.description,
          severity: feature.properties.severity,
          urgency: feature.properties.urgency,
          start: new Date(feature.properties.effective),
          end: new Date(feature.properties.expires)
        })));
      } catch (err) {
        console.error('Alerts fetch error:', err);
        // Don't set error state for alerts - they're optional
      }
    };

    fetchAlerts();
    // Fetch alerts more frequently than weather data
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, [settings.coordinates]);

  const handleSettingChange = (key, value) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        [key]: value
      });
    }
  };

  return (
    <BaseWidget
      id={id}
      title="Weather"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      onSettingsChange={handleSettingChange}
      SettingsComponent={WeatherSettings}
      className="weather-widget"
    >
      <WeatherDisplay
        data={weatherData}
        alerts={alerts}
        isLoading={isLoading}
        error={error}
        settings={settings}
        globalSettings={globalSettings}
      />
    </BaseWidget>
  );
};

WeatherWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object,
  onSettingsChange: PropTypes.func
};

// Register the widget
const weatherWidgetConfig = {
  type: 'weather',
  component: WeatherWidget,
  name: 'Weather',
  description: 'Display current weather and forecast using National Weather Service data',
  defaultSettings: {
    location: 'auto', // 'auto' for automatic location detection
    coordinates: null, // Will store lat/long
    units: 'metric', // 'metric' or 'imperial'
    showForecast: true,
    updateInterval: 5, // minutes
    theme: {
      backgroundColor: '#161616'
    }
  },
  defaultSize: {
    width: 3,
    height: 2
  },
  isResizable: true,
  minSize: {
    width: 2,
    height: 2
  },
  maxSize: {
    width: 4,
    height: 4
  }
};

export { WeatherWidget as default, weatherWidgetConfig }; 