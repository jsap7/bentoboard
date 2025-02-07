import React, { useState } from 'react';
import { BaseWidgetProps } from '../shared/types';
import './BaseWidget.css';

const BaseWidget: React.FC<BaseWidgetProps> = ({
  id,
  title,
  style,
  children,
  settings,
  onSettingsChange,
  onResize,
  onDrag,
  onClose,
  gridPosition,
  gridSize,
  SettingsComponent
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const gridSizeAttribute = `${gridSize.width}x${gridSize.height}`;
  
  console.log(`Widget ${id} grid size:`, gridSizeAttribute);

  const combinedStyle = {
    ...style,
    gridColumn: `${gridPosition.column + 1} / span ${gridSize.width}`,
    gridRow: `${gridPosition.row + 1} / span ${gridSize.height}`,
    '--grid-width': gridSize.width,
    '--grid-height': gridSize.height
  } as React.CSSProperties;

  return (
    <div
      className="widget"
      data-widget-id={id}
      data-grid-size={gridSizeAttribute}
      style={combinedStyle}
    >
      <div className="widget-header">
        <div className="widget-header-left">
          <div className="widget-drag-handle">
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
      {showSettings && SettingsComponent && (
        <div className="widget-settings-overlay">
          <SettingsComponent
            settings={settings}
            onSettingsChange={onSettingsChange!}
            onClose={handleSettingsClose}
          />
        </div>
      )}
      <div className="resize-handle resize-handle-se">
        <div className="resize-handle-dot" />
      </div>
      <div className="resize-handle resize-handle-sw">
        <div className="resize-handle-dot" />
      </div>
      <div className="resize-handle resize-handle-ne">
        <div className="resize-handle-dot" />
      </div>
      <div className="resize-handle resize-handle-nw">
        <div className="resize-handle-dot" />
      </div>
    </div>
  );
};

export default BaseWidget; 