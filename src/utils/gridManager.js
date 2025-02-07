/**
 * Calculate the dimensions of a grid cell based on container width and grid settings
 * @param {number} containerWidth - Width of the dashboard container
 * @param {Object} layout - Layout configuration object
 * @returns {Object} Cell dimensions { width, height }
 */
export const getCellDimensions = (containerWidth, layout) => {
  const { columns, rowHeight, gap } = layout;
  const totalGapWidth = gap * (columns - 1);
  const cellWidth = (containerWidth - totalGapWidth) / columns;

  return {
    width: cellWidth,
    height: rowHeight
  };
};

/**
 * Snap a position to the nearest grid point
 * @param {Object} position - Current position { x, y }
 * @param {Object} cellDimensions - Dimensions of a grid cell
 * @param {Object} layout - Layout configuration object
 * @returns {Object} Snapped position { x, y }
 */
export const snapToGrid = (position, cellDimensions, layout) => {
  const { width, height } = cellDimensions;
  const { gap } = layout;

  const snapToNearest = (value, gridSize) => {
    const cellWithGap = gridSize + gap;
    return Math.round(value / cellWithGap) * cellWithGap;
  };

  return {
    x: snapToNearest(position.x, width),
    y: snapToNearest(position.y, height)
  };
};

/**
 * Convert grid coordinates to pixel values
 * @param {Object} gridPosition - Position in grid units { column, row }
 * @param {Object} cellDimensions - Dimensions of a grid cell
 * @param {Object} layout - Layout configuration object
 * @returns {Object} Pixel position { x, y }
 */
export const gridToPixels = (gridPosition, cellDimensions, layout) => {
  const { width, height } = cellDimensions;
  const { gap } = layout;

  return {
    x: gridPosition.column * (width + gap),
    y: gridPosition.row * (height + gap)
  };
}; 