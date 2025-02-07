import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { listWidgets } from '../registry/widgetRegistry';
import './Header.css';

const Header = ({ onAddWidget }) => {
  const { theme, setTheme } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const widgets = listWidgets();

  const handleAccentColorChange = (color) => {
    setTheme(prev => ({
      ...prev,
      accentColor: color
    }));
  };

  return (
    <header className="dashboard-header" style={{ backgroundColor: theme.header }}>
      <div className="header-content">
        <div className="header-left">
          <div className="widget-dropdown-container">
            <button 
              className={`add-widget-button ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Add Widget"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="dropdown-backdrop"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="widget-dropdown">
                  <div className="widget-dropdown-header">
                    <h2>Add Widget</h2>
                    <button 
                      className="close-dropdown"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="widget-list">
                    {widgets.map(([id, config]) => (
                      <button
                        key={id}
                        className="widget-option"
                        onClick={() => {
                          onAddWidget(id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="widget-option-content">
                          <div className="widget-option-header">
                            <h3>{config.title}</h3>
                            <span className="widget-size">
                              {config.defaultSize.width}x{config.defaultSize.height}
                            </span>
                          </div>
                          <p>{config.description}</p>
                        </div>
                        <div className="widget-option-arrow">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="header-right">
          <div className="settings-dropdown-container">
            <button
              className={`settings-button ${isSettingsOpen ? 'active' : ''}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Settings"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </button>

            {isSettingsOpen && (
              <>
                <div 
                  className="dropdown-backdrop"
                  onClick={() => setIsSettingsOpen(false)}
                />
                <div className="settings-dropdown">
                  <div className="widget-dropdown-header">
                    <h2>Global Settings</h2>
                    <button 
                      className="close-dropdown"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="settings-content">
                    <div className="settings-section">
                      <h3>Theme</h3>
                      <div className="settings-option">
                        <label>Accent Color</label>
                        <div className="color-options">
                          {['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#84cc16', '#06b6d4'].map(color => (
                            <button
                              key={color}
                              className={`color-option ${theme.accentColor === color ? 'active' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleAccentColorChange(color)}
                              aria-label={`Set accent color to ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 