import React, { useState, useCallback, useEffect } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import SettingsPortal from './SettingsPortal';
import './BaseWidget.css';

const DragHandle = ({ onDragStart }) => (
  <div 
    className="widget-drag-handle"
    onMouseDown={onDragStart}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 9h8M8 15h8" />
    </svg>
  </div>
);

const ResizeHandle = ({ position, onResizeStart }) => (
  <div 
    className={`resize-handle resize-handle-${position}`}
    onMouseDown={(e) => {
      e.stopPropagation();
      onResizeStart(e, position);
    }}
  >
    <div className="resize-handle-dot" />
  </div>
);

const BaseWidget = ({
  id,
  title,
  style,
  onClose,
  onResize,
  onDrag,
  settings = {},
  onSettingsChange,
  SettingsComponent,
  children,
  gridPosition = { column: 0, row: 0 },
  gridSize = { width: 1, height: 1 }
}) => {
  const { theme } = useGlobalContext();
  const [showSettings, setShowSettings] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [currentGridSize, setCurrentGridSize] = useState(gridSize);
  const [currentGridPosition, setCurrentGridPosition] = useState(gridPosition);

  useEffect(() => {
    if (JSON.stringify(gridSize) !== JSON.stringify(currentGridSize)) {
      setCurrentGridSize(gridSize);
    }
  }, [gridSize]);

  useEffect(() => {
    if (JSON.stringify(gridPosition) !== JSON.stringify(currentGridPosition)) {
      setCurrentGridPosition(gridPosition);
    }
  }, [gridPosition]);

  const handleDragStart = useCallback((e) => {
    console.log('Drag start');
    const widgetElement = e.currentTarget.closest('.widget');
    if (!widgetElement) {
      console.warn('Widget element not found');
      return;
    }

    const dashboardElement = document.querySelector('.dashboard');
    if (!dashboardElement) {
      console.warn('Dashboard element not found');
      return;
    }

    const widgetRect = widgetElement.getBoundingClientRect();
    const dashboardRect = dashboardElement.getBoundingClientRect();

    // Calculate the offset of the mouse click relative to the widget
    const offsetX = e.clientX - widgetRect.left;
    const offsetY = e.clientY - widgetRect.top;

    console.log('Initial offsets:', { offsetX, offsetY });
    console.log('Widget rect:', widgetRect);
    console.log('Dashboard rect:', dashboardRect);
    
    setIsDragging(true);
    widgetElement.style.transition = 'none';
    widgetElement.style.zIndex = '1000';
    widgetElement.classList.add('dragging');

    const handleMouseMove = (e) => {
      if (!onDrag) {
        console.warn('No onDrag handler provided');
        return;
      }

      // Calculate new position relative to the dashboard
      const mouseX = e.clientX - dashboardRect.left;
      const mouseY = e.clientY - dashboardRect.top;

      console.log('Mouse move:', { 
        clientX: e.clientX, 
        clientY: e.clientY,
        mouseX, 
        mouseY, 
        offsetX, 
        offsetY 
      });

      const adjustedX = mouseX - offsetX;
      const adjustedY = mouseY - offsetY;

      console.log('Adjusted position:', { adjustedX, adjustedY });

      const dragData = {
        mouseX: adjustedX,
        mouseY: adjustedY,
        startPosition: currentGridPosition,
        size: currentGridSize,
        widgetRect,
        dashboardRect
      };

      const newPosition = onDrag(dragData);
      console.log('Drag handler returned:', newPosition);
      
      if (newPosition && newPosition.column !== undefined && newPosition.row !== undefined) {
        console.log('Setting new position:', newPosition);
        setCurrentGridPosition(newPosition);
      }
    };

    const handleMouseUp = () => {
      console.log('Drag end');
      setIsDragging(false);
      widgetElement.style.transition = '';
      widgetElement.style.zIndex = '';
      widgetElement.classList.remove('dragging');
      
      // Clean up event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    // Add the event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Prevent default browser drag behavior
    e.preventDefault();
    e.stopPropagation();
  }, [onDrag, currentGridPosition, currentGridSize]);

  const handleResizeStart = useCallback((e, position) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.clientX;
    const startY = e.clientY;
    const widgetRect = e.currentTarget.closest('.widget').getBoundingClientRect();
    
    setIsResizing(true);

    const handleMouseMove = (e) => {
      if (onResize) {
        const direction = {
          isLeft: position.includes('w'),
          isTop: position.includes('n'),
          isRight: position.includes('e'),
          isBottom: position.includes('s')
        };
        
        const resizeData = {
          mouseX: e.clientX,
          mouseY: e.clientY,
          startPosition: currentGridPosition,
          startSize: currentGridSize,
          direction,
          widgetRect
        };

        const newSize = onResize(resizeData);
        if (newSize && newSize.width && newSize.height) {
          setCurrentGridSize(newSize);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [onResize, currentGridPosition, currentGridSize]);

  const widgetStyle = {
    ...style,
    backgroundColor: theme.surface,
    color: theme.text,
    cursor: isDragging ? 'grabbing' : isResizing ? 'nwse-resize' : 'default'
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  return (
    <>
      <div 
        className={`widget ${isResizing ? 'resizing' : ''} ${isDragging ? 'dragging' : ''}`} 
        style={widgetStyle} 
        data-widget-id={id}
      >
        <div className="widget-header">
          <div className="widget-header-left">
            <DragHandle onDragStart={handleDragStart} />
            <div className="widget-title">{title}</div>
          </div>
          <div className="widget-controls">
            {SettingsComponent && (
              <button 
                className="widget-control settings"
                onClick={handleSettingsClick}
                aria-label="Settings"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </button>
            )}
            {onClose && (
              <button 
                className="widget-control close"
                onClick={onClose}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="widget-content">
          {children}
        </div>
        <ResizeHandle position="se" onResizeStart={handleResizeStart} />
        <ResizeHandle position="sw" onResizeStart={handleResizeStart} />
        <ResizeHandle position="ne" onResizeStart={handleResizeStart} />
        <ResizeHandle position="nw" onResizeStart={handleResizeStart} />
      </div>
      {SettingsComponent && showSettings && (
        <SettingsPortal>
          <SettingsComponent
            title={`${title} Settings`}
            settings={settings}
            onSettingsChange={onSettingsChange}
            onClose={handleSettingsClose}
          />
        </SettingsPortal>
      )}
    </>
  );
};

export default BaseWidget; 