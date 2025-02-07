import React, { useMemo } from 'react';
import { BaseWidgetProps, CustomCSSProperties } from '../widgets/shared/types';
import { useWidgetState } from '../hooks/useWidgetState';
import SettingsPortal from './SettingsPortal';
import './BaseWidget.css';

const BaseWidget: React.FC<BaseWidgetProps> = ({
  id,
  title,
  style,
  children,
  settings: initialSettings,
  onSettingsChange,
  onResize,
  onDrag,
  onClose,
  gridPosition: initialGridPosition,
  gridSize: initialGridSize,
  SettingsComponent,
  sizeConfig
}) => {
  const [widgetState, updateWidgetState] = useWidgetState({
    id,
    initialGridPosition,
    initialGridSize,
    initialSettings,
  });

  const [showSettings, setShowSettings] = React.useState(false);

  // Get size configuration based on current dimensions
  const currentSizeConfig = useMemo(() => 
    sizeConfig?.getSizeConfig(widgetState.gridSize.width, widgetState.gridSize.height),
    [sizeConfig, widgetState.gridSize.width, widgetState.gridSize.height]
  );

  // Calculate grid size attribute and category
  const gridSizeAttribute = `${widgetState.gridSize.width}x${widgetState.gridSize.height}`;
  const categoryAttribute = currentSizeConfig?.category;

  // Handle position and size changes
  const handleResize = (newSize: typeof initialGridSize) => {
    updateWidgetState({ gridSize: newSize });
    if (onResize) {
      onResize(newSize);
    }
  };

  const handleDrag = (newPosition: typeof initialGridPosition) => {
    updateWidgetState({ gridPosition: newPosition });
    if (onDrag) {
      onDrag(newPosition);
    }
  };

  // Handle settings changes
  const handleSettingsChange = (newSettings: any) => {
    updateWidgetState({ settings: newSettings });
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Calculate content style based on grid size and size config
  const contentStyle = useMemo(() => {
    const baseStyle: CustomCSSProperties = {
      '--grid-width': widgetState.gridSize.width,
      '--grid-height': widgetState.gridSize.height,
      gridColumn: `${widgetState.gridPosition.column + 1} / span ${widgetState.gridSize.width}`,
      gridRow: `${widgetState.gridPosition.row + 1} / span ${widgetState.gridSize.height}`,
      ...style
    };

    // Add any size-specific styles from the config
    if (currentSizeConfig?.styles) {
      Object.assign(baseStyle, currentSizeConfig.styles);
    }

    return baseStyle;
  }, [widgetState.gridSize, widgetState.gridPosition, style, currentSizeConfig]);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  return (
    <>
      <div 
        className="widget"
        style={contentStyle}
        data-widget-id={id}
        data-grid-size={gridSizeAttribute}
        data-size-category={categoryAttribute}
      >
        <div className="widget-header">
          <div className="widget-header-left">
            <div 
              className="widget-drag-handle"
              onMouseDown={(e) => {
                const widgetElement = e.currentTarget.closest('.widget');
                if (!widgetElement) return;

                const dashboardElement = document.querySelector('.dashboard');
                if (!dashboardElement) return;

                const widgetRect = widgetElement.getBoundingClientRect();
                const dashboardRect = dashboardElement.getBoundingClientRect();

                const offsetX = e.clientX - widgetRect.left;
                const offsetY = e.clientY - widgetRect.top;

                const handleMouseMove = (e: MouseEvent) => {
                  const mouseX = e.clientX - dashboardRect.left;
                  const mouseY = e.clientY - dashboardRect.top;

                  const adjustedX = mouseX - offsetX;
                  const adjustedY = mouseY - offsetY;

                  if (onDrag) {
                    const newPosition = onDrag({
                      mouseX: adjustedX,
                      mouseY: adjustedY,
                      startPosition: widgetState.gridPosition,
                      size: widgetState.gridSize,
                      widgetRect,
                      dashboardRect
                    });

                    if (newPosition) {
                      handleDrag(newPosition);
                    }
                  }
                };

                const handleMouseUp = () => {
                  window.removeEventListener('mousemove', handleMouseMove);
                  window.removeEventListener('mouseup', handleMouseUp);
                  widgetElement.style.zIndex = '';
                  widgetElement.classList.remove('dragging');
                };

                widgetElement.style.zIndex = '1000';
                widgetElement.classList.add('dragging');
                window.addEventListener('mousemove', handleMouseMove);
                window.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 9h8M8 15h8" />
              </svg>
            </div>
            <div className="widget-title">{title}</div>
          </div>
          <div className="widget-controls">
            {SettingsComponent && (
              <button 
                className="widget-control settings"
                onClick={handleSettingsClick}
                title="Settings"
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
                title="Close"
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
        {/* Resize handles */}
        {['se', 'sw', 'ne', 'nw'].map((position) => (
          <div
            key={position}
            className={`resize-handle resize-handle-${position}`}
            onMouseDown={(e) => {
              e.preventDefault();
              const widgetElement = e.currentTarget.closest('.widget');
              if (!widgetElement) return;

              const startX = e.clientX;
              const startY = e.clientY;
              const startSize = { ...widgetState.gridSize };
              const widgetRect = widgetElement.getBoundingClientRect();

              const direction = {
                isLeft: position.includes('w'),
                isTop: position.includes('n'),
                isRight: position.includes('e'),
                isBottom: position.includes('s')
              };

              const handleMouseMove = (e: MouseEvent) => {
                if (onResize) {
                  const newSize = onResize({
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    startPosition: widgetState.gridPosition,
                    startSize,
                    direction,
                    widgetRect
                  });

                  if (newSize) {
                    handleResize(newSize);
                  }
                }
              };

              const handleMouseUp = () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                widgetElement.classList.remove('resizing');
              };

              widgetElement.classList.add('resizing');
              window.addEventListener('mousemove', handleMouseMove);
              window.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="resize-handle-dot" />
          </div>
        ))}
      </div>
      {SettingsComponent && showSettings && (
        <SettingsPortal>
          <SettingsComponent
            settings={widgetState.settings}
            onSettingsChange={handleSettingsChange}
            onClose={handleSettingsClose}
            availableModes={currentSizeConfig?.availableModes}
          />
        </SettingsPortal>
      )}
    </>
  );
};

export default BaseWidget; 