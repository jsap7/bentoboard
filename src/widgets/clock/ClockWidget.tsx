import React from 'react';
import BaseWidget from '../../components/BaseWidget';
import ClockSettings from './components/ClockSettings';
import { formatTime, formatDate, getDefaultClockSettings } from './utils/timeUtils';
import { WidgetProps, ClockSettings as ClockSettingsType, WidgetConfig } from '../shared/types';
import './styles/ClockWidget.css';
import { useWidgetState } from '../../contexts/WidgetStateContext';

interface ClockWidgetProps extends WidgetProps {}

interface ClockWidgetComponent extends React.FC<ClockWidgetProps> {
  widgetConfig: WidgetConfig;
}

// Extend CSSProperties to include our custom properties
interface CustomCSSProperties extends React.CSSProperties {
  '--grid-width'?: number;
  '--grid-height'?: number;
}

// Define size categories for different layouts
type SizeCategory = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
type DisplayMode = 'digital' | 'minimal';
type ThemeMode = 'minimal' | 'modern' | 'classic';

interface SizeConfig {
  category: SizeCategory;
  availableModes: DisplayMode[];
  defaultMode: DisplayMode;
}

const getSizeConfig = (width: number, height: number): SizeConfig => {
  if (width === 1 && height === 1) {
    return {
      category: 'tiny',
      availableModes: ['minimal', 'digital'],
      defaultMode: 'minimal'
    };
  }
  if ((width === 2 && height === 1) || (width === 1 && height === 2)) {
    return {
      category: 'small',
      availableModes: ['digital', 'minimal'],
      defaultMode: 'digital'
    };
  }
  if (width === 2 && height === 2) {
    return {
      category: 'medium',
      availableModes: ['digital', 'minimal'],
      defaultMode: 'digital'
    };
  }
  return {
    category: width >= 3 || height >= 3 ? 'xlarge' : 'large',
    availableModes: ['digital', 'minimal'],
    defaultMode: 'digital'
  };
};

const ClockWidget: ClockWidgetComponent = ({
  id,
  style,
  gridPosition,
  gridSize,
  onClose,
  onResize,
  onDrag
}) => {
  const [time, setTime] = React.useState(new Date());
  const [widgetState, updateWidgetState] = useWidgetState({
    id,
    initialGridPosition: gridPosition,
    initialGridSize: gridSize,
    initialSettings: getDefaultClockSettings(),
  });

  const settings = widgetState.settings as ClockSettingsType;

  // Get size configuration based on current dimensions
  const sizeConfig = React.useMemo(() => 
    getSizeConfig(widgetState.gridSize.width, widgetState.gridSize.height),
    [widgetState.gridSize.width, widgetState.gridSize.height]
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, settings.showMilliseconds ? 100 : settings.showSeconds ? 1000 : 60000);

    return () => clearInterval(timer);
  }, [settings.showSeconds, settings.showMilliseconds]);

  const formatTimeSegments = React.useCallback((date: Date) => {
    const hours = settings.use24Hour 
      ? date.getHours().toString().padStart(2, '0')
      : (date.getHours() % 12 || 12).toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = Math.floor(date.getMilliseconds() / 100);
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return { hours, minutes, seconds, milliseconds, period };
  }, [settings.use24Hour]);

  const timeSegments = React.useMemo(() => formatTimeSegments(time), [time, formatTimeSegments]);

  const dateSegments = React.useMemo(() => {
    const weekday = time.toLocaleDateString(undefined, { weekday: 'long' });
    const fullDate = time.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return { weekday, fullDate };
  }, [time]);

  const handleSettingsChange = React.useCallback((newSettings: ClockSettingsType) => {
    updateWidgetState({ settings: newSettings });
  }, [updateWidgetState]);

  // Calculate grid size attribute and category
  const gridSizeAttribute = `${gridSize.width}x${gridSize.height}`;
  const categoryAttribute = sizeConfig.category;

  // Calculate content style based on grid size
  const contentStyle = React.useMemo(() => {
    const baseStyle: CustomCSSProperties = {
      '--grid-width': gridSize.width,
      '--grid-height': gridSize.height,
    };

    return baseStyle;
  }, [gridSize]);

  const renderDigitalClock = () => {
    return (
      <>
        <div className="clock-time">
          <span>{timeSegments.hours}</span>
          <span className="separator">:</span>
          <span>{timeSegments.minutes}</span>
          {settings.showSeconds && (
            <>
              <span className="separator">:</span>
              <span className="seconds">
                {timeSegments.seconds}
                {settings.showMilliseconds && `.${timeSegments.milliseconds}`}
              </span>
            </>
          )}
          {!settings.use24Hour && <span className="period">{timeSegments.period}</span>}
        </div>
        {settings.showDate && (
          <div className="clock-date">
            <div className="weekday">{dateSegments.weekday}</div>
            <div className="full-date">{dateSegments.fullDate}</div>
          </div>
        )}
      </>
    );
  };

  const renderMinimalClock = () => {
    return (
      <div className="clock-minimal">
        <div className="clock-time">
          {timeSegments.hours}:{timeSegments.minutes}
          {!settings.use24Hour && <span className="period">{timeSegments.period}</span>}
        </div>
        {settings.showDate && (
          <div className="clock-date">
            {dateSegments.fullDate}
          </div>
        )}
      </div>
    );
  };

  const renderClock = () => {
    const mode = settings.displayMode || sizeConfig.defaultMode;
    return mode === 'minimal' ? renderMinimalClock() : renderDigitalClock();
  };

  return (
    <BaseWidget
      id={id}
      title="Clock"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={ClockSettings}
    >
      <div 
        className="clock-widget-content"
        style={contentStyle}
        data-grid-size={gridSizeAttribute}
        data-size-category={categoryAttribute}
        data-display-mode={settings.displayMode || sizeConfig.defaultMode}
        data-theme={settings.theme || 'modern'}
      >
        {renderClock()}
      </div>
    </BaseWidget>
  );
};

// Widget configuration
ClockWidget.widgetConfig = {
  id: 'clock',
  type: 'clock',
  title: 'Clock',
  description: 'Displays current time and date in various formats',
  defaultSize: { width: 2, height: 2 }
};

export default ClockWidget; 