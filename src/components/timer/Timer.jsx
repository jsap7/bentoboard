import React, { useState, useEffect, useCallback } from 'react';
import TimerRing from './TimerRing';
import TimerDial from './TimerDial';
import TimerScroll from './TimerScroll';
import Settings from '../settings/Settings';
import { useSettings, InputMethods } from '../../context/SettingsContext.jsx';
import { playNotificationSound } from '/public/notification.js';
import './Timer.css';

const Timer = () => {
  // State
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const { settings } = useSettings();

  // Effects
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', settings.theme.buttonColor);
  }, [settings.theme]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            playNotificationSound();
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Handlers
  const handleTimeSelected = useCallback((totalSeconds) => {
    if (!isRunning) {
      setSelectedTime(totalSeconds);
      setTimeLeft(0);
    }
  }, [isRunning]);

  const handleStart = useCallback(() => {
    if (!isRunning) {
      if (timeLeft > 0) {
        setIsRunning(true);
      } else if (selectedTime > 0) {
        setTimeLeft(selectedTime);
        setTotalTime(selectedTime);
        setIsRunning(true);
        setIsComplete(false);
      }
    }
  }, [selectedTime, isRunning, timeLeft]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    setTotalTime(0);
    setSelectedTime(0);
    setIsComplete(false);
  }, []);

  // Utilities
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render methods
  const renderTimerInput = () => {
    if (isRunning || timeLeft > 0) {
      return (
        <div className={`timer-display ${isComplete ? 'timer-complete' : ''}`}>
          {formatTime(timeLeft)}
        </div>
      );
    }

    switch (settings.inputMethod) {
      case InputMethods.DIAL:
        return <TimerDial onTimeSet={handleTimeSelected} />;
      case InputMethods.SCROLL:
        return <TimerScroll onTimeSet={handleTimeSelected} />;
      case InputMethods.DIRECT:
        return renderDirectInput();
      default:
        return null;
    }
  };

  const renderDirectInput = () => {
    const minutes = Math.floor(selectedTime / 60);
    const seconds = selectedTime % 60;
    
    return (
      <div className="timer-input">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minutes === 0 ? '' : minutes}
          onChange={(e) => {
            const value = e.target.value;
            const mins = value === '' ? 0 : Math.min(99, parseInt(value) || 0);
            handleTimeSelected(mins * 60 + seconds);
          }}
          placeholder="00"
        />
        <span>:</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={seconds === 0 ? '' : seconds.toString().padStart(2, '0')}
          onChange={(e) => {
            const value = e.target.value;
            const secs = value === '' ? 0 : Math.min(59, parseInt(value) || 0);
            handleTimeSelected(minutes * 60 + secs);
          }}
          placeholder="00"
        />
      </div>
    );
  };

  return (
    <div className="timer">
      <button 
        className="settings-button" 
        onClick={() => setShowSettings(true)}
        aria-label="Open Settings"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      </button>

      <div className="timer-ring-container">
        <TimerRing progress={timeLeft > 0 ? timeLeft / totalTime : 0} />
        <div className="timer-display-container">
          {renderTimerInput()}
        </div>
      </div>
      
      <div className="timer-controls">
        {!isRunning ? (
          <button 
            className="timer-button" 
            onClick={handleStart}
            style={{ backgroundColor: settings.theme.buttonColor }}
          >
            {timeLeft > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button 
            className="timer-button" 
            onClick={handlePause}
            style={{ backgroundColor: settings.theme.buttonColor }}
          >
            Pause
          </button>
        )}
        <button className="timer-button reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {showNotification && (
        <div className="timer-notification" style={{ backgroundColor: settings.theme.buttonColor }}>
          Timer Complete!
        </div>
      )}

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};

export default Timer;