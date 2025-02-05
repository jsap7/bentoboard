import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import Timer from './components/Timer';
import TimerSettings from './TimerSettings';
import { TimerModes, InputMethods } from '../../../shared/context/SettingsContext';
import './TimerWidget.css';

const TimerWidget = ({ id, onClose, onMinimize, settings = {} }) => {
  return (
    <BaseWidget
      id={id}
      title="Timer"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      className="timer-widget"
      SettingsComponent={TimerSettings}
    >
      <Timer />
    </BaseWidget>
  );
};

TimerWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object
};

// Register the widget
const timerWidgetConfig = {
  type: 'timer',
  component: TimerWidget,
  name: 'Timer',
  description: 'A versatile timer widget with multiple modes (Timer, Stopwatch, Alarm)',
  defaultSettings: {
    timerMode: TimerModes.TIMER,
    inputMethod: InputMethods.SCROLL
  },
  defaultSize: {
    width: 3,
    height: 3
  },
  isResizable: true,
  minSize: {
    width: 2,
    height: 2
  },
  maxSize: {
    width: 6,
    height: 4
  }
};

export { TimerWidget as default, timerWidgetConfig }; 