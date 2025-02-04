import React, { useState, useEffect } from 'react';
import './BaseWidgetSettings.css';
import PropTypes from 'prop-types';

const BaseWidgetSettings = ({ onClose, title = "Widget Settings", children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  return (
    <div className={`settings-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div 
        className={`settings-sidebar ${isVisible ? 'visible' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">{title}</h2>
          <button className="settings-close" onClick={handleClose} aria-label="Close settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="settings-content">
          {children}
        </div>
      </div>
    </div>
  );
};

BaseWidgetSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node
};

export default BaseWidgetSettings; 