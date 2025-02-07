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

  // Check if a position and size would overlap with existing widgets
  const checkCollision = (testPosition, testSize, excludeId = null) => {
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

  const findEmptyPosition = (widgetSize) => {
    // Grid dimensions
    const columns = 12;
    const rows = 6;
    
    // Try each position from top-left to bottom-right
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        // Check if widget would fit within grid bounds
        if (column + widgetSize.width > columns || row + widgetSize.height > rows) {
          continue;
        }

        const testPosition = { column, row };
        
        // Check for collisions at this position
        if (!checkCollision(testPosition, widgetSize)) {
          console.log('Found empty position:', testPosition);
          return testPosition;
        }
      }
    }
    
    // If no empty space found, try to find space in the first row
    console.warn('No empty space found, defaulting to (0,0)');
    return { column: 0, row: 0 };
  };

  const handleAddWidget = (widgetType) => {
    const widgetConfig = getWidget(widgetType);
    if (widgetConfig) {
      const widgetSize = widgetConfig.defaultSize || { width: 2, height: 2 };
      const position = findEmptyPosition(widgetSize);
      
      // Double check for collisions
      if (checkCollision(position, widgetSize)) {
        console.warn('Could not find non-colliding position for new widget');
        return;
      }

      const newWidget = {
        id: `${widgetType}-${Date.now()}`,
        type: widgetType,
        component: widgetConfig.component,
        gridPosition: position,
        gridSize: widgetSize
      };

      console.log('Adding new widget:', newWidget);
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
        // Check if new size would cause collisions
        if (checkCollision(widget.gridPosition, newSize, widgetId)) {
          console.log('Resize rejected due to collision');
          return widget;
        }
        return {
          ...widget,
          gridSize: newSize
        };
      }
      return widget;
    }));
  };

  const handleWidgetDrag = (widgetId, newPosition) => {
    console.log('App: handleWidgetDrag', { widgetId, newPosition });
    setWidgets(widgets.map(widget => {
      if (widget.id === widgetId) {
        // Check if new position would cause collisions
        if (checkCollision(newPosition, widget.gridSize, widgetId)) {
          console.log('Drag rejected due to collision');
          return widget;
        }
        return {
          ...widget,
          gridPosition: newPosition
        };
      }
      return widget;
    }));
  };

  return (
    <GlobalProvider>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Header onAddWidget={() => setIsWidgetSelectorOpen(true)} />
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