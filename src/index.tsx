import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalProvider } from './contexts/GlobalContext';
import { WidgetStateProvider } from './contexts/WidgetStateContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import WidgetSelector from './components/WidgetSelector';
import { getWidget } from './registry/widgetRegistry';
import { getAllWidgetStates } from './hooks/useWidgetState';

// Import global styles (we'll create this next)
import './styles.css';

interface GridPosition {
  column: number;
  row: number;
}

interface GridSize {
  width: number;
  height: number;
}

interface WidgetConfig {
  component: React.ComponentType<any>;
  defaultSize: GridSize;
  minSize?: GridSize;
  maxSize?: GridSize;
  icon?: React.ComponentType<any>;
  title: string;
  description: string;
}

interface Widget {
  id: string;
  type: string;
  component: React.ComponentType<any>;
  gridPosition: GridPosition;
  gridSize: GridSize;
  settings: any;
  data: any;
  minSize?: GridSize;
  maxSize?: GridSize;
}

const App = () => {
  const [widgets, setWidgets] = useState<Widget[]>([]);

  // Load saved widgets on startup
  useEffect(() => {
    const savedStates = getAllWidgetStates();
    const restoredWidgets = Object.entries(savedStates).map(([id, state]) => {
      const [widgetType] = id.split('-');
      const widgetConfig = getWidget(widgetType) as WidgetConfig;
      
      if (widgetConfig) {
        // Use the saved state's grid size and position, falling back to defaults if not present
        return {
          id,
          type: widgetType,
          component: widgetConfig.component,
          gridPosition: state.gridPosition || { column: 0, row: 0 },
          gridSize: state.gridSize || widgetConfig.defaultSize,
          settings: state.settings || {},
          data: state.data || {},
          minSize: widgetConfig.minSize,  // Pass through size constraints
          maxSize: widgetConfig.maxSize
        };
      }
      return null;
    }).filter(Boolean) as Widget[];

    setWidgets(restoredWidgets);
  }, []);

  // Check if a position and size would overlap with existing widgets
  const checkCollision = (testPosition: GridPosition, testSize: GridSize, excludeId: string | null = null) => {
    const left1 = testPosition.column;
    const right1 = testPosition.column + testSize.width - 1;
    const top1 = testPosition.row;
    const bottom1 = testPosition.row + testSize.height - 1;

    return widgets.some(widget => {
      if (widget.id === excludeId) return false;

      const left2 = widget.gridPosition.column;
      const right2 = widget.gridPosition.column + widget.gridSize.width - 1;
      const top2 = widget.gridPosition.row;
      const bottom2 = widget.gridPosition.row + widget.gridSize.height - 1;

      return !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2);
    });
  };

  const findEmptyPosition = (widgetSize: GridSize) => {
    const columns = 12;
    const rows = 6;
    
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (column + widgetSize.width > columns || row + widgetSize.height > rows) {
          continue;
        }

        const testPosition = { column, row };
        if (!checkCollision(testPosition, widgetSize)) {
          return testPosition;
        }
      }
    }
    
    return { column: 0, row: 0 };
  };

  const handleAddWidget = (widgetType: string) => {
    const widgetConfig = getWidget(widgetType) as WidgetConfig;
    if (widgetConfig) {
      const widgetSize = widgetConfig.defaultSize || { width: 2, height: 2 };
      const position = findEmptyPosition(widgetSize);
      
      const newWidget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
        component: widgetConfig.component,
        gridPosition: position,
        gridSize: widgetSize,
        settings: {},
        data: {},
        minSize: widgetConfig.minSize,
        maxSize: widgetConfig.maxSize
      };

      setWidgets([...widgets, newWidget]);
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
    localStorage.removeItem(`widget-${widgetId}`);
  };

  const handleWidgetResize = (widgetId: string, newSize: GridSize) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === widgetId) {
        const hasCollision = checkCollision(widget.gridPosition, newSize, widgetId);
        if (hasCollision) {
          return widget;
        }
        const updatedWidget = {
          ...widget,
          gridSize: newSize
        };
        // Update localStorage immediately
        const widgetState = {
          gridPosition: updatedWidget.gridPosition,
          gridSize: updatedWidget.gridSize,
          settings: updatedWidget.settings,
          data: updatedWidget.data
        };
        localStorage.setItem(`widget-${widgetId}`, JSON.stringify(widgetState));
        return updatedWidget;
      }
      return widget;
    }));
  };

  const handleWidgetDrag = (widgetId: string, newPosition: GridPosition) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === widgetId) {
        const hasCollision = checkCollision(newPosition, widget.gridSize, widgetId);
        if (hasCollision) {
          return widget;
        }
        const updatedWidget = {
          ...widget,
          gridPosition: newPosition
        };
        // Update localStorage immediately
        const widgetState = {
          gridPosition: updatedWidget.gridPosition,
          gridSize: updatedWidget.gridSize,
          settings: updatedWidget.settings,
          data: updatedWidget.data
        };
        localStorage.setItem(`widget-${widgetId}`, JSON.stringify(widgetState));
        return updatedWidget;
      }
      return widget;
    }));
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <Header onAddWidget={handleAddWidget} />
      <Dashboard 
        onWidgetResize={handleWidgetResize}
        onWidgetDrag={handleWidgetDrag}
      >
        {widgets.map(widget => {
          const WidgetComponent = widget.component;
          return (
            <WidgetComponent
              key={widget.id}
              id={widget.id}
              onClose={() => handleRemoveWidget(widget.id)}
              gridPosition={widget.gridPosition}
              gridSize={widget.gridSize}
              settings={widget.settings}
              data={widget.data}
              minSize={widget.minSize}
              maxSize={widget.maxSize}
            />
          );
        })}
      </Dashboard>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <WidgetStateProvider>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </WidgetStateProvider>
); 