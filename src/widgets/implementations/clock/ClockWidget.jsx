import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import './ClockWidget.css';

const ClockWidget = ({ id, onClose, onMinimize, settings = {} }) => {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(settings.is24Hour ?? false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    if (is24Hour) {
      return date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  return (
    <BaseWidget
      id={id}
      title="Clock"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      className="clock-widget"
    >
      <div className="clock-container">
        <div className="clock-time">{formatTime(time)}</div>
        <div className="clock-date">
          {time.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <button className="clock-format-toggle" onClick={toggleTimeFormat}>
          {is24Hour ? '12H' : '24H'}
        </button>
      </div>
    </BaseWidget>
  );
};

ClockWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object
};

// Register the widget
const clockWidgetConfig = {
  type: 'clock',
  component: ClockWidget,
  name: 'Clock',
  description: 'A digital clock widget with 12/24-hour format toggle',
  defaultSettings: {
    is24Hour: false,
    theme: {
      textColor: '#FFFFFF',
      backgroundColor: '#161616'
    }
  },
  defaultSize: {
    width: 2,
    height: 2
  }
};

export { ClockWidget as default, clockWidgetConfig }; 