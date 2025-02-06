import widgetRegistry from './WidgetRegistry';
import { timerWidgetConfig } from '../implementations/timer/TimerWidget';
import { clockWidgetConfig } from '../implementations/clock/ClockWidget';
import { todoWidgetConfig } from '../implementations/todo/TodoWidget';
import { weatherWidgetConfig } from '../implementations/weather/WeatherWidget';

export function initializeWidgets() {
  // Register the timer widget
  widgetRegistry.register(timerWidgetConfig);
  
  // Register the clock widget
  widgetRegistry.register(clockWidgetConfig);

  // Register the todo widget
  widgetRegistry.register(todoWidgetConfig);

  // Register the weather widget
  widgetRegistry.register(weatherWidgetConfig);

  // Future widgets will be registered here
}

export function getAvailableWidgets() {
  return Array.from(widgetRegistry.widgets.values());
} 