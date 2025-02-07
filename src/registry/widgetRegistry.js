import ClockWidget from '../widgets/clock/ClockWidget';
import TodoWidget from '../widgets/todo/TodoWidget';
import { FiClock, FiCheckSquare } from 'react-icons/fi';

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
  defaultSize: { width: 2, height: 2 }
});

// Register the todo widget
registerWidget('todo', {
  component: TodoWidget,
  icon: FiCheckSquare,
  title: 'Todo List',
  description: 'Keep track of tasks and todos',
  defaultSize: { width: 2, height: 2 }
});

export default widgetRegistry; 