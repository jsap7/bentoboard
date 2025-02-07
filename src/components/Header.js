import React, { useState, useEffect } from 'react';
import { useGlobalContext, availableFonts } from '../context/GlobalContext';
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
                    <h2>Global Settings</h2>
                    <button 
                      className="close-dropdown"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <FiX />
                    </button>
                  </div>
                  <div className="settings-content">
                    <div className="settings-section">
                      <h3>Theme</h3>
                      <div className="settings-option">
                        <label>Font Family</label>
                        <div className="font-options">
                          {availableFonts.map((font) => (
                            <button
                              key={font.family}
                              className={`font-option ${theme?.font?.family === font.family ? 'active' : ''}`}
                              onClick={() => handleFontChange(font.family)}
                              style={{ fontFamily: font.family }}
                            >
                              <span className="font-name">{font.family}</span>
                              <span className="font-preview">The quick brown fox</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="settings-option">
                        <label>Accent Color</label>
                        <div className="color-options">
                          {['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#84cc16', '#06b6d4'].map(color => (
                            <button
                              key={color}
                              className={`color-option ${theme?.accentColor === color ? 'active' : ''}`}
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