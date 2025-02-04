import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import widgetRegistry from '../registry/WidgetRegistry';

const WidgetContext = createContext();

const WIDGETS_STORAGE_KEY = 'dashboard_widgets';

export function WidgetProvider({ children, initialWidgets = [] }) {
  const [widgets, setWidgets] = useState(() => {
    try {
      const savedWidgets = localStorage.getItem(WIDGETS_STORAGE_KEY);
      return savedWidgets ? JSON.parse(savedWidgets) : initialWidgets;
    } catch (error) {
      console.error('Error loading widgets:', error);
      return initialWidgets;
    }
  });

  // Save widgets whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
    } catch (error) {
      console.error('Error saving widgets:', error);
    }
  }, [widgets]);

  const addWidget = useCallback((type) => {
    if (!widgetRegistry.hasWidget(type)) {
      console.error(`Widget type "${type}" not found`);
      return null;
    }

    const widgetConfig = widgetRegistry.getWidget(type);
    const newWidget = {
      id: `${type}-${Date.now()}`,
      type,
      settings: { ...widgetConfig.defaultSettings },
      size: { ...widgetConfig.defaultSize }
    };

    setWidgets(currentWidgets => [...currentWidgets, newWidget]);
    return newWidget.id;
  }, []);

  const removeWidget = useCallback((widgetId) => {
    setWidgets(currentWidgets => 
      currentWidgets.filter(widget => widget.id !== widgetId)
    );
  }, []);

  const updateWidget = useCallback((widgetId, updates) => {
    setWidgets(currentWidgets =>
      currentWidgets.map(widget =>
        widget.id === widgetId
          ? { ...widget, ...updates }
          : widget
      )
    );
  }, []);

  const value = {
    widgets,
    addWidget,
    removeWidget,
    updateWidget
  };

  return (
    <WidgetContext.Provider value={value}>
      {children}
    </WidgetContext.Provider>
  );
}

WidgetProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialWidgets: PropTypes.array
};

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
} 