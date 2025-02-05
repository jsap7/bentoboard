import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SettingsPortal from './SettingsPortal';
import './BaseWidget.css';

const BaseWidget = ({ 
  id,
  title,
  isResizable = true,
  isMinimizable = true,
  onMinimize,
  onClose,
  children,
  className,
  settings = {},
  onSettingsChange,
  SettingsComponent
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleSettingsChange = (newSettings) => {
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const handleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    if (onMinimize) {
      onMinimize(newState);
    }
  };

  return (
    <>
      <div className={`widget ${className || ''} ${isMinimized ? 'minimized' : ''} ${showSettings ? 'settings-open' : ''}`}>
        <div className="widget-header">
          <div className="widget-title">{title}</div>
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
            {isMinimizable && (
              <button 
                className="widget-control minimize"
                onClick={handleMinimize}
                aria-label={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3h8m-8 0v3m0-3H3m5 18h8m-8 0v-3m0 3H3m18-5h-3m3 0v-8m0 8v5m0-13h-3m3 0v-5M3 8v8m0-8h3m-3 8h3" />
                  </svg>
                )}
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
      </div>
      {SettingsComponent && showSettings && (
        <SettingsPortal>
          <SettingsComponent 
            title={`${title} Settings`}
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onClose={() => setShowSettings(false)} 
          />
        </SettingsPortal>
      )}
    </>
  );
};

BaseWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isResizable: PropTypes.bool,
  isMinimizable: PropTypes.bool,
  onMinimize: PropTypes.func,
  onClose: PropTypes.func,
  onSettingsChange: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  settings: PropTypes.object,
  SettingsComponent: PropTypes.elementType
};

export default BaseWidget; 