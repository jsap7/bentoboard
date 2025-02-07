import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { 
  BaseWidgetProps, 
  CustomCSSProperties, 
  DragEventData, 
  ResizeEventData,
  BaseSizeConfig,
  GridSize,
  GridPosition
} from '../widgets/shared/types';
import { useWidgetState } from '../hooks/useWidgetState';
import SettingsPortal from './SettingsPortal';
import { useGlobalContext } from '../contexts/GlobalContext';
import './BaseWidget.css';

const getDefaultSizeConfig = (width: number, height: number): BaseSizeConfig<'default'> => ({
  category: width === 1 && height === 1 ? 'tiny' :
           (width === 2 && height === 1) || (width === 1 && height === 2) ? 'small' :
           width === 2 && height === 2 ? 'medium' :
           (width === 3 && height === 2) || (width === 2 && height === 3) ? 'large' : 'xlarge',
  availableModes: ['default'],
  defaultMode: 'default',
  styles: {
    padding: width === 1 && height === 1 ? '0.5rem' :
            (width === 2 && height === 1) || (width === 1 && height === 2) ? '0.75rem' :
            width === 2 && height === 2 ? '1rem' :
            (width === 3 && height === 2) || (width === 2 && height === 3) ? '1.25rem' : '1.5rem',
    gap: '0.5rem',
    fontSize: '1rem'
  }
});

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
  const { theme } = useGlobalContext();
  const [widgetState, updateWidgetState] = useWidgetState({
    id,
    initialGridPosition,
    initialGridSize,
    initialSettings,
  });

  const [showSettings, setShowSettings] = React.useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Get size configuration based on current dimensions
  const currentSizeConfig = useMemo(() => 
    sizeConfig?.getSizeConfig(widgetState.gridSize.width, widgetState.gridSize.height) ||
    getDefaultSizeConfig(widgetState.gridSize.width, widgetState.gridSize.height),
    [sizeConfig, widgetState.gridSize.width, widgetState.gridSize.height]
  );

  // Calculate grid size attribute and category
  const gridSizeAttribute = `${widgetState.gridSize.width}x${widgetState.gridSize.height}`;
  const categoryAttribute = currentSizeConfig.category;

  // Handle position and size changes
  const handleResize = (newSize: GridSize) => {
    updateWidgetState({ gridSize: newSize });
  };

  const handleDrag = (newPosition: GridPosition) => {
    updateWidgetState({ gridPosition: newPosition });
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
      '--widget-padding': currentSizeConfig.styles.padding,
      '--content-gap': currentSizeConfig.styles.gap,
      '--font-size': currentSizeConfig.styles.fontSize,
      gridColumn: `${widgetState.gridPosition.column + 1} / span ${widgetState.gridSize.width}`,
      gridRow: `${widgetState.gridPosition.row + 1} / span ${widgetState.gridSize.height}`,
      ...style
    };

    // Add any additional size-specific styles from the config
    if (currentSizeConfig.styles) {
      Object.entries(currentSizeConfig.styles).forEach(([key, value]) => {
        if (!['padding', 'gap', 'fontSize'].includes(key)) {
          baseStyle[`--${key}`] = value;
        }
      });
    }

    return baseStyle;
  }, [widgetState.gridSize, widgetState.gridPosition, style, currentSizeConfig]);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  useEffect(() => {
    // Update CSS variables when theme changes
    const widget = document.documentElement;
    widget.style.setProperty('--theme-accent-color', theme.accentColor);
    widget.style.setProperty('--theme-accent-color-hover', theme.accentColorHover || adjustColor(theme.accentColor, -10));
    widget.style.setProperty('--theme-background', theme.background);
    widget.style.setProperty('--theme-surface', theme.surface);
    widget.style.setProperty('--theme-text', theme.text);
  }, [theme]);

  const adjustColor = (color: string, amount: number): string => {
    const clamp = (num: number): number => Math.min(255, Math.max(0, num));
    
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust each channel
    const adjustedR = clamp(r + amount);
    const adjustedG = clamp(g + amount);
    const adjustedB = clamp(b + amount);
    
    // Convert back to hex
    const toHex = (n: number): string => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
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
                const widgetElement = e.currentTarget.closest('.widget') as HTMLElement;
                if (!widgetElement) return;

                const dashboardElement = document.querySelector('.dashboard') as HTMLElement;
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
                    const dragData: DragEventData = {
                      mouseX: adjustedX,
                      mouseY: adjustedY,
                      startPosition: widgetState.gridPosition,
                      size: widgetState.gridSize,
                      widgetRect,
                      dashboardRect
                    };

                    const newPosition = onDrag(dragData);
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
              const widgetElement = e.currentTarget.closest('.widget') as HTMLElement;
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
                  const resizeData: ResizeEventData = {
                    mouseX: e.clientX,
                    mouseY: e.clientY,
                    startPosition: widgetState.gridPosition,
                    startSize,
                    direction,
                    widgetRect
                  };

                  const newSize = onResize(resizeData);
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
        <SettingsPortal onClose={handleSettingsClose}>
          <SettingsComponent
            settings={widgetState.settings}
            onSettingsChange={handleSettingsChange}
            onClose={handleSettingsClose}
            availableModes={currentSizeConfig.availableModes}
          />
        </SettingsPortal>
      )}
    </>
  );
};

export default BaseWidget; 