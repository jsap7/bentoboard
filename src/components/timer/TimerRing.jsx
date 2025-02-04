import React, { useState, useEffect } from 'react';
import { useSettings, TimerModes } from '../../context/SettingsContext.jsx';
import PropTypes from 'prop-types';

const TimerRing = ({ progress, color }) => {
  const { settings } = useSettings();
  const [isLoopComplete, setIsLoopComplete] = useState(false);
  const size = 280;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  // Handle loop completion animation
  useEffect(() => {
    if (settings.timerMode === TimerModes.STOPWATCH && progress < 0.1 && progress > 0) {
      setIsLoopComplete(true);
      const timer = setTimeout(() => setIsLoopComplete(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [progress, settings.timerMode]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)' }}
    >
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
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.1s ease'
        }}
      />
    </svg>
  );
};

TimerRing.propTypes = {
  progress: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired
};

export default TimerRing; 