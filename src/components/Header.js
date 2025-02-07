import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';

const Header = ({ onAddWidget }) => {
  const { theme } = useGlobalContext();

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    backgroundColor: theme.header,
    color: theme.text,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    zIndex: 1000
  };

  const buttonStyle = {
    backgroundColor: theme.surface,
    color: theme.text,
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: '#3d3d3d'
    }
  };

  return (
    <header style={headerStyle}>
      <button 
        style={buttonStyle} 
        onClick={onAddWidget}
        className="add-widget-button"
      >
        + Add Widget
      </button>
      <button style={buttonStyle} onClick={() => console.log('Settings clicked')}>
        ⚙️ Settings
      </button>
    </header>
  );
};

export default Header; 