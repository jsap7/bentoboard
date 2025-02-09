import React from 'react';
import BaseWidget from '../../components/BaseWidget';
import WeatherSettings from './components/WeatherSettings';
import { getDefaultWeatherSettings, getSizeConfig, formatTemperature, formatWindSpeed, formatHumidity, fetchWeatherData, getCurrentLocation } from './utils/weatherUtils';
import { getIconForCondition } from './utils/weatherIcons';
import { WidgetProps, WidgetConfig } from '../shared/types';
import { WeatherData, WeatherSettings as WeatherSettingsType } from './utils/types';
import { useWidgetState } from '../../contexts/WidgetStateContext';
import './styles/WeatherWidget.css';

interface WeatherWidgetProps extends WidgetProps {}

interface WeatherWidgetComponent extends React.FC<WeatherWidgetProps> {
  widgetConfig: WidgetConfig;
}

const WeatherWidget: WeatherWidgetComponent = ({
  id,
  style,
  gridPosition,
  gridSize,
  onClose,
  onResize,
  onDrag
}) => {
  const [widgetState, updateWidgetState] = useWidgetState({
    id,
    initialGridPosition: gridPosition,
    initialGridSize: gridSize,
    initialSettings: getDefaultWeatherSettings(),
  });

  const settings = widgetState.settings as WeatherSettingsType;
  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Get size configuration based on current dimensions
  const sizeConfig = React.useMemo(() => 
    getSizeConfig(widgetState.gridSize.width, widgetState.gridSize.height),
    [widgetState.gridSize.width, widgetState.gridSize.height]
  );

  // Function to update location and fetch weather data
  const updateLocationAndFetch = React.useCallback(async () => {
    if (!settings.useCurrentLocation) return;

    try {
      const location = await getCurrentLocation();
      updateWidgetState({
        settings: {
          ...settings,
          location
        }
      });
    } catch (err) {
      setError('Failed to get current location. Please enter location manually.');
      updateWidgetState({
        settings: {
          ...settings,
          useCurrentLocation: false
        }
      });
    }
  }, [settings, updateWidgetState]);

  // Initial location setup
  React.useEffect(() => {
    if (settings.useCurrentLocation && !settings.location) {
      updateLocationAndFetch();
    }
  }, [settings.useCurrentLocation, settings.location, updateLocationAndFetch]);

  const fetchData = React.useCallback(async () => {
    if (!settings.location) {
      if (settings.useCurrentLocation) {
        await updateLocationAndFetch();
      } else {
        setError('Please set a location in settings');
        return;
      }
    }

    if (!settings.location) return; // Exit if still no location

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(settings.location);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  }, [settings.location, settings.useCurrentLocation, updateLocationAndFetch]);

  // Initial fetch and refresh setup
  React.useEffect(() => {
    fetchData();

    if (settings.autoRefresh) {
      const interval = setInterval(fetchData, settings.refreshInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [fetchData, settings.autoRefresh, settings.refreshInterval]);

  const handleSettingsChange = React.useCallback((newSettings: WeatherSettingsType) => {
    updateWidgetState({ settings: newSettings });
  }, [updateWidgetState]);

  const renderWeatherIcon = () => {
    if (!weatherData?.description) return null;
    const Icon = getIconForCondition(weatherData.description);
    return <Icon className="weather-icon" />;
  };

  const renderMinimalMode = () => (
    <div className="weather-minimal">
      <div className="weather-temperature">
        {weatherData && formatTemperature(weatherData.temperature, settings.unit)}
      </div>
      <div className="weather-location">
        {weatherData?.location}
      </div>
    </div>
  );

  const renderDetailedMode = () => (
    <>
      <div className="weather-main">
        <div className="weather-temperature">
          {weatherData && formatTemperature(weatherData.temperature, settings.unit)}
        </div>
        <div className="weather-location">
          {weatherData?.location}
        </div>
        <div className="weather-description">
          {weatherData?.description}
        </div>
        <div className="weather-feels-like">
          Feels like {weatherData && formatTemperature(weatherData.feelsLike, settings.unit)}
        </div>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M8 6l8 12M16 6L8 18" />
          </svg>
          {weatherData && formatWindSpeed(weatherData.windSpeed, weatherData.windDirection)}
        </div>
        <div className="weather-detail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
          </svg>
          {weatherData && formatHumidity(weatherData.humidity)}
        </div>
      </div>
      <div className="weather-last-updated">
        Updated {weatherData && new Date(weatherData.lastUpdated).toLocaleTimeString()}
      </div>
    </>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="weather-loading">
          <div className="weather-loading-spinner" />
          <div>Loading weather data...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="weather-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12" y2="16" />
          </svg>
          <div>{error}</div>
        </div>
      );
    }

    if (!weatherData) {
      return (
        <div className="weather-error">
          <div>No weather data available</div>
        </div>
      );
    }

    return settings.displayMode === 'minimal' ? renderMinimalMode() : renderDetailedMode();
  };

  return (
    <BaseWidget
      id={id}
      title="Weather"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={WeatherSettings}
    >
      <div 
        className="weather-widget-content"
        data-size-category={sizeConfig.category}
        data-display-mode={settings.displayMode || sizeConfig.defaultMode}
      >
        {renderContent()}
      </div>
    </BaseWidget>
  );
};

// Widget configuration
WeatherWidget.widgetConfig = {
  id: 'weather',
  type: 'weather',
  title: 'Weather',
  description: 'Displays current weather conditions',
  defaultSize: { width: 2, height: 2 },
  minSize: { width: 1, height: 1 },
  maxSize: { width: 4, height: 3 }
};

export default WeatherWidget; 