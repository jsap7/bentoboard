import widgetRegistry from './WidgetRegistry';
import { timerWidgetConfig } from '../implementations/timer/TimerWidget';
import { clockWidgetConfig } from '../implementations/clock/ClockWidget';
import { todoWidgetConfig } from '../implementations/todo/TodoWidget';
import { weatherWidgetConfig } from '../implementations/weather/WeatherWidget';
import { notesWidgetConfig } from '../implementations/notes/NotesWidget';
import { calculatorWidgetConfig } from '../implementations/calculator/CalculatorWidget';

export function initializeWidgets() {
  // Register the timer widget
  widgetRegistry.register(timerWidgetConfig);
  
  // Register the clock widget
  widgetRegistry.register(clockWidgetConfig);

  // Register the todo widget
  widgetRegistry.register(todoWidgetConfig);

  // Register the weather widget
  widgetRegistry.register(weatherWidgetConfig);

  // Register the notes widget
  widgetRegistry.register(notesWidgetConfig);

  // Register the calculator widget
  widgetRegistry.register(calculatorWidgetConfig);

  // Future widgets will be registered here
}

export function getAvailableWidgets() {
  return Array.from(widgetRegistry.widgets.values());
} 