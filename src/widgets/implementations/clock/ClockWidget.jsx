import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import ClockSettings from './ClockSettings';
import './ClockWidget.css';

const ClockWidget = ({ id, onClose, onMinimize, settings = {}, onSettingsChange }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const options = {
      hour: settings.is24Hour ? '2-digit' : 'numeric',
      minute: '2-digit',
      hour12: !settings.is24Hour,
      ...(settings.showSeconds !== false && { second: '2-digit' })
    };
    
    return date.toLocaleTimeString('en-US', options);
  };

  const formatDate = (date) => {
    if (settings.showDate === false) return null;

    const options = {};
    
    if (settings.weekdayFormat && settings.weekdayFormat !== 'none') {
      options.weekday = settings.weekdayFormat;
    }
    
    if (settings.monthFormat) {
      options.month = settings.monthFormat;
    }
    
    if (settings.yearFormat && settings.yearFormat !== 'none') {
      options.year = settings.yearFormat;
    }

    if (settings.monthFormat) {
      options.day = '2-digit';
    }

    return date.toLocaleDateString('en-US', options);
  };

  const handleSettingsChange = (newSettings) => {
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  return (
    <BaseWidget
      id={id}
      title="Clock"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={ClockSettings}
      className="clock-widget"
    >
      <div className="clock-container">
        <div className="clock-time">{formatTime(time)}</div>
        {settings.showDate !== false && (
          <div className="clock-date">{formatDate(time)}</div>
        )}
      </div>
    </BaseWidget>
  );
};

ClockWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object,
  onSettingsChange: PropTypes.func
};

// Register the widget
const clockWidgetConfig = {
  type: 'clock',
  component: ClockWidget,
  name: 'Clock',
  description: 'A digital clock widget with customizable time and date formats',
  defaultSettings: {
    is24Hour: false,
    showSeconds: true,
    showDate: true,
    weekdayFormat: 'long',
    monthFormat: 'long',
    yearFormat: 'numeric',
    theme: {
      textColor: '#FFFFFF',
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
    height: 1
  },
  maxSize: {
    width: 6,
    height: 4
  }
};

export { ClockWidget as default, clockWidgetConfig }; 