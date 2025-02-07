import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { getCellDimensions, snapToGrid } from '../utils/gridManager';

const Dashboard = ({ children, onWidgetResize, onWidgetDrag }) => {
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
    if (!dashboardRef.current) {
      return { column: 0, row: 0 };
    }

    const rect = dashboardRef.current.getBoundingClientRect();
    const containerWidth = rect.width - (dashboardState.layout.gap * 2);
    const containerHeight = rect.height - (dashboardState.layout.gap * 2);
    
    // Calculate cell dimensions including gaps
    const totalGapWidth = dashboardState.layout.gap * (dashboardState.layout.columns - 1);
    const totalGapHeight = dashboardState.layout.gap * (dashboardState.layout.rows - 1);
    
    const cellWidth = (containerWidth - totalGapWidth) / dashboardState.layout.columns;
    const cellHeight = (containerHeight - totalGapHeight) / dashboardState.layout.rows;

    // Calculate grid position
    const column = Math.floor(x / (cellWidth + dashboardState.layout.gap));
    const row = Math.floor(y / (cellHeight + dashboardState.layout.gap));

    // Ensure position is within bounds
    const boundedColumn = Math.max(0, Math.min(dashboardState.layout.columns - 1, column));
    const boundedRow = Math.max(0, Math.min(dashboardState.layout.rows - 1, row));

    return {
      column: boundedColumn,
      row: boundedRow
    };
  }, [dashboardState.layout]);

  // Check if two widgets overlap
  const checkCollision = useCallback((pos1, size1, pos2, size2) => {
    const left1 = pos1.column;
    const right1 = pos1.column + size1.width - 1;
    const top1 = pos1.row;
    const bottom1 = pos1.row + size1.height - 1;

    const left2 = pos2.column;
    const right2 = pos2.column + size2.width - 1;
    const top2 = pos2.row;
    const bottom2 = pos2.row + size2.height - 1;

    return !(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2);
  }, []);

  // Check if a widget position collides with any other widget
  const hasCollisions = useCallback((testId, testPosition, testSize) => {
    let hasCollision = false;
    
    React.Children.forEach(children, child => {
      if (!child || child.props.id === testId) return;

      const { gridPosition, gridSize } = child.props;
      if (checkCollision(testPosition, testSize, gridPosition, gridSize)) {
        hasCollision = true;
      }
    });

    return hasCollision;
  }, [children, checkCollision]);

  // Handle widget drag with collision detection
  const handleWidgetDrag = useCallback((widgetId, dragData) => {
    if (!dashboardRef.current || !dragData) {
      return null;
    }

    const {
      mouseX,
      mouseY,
      startPosition,
      size,
      widgetRect,
      dashboardRect
    } = dragData;

    // Convert mouse position to grid coordinates
    const gridPos = pixelsToGrid(mouseX, mouseY);
    
    // Calculate new position ensuring widget stays within bounds
    const newPosition = {
      column: Math.max(0, Math.min(
        dashboardState.layout.columns - size.width,
        gridPos.column
      )),
      row: Math.max(0, Math.min(
        dashboardState.layout.rows - size.height,
        gridPos.row
      ))
    };

    // Check for collisions
    if (hasCollisions(widgetId, newPosition, size)) {
      return null;
    }

    // Call the parent's onWidgetDrag callback
    if (onWidgetDrag) {
      onWidgetDrag(widgetId, newPosition);
      return newPosition;
    }

    return null;
  }, [dashboardState.layout, pixelsToGrid, onWidgetDrag, hasCollisions]);

  // Handle widget resize with collision detection
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
      return null;
    }

    const rect = dashboardRef.current.getBoundingClientRect();
    
    // Calculate relative mouse position in the dashboard
    const relativeX = mouseX - rect.left - dashboardState.layout.gap;
    const relativeY = mouseY - rect.top - dashboardState.layout.gap;

    // Convert to grid coordinates
    const mouseGridPos = pixelsToGrid(relativeX, relativeY);
    
    // Calculate new size based on resize direction
    let newWidth = startSize.width;
    let newHeight = startSize.height;

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

    // Check for collisions with new size
    if (hasCollisions(widgetId, startPosition, newSize)) {
      return null;
    }

    // Call the parent's onWidgetResize callback
    if (onWidgetResize) {
      onWidgetResize(widgetId, newSize);
    }

    return newSize;
  }, [dashboardState.layout, pixelsToGrid, onWidgetResize, hasCollisions]);

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
          
          const { gridPosition = { column: 0, row: 0 }, gridSize = { width: 1, height: 1 }, id } = child.props;
          
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
            onResize: (resizeData) => handleWidgetResize(id, resizeData),
            onDrag: (dragData) => handleWidgetDrag(id, dragData)
          });
        })}
      </div>
    </div>
  );
};

export default Dashboard; 