import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import { getCellDimensions, snapToGrid } from '../utils/gridManager';

const MIN_ROWS = 6;

const Dashboard = ({ children, onWidgetResize, onWidgetDrag }) => {
  const { theme, dashboardState } = useGlobalContext();
  const dashboardRef = useRef(null);
  const [dynamicRowHeight, setDynamicRowHeight] = useState(dashboardState.layout.rowHeight);
  const [isInteracting, setIsInteracting] = useState(false);
  const [totalRows, setTotalRows] = useState(MIN_ROWS);

  // Calculate total rows needed based on widget positions
  useEffect(() => {
    let maxRow = MIN_ROWS;
    React.Children.forEach(children, child => {
      if (!child) return;
      const { gridPosition, gridSize } = child.props;
      const widgetBottom = gridPosition.row + gridSize.height;
      maxRow = Math.max(maxRow, widgetBottom);
    });
    setTotalRows(maxRow);
  }, [children]);

  const dashboardStyle = {
    position: 'relative',
    width: '100%',
    minHeight: `calc(100vh - 60px)`,
    height: 'auto',
    backgroundColor: theme.background,
    padding: `${dashboardState.layout.gap}px`,
    boxSizing: 'border-box',
    marginTop: '60px',
    overflowY: 'auto',
    overflowX: 'hidden'
  };

  // Calculate dynamic row height based on available space
  const calculateRowHeight = useCallback(() => {
    if (dashboardRef.current) {
      const minHeight = Math.floor((window.innerHeight - 60) / totalRows);
      setDynamicRowHeight(Math.max(minHeight, dashboardState.layout.rowHeight));
    }
  }, [totalRows, dashboardState.layout.rowHeight]);

  // Convert pixel coordinates to grid coordinates
  const pixelsToGrid = useCallback((x, y) => {
    if (!dashboardRef.current) {
      return { column: 0, row: 0 };
    }

    const rect = dashboardRef.current.getBoundingClientRect();
    const containerWidth = rect.width - (dashboardState.layout.gap * 2);
    
    // Calculate cell dimensions including gaps
    const totalGapWidth = dashboardState.layout.gap * (dashboardState.layout.columns - 1);
    const cellWidth = (containerWidth - totalGapWidth) / dashboardState.layout.columns;
    const cellHeight = dynamicRowHeight + dashboardState.layout.gap;

    // Calculate grid position
    const column = Math.floor(x / (cellWidth + dashboardState.layout.gap));
    const row = Math.floor(y / cellHeight);

    // Ensure position is within bounds
    const boundedColumn = Math.max(0, Math.min(dashboardState.layout.columns - 1, column));
    // Allow row to exceed current totalRows to enable expansion
    const boundedRow = Math.max(0, row);

    return {
      column: boundedColumn,
      row: boundedRow
    };
  }, [dashboardState.layout, dynamicRowHeight]);

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

    setIsInteracting(true);  // Show grid when dragging starts

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
      row: Math.max(0, gridPos.row)  // Allow vertical expansion
    };

    // Check for collisions
    if (hasCollisions(widgetId, newPosition, size)) {
      return null;
    }

    // Update totalRows if widget is moved below current grid
    const newBottom = newPosition.row + size.height;
    if (newBottom > totalRows) {
      setTotalRows(newBottom);
    }

    // Call the parent's onWidgetDrag callback
    if (onWidgetDrag) {
      onWidgetDrag(widgetId, newPosition);
      return newPosition;
    }

    return null;
  }, [dashboardState.layout, pixelsToGrid, onWidgetDrag, hasCollisions, totalRows]);

  // Handle widget resize with collision detection and size constraints
  const handleWidgetResize = useCallback((widgetId, resizeData) => {
    if (!dashboardRef.current || !resizeData) return null;

    const {
      mouseX,
      mouseY,
      startPosition,
      startSize,
      direction,
      widgetRect,
      minSize,
      maxSize
    } = resizeData;

    setIsInteracting(true);  // Show grid when resizing starts

    // Convert mouse position to grid coordinates
    const mouseGridPos = pixelsToGrid(mouseX, mouseY);
    
    let newWidth = startSize.width;
    let newHeight = startSize.height;
    let newPosition = { ...startPosition };

    // Handle horizontal resize
    if (direction.isLeft) {
      const widthDiff = startPosition.column - mouseGridPos.column;
      newWidth = startSize.width + widthDiff;
      newPosition.column = startPosition.column - widthDiff;
    } else if (direction.isRight) {
      newWidth = mouseGridPos.column - startPosition.column + 1;
    }

    // Handle vertical resize
    if (direction.isTop) {
      const heightDiff = startPosition.row - mouseGridPos.row;
      newHeight = startSize.height + heightDiff;
      newPosition.row = startPosition.row - heightDiff;
    } else if (direction.isBottom) {
      newHeight = mouseGridPos.row - startPosition.row + 1;
    }

    // Apply size constraints
    if (minSize) {
      newWidth = Math.max(newWidth, minSize.width);
      newHeight = Math.max(newHeight, minSize.height);
    }
    if (maxSize) {
      newWidth = Math.min(newWidth, maxSize.width);
      newHeight = Math.min(newHeight, maxSize.height);
    }

    // Ensure we don't exceed grid boundaries for width
    newWidth = Math.max(1, Math.min(newWidth, dashboardState.layout.columns - newPosition.column));
    
    // Ensure minimum height of 1
    newHeight = Math.max(1, newHeight);

    // Ensure position is valid
    newPosition.column = Math.max(0, Math.min(newPosition.column, dashboardState.layout.columns - 1));
    newPosition.row = Math.max(0, newPosition.row);

    const newSize = { width: newWidth, height: newHeight };

    // Check for collisions with new size and position
    if (hasCollisions(widgetId, newPosition, newSize)) {
      return null;
    }

    // Update totalRows if widget extends below current grid
    const newBottom = newPosition.row + newHeight;
    if (newBottom > totalRows) {
      setTotalRows(newBottom);
    }

    // Call the parent's onWidgetResize callback
    if (onWidgetResize) {
      onWidgetResize(widgetId, newSize);
    }

    return newSize;
  }, [dashboardState.layout, pixelsToGrid, onWidgetResize, hasCollisions, totalRows]);

  useEffect(() => {
    calculateRowHeight();
    window.addEventListener('resize', calculateRowHeight);
    return () => window.removeEventListener('resize', calculateRowHeight);
  }, [calculateRowHeight]);

  // Add effect to hide grid when interaction ends
  useEffect(() => {
    if (isInteracting) {
      const hideGrid = () => setIsInteracting(false);
      window.addEventListener('mouseup', hideGrid);
      return () => window.removeEventListener('mouseup', hideGrid);
    }
  }, [isInteracting]);

  const widgetContainerStyle = {
    position: 'absolute',
    top: dashboardState.layout.gap,
    left: dashboardState.layout.gap,
    right: dashboardState.layout.gap,
    bottom: dashboardState.layout.gap,
    display: 'grid',
    gridTemplateColumns: `repeat(${dashboardState.layout.columns}, 1fr)`,
    gridTemplateRows: `repeat(${totalRows}, ${dynamicRowHeight}px)`,
    gap: `${dashboardState.layout.gap}px`,
    minHeight: `${totalRows * (dynamicRowHeight + dashboardState.layout.gap)}px`
  };

  const createGridCells = () => {
    const cells = [];
    const { columns } = dashboardState.layout;
    
    for (let row = 0; row < totalRows; row++) {
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
              pointerEvents: 'none',
              opacity: isInteracting ? 1 : 0
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
      data-interacting={isInteracting}
    >
      <div style={widgetContainerStyle}>
        {createGridCells()}
        {React.Children.map(children, child => {
          if (!child) return null;
          
          const { 
            gridPosition = { column: 0, row: 0 }, 
            gridSize = { width: 1, height: 1 }, 
            id,
            minSize,
            maxSize
          } = child.props;
          
          const safeGridPosition = {
            column: Math.max(0, Math.min(gridPosition.column || 0, dashboardState.layout.columns - 1)),
            row: Math.max(0, gridPosition.row || 0)
          };

          const safeGridSize = {
            width: Math.max(1, Math.min(gridSize.width || 1, dashboardState.layout.columns - safeGridPosition.column)),
            height: Math.max(1, gridSize.height || 1)
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
            onResize: (resizeData) => handleWidgetResize(id, { ...resizeData, minSize, maxSize }),
            onDrag: (dragData) => handleWidgetDrag(id, dragData)
          });
        })}
      </div>
    </div>
  );
};

export default Dashboard; 