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
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) {
      onMinimize(!isMinimized);
    }
  };

  const handleSettingsChange = (newSettings) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        ...newSettings
      });
    }
  };

  return (
    <>
      <div className={`widget ${className || ''} ${isMinimized ? 'minimized' : ''}`}>
        <div className="widget-header">
          <div className="widget-title">{title}</div>
          <div className="widget-controls">
            {SettingsComponent && (
              <button 
                className="widget-control settings"
                onClick={() => setShowSettings(true)}
                aria-label="Widget Settings"
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
                {isMinimized ? '□' : '−'}
              </button>
            )}
            {onClose && (
              <button 
                className="widget-control close"
                onClick={onClose}
                aria-label="Close"
              >
                ×
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