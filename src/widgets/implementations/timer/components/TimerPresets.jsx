import React from 'react';

const PRESETS = [
  { label: '1m', seconds: 60 },
  { label: '3m', seconds: 180 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '15m', seconds: 900 },
  { label: '20m', seconds: 1200 },
  { label: '30m', seconds: 1800 },
  { label: '1h', seconds: 3600 },
];

const TimerPresets = ({ onSelectPreset }) => {
  return (
    <div className="timer-presets">
      {PRESETS.map((preset) => (
        <button
          key={preset.label}
          className="timer-preset-button"
          onClick={() => onSelectPreset(preset.seconds)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
};

export default TimerPresets; 