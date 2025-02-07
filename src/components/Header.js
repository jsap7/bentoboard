import React, { useState, useEffect } from 'react';
import { useGlobalContext, availableFonts } from '../contexts/GlobalContext';
import { listWidgets } from '../registry/widgetRegistry';
import { FiSettings, FiPlus, FiX } from 'react-icons/fi';
import './Header.css';

const Header = ({ onAddWidget }) => {
  const { theme, setTheme } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const widgets = listWidgets();

  // Load font on mount and when font changes
  useEffect(() => {
    if (theme?.font?.family) {
      const selectedFont = availableFonts.find(f => f.family === theme.font.family);
      if (selectedFont) {
        // Remove any existing font link
        const existingLink = document.head.querySelector('link[data-font-link]');
        if (existingLink) {
          existingLink.remove();
        }
        
        // Add new font link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = selectedFont.url;
        link.setAttribute('data-font-link', '');
        document.head.appendChild(link);

        // Update CSS variable for global font
        document.documentElement.style.setProperty('--font-primary', `'${selectedFont.family}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`);
      }
    }
  }, [theme?.font?.family]);

  const handleAccentColorChange = (color) => {
    setTheme(prev => ({
      ...prev,
      accentColor: color
    }));
  };

  const handleFontChange = (fontFamily) => {
    const selectedFont = availableFonts.find(f => f.family === fontFamily);
    if (selectedFont) {
      setTheme(prev => ({
        ...prev,
        font: {
          ...prev.font,
          family: fontFamily
        }
      }));
    }
  };

  return (
    <header className="dashboard-header" style={{ backgroundColor: theme?.header }}>
      <div className="header-content">
        <div className="header-left">
          <div className="widget-dropdown-container">
            <button 
              className={`add-widget-button ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Add Widget"
            >
              <FiPlus />
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
                      <FiX />
                    </button>
                  </div>
                  <div className="widget-list">
                    {widgets.map(([id, config]) => {
                      const Icon = config.icon;
                      return (
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
                              <div className="widget-option-title">
                                {Icon && <Icon className="widget-option-icon" />}
                                <h3>{config.title}</h3>
                              </div>
                            </div>
                            <p>{config.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="header-title">BENTOBOARD</div>

        <div className="header-right">
          <div className="settings-dropdown-container">
            <button
              className={`settings-button ${isSettingsOpen ? 'active' : ''}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Settings"
            >
              <FiSettings />
            </button>

            {isSettingsOpen && (
              <>
                <div 
                  className="dropdown-backdrop"
                  onClick={() => setIsSettingsOpen(false)}
                />
                <div className="settings-dropdown">
                  <div className="widget-dropdown-header">
                    <h2>Settings</h2>
                    <button 
                      className="close-dropdown"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <FiX />
                    </button>
                  </div>
                  <div className="settings-content">
                    <div className="settings-section">
                      <h3 className="settings-section-title">Appearance</h3>
                      <div className="settings-option">
                        <span className="settings-option-label">Font</span>
                        <div className="font-options">
                          {availableFonts.map((font) => (
                            <button
                              key={font.family}
                              className={`font-option ${theme?.font?.family === font.family ? 'active' : ''}`}
                              onClick={() => handleFontChange(font.family)}
                              style={{ fontFamily: font.family }}
                            >
                              {font.family}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="settings-option">
                        <span className="settings-option-label">Accent Color</span>
                        <div className="color-options">
                          {[
                            { color: '#6366f1', name: 'Indigo' },
                            { color: '#818cf8', name: 'Blue' },
                            { color: '#38bdf8', name: 'Sky Blue' },
                            { color: '#0891b2', name: 'Ocean Blue' },
                            { color: '#06b6d4', name: 'Cyan' },
                            { color: '#2dd4bf', name: 'Teal' },
                            { color: '#34d399', name: 'Emerald' },
                            { color: '#16a34a', name: 'Forest Green' },
                            { color: '#84cc16', name: 'Lime' },
                            { color: '#fbbf24', name: 'Amber' },
                            { color: '#f97316', name: 'Orange' },
                            { color: '#fb7185', name: 'Rose' },
                            { color: '#f43f5e', name: 'Red' },
                            { color: '#dc2626', name: 'Crimson' },
                            { color: '#ec4899', name: 'Pink' },
                            { color: '#8b5cf6', name: 'Purple' },
                            { color: '#9333ea', name: 'Royal Purple' },
                            { color: '#a78bfa', name: 'Violet' },
                            { color: '#c084fc', name: 'Lavender' },
                            { color: '#e879f9', name: 'Magenta' }
                          ].map(({ color, name }) => (
                            <button
                              key={color}
                              className={`color-option ${theme?.accentColor === color ? 'active' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => handleAccentColorChange(color)}
                              aria-label={`Set accent color to ${name}`}
                              title={name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="settings-section">
                      <h3 className="settings-section-title">Coming Soon</h3>
                      <div className="settings-option">
                        <span className="settings-option-label">Light Mode</span>
                        <label className="settings-switch">
                          <input
                            type="checkbox"
                            checked={false}
                            disabled
                            onChange={() => {}}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <div className="settings-option">
                        <span className="settings-option-label">Alternative Grid Sizes</span>
                        <select className="settings-select" disabled>
                          <option value="default">Current (12×6)</option>
                          <option value="compact">Coming Soon: Compact (8×4)</option>
                          <option value="large">Coming Soon: Large (16×8)</option>
                          <option value="ultrawide">Coming Soon: Ultrawide (21:9)</option>
                        </select>
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