import React from 'react';
import PropTypes from 'prop-types';
import widgetRegistry from '../registry/WidgetRegistry';
import { useWidgets } from '../core/WidgetContext';
import './WidgetContainer.css';

const ResizeHandle = ({ onResizeStart }) => (
  <div 
    className="resize-handle"
    onMouseDown={(e) => {
      e.preventDefault();
      if (onResizeStart) onResizeStart(e);
    }}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  </div>
);

const WidgetContainer = ({ className }) => {
  const { widgets, removeWidget, updateWidget } = useWidgets();

  const handleWidgetClose = (widgetId) => {
    removeWidget(widgetId);
  };

  const handleWidgetMinimize = (widgetId, isMinimized) => {
    updateWidget(widgetId, { isMinimized });
  };

  const handleWidgetSettingsChange = (widgetId, newSettings) => {
    updateWidget(widgetId, { settings: newSettings });
  };

  const handleResizeStart = (widgetId, widgetConfig, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const widget = widgets.find(w => w.id === widgetId);
    const startSize = widget?.size || widgetConfig.defaultSize;
    
    // Get the container's actual width for accurate column calculation
    const containerRect = e.currentTarget.closest('.widget-container').getBoundingClientRect();
    const columnWidth = containerRect.width / 12;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Calculate new size in grid units
      const widthChange = Math.round(deltaX / columnWidth);
      const heightChange = Math.round(deltaY / 100);

      // Apply size constraints
      const minSize = widgetConfig.minSize || { width: 1, height: 1 };
      const maxSize = widgetConfig.maxSize || { width: 12, height: 4 };

      const newWidth = Math.max(
        minSize.width,
        Math.min(maxSize.width, startSize.width + widthChange)
      );
      const newHeight = Math.max(
        minSize.height,
        Math.min(maxSize.height, startSize.height + heightChange)
      );

      // Only update if size actually changed
      if (newWidth !== widget.size?.width || newHeight !== widget.size?.height) {
        updateWidget(widgetId, {
          size: { width: newWidth, height: newHeight }
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={`widget-container ${className || ''}`}>
      {widgets.map(widget => {
        const widgetConfig = widgetRegistry.getWidget(widget.type);
        if (!widgetConfig) return null;

        const WidgetComponent = widgetConfig.component;
        
        return (
          <div
            key={widget.id}
            className="widget-wrapper"
            style={{
              gridColumn: `span ${widget.size?.width || widgetConfig.defaultSize.width}`,
              gridRow: `span ${widget.size?.height || widgetConfig.defaultSize.height}`
            }}
          >
            <WidgetComponent
              id={widget.id}
              settings={widget.settings || widgetConfig.defaultSettings}
              onSettingsChange={(newSettings) => handleWidgetSettingsChange(widget.id, newSettings)}
              onClose={() => handleWidgetClose(widget.id)}
              onMinimize={(isMinimized) => handleWidgetMinimize(widget.id, isMinimized)}
            />
            {widgetConfig.isResizable !== false && (
              <ResizeHandle 
                onResizeStart={(e) => handleResizeStart(widget.id, widgetConfig, e)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

WidgetContainer.propTypes = {
  className: PropTypes.string
};

export default WidgetContainer; 