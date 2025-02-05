import React, { useState, useEffect } from 'react';
import './BaseWidgetSettings.css';
import PropTypes from 'prop-types';

const BaseWidgetSettings = ({ 
  onClose, 
  title = "Widget Settings", 
  children,
  settings,
  onSettingsChange 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Clone children and inject settings props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        settings,
        onSettingsChange
      });
    }
    return child;
  });

  return (
    <div 
      className={`settings-overlay ${isVisible ? 'visible' : ''}`} 
      onClick={handleOverlayClick}
    >
      <div 
        className={`settings-sidebar ${isVisible ? 'visible' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">{title}</h2>
          <button 
            className="settings-close" 
            onClick={handleClose} 
            aria-label="Close settings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="settings-content">
          {childrenWithProps}
        </div>
      </div>
    </div>
  );
};

BaseWidgetSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  settings: PropTypes.object,
  onSettingsChange: PropTypes.func
};

export default BaseWidgetSettings; 