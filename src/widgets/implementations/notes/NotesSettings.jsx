import React from 'react';
import PropTypes from 'prop-types';
import BaseWidgetSettings from '../../core/BaseWidgetSettings';
import './styles/NotesSettings.css';

const FONT_FAMILIES = [
  'monospace',
  'system-ui',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman'
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24];
const LINE_HEIGHTS = [1, 1.2, 1.5, 1.8, 2];

const NotesSettings = ({ settings = {}, onSettingsChange, onClose }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <BaseWidgetSettings onClose={onClose} title="Notes Settings">
      <div className="notes-settings">
        <div className="settings-section">
          <h3>Text</h3>
          <div className="setting-item">
            <label>Font Family</label>
            <select
              value={settings.fontFamily || 'monospace'}
              onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
            >
              {FONT_FAMILIES.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div className="setting-item">
            <label>Font Size</label>
            <select
              value={settings.fontSize || 14}
              onChange={(e) => handleSettingChange('fontSize', Number(e.target.value))}
            >
              {FONT_SIZES.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>
          <div className="setting-item">
            <label>Line Height</label>
            <select
              value={settings.lineHeight || 1.5}
              onChange={(e) => handleSettingChange('lineHeight', Number(e.target.value))}
            >
              {LINE_HEIGHTS.map(height => (
                <option key={height} value={height}>{height}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Editor</h3>
          <div className="setting-item">
            <label>Spell Check</label>
            <input
              type="checkbox"
              checked={settings.spellCheck !== false}
              onChange={(e) => handleSettingChange('spellCheck', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section preview">
          <h3>Preview</h3>
          <div 
            className="text-preview"
            style={{
              fontFamily: settings.fontFamily || 'monospace',
              fontSize: `${settings.fontSize || 14}px`,
              lineHeight: settings.lineHeight || 1.5
            }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      </div>
    </BaseWidgetSettings>
  );
};

NotesSettings.propTypes = {
  settings: PropTypes.shape({
    fontSize: PropTypes.number,
    fontFamily: PropTypes.string,
    lineHeight: PropTypes.number,
    spellCheck: PropTypes.bool
  }),
  onSettingsChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default NotesSettings; 