import React, { useState, useEffect } from 'react';
import { useSettings, TimerModes } from '../../context/SettingsContext.jsx';

const TimerRing = ({ progress }) => {
  const { settings } = useSettings();
  const [isLoopComplete, setIsLoopComplete] = useState(false);
  const size = 280;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Handle loop completion animation
  useEffect(() => {
    if (settings.timerMode === TimerModes.STOPWATCH && progress < 0.1 && progress > 0) {
      setIsLoopComplete(true);
      const timer = setTimeout(() => setIsLoopComplete(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [progress, settings.timerMode]);

  return (
    <svg className="timer-ring" width={size} height={size}>
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <circle
        className={`timer-ring-progress ${settings.timerMode === TimerModes.STOPWATCH ? 'stopwatch' : ''} ${isLoopComplete ? 'loop-complete' : ''}`}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={settings.theme.buttonColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default TimerRing; 