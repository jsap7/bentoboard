import { WeatherData, WeatherUnit, WeatherSizeConfig, WeatherDisplayMode } from './types';
import { BaseSizeConfig } from '../../shared/types';

export const getDefaultWeatherSettings = () => ({
  unit: 'fahrenheit' as WeatherUnit,
  autoRefresh: true,
  refreshInterval: 30, // 30 minutes
  displayMode: 'detailed' as WeatherDisplayMode,
  useCurrentLocation: true
});

export const formatTemperature = (temp: number, unit: WeatherUnit): string => {
  const temperature = unit === 'celsius' ? (temp - 32) * 5/9 : temp;
  return `${Math.round(temperature)}°${unit === 'celsius' ? 'C' : 'F'}`;
};

export const formatWindSpeed = (speed: number, direction: string): string => {
  return `${Math.round(speed)} mph ${direction}`;
};

export const formatHumidity = (humidity: number): string => {
  return `${Math.round(humidity)}%`;
};

export const getSizeConfig = (width: number, height: number): BaseSizeConfig<WeatherDisplayMode> => {
  // Determine size category based on grid dimensions
  let category: WeatherSizeConfig['category'];
  if (width <= 1 && height <= 1) category = 'tiny';
  else if (width <= 2 && height <= 1) category = 'small';
  else if (width <= 2 && height <= 2) category = 'medium';
  else if (width <= 3 && height <= 2) category = 'large';
  else category = 'xlarge';

  // Define available modes and default mode based on size
  const config: WeatherSizeConfig = {
    category,
    availableModes: ['minimal', 'detailed'],
    defaultMode: category === 'tiny' || category === 'small' ? 'minimal' : 'detailed',
    styles: {
      padding: {
        tiny: '0.5rem',
        small: '0.75rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '1.5rem'
      }[category],
      fontSize: {
        tiny: '0.85rem',
        small: '0.9rem',
        medium: '1rem',
        large: '1.1rem',
        xlarge: '1.2rem'
      }[category],
      gap: {
        tiny: '0.35rem',
        small: '0.5rem',
        medium: '0.75rem',
        large: '1rem',
        xlarge: '1.25rem'
      }[category]
    }
  };

  return config;
};

export const fetchWeatherData = async (location: string): Promise<WeatherData> => {
  try {
    // Add user agent header as required by weather.gov API
    const headers = {
      'User-Agent': '(bentoboard.app, contact@bentoboard.app)',
      'Accept': 'application/geo+json'
    };

    // First, get the grid points for the location
    const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
    const pointsUrl = `https://api.weather.gov/points/${lat},${lon}`;
    
    const pointsResponse = await fetch(pointsUrl, { headers });
    if (!pointsResponse.ok) {
      throw new Error('Failed to get location data');
    }
    
    const pointsData = await pointsResponse.json();

    // Get the forecast using the grid endpoint
    const forecastUrl = pointsData.properties.forecast;
    const forecastResponse = await fetch(forecastUrl, { headers });
    if (!forecastResponse.ok) {
      throw new Error('Failed to get forecast data');
    }
    
    const forecastData = await forecastResponse.json();

    // Get the current conditions from the first period
    const currentConditions = forecastData.properties.periods[0];

    // Get the hourly forecast for more detailed current conditions
    const hourlyUrl = pointsData.properties.forecastHourly;
    const hourlyResponse = await fetch(hourlyUrl, { headers });
    if (!hourlyResponse.ok) {
      throw new Error('Failed to get hourly forecast data');
    }
    
    const hourlyData = await hourlyResponse.json();
    const currentHourly = hourlyData.properties.periods[0];

    return {
      temperature: currentHourly.temperature,
      feelsLike: currentHourly.temperature, // API doesn't provide feels like temp
      humidity: currentHourly.relativeHumidity.value,
      windSpeed: parseInt(currentHourly.windSpeed.split(' ')[0]), // Extract numeric value
      windDirection: currentHourly.windDirection,
      description: currentConditions.shortForecast,
      icon: currentConditions.icon,
      location: `${pointsData.properties.relativeLocation.properties.city}, ${pointsData.properties.relativeLocation.properties.state}`,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getCurrentLocation = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve(`${latitude.toFixed(4)},${longitude.toFixed(4)}`);
      },
      (error) => {
        reject(new Error('Unable to get your location. Please enter it manually.'));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
}; 