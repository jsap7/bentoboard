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

  const findNextPosition = useCallback((widgetSize) => {
    const GRID_COLUMNS = 12;
    const GRID_ROWS = 8; // Reasonable maximum
    const grid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLUMNS).fill(false));

    // Mark occupied cells
    widgets.forEach(widget => {
      const width = widget.size?.width || widgetRegistry.getWidget(widget.type).defaultSize.width;
      const height = widget.size?.height || widgetRegistry.getWidget(widget.type).defaultSize.height;
      const x = widget.position?.x || 0;
      const y = widget.position?.y || 0;

      for (let i = y; i < Math.min(y + height, GRID_ROWS); i++) {
        for (let j = x; j < Math.min(x + width, GRID_COLUMNS); j++) {
          grid[i][j] = true;
        }
      }
    });

    // Find first available position
    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLUMNS; x++) {
        if (x + widgetSize.width > GRID_COLUMNS) continue;
        
        let fits = true;
        for (let i = y; i < Math.min(y + widgetSize.height, GRID_ROWS); i++) {
          for (let j = x; j < Math.min(x + widgetSize.width, GRID_COLUMNS); j++) {
            if (grid[i]?.[j]) {
              fits = false;
              break;
            }
          }
          if (!fits) break;
        }
        
        if (fits) {
          return { x, y };
        }
      }
    }

    return { x: 0, y: 0 }; // Fallback if no space found
  }, [widgets]);

  const addWidget = useCallback((type) => {
    if (!widgetRegistry.hasWidget(type)) {
      console.error(`Widget type "${type}" not found`);
      return null;
    }

    const widgetConfig = widgetRegistry.getWidget(type);
    const position = findNextPosition(widgetConfig.defaultSize);
    
    const newWidget = {
      id: `${type}-${Date.now()}`,
      type,
      settings: widgetConfig.defaultSettings,
      size: { ...widgetConfig.defaultSize },
      position
    };

    console.log('Adding new widget with settings:', newWidget.settings);
    setWidgets(currentWidgets => [...currentWidgets, newWidget]);
    return newWidget.id;
  }, [findNextPosition]);

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