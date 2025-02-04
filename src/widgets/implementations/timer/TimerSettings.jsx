import React from 'react';
import PropTypes from 'prop-types';
import BaseWidgetSettings from '../../core/BaseWidgetSettings';
import { useSettings, TimerModes, InputMethods } from '../../../shared/context/SettingsContext';
import './TimerSettings.css';

const TimerSettings = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();

  const handleModeChange = (mode) => {
    updateSettings({
      ...settings,
      timerMode: mode
    });
  };

  const handleInputMethodChange = (method) => {
    updateSettings({
      ...settings,
      inputMethod: method
    });
  };

  return (
    <BaseWidgetSettings onClose={onClose} title="Timer Settings">
      <div className="timer-settings">
        <div className="timer-settings-section">
          <h3 className="timer-settings-title">Timer Mode</h3>
          <div className="timer-settings-grid">
            <button
              className={`timer-settings-option ${settings.timerMode === TimerModes.TIMER ? 'active' : ''}`}
              onClick={() => handleModeChange(TimerModes.TIMER)}
            >
              <svg className="timer-settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="timer-settings-label">Timer</span>
            </button>
            <button
              className={`timer-settings-option ${settings.timerMode === TimerModes.STOPWATCH ? 'active' : ''}`}
              onClick={() => handleModeChange(TimerModes.STOPWATCH)}
            >
              <svg className="timer-settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 8 14"/>
              </svg>
              <span className="timer-settings-label">Stopwatch</span>
            </button>
            <button
              className={`timer-settings-option ${settings.timerMode === TimerModes.ALARM ? 'active' : ''}`}
              onClick={() => handleModeChange(TimerModes.ALARM)}
            >
              <svg className="timer-settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
              <span className="timer-settings-label">Alarm</span>
            </button>
          </div>
        </div>

        <div className="timer-settings-section">
          <h3 className="timer-settings-title">Input Method</h3>
          <div className="timer-settings-grid">
            <button
              className={`timer-settings-option ${settings.inputMethod === InputMethods.DIRECT ? 'active' : ''}`}
              onClick={() => handleInputMethodChange(InputMethods.DIRECT)}
            >
              <svg className="timer-settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="6" width="16" height="12" rx="2"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <span className="timer-settings-label">Direct</span>
            </button>
            <button
              className={`timer-settings-option ${settings.inputMethod === InputMethods.DIAL ? 'active' : ''}`}
              onClick={() => handleInputMethodChange(InputMethods.DIAL)}
            >
              <svg className="timer-settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
              </svg>
              <span className="timer-settings-label">Dial</span>
            </button>
            <button
              className={`timer-settings-option ${settings.inputMethod === InputMethods.SCROLL ? 'active' : ''}`}
              onClick={() => handleInputMethodChange(InputMethods.SCROLL)}
            >
              <svg className="timer-settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="12" height="16" rx="2"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
              </svg>
              <span className="timer-settings-label">Scroll</span>
            </button>
          </div>
        </div>
      </div>
    </BaseWidgetSettings>
  );
};

TimerSettings.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default TimerSettings; 