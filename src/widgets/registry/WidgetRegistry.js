class WidgetRegistry {
  constructor() {
    this.widgets = new Map();
  }

  /**
   * Register a new widget type
   * @param {Object} widgetConfig - Widget configuration
   * @param {string} widgetConfig.type - Unique identifier for the widget type
   * @param {React.Component} widgetConfig.component - The widget's React component
   * @param {string} widgetConfig.name - Display name for the widget
   * @param {string} widgetConfig.description - Widget description
   * @param {Object} widgetConfig.defaultSettings - Default settings for the widget
   * @param {Object} widgetConfig.defaultSize - Default size for the widget
   */
  register(widgetConfig) {
    if (!widgetConfig.type || !widgetConfig.component) {
      throw new Error('Widget must have a type and component');
    }

    // If widget is already registered with the same component, just return
    if (this.widgets.has(widgetConfig.type)) {
      const existing = this.widgets.get(widgetConfig.type);
      if (existing.component === widgetConfig.component) {
        return;
      }
      console.warn(`Widget type "${widgetConfig.type}" is being re-registered with a different component`);
    }

    this.widgets.set(widgetConfig.type, {
      ...widgetConfig,
      defaultSettings: widgetConfig.defaultSettings || {},
      defaultSize: widgetConfig.defaultSize || { width: 2, height: 2 }
    });
  }

  /**
   * Get a registered widget by type
   * @param {string} type - Widget type identifier
   * @returns {Object} Widget configuration
   */
  getWidget(type) {
    if (!this.widgets.has(type)) {
      throw new Error(`Widget type "${type}" not found`);
    }
    return this.widgets.get(type);
  }

  /**
   * Get all registered widgets
   * @returns {Array} Array of widget configurations
   */
  getAllWidgets() {
    return Array.from(this.widgets.values());
  }

  /**
   * Check if a widget type is registered
   * @param {string} type - Widget type identifier
   * @returns {boolean}
   */
  hasWidget(type) {
    return this.widgets.has(type);
  }

  /**
   * Remove a widget type from the registry
   * @param {string} type - Widget type identifier
   */
  unregister(type) {
    if (!this.widgets.has(type)) {
      throw new Error(`Widget type "${type}" not found`);
    }
    this.widgets.delete(type);
  }
}

// Create and export a singleton instance
const widgetRegistry = new WidgetRegistry();
export default widgetRegistry; 