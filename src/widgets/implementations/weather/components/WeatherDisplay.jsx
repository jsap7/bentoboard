import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import WeatherIcon from './WeatherIcon';
import '../styles/WeatherDisplay.css';

const WeatherDisplay = ({ data, alerts = [], isLoading, error, settings, globalSettings }) => {
  // Calculate widget size class
  const widgetSize = useMemo(() => {
    const width = settings.size?.width || 3;
    const height = settings.size?.height || 2;
    return `widget-size-${width}x${height}`;
  }, [settings.size]);

  // Sort alerts by severity and urgency
  const sortedAlerts = useMemo(() => {
    if (!alerts.length) return [];
    
    return [...alerts].sort((a, b) => {
      const severityOrder = { Extreme: 0, Severe: 1, Moderate: 2, Minor: 3 };
      const urgencyOrder = { Immediate: 0, Expected: 1, Future: 2, Past: 3 };
      
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  }, [alerts]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`weather-display loading ${widgetSize}`}>
        <div className="weather-loading-spinner" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`weather-display error ${widgetSize}`}>
        <div className="weather-error-message">
          {error}
        </div>
      </div>
    );
  }

  // Empty state
  if (!data) {
    return (
      <div className={`weather-display empty ${widgetSize}`}>
        <div className="weather-empty-message">
          No weather data available
        </div>
      </div>
    );
  }

  const { current, daily, location } = data;
  const isMetric = settings.units === 'metric';
  const tempUnit = isMetric ? '°C' : '°F';
  const speedUnit = isMetric ? 'm/s' : 'mph';

  const renderWeatherDetails = () => (
    <div className="weather-details">
      <div className="weather-detail">
        <span className="label">Feels like</span>
        <span className="value">{Math.round(current.feels_like)}{tempUnit}</span>
      </div>
      <div className="weather-detail">
        <span className="label">Humidity</span>
        <span className="value">{current.humidity}%</span>
      </div>
      <div className="weather-detail">
        <span className="label">Wind</span>
        <span className="value">
          {current.wind_speed} {speedUnit} {current.wind_direction}
        </span>
      </div>
      {current.precipitation !== undefined && (
        <div className="weather-detail">
          <span className="label">Rain Chance</span>
          <span className="value">{current.precipitation}%</span>
        </div>
      )}
      {current.pressure && (
        <div className="weather-detail">
          <span className="label">Pressure</span>
          <span className="value">{Math.round(current.pressure)} hPa</span>
        </div>
      )}
      {current.visibility && (
        <div className="weather-detail">
          <span className="label">Visibility</span>
          <span className="value">{Math.round(current.visibility)} mi</span>
        </div>
      )}
    </div>
  );

  const renderForecast = () => (
    settings.showForecast && daily && (
      <div className="weather-forecast">
        {daily.slice(1, 5).map((day, index) => (
          <div key={index} className="forecast-day">
            <WeatherIcon code={day.weather[0].icon} size="small" />
            <div className="forecast-temps">
              <span className="high">{Math.round(day.temp.max)}{tempUnit}</span>
              <span className="low">{Math.round(day.temp.min)}{tempUnit}</span>
            </div>
            <div className="forecast-details">
              {day.precipitation > 0 && (
                <div className="forecast-precipitation">
                  {day.precipitation}%
                </div>
              )}
              <div className="forecast-wind">
                {day.wind_speed} {speedUnit} {day.wind_direction}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className={`weather-display ${widgetSize}`} style={{ '--accent-rgb': globalSettings.theme.accentColorRgb }}>
      {alerts.length > 0 && (
        <div className="weather-alerts">
          {sortedAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`weather-alert ${alert.severity.toLowerCase()}`}
            >
              <div className="alert-header">
                <span className="alert-severity">{alert.severity}</span>
                <span className="alert-event">{alert.event}</span>
              </div>
              <div className="alert-headline">{alert.headline}</div>
              <div className="alert-time">
                Until {alert.end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </div>
              <button 
                className="alert-details-toggle"
                onClick={() => {
                  const el = document.getElementById(`alert-${alert.id}`);
                  el.style.display = el.style.display === 'none' ? 'block' : 'none';
                }}
              >
                Show Details
              </button>
              <div 
                id={`alert-${alert.id}`}
                className="alert-description"
                style={{ display: 'none' }}
              >
                {alert.description}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="weather-current">
        <div className="weather-location">
          {location && (
            <h3>{location.name}, {location.state}</h3>
          )}
        </div>
        <div className="weather-main">
          <div className="weather-temp">
            {Math.round(current.temp)}{tempUnit}
          </div>
        </div>
        {renderWeatherDetails()}
        <div className="weather-description">
          {current.weather[0].description}
        </div>
      </div>

      {/* {renderForecast()} */}
    </div>
  );
};

WeatherDisplay.propTypes = {
  data: PropTypes.shape({
    current: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      wind_speed: PropTypes.number.isRequired,
      wind_direction: PropTypes.string.isRequired,
      pressure: PropTypes.number,
      visibility: PropTypes.number,
      precipitation: PropTypes.number,
      weather: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired
        })
      ).isRequired
    }),
    daily: PropTypes.arrayOf(
      PropTypes.shape({
        temp: PropTypes.shape({
          min: PropTypes.number.isRequired,
          max: PropTypes.number.isRequired
        }).isRequired,
        wind_speed: PropTypes.number.isRequired,
        wind_direction: PropTypes.string.isRequired,
        precipitation: PropTypes.number,
        weather: PropTypes.arrayOf(
          PropTypes.shape({
            icon: PropTypes.string.isRequired
          })
        ).isRequired
      })
    ),
    location: PropTypes.shape({
      name: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired
    })
  }),
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      event: PropTypes.string.isRequired,
      headline: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      severity: PropTypes.oneOf(['Extreme', 'Severe', 'Moderate', 'Minor']).isRequired,
      urgency: PropTypes.oneOf(['Immediate', 'Expected', 'Future', 'Past']).isRequired,
      start: PropTypes.instanceOf(Date).isRequired,
      end: PropTypes.instanceOf(Date).isRequired
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  settings: PropTypes.shape({
    units: PropTypes.oneOf(['metric', 'imperial']).isRequired,
    showForecast: PropTypes.bool,
    size: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number
    })
  }).isRequired,
  globalSettings: PropTypes.shape({
    theme: PropTypes.shape({
      accentColorRgb: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

WeatherDisplay.defaultProps = {
  alerts: [],
  isLoading: false,
  error: null
};

export default WeatherDisplay; 