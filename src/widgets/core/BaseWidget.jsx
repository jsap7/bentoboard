import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  settings = {}
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (onMinimize) {
      onMinimize(!isMinimized);
    }
  };

  return (
    <div className={`widget ${className || ''} ${isMinimized ? 'minimized' : ''}`}>
      <div className="widget-header">
        <div className="widget-title">{title}</div>
        <div className="widget-controls">
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
  );
};

BaseWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isResizable: PropTypes.bool,
  isMinimizable: PropTypes.bool,
  onMinimize: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  settings: PropTypes.object
};

export default BaseWidget; 