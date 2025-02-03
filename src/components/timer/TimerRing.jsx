import React from 'react';
import { useSettings } from '../../context/SettingsContext.jsx';

const TimerRing = ({ progress }) => {
  const { settings } = useSettings();
  const size = 280;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

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
        className="timer-ring-progress"
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