import React from 'react';
import BaseWidget from '../../components/BaseWidget';
import ClockSettings from './components/ClockSettings';
import { formatTime, formatDate, getDefaultClockSettings } from './utils/timeUtils';
import { WidgetProps, ClockSettings as ClockSettingsType, WidgetConfig } from '../shared/types';
import './styles/ClockWidget.css';

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
type DisplayMode = 'digital' | 'analog' | 'minimal';

interface SizeConfig {
  category: SizeCategory;
  availableModes: DisplayMode[];
  defaultMode: DisplayMode;
}

const getSizeConfig = (width: number, height: number): SizeConfig => {
  // Group similar sizes together
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
      availableModes: ['digital', 'analog', 'minimal'],
      defaultMode: 'digital'
    };
  }
  if ((width === 3 && height === 2) || (width === 2 && height === 3)) {
    return {
      category: 'large',
      availableModes: ['digital', 'analog'],
      defaultMode: 'digital'
    };
  }
  // 3x3, 4x2, 4x3, 4x4, etc.
  return {
    category: 'xlarge',
    availableModes: ['digital', 'analog'],
    defaultMode: 'analog'
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
  const [settings, setSettings] = React.useState<ClockSettingsType>(getDefaultClockSettings());

  // Get size configuration based on current dimensions
  const sizeConfig = React.useMemo(() => 
    getSizeConfig(gridSize.width, gridSize.height),
    [gridSize.width, gridSize.height]
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, settings.showSeconds ? 1000 : 60000);

    return () => clearInterval(timer);
  }, [settings.showSeconds]);

  const timeString = React.useMemo(() => {
    return formatTime(time, {
      showSeconds: settings.showSeconds,
      use24Hour: settings.use24Hour
    });
  }, [time, settings.showSeconds, settings.use24Hour]);

  const dateString = React.useMemo(() => {
    return formatDate(time, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [time]);

  const handleSettingsChange = React.useCallback((newSettings: ClockSettingsType) => {
    setSettings(newSettings);
  }, []);

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

  const renderClock = () => {
    const mode = settings.displayMode || sizeConfig.defaultMode;

    switch (mode) {
      case 'analog':
        return (
          <div className="clock-analog">
            {/* We'll implement the analog clock face later */}
            <div className="clock-face">
              <div className="clock-hands">
                <div className="hand hour" style={{ transform: `rotate(${(time.getHours() % 12) * 30 + time.getMinutes() * 0.5}deg)` }} />
                <div className="hand minute" style={{ transform: `rotate(${time.getMinutes() * 6}deg)` }} />
                {settings.showSeconds && (
                  <div className="hand second" style={{ transform: `rotate(${time.getSeconds() * 6}deg)` }} />
                )}
              </div>
            </div>
            {settings.showDate && <div className="clock-date">{dateString}</div>}
          </div>
        );

      case 'minimal':
        return (
          <>
            <div className="clock-time minimal">{timeString}</div>
            {settings.showDate && <div className="clock-date minimal">{dateString}</div>}
          </>
        );

      case 'digital':
      default:
        return (
          <>
            <div className="clock-time">{timeString}</div>
            {settings.showDate && <div className="clock-date">{dateString}</div>}
          </>
        );
    }
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