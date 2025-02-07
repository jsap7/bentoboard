import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GlobalProvider } from './context/GlobalContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import WidgetSelector from './components/WidgetSelector';
import { getWidget } from './registry/widgetRegistry';

// Import global styles (we'll create this next)
import './styles.css';

const App = () => {
  const [widgets, setWidgets] = useState([]);
  const [isWidgetSelectorOpen, setIsWidgetSelectorOpen] = useState(false);

  const findEmptyPosition = (widgets) => {
    // Start from top-left and find the first empty position
    const occupiedPositions = new Set(
      widgets.map(w => `${w.gridPosition.column},${w.gridPosition.row}`)
    );

    for (let row = 0; row < 6; row++) {
      for (let column = 0; column < 12; column++) {
        if (!occupiedPositions.has(`${column},${row}`)) {
          return { column, row };
        }
      }
    }
    
    // If no empty space found, default to (0,0)
    return { column: 0, row: 0 };
  };

  const handleAddWidget = (widgetType) => {
    const widgetConfig = getWidget(widgetType);
    if (widgetConfig) {
      const position = findEmptyPosition(widgets);
      const newWidget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
        component: widgetConfig.component,
        gridPosition: position,
        gridSize: widgetConfig.defaultSize || { width: 2, height: 2 }
      };
      setWidgets([...widgets, newWidget]);
      setIsWidgetSelectorOpen(false);
    }
  };

  const handleRemoveWidget = (widgetId) => {
    setWidgets(widgets.filter(widget => widget.id !== widgetId));
  };

  const handleWidgetResize = (widgetId, newSize) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === widgetId) {
        return {
          ...widget,
          gridSize: newSize
        };
      }
      return widget;
    }));
  };

  return (
    <GlobalProvider>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Header onAddWidget={() => setIsWidgetSelectorOpen(true)} />
        <Dashboard onWidgetResize={handleWidgetResize}>
          {widgets.map(widget => {
            const WidgetComponent = widget.component;
            return (
              <WidgetComponent
                key={widget.id}
                id={widget.id}
                onClose={() => handleRemoveWidget(widget.id)}
                gridPosition={widget.gridPosition}
                gridSize={widget.gridSize}
              />
            );
          })}
        </Dashboard>
        {isWidgetSelectorOpen && (
          <WidgetSelector
            onSelect={handleAddWidget}
            onClose={() => setIsWidgetSelectorOpen(false)}
          />
        )}
      </div>
    </GlobalProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); 