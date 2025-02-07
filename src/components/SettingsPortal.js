import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useGlobalContext } from '../contexts/GlobalContext';
import './SettingsPortal.css';

const SettingsPortal = ({ children, onClose }) => {
  const [portalContainer, setPortalContainer] = useState(null);
  const { theme } = useGlobalContext();

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
    <div 
      className="settings-portal"
      style={{ '--accent-color': theme.accentColor }}
    >
      {children}
    </div>,
    portalContainer
  );
};

export default SettingsPortal; 