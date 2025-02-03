import React, { useState, useEffect } from 'react';
import { useSettings, InputMethods } from '../../context/SettingsContext.jsx';
import './Settings.css';

const Settings = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  const handleInputMethodChange = (e) => {
    updateSettings({
      ...settings,
      inputMethod: e.target.value
    });
  };

  const handleThemeChange = (color) => {
    updateSettings({
      ...settings,
      theme: {
        ...settings.theme,
        buttonColor: color
      }
    });
  };

  const colors = [
    // Reds
    '#FF0000', // Pure Red
    '#FF3333', // Bright Red
    '#FF4D4D', // Vibrant Red
    '#FF6666', // Strong Red
    '#FF8080', // Light Red
    
    // Oranges  
    '#FF8C00', // Dark Orange
    '#FFA033', // Strong Orange
    '#FFB347', // Bright Orange
    '#FFC266', // Vibrant Orange
    '#FFD180', // Light Orange
    
    // Yellows
    '#FFD700', // Golden Yellow
    '#FFDD33', // Strong Yellow
    '#FFE347', // Bright Yellow
    '#FFE866', // Vibrant Yellow
    '#FFED80', // Light Yellow
    
    // Greens
    '#32CD32', // Pure Green
    '#47D147', // Strong Green
    '#5CD65C', // Bright Green
    '#70DB70', // Vibrant Green
    '#85E085', // Light Green
    
    // Blues
    '#1E90FF', // Pure Blue
    '#3D9EFF', // Strong Blue
    '#5CACFF', // Bright Blue
    '#7ABAFF', // Vibrant Blue
    '#99C9FF', // Light Blue
    
    // Violets
    '#8A2BE2', // Pure Violet
    '#9D44E6', // Strong Violet
    '#AF5DEA', // Bright Violet
    '#C176EE', // Vibrant Violet
    '#D38FF2', // Light Violet
  ];

  return (
    <div className={`settings-overlay ${isVisible ? 'visible' : ''}`} onClick={handleClose}>
      <div 
        className={`settings-sidebar ${isVisible ? 'visible' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button className="settings-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Input Method</h3>
          <div className="settings-option">
            <select 
              value={settings.inputMethod} 
              onChange={handleInputMethodChange}
            >
              <option value={InputMethods.SCROLL}>Scroll Wheel</option>
              <option value={InputMethods.DIRECT}>Direct Input</option>
              <option value={InputMethods.DIAL}>Timer Dial</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Theme Color</h3>
          <div className="color-options">
            {colors.map(color => (
              <button
                key={color}
                className={`color-option ${color === settings.theme.buttonColor ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleThemeChange(color)}
                aria-label={`Select ${color} theme`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 