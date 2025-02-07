import React from 'react';
import { listWidgets } from '../registry/widgetRegistry';

const WidgetSelector = ({ onSelect, onClose }) => {
  const widgets = listWidgets();

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const menuStyle = {
    backgroundColor: '#2d2d2d',
    borderRadius: '12px',
    padding: '24px',
    minWidth: '300px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  };

  const titleStyle = {
    color: '#ffffff',
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: '600',
  };

  const widgetListStyle = {
    display: 'grid',
    gap: '12px',
  };

  const widgetItemStyle = {
    backgroundColor: '#3d3d3d',
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={menuStyle} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>Add Widget</div>
        <div style={widgetListStyle}>
          {widgets.map(([id, config]) => (
            <div
              key={id}
              style={widgetItemStyle}
              onClick={() => onSelect(id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#4d4d4d';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3d3d3d';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>{config.title}</h3>
              <p style={{ color: '#999999', margin: 0, fontSize: '14px' }}>{config.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetSelector; 