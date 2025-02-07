import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './SettingsPortal.css';

const SettingsPortal = ({ children }) => {
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Check if container already exists
    let container = document.getElementById('settings-portal-container');
    
    // Create container if it doesn't exist
    if (!container) {
      container = document.createElement('div');
      container.id = 'settings-portal-container';
      document.body.appendChild(container);
    }

    setPortalContainer(container);

    // Cleanup
    return () => {
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);

  if (!portalContainer) return null;

  return ReactDOM.createPortal(
    <div className="settings-portal">
      {children}
    </div>,
    portalContainer
  );
};

export default SettingsPortal; 