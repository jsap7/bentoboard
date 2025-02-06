import React from 'react';
import PropTypes from 'prop-types';
import '../styles/WeatherIcon.css';

const WeatherIcon = ({ code, size = 'medium', className }) => {
  const getIconContent = (code) => {
    const isDayTime = code.endsWith('d');
    const iconType = code.slice(0, 2);

    switch (iconType) {
      case '01': // clear sky
        return isDayTime ? (
          <>
            <circle cx="12" cy="12" r="5" className="sun" />
            <g className="sun-beams">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </>
        ) : (
          <>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" className="moon" />
            <circle cx="8" cy="6" r="0.5" className="star" />
            <circle cx="18" cy="4" r="0.5" className="star" />
            <circle cx="16" cy="8" r="0.5" className="star" />
          </>
        );
      case '02': // few clouds
        return (
          <>
            {isDayTime && (
              <>
                <circle cx="8" cy="8" r="3" className="sun" />
                <g className="sun-beams">
                  <line x1="8" y1="1" x2="8" y2="2" />
                  <line x1="1" y1="8" x2="2" y2="8" />
                  <line x1="3.5" y1="3.5" x2="4.5" y2="4.5" />
                </g>
              </>
            )}
            <path d="M12 6a5 5 0 0 0-5 5v.1A4.975 4.975 0 0 0 3 16a5 5 0 0 0 5 5h9a5 5 0 0 0 5-5c0-2.76-2.24-5-5-5h-.1A5 5 0 0 0 12 6z" className="cloud" />
          </>
        );
      case '03': // scattered clouds
      case '04': // broken clouds
        return (
          <>
            <path d="M4 14a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8h-1a5.002 5.002 0 0 0-9.716-1.298A4 4 0 0 0 4 14z" className="cloud" />
            <path d="M6 20a3 3 0 0 0 3 3h8a3 3 0 0 0 0-6h-.8a4.002 4.002 0 0 0-7.773-1.038A3 3 0 0 0 6 20z" className="cloud secondary" />
          </>
        );
      case '09': // shower rain
        return (
          <>
            <path d="M4 14a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8h-1a5.002 5.002 0 0 0-9.716-1.298A4 4 0 0 0 4 14z" className="cloud" />
            <g className="rain">
              <line x1="8" y1="19" x2="8" y2="21" />
              <line x1="12" y1="19" x2="12" y2="21" />
              <line x1="16" y1="19" x2="16" y2="21" />
            </g>
          </>
        );
      case '10': // rain
        return (
          <>
            {isDayTime && (
              <>
                <circle cx="8" cy="8" r="3" className="sun" />
                <g className="sun-beams">
                  <line x1="8" y1="1" x2="8" y2="2" />
                  <line x1="1" y1="8" x2="2" y2="8" />
                  <line x1="3.5" y1="3.5" x2="4.5" y2="4.5" />
                </g>
              </>
            )}
            <path d="M4 14a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8h-1a5.002 5.002 0 0 0-9.716-1.298A4 4 0 0 0 4 14z" className="cloud" />
            <g className="rain">
              <line x1="8" y1="19" x2="8" y2="21" />
              <line x1="12" y1="19" x2="12" y2="21" />
              <line x1="16" y1="19" x2="16" y2="21" />
            </g>
          </>
        );
      case '11': // thunderstorm
        return (
          <>
            <path d="M4 14a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8h-1a5.002 5.002 0 0 0-9.716-1.298A4 4 0 0 0 4 14z" className="cloud" />
            <g className="lightning">
              <path d="M13 10l-4 6h6l-4 6" />
            </g>
          </>
        );
      case '13': // snow
        return (
          <>
            <path d="M4 14a4 4 0 0 0 4 4h10a4 4 0 0 0 0-8h-1a5.002 5.002 0 0 0-9.716-1.298A4 4 0 0 0 4 14z" className="cloud" />
            <g className="snow">
              <circle cx="8" cy="19" r="1" />
              <circle cx="12" cy="19" r="1" />
              <circle cx="16" cy="19" r="1" />
            </g>
          </>
        );
      case '50': // mist/fog
        return (
          <g className="mist">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="8" x2="21" y2="8" />
            <line x1="3" y1="16" x2="21" y2="16" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`weather-icon ${size} ${className || ''}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {getIconContent(code)}
      </svg>
    </div>
  );
};

WeatherIcon.propTypes = {
  code: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
};

export default WeatherIcon; 