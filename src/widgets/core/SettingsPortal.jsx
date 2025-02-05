import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const SettingsPortal = ({ children }) => {
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Check if container already exists
    let container = document.getElementById('settings-portal-container');
    
    // Create container if it doesn't exist
    if (!container) {
      container = document.createElement('div');
      container.id = 'settings-portal-container';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '100000';
      container.style.pointerEvents = 'auto';
      document.body.appendChild(container);
    }

    setPortalContainer(container);

    // Cleanup
    return () => {
      if (container && !container.children.length) {
        document.body.removeChild(container);
      }
    };
  }, []);

  if (!portalContainer) return null;

  return ReactDOM.createPortal(children, portalContainer);
};

SettingsPortal.propTypes = {
  children: PropTypes.node.isRequired
};

export default SettingsPortal; 