import React, { useState, useEffect, useCallback } from 'react';
import BaseWidget from '../components/BaseWidget';
import ClockSettings from './components/ClockSettings';
import { formatTime, formatDate, getDefaultDateFormatOptions, getDefaultClockSettings } from './utils/timeUtils';
import { WidgetProps } from '../shared/types';
import './styles/ClockWidget.css';

const ClockWidget: React.FC<WidgetProps> = ({
  id,
  style,
  onResize,
  onDrag,
  onClose,
  gridPosition,
  gridSize,
  settings: initialSettings
}) => {
  const [time, setTime] = useState<Date>(new Date());
  const [settings, setSettings] = useState(initialSettings || getDefaultClockSettings());

  // Update time at regular intervals
  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime(); // Initial update
    
    const interval = setInterval(
      updateTime,
      settings.showSeconds ? 1000 : 60000
    );

    return () => clearInterval(interval);
  }, [settings.showSeconds]);

  const handleSettingsChange = useCallback((newSettings: any) => {
    setSettings(newSettings);
  }, []);

  return (
    <BaseWidget
      id={id}
      title="Clock"
      style={style}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      onResize={onResize}
      onDrag={onDrag}
      onClose={onClose}
      gridPosition={gridPosition}
      gridSize={gridSize}
      SettingsComponent={ClockSettings}
    >
      <div className="clock-widget-content">
        <div className="clock-time">
          {formatTime(time, {
            showSeconds: settings.showSeconds,
            use24Hour: settings.use24Hour
          })}
        </div>
        {settings.showDate && (
          <div className="clock-date">
            {formatDate(time, getDefaultDateFormatOptions())}
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

// Widget configuration
ClockWidget.widgetConfig = {
  type: 'clock',
  title: 'Clock',
  description: 'Displays current time and date',
  defaultSize: { width: 2, height: 2 },
  defaultSettings: getDefaultClockSettings()
};

export default ClockWidget; 