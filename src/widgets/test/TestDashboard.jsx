import React, { useState, useRef, useEffect } from 'react';
import { WidgetProvider, useWidgets } from '../core/WidgetContext';
import { GlobalSettingsProvider, useGlobalSettings } from '../../context/GlobalSettingsContext';
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

const ColorPicker = ({ colors, activeColor, onColorSelect }) => {
  return (
    <div className="color-grid">
      {colors.map((color, index) => (
        <button
          key={index}
          className={`color-option ${color === activeColor ? 'active' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};

const SettingsPanel = ({ isVisible, onClose }) => {
  const { settings, updateTheme } = useGlobalSettings();
  
  const colors = [
    '#007AFF', '#5856D6', '#FF2D55', '#FF3B30', '#FF9500',
    '#34C759', '#AF52DE', '#FF6482', '#FF9F0A', '#FFD60A',
    '#32ADE6', '#66D4CF', '#FF6482', '#FF9F0A', '#FFD60A',
    '#64D2FF', '#30B0C7', '#FF6482', '#FF9F0A', '#FFD60A',
  ];

  return (
    <>
      <div className={`settings-panel-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose} />
      <div className={`settings-panel ${isVisible ? 'visible' : ''}`}>
        <div className="settings-panel-header">
          <h2 className="settings-panel-title">Settings</h2>
          <button className="settings-panel-close" onClick={onClose} aria-label="Close settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="settings-panel-content">
          <div className="settings-section">
            <h3 className="settings-section-title">Theme Colors</h3>
            <p className="settings-section-description">
              Customize the colors used throughout the dashboard.
            </p>
            <div className="settings-section-content">
              <div className="theme-color-row">
                <span className="theme-color-label">Accent Color</span>
                <div 
                  className="theme-color-preview"
                  style={{ backgroundColor: settings.theme.buttonColor }}
                />
                <span className="theme-color-value">{settings.theme.buttonColor}</span>
              </div>
              <ColorPicker
                colors={colors}
                activeColor={settings.theme.buttonColor}
                onColorSelect={(color) => updateTheme({ buttonColor: color, ringColor: color })}
              />
            </div>
          </div>
          <div className="settings-section">
            <h3 className="settings-section-title">Behavior</h3>
            <p className="settings-section-description">
              Configure how widgets and the dashboard behave.
            </p>
          </div>
          <div className="settings-section">
            <h3 className="settings-section-title">Keyboard Shortcuts</h3>
            <p className="settings-section-description">
              Customize keyboard shortcuts for quick actions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardContent = () => {
  const { widgets, addWidget } = useWidgets();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const handleGlobalSettings = () => {
    setIsSettingsOpen(true);
  };

  return (
    <>
      <div className="test-dashboard-toolbar">
        <div className="test-dashboard-toolbar-left">
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
        <div className="test-dashboard-toolbar-right">
          <button 
            className="global-settings-button"
            onClick={handleGlobalSettings}
            aria-label="Global Settings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="test-dashboard-content">
        <WidgetContainer />
      </div>
      <SettingsPanel 
        isVisible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

const TestDashboard = () => {
  return (
    <GlobalSettingsProvider>
      <WidgetProvider initialWidgets={initialWidgets}>
        <div className="test-dashboard">
          <DashboardContent />
        </div>
      </WidgetProvider>
    </GlobalSettingsProvider>
  );
};

export default TestDashboard; 