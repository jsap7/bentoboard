import React from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import Timer from '../../../components/timer/Timer';
import { TimerModes, InputMethods } from '../../../context/SettingsContext';
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
    width: 5,
    height: 4
  }
};

export { TimerWidget as default, timerWidgetConfig }; 