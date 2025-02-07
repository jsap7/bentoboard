import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import ColorPicker from './ColorPicker';

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { theme, setTheme } = useGlobalContext();

  const handleAccentColorChange = (color: string) => {
    setTheme({
      ...theme,
      accentColor: color,
      accentColorHover: adjustColorBrightness(color, -10)
    });
  };

  const adjustColorBrightness = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const clamp = (num: number) => Math.min(255, Math.max(0, num));
    
    const adjustedR = clamp(r + amount);
    const adjustedG = clamp(g + amount);
    const adjustedB = clamp(b + amount);
    
    const toHex = (n: number): string => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
  };

  return (
    <div className="settings-portal">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button className="settings-close" onClick={onClose} aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="settings-content">
        <div className="settings-section">
          <h3 className="settings-section-title">Theme</h3>
          <div className="settings-option">
            <span className="settings-option-label">Accent Color</span>
          </div>
          <ColorPicker
            value={theme.accentColor}
            onChange={handleAccentColorChange}
          />
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Coming Soon</h3>
          <div className="settings-option">
            <span className="settings-option-label">Dark Mode</span>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={theme.mode === 'dark'}
                disabled
                onChange={() => {}}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-option">
            <span className="settings-option-label">Custom Background</span>
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
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 