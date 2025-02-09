import React, { useState, useEffect, useCallback } from 'react';
import BaseWidget from '../../components/BaseWidget';
import { WidgetProps } from '../shared/types';
import TimerSettings from './components/TimerSettings';
import { TimerSettings as TimerSettingsType, TimerMode, TimerPreset } from './utils/types';
import { formatTime } from './utils/timerUtils';
import './styles/TimerWidget.css';

interface TimerWidgetProps extends WidgetProps {}

interface TimerWidgetComponent extends React.FC<TimerWidgetProps> {
  widgetConfig: any;
}

const getDefaultSettings = (): TimerSettingsType => ({
  mode: 'timer',
  soundEnabled: true,
  presets: [
    { id: '1', name: 'Pomodoro', duration: 25 * 60 },
    { id: '2', name: 'Short Break', duration: 5 * 60 },
    { id: '3', name: 'Long Break', duration: 15 * 60 }
  ]
});

const TimerWidget: TimerWidgetComponent = ({
  id,
  style,
  gridPosition,
  gridSize,
  onClose,
  onResize,
  onDrag
}) => {
  const [widgetState, setWidgetState] = useState({
    settings: getDefaultSettings(),
    time: 0,
    isRunning: false,
    selectedPreset: null as TimerPreset | null
  });

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const playSound = useCallback(() => {
    if (widgetState.settings.soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,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');
      audio.play();
    }
  }, [widgetState.settings.soundEnabled]);

  const startTimer = useCallback(() => {
    setStartTime(Date.now() - elapsedTime);
    setWidgetState(prev => ({ ...prev, isRunning: true }));
  }, [elapsedTime]);

  const stopTimer = useCallback(() => {
    setStartTime(null);
    setWidgetState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setStartTime(null);
    setElapsedTime(0);
    setWidgetState(prev => ({
      ...prev,
      isRunning: false,
      time: prev.settings.mode === 'timer' && prev.selectedPreset ? prev.selectedPreset.duration : 0
    }));
  }, []);

  const selectPreset = useCallback((preset: TimerPreset) => {
    setWidgetState(prev => ({
      ...prev,
      selectedPreset: preset,
      time: preset.duration
    }));
    setElapsedTime(0);
    setStartTime(null);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (widgetState.isRunning && startTime !== null) {
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const newElapsedTime = currentTime - startTime;
        setElapsedTime(newElapsedTime);

        if (widgetState.settings.mode === 'timer') {
          const remainingTime = (widgetState.selectedPreset?.duration || 0) * 1000 - newElapsedTime;
          if (remainingTime <= 0) {
            stopTimer();
            playSound();
          }
        }
      }, 10);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [widgetState.isRunning, startTime, widgetState.settings.mode, widgetState.selectedPreset, stopTimer, playSound]);

  const displayTime = widgetState.settings.mode === 'timer'
    ? Math.max(0, ((widgetState.selectedPreset?.duration || 0) * 1000 - elapsedTime) / 1000)
    : elapsedTime / 1000;

  const progress = widgetState.settings.mode === 'timer' && widgetState.selectedPreset
    ? 1 - (elapsedTime / (widgetState.selectedPreset.duration * 1000))
    : (elapsedTime % 60000) / 60000;

  return (
    <BaseWidget
      id={id}
      title="Timer"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={widgetState.settings}
      onSettingsChange={(newSettings) => setWidgetState(prev => ({ ...prev, settings: newSettings as TimerSettingsType }))}
      SettingsComponent={TimerSettings}
    >
      <div className="timer-widget">
        <div className="timer-mode-selector">
          <button
            className={`mode-button ${widgetState.settings.mode === 'timer' ? 'active' : ''}`}
            onClick={() => setWidgetState(prev => ({ ...prev, settings: { ...prev.settings, mode: 'timer' } }))}
          >
            Timer
          </button>
          <button
            className={`mode-button ${widgetState.settings.mode === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setWidgetState(prev => ({ ...prev, settings: { ...prev.settings, mode: 'stopwatch' } }))}
          >
            Stopwatch
          </button>
        </div>

        {widgetState.settings.mode === 'timer' && (
          <div className="timer-presets">
            {widgetState.settings.presets.map(preset => (
              <button
                key={preset.id}
                className={`preset-button ${widgetState.selectedPreset?.id === preset.id ? 'active' : ''}`}
                onClick={() => selectPreset(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}

        <div className="timer-display">
          <svg className="progress-ring" viewBox="0 0 100 100">
            <circle
              className="progress-ring-circle-bg"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="5"
            />
            <circle
              className="progress-ring-circle"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 45 * progress} ${2 * Math.PI * 45}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="time-display">{formatTime(displayTime)}</div>
        </div>

        <div className="timer-controls">
          {!widgetState.isRunning ? (
            <button className="control-button start" onClick={startTimer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21" />
              </svg>
            </button>
          ) : (
            <button className="control-button stop" onClick={stopTimer}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </button>
          )}
          <button className="control-button reset" onClick={resetTimer}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>
    </BaseWidget>
  );
};

TimerWidget.widgetConfig = {
  id: 'timer',
  type: 'timer',
  title: 'Timer',
  description: 'Countdown timer and stopwatch',
  defaultSize: { width: 2, height: 3 },
  minSize: { width: 2, height: 3 },
  maxSize: { width: 3, height: 4 }
};

export default TimerWidget; 