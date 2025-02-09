import ClockWidget from '../widgets/clock/ClockWidget';
import TodoWidget from '../widgets/todo/TodoWidget';
import WeatherWidget from '../widgets/weather/WeatherWidget';
import NotesWidget from '../widgets/notes/NotesWidget';
import CalculatorWidget from '../widgets/calculator/CalculatorWidget';
import { FiClock, FiCheckSquare, FiCloud, FiFileText, FiHash } from 'react-icons/fi';
import TimerWidget from '../widgets/timer/TimerWidget';
import HabitWidget from '../widgets/habit/HabitWidget';
import { FiTarget } from 'react-icons/fi';

const widgetRegistry = new Map();

/**
 * Register a new widget component
 * @param {string} id - Unique identifier for the widget
 * @param {Object} widget - Widget configuration object
 * @param {React.Component} widget.component - The widget component
 * @param {Object} widget.defaultSettings - Default settings for the widget
 * @param {Object} widget.defaultSize - Default size in grid units { width, height }
 */
export const registerWidget = (id, config) => {
  if (widgetRegistry.has(id)) {
    console.warn(`Widget with id "${id}" is already registered. It will be overwritten.`);
  }
  widgetRegistry.set(id, config);
};

/**
 * Get a widget by its ID
 * @param {string} id - Widget identifier
 * @returns {Object|undefined} Widget configuration object or undefined if not found
 */
export const getWidget = (id) => {
  return widgetRegistry.get(id);
};

/**
 * List all registered widgets
 * @returns {Array} Array of widget entries [id, configuration]
 */
export const listWidgets = () => {
  return Array.from(widgetRegistry.entries());
};

/**
 * Check if a widget is registered
 * @param {string} id - Widget identifier
 * @returns {boolean} True if the widget is registered
 */
export const hasWidget = (id) => {
  return widgetRegistry.has(id);
};

// Register the clock widget
registerWidget('clock', {
  component: ClockWidget,
  icon: FiClock,
  title: 'Clock',
  description: 'Displays current time and date in various formats',
  defaultSize: { width: 2, height: 2 },
  minSize: { width: 2, height: 1 },
  maxSize: { width: 4, height: 4 }
});

// Register the todo widget
registerWidget('todo', {
  component: TodoWidget,
  icon: FiCheckSquare,
  title: 'Todo List',
  description: 'Keep track of tasks and todos',
  defaultSize: { width: 2, height: 2 },
  minSize: { width: 3, height: 4 },
  maxSize: { width: 6, height: 6 }
});

// Register the weather widget
registerWidget('weather', {
  component: WeatherWidget,
  icon: FiCloud,
  title: 'Weather',
  description: 'Displays current weather conditions',
  defaultSize: { width: 2, height: 2 },
  minSize: { width: 1, height: 1 },
  maxSize: { width: 4, height: 3 }
});

// Register the notes widget
registerWidget('notes', {
  component: NotesWidget,
  icon: FiFileText,
  title: 'Notes',
  description: 'Create and manage your notes',
  defaultSize: { width: 3, height: 4 },
  minSize: { width: 2, height: 3 },
  maxSize: { width: 6, height: 6 }
});

// Register the calculator widget
registerWidget('calculator', {
  component: CalculatorWidget,
  icon: FiHash,
  title: 'Calculator',
  description: 'Basic calculator with standard operations',
  defaultSize: { width: 2, height: 3 },
  minSize: { width: 2, height: 3 },
  maxSize: { width: 3, height: 4 }
});

// Register the timer widget
registerWidget('timer', {
  component: TimerWidget,
  icon: FiClock,
  title: 'Timer',
  description: 'Countdown timer and stopwatch with presets',
  defaultSize: { width: 2, height: 3 },
  minSize: { width: 2, height: 3 },
  maxSize: { width: 3, height: 4 }
});

// Register the habit widget
registerWidget('habit', {
  component: HabitWidget,
  icon: FiTarget,
  title: 'Habit Tracker',
  description: 'Track and maintain daily and weekly habits',
  defaultSize: { width: 2, height: 3 },
  minSize: { width: 2, height: 2 },
  maxSize: { width: 4, height: 6 }
});

export default widgetRegistry; 