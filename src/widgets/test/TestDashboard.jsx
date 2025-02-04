import React, { useState, useRef, useEffect } from 'react';
import { WidgetProvider, useWidgets } from '../core/WidgetContext';
import WidgetContainer from '../components/WidgetContainer';
import { getAvailableWidgets } from '../registry/initializeWidgets';
import './TestDashboard.css';

const initialWidgets = [
  {
    id: 'timer-1',
    type: 'timer',
    size: { width: 5, height: 5 }
  }
];

const DashboardContent = () => {
  const { widgets, addWidget } = useWidgets();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const availableWidgets = getAvailableWidgets();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddWidget = (type) => {
    addWidget(type);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="test-dashboard-toolbar">
        <button 
          ref={buttonRef}
          className="add-widget-button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label="Add Widget"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div ref={dropdownRef} className={`widget-dropdown ${isDropdownOpen ? 'open' : ''}`}>
          {availableWidgets.map(widget => (
            <div
              key={widget.type}
              className="widget-dropdown-item"
              onClick={() => handleAddWidget(widget.type)}
            >
              <div className="widget-dropdown-item-info">
                <div className="widget-dropdown-item-title">{widget.name}</div>
                <div className="widget-dropdown-item-description">{widget.description}</div>
              </div>
              <span className="widget-dropdown-item-size">
                {widget.defaultSize.width}×{widget.defaultSize.height}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="test-dashboard-content">
        <WidgetContainer />
      </div>
    </>
  );
};

const TestDashboard = () => {
  return (
    <WidgetProvider initialWidgets={initialWidgets}>
      <div className="test-dashboard">
        <DashboardContent />
      </div>
    </WidgetProvider>
  );
};

export default TestDashboard; 