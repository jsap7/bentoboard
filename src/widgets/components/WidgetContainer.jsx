import React, { useState, useRef, useCallback } from 'react';
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
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const containerRef = useRef(null);

  const handleWidgetClose = (widgetId) => {
    removeWidget(widgetId);
  };

  const handleWidgetMinimize = (widgetId, isMinimized) => {
    updateWidget(widgetId, { isMinimized });
  };

  const handleWidgetSettingsChange = (widgetId, newSettings) => {
    updateWidget(widgetId, { settings: newSettings });
  };

  const checkCollision = useCallback((x, y, width, height, widgetId) => {
    return widgets.some(otherWidget => {
      if (otherWidget.id === widgetId) return false;

      const otherX = otherWidget.position?.x || 0;
      const otherY = otherWidget.position?.y || 0;
      const otherWidth = otherWidget.size?.width || 1;
      const otherHeight = otherWidget.size?.height || 1;

      return (
        x < otherX + otherWidth &&
        x + width > otherX &&
        y < otherY + otherHeight &&
        y + height > otherY
      );
    });
  }, [widgets]);

  const handleResizeStart = (widgetId, widgetConfig, e) => {
    e.preventDefault();
    setIsResizing(true);
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
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDragStart = (e, widget) => {
    setIsDragging(true);
    setDraggedWidget(widget);
    e.dataTransfer.setData('text/plain', widget.id);
    e.dataTransfer.effectAllowed = 'move';

    // Add dragging class to the dragged element
    e.target.classList.add('dragging');

    // Create a drag image that maintains the original size
    const dragImage = e.target.cloneNode(true);
    const originalRect = e.target.getBoundingClientRect();
    Object.assign(dragImage.style, {
      position: 'fixed',
      top: '-9999px',
      left: '-9999px',
      width: `${originalRect.width}px`,
      height: `${originalRect.height}px`,
      opacity: '0.5',
      pointerEvents: 'none',
      zIndex: '-1'
    });
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!draggedWidget) return;

    e.dataTransfer.dropEffect = 'move';

    // Show grid during drag
    if (!containerRef.current.classList.contains('dragging')) {
      containerRef.current.classList.add('dragging');
    }

    // Calculate potential drop position
    const containerRect = containerRef.current.getBoundingClientRect();
    const columnWidth = containerRect.width / 12;
    const rowHeight = 150;

    const dropX = Math.round((e.clientX - containerRect.left) / columnWidth);
    const dropY = Math.round((e.clientY - containerRect.top) / rowHeight);

    // Ensure the position is within bounds
    const maxX = 12 - (draggedWidget.size?.width || 1);
    const newX = Math.max(0, Math.min(maxX, dropX));
    const newY = Math.max(0, dropY);

    // Check if this is a valid drop position
    const hasCollision = checkCollision(
      newX,
      newY,
      draggedWidget.size?.width || 1,
      draggedWidget.size?.height || 1,
      draggedWidget.id
    );

    setDropPosition({
      x: newX,
      y: newY,
      isValid: !hasCollision
    });

    // Update container class based on validity
    containerRef.current.classList.toggle('drop-valid', !hasCollision);
    containerRef.current.classList.toggle('drop-invalid', hasCollision);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setDraggedWidget(null);
    setDropPosition(null);
    e.target.classList.remove('dragging');
    containerRef.current.classList.remove('dragging', 'drop-valid', 'drop-invalid');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setDraggedWidget(null);
    setDropPosition(null);
    containerRef.current.classList.remove('dragging', 'drop-valid', 'drop-invalid');

    if (!dropPosition || !dropPosition.isValid) return;

    const widgetId = e.dataTransfer.getData('text/plain');
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    updateWidget(widget.id, {
      position: { x: dropPosition.x, y: dropPosition.y }
    });
  };

  return (
    <div
      ref={containerRef}
      className={`widget-container ${className || ''} ${isResizing ? 'resizing' : ''} ${
        isDragging ? 'dragging' : ''
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {widgets.map((widget, index) => {
        const widgetConfig = widgetRegistry.getWidget(widget.type);
        if (!widgetConfig) return null;

        const WidgetComponent = widgetConfig.component;
        const width = widget.size?.width || widgetConfig.defaultSize.width;
        const height = widget.size?.height || widgetConfig.defaultSize.height;
        
        // Calculate grid position
        const gridColumn = widget.position?.x ? 
          `${widget.position.x + 1} / span ${width}` : 
          `span ${width}`;
        const gridRow = widget.position?.y ? 
          `${widget.position.y + 1} / span ${height}` : 
          `span ${height}`;

        return (
          <div
            key={widget.id}
            className="widget-wrapper"
            style={{
              gridColumn,
              gridRow,
            }}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, widget)}
            onDragEnd={handleDragEnd}
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