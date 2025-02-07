import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { getCellDimensions } from '../utils/gridManager';

const Dashboard = ({ children, onWidgetResize }) => {
  const { theme, dashboardState } = useGlobalContext();
  const dashboardRef = useRef(null);
  const [dynamicRowHeight, setDynamicRowHeight] = useState(dashboardState.layout.rowHeight);

  const dashboardStyle = {
    position: 'relative',
    width: '100%',
    height: `calc(100vh - 60px)`,
    backgroundColor: theme.background,
    padding: `${dashboardState.layout.gap}px`,
    boxSizing: 'border-box',
    marginTop: '60px',
    overflow: 'hidden'
  };

  // Calculate dynamic row height based on available space
  const calculateRowHeight = useCallback(() => {
    if (dashboardRef.current) {
      const availableHeight = dashboardRef.current.clientHeight - (dashboardState.layout.gap * (dashboardState.layout.rows + 1));
      const newRowHeight = Math.floor(availableHeight / dashboardState.layout.rows);
      setDynamicRowHeight(newRowHeight);
    }
  }, [dashboardState.layout.rows, dashboardState.layout.gap]);

  // Convert pixel coordinates to grid coordinates
  const pixelsToGrid = useCallback((x, y) => {
    if (!dashboardRef.current) return { column: 0, row: 0 };

    const rect = dashboardRef.current.getBoundingClientRect();
    const containerWidth = rect.width - (dashboardState.layout.gap * 2);
    const cellWidth = containerWidth / dashboardState.layout.columns;
    const cellHeight = dynamicRowHeight;

    const column = Math.max(0, Math.min(
      dashboardState.layout.columns - 1,
      Math.floor(x / (cellWidth + dashboardState.layout.gap))
    ));

    const row = Math.max(0, Math.min(
      dashboardState.layout.rows - 1,
      Math.floor(y / (cellHeight + dashboardState.layout.gap))
    ));

    return { column, row };
  }, [dashboardState.layout, dynamicRowHeight]);

  // Handle widget resize
  const handleWidgetResize = useCallback((widgetId, resizeData) => {
    if (!dashboardRef.current || !resizeData) return null;

    const {
      mouseX,
      mouseY,
      startPosition,
      startSize,
      direction,
      widgetRect
    } = resizeData;

    // Ensure we have all required properties
    if (!startPosition || !startSize || !direction) {
      console.warn('Missing required resize data properties');
      return null;
    }

    const rect = dashboardRef.current.getBoundingClientRect();
    
    // Calculate relative mouse position in the dashboard
    const relativeX = mouseX - rect.left - dashboardState.layout.gap;
    const relativeY = mouseY - rect.top - dashboardState.layout.gap;

    // Convert to grid coordinates
    const mouseGridPos = pixelsToGrid(relativeX, relativeY);
    
    // Calculate new size based on resize direction
    let newWidth = startSize.width || 1;  // Default to 1 if width is undefined
    let newHeight = startSize.height || 1; // Default to 1 if height is undefined

    if (direction.isRight) {
      newWidth = Math.max(1, mouseGridPos.column - startPosition.column + 1);
    } else if (direction.isLeft) {
      const diff = startPosition.column - mouseGridPos.column;
      newWidth = Math.max(1, startSize.width + diff);
    }

    if (direction.isBottom) {
      newHeight = Math.max(1, mouseGridPos.row - startPosition.row + 1);
    } else if (direction.isTop) {
      const diff = startPosition.row - mouseGridPos.row;
      newHeight = Math.max(1, startSize.height + diff);
    }

    // Ensure we don't exceed grid boundaries
    const newSize = {
      width: Math.min(newWidth, dashboardState.layout.columns - startPosition.column),
      height: Math.min(newHeight, dashboardState.layout.rows - startPosition.row)
    };

    // Call the parent's onWidgetResize callback
    if (onWidgetResize) {
      onWidgetResize(widgetId, newSize);
    }

    return newSize;
  }, [dashboardState.layout, pixelsToGrid, onWidgetResize]);

  useEffect(() => {
    calculateRowHeight();
    window.addEventListener('resize', calculateRowHeight);
    return () => window.removeEventListener('resize', calculateRowHeight);
  }, [calculateRowHeight]);

  const widgetContainerStyle = {
    position: 'absolute',
    top: dashboardState.layout.gap,
    left: dashboardState.layout.gap,
    right: dashboardState.layout.gap,
    bottom: dashboardState.layout.gap,
    display: 'grid',
    gridTemplateColumns: `repeat(${dashboardState.layout.columns}, 1fr)`,
    gridTemplateRows: `repeat(${dashboardState.layout.rows}, ${dynamicRowHeight}px)`,
    gap: `${dashboardState.layout.gap}px`,
  };

  const createGridCells = () => {
    const cells = [];
    const { columns, rows } = dashboardState.layout;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        cells.push(
          <div
            key={`${row}-${col}`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              gridColumn: col + 1,
              gridRow: row + 1,
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              pointerEvents: 'none'
            }}
          />
        );
      }
    }
    return cells;
  };

  return (
    <div 
      ref={dashboardRef}
      className="dashboard"
      style={dashboardStyle}
      data-testid="dashboard"
    >
      <div style={widgetContainerStyle}>
        {createGridCells()}
        {React.Children.map(children, child => {
          if (!child) return null;
          
          const { gridPosition = { column: 0, row: 0 }, gridSize = { width: 1, height: 1 } } = child.props;
          
          // Ensure we have valid grid position and size
          const safeGridPosition = {
            column: Math.max(0, Math.min(gridPosition.column || 0, dashboardState.layout.columns - 1)),
            row: Math.max(0, Math.min(gridPosition.row || 0, dashboardState.layout.rows - 1))
          };

          const safeGridSize = {
            width: Math.max(1, Math.min(gridSize.width || 1, dashboardState.layout.columns - safeGridPosition.column)),
            height: Math.max(1, Math.min(gridSize.height || 1, dashboardState.layout.rows - safeGridPosition.row))
          };

          const widgetStyle = {
            gridColumn: `${safeGridPosition.column + 1} / span ${safeGridSize.width}`,
            gridRow: `${safeGridPosition.row + 1} / span ${safeGridSize.height}`,
            minWidth: 0,
            minHeight: 0,
            zIndex: 1
          };
          
          return React.cloneElement(child, { 
            style: widgetStyle,
            gridPosition: safeGridPosition,
            gridSize: safeGridSize,
            onResize: (resizeData) => handleWidgetResize(child.props.id, resizeData)
          });
        })}
      </div>
    </div>
  );
};

export default Dashboard; 