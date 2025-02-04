import React, { useState, useEffect, useCallback } from 'react';
import TimerRing from './TimerRing';
import TimerDial from './TimerDial';
import TimerScroll from './TimerScroll';
import Settings from '../settings/Settings';
import { useSettings, InputMethods, TimerModes } from '../../context/SettingsContext.jsx';
import { playNotificationSound } from '../../utils/notification.js';
import { useGlobalSettings } from '../../context/GlobalSettingsContext';
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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [milliseconds, setMilliseconds] = useState(0);
  const [alarmTime, setAlarmTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { settings } = useSettings();
  const { settings: globalSettings } = useGlobalSettings();

  // Effects
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', globalSettings.theme.buttonColor);
  }, [globalSettings.theme]);

  useEffect(() => {
    let interval;
    let startTime;
    
    if (isRunning) {
      if (settings.timerMode === TimerModes.STOPWATCH) {
        startTime = Date.now() - (elapsedTime * 1000 + milliseconds);
        interval = setInterval(() => {
          const now = Date.now();
          const diff = now - startTime;
          setElapsedTime(Math.floor(diff / 1000));
          setMilliseconds(diff % 1000);
        }, 16);
      } else if (timeLeft > 0) {
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
    }
    return () => clearInterval(interval);
  }, [isRunning, settings.timerMode]);

  useEffect(() => {
    let interval;
    if (settings.timerMode === TimerModes.ALARM) {
      interval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        
        // Check if alarm should trigger
        if (alarmTime && isRunning) {
          const alarmHours = Math.floor(alarmTime / 3600);
          const alarmMinutes = Math.floor((alarmTime % 3600) / 60);
          
          if (now.getHours() === alarmHours && now.getMinutes() === alarmMinutes && now.getSeconds() === 0) {
            setIsComplete(true);
            setIsRunning(false);
            playNotificationSound();
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [settings.timerMode, alarmTime, isRunning]);

  // Handlers
  const handleTimeSelected = useCallback((totalSeconds) => {
    if (!isRunning) {
      setSelectedTime(totalSeconds);
      setTimeLeft(0);
    }
  }, [isRunning]);

  const handleStart = useCallback(() => {
    if (settings.timerMode === TimerModes.ALARM) {
      if (alarmTime !== null) {
        setIsRunning(true);
        setIsComplete(false);
      }
    } else if (settings.timerMode === TimerModes.STOPWATCH) {
      setIsRunning(true);
    } else if (!isRunning) {
      if (timeLeft > 0) {
        setIsRunning(true);
      } else if (selectedTime > 0) {
        setTimeLeft(selectedTime);
        setTotalTime(selectedTime);
        setIsRunning(true);
        setIsComplete(false);
      }
    }
  }, [selectedTime, isRunning, timeLeft, settings.timerMode, alarmTime]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    if (settings.timerMode === TimerModes.ALARM) {
      setAlarmTime(null);
      setIsComplete(false);
    } else if (settings.timerMode === TimerModes.STOPWATCH) {
      setElapsedTime(0);
      setMilliseconds(0);
    } else {
      setTimeLeft(0);
      setTotalTime(0);
      setSelectedTime(0);
      setIsComplete(false);
    }
  }, [settings.timerMode]);

  // Utilities
  const calculateProgress = () => {
    if (settings.timerMode === TimerModes.STOPWATCH) {
      const totalSeconds = elapsedTime + (milliseconds / 1000);
      return (totalSeconds % 60) / 60;
    } else if (settings.timerMode === TimerModes.ALARM) {
      if (!alarmTime || !isRunning) return 0;
      
      const now = currentTime;
      const currentMinutes = (now.getHours() * 60) + now.getMinutes();
      const currentSeconds = currentMinutes * 60 + now.getSeconds();
      
      const alarmHours = Math.floor(alarmTime / 3600);
      const alarmMinutes = Math.floor((alarmTime % 3600) / 60);
      let targetSeconds = (alarmHours * 60 + alarmMinutes) * 60;
      
      if (targetSeconds <= currentSeconds) {
        targetSeconds += 24 * 60 * 60; // Add 24 hours
      }
      
      const secondsUntilAlarm = targetSeconds - currentSeconds;
      const totalSecondsInDay = 24 * 60 * 60;
      
      return (totalSecondsInDay - secondsUntilAlarm) / totalSecondsInDay;
    }
    return timeLeft > 0 ? timeLeft / totalTime : 0;
  };

  const formatTime = (time, includeMilliseconds = false) => {
    if (settings.timerMode === TimerModes.ALARM) {
      if (time === null) return '--:--';
      const totalHours = Math.floor(time / 3600);
      const isPM = totalHours >= 12;
      const hours = totalHours % 12 || 12;
      const mins = Math.floor((time % 3600) / 60);
      return (
        <div className="time-with-meridiem">
          <span>{`${hours}:${mins.toString().padStart(2, '0')}`}</span>
          <span className="meridiem">{isPM ? 'PM' : 'AM'}</span>
        </div>
      );
    }

    const hours = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    
    const mainTime = hours > 0
      ? `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (includeMilliseconds) {
      const ms = Math.floor(milliseconds / 10).toString().padStart(2, '0');
      return (
        <>
          <span className="main-time">{mainTime}</span>
          <span className="milliseconds">{ms}</span>
        </>
      );
    }

    return <span className="main-time">{mainTime}</span>;
  };

  // Render methods
  const renderTimerInput = () => {
    if (settings.timerMode === TimerModes.ALARM) {
      if (isRunning) {
        return (
          <div className="timer-display">
            {formatTime(alarmTime)}
          </div>
        );
      }
      return renderAlarmInput();
    }

    if (settings.timerMode === TimerModes.STOPWATCH) {
      return (
        <div className="timer-display">
          {formatTime(elapsedTime, true)}
        </div>
      );
    }

    if (settings.timerMode !== TimerModes.TIMER) {
      return (
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
      );
    }

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

  const renderAlarmInput = () => {
    const hours = alarmTime ? Math.floor((alarmTime % 43200) / 3600) || 12 : 12;
    const minutes = alarmTime ? Math.floor((alarmTime % 3600) / 60) : 0;
    const isPM = alarmTime ? Math.floor(alarmTime / 43200) > 0 : false;
    
    const handleTimeChange = (newHours, newMinutes, newIsPM) => {
      // Convert to 24 hour format
      let hours24 = newHours === 12 ? 0 : newHours;
      if (newIsPM) hours24 += 12;
      const newTime = (hours24 * 3600) + (newMinutes * 60);
      setAlarmTime(newTime);
    };

    return (
      <div className="alarm-scroll-container">
        <TimerScroll
          value={hours}
          onChange={(h) => handleTimeChange(h, minutes, isPM)}
          max={12}
          min={1}
          label="hour"
        />
        <TimerScroll
          value={minutes}
          onChange={(m) => handleTimeChange(hours, m, isPM)}
          max={59}
          min={0}
          label="min"
        />
        <div className="ampm-selector">
          <button
            className={`ampm-button ${!isPM ? 'active' : ''}`}
            onClick={() => handleTimeChange(hours, minutes, false)}
          >
            AM
          </button>
          <button
            className={`ampm-button ${isPM ? 'active' : ''}`}
            onClick={() => handleTimeChange(hours, minutes, true)}
          >
            PM
          </button>
        </div>
      </div>
    );
  };

  // Customize controls based on mode
  const renderControls = () => {
    switch (settings.timerMode) {
      case TimerModes.TIMER:
        return (
          <>
            {!isRunning ? (
              <button 
                className="timer-button" 
                onClick={handleStart}
                style={{ backgroundColor: globalSettings.theme.buttonColor }}
              >
                {timeLeft > 0 ? 'Resume' : 'Start'}
              </button>
            ) : (
              <button 
                className="timer-button" 
                onClick={handlePause}
                style={{ backgroundColor: globalSettings.theme.buttonColor }}
              >
                Pause
              </button>
            )}
            <button className="timer-button reset" onClick={handleReset}>
              Reset
            </button>
          </>
        );
      
      case TimerModes.STOPWATCH:
        return (
          <>
            <button 
              className="timer-button" 
              onClick={isRunning ? handlePause : handleStart}
              style={{ backgroundColor: globalSettings.theme.buttonColor }}
            >
              {isRunning ? 'Stop' : 'Start'}
            </button>
            <button className="timer-button reset" onClick={handleReset}>
              Reset
            </button>
          </>
        );
      
      case TimerModes.ALARM:
        return (
          <>
            <button 
              className="timer-button" 
              onClick={isRunning ? handlePause : handleStart}
              style={{ backgroundColor: globalSettings.theme.buttonColor }}
            >
              {isRunning ? 'Disable' : 'Enable'}
            </button>
          </>
        );
    }
  };

  return (
    <div className="timer">
      <div className="timer-ring-container">
        <TimerRing 
          progress={calculateProgress()} 
          color={globalSettings.theme.ringColor}
        />
        <div className="timer-display-container">
          {renderTimerInput()}
        </div>
      </div>
      
      <div className="timer-controls">
        {renderControls()}
      </div>

      {showNotification && (
        <div className={`timer-notification ${settings.timerMode === TimerModes.ALARM ? 'alarm' : ''}`} style={{ backgroundColor: globalSettings.theme.buttonColor }}>
          {settings.timerMode === TimerModes.ALARM ? 'Alarm!' : 'Timer Complete!'}
        </div>
      )}
    </div>
  );
};

export default Timer;