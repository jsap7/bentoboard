import widgetRegistry from './WidgetRegistry';
import { timerWidgetConfig } from '../implementations/timer/TimerWidget';
import { clockWidgetConfig } from '../implementations/clock/ClockWidget';

export function initializeWidgets() {
  // Register the timer widget
  widgetRegistry.register(timerWidgetConfig);
  
  // Register the clock widget
  widgetRegistry.register(clockWidgetConfig);

  // Future widgets will be registered here
}

export function getAvailableWidgets() {
  return widgetRegistry.getAllWidgets();
} 