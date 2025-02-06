import React from 'react';
import PropTypes from 'prop-types';
import BaseWidgetSettings from '../../core/BaseWidgetSettings';
import './styles/CalculatorSettings.css';

const CalculatorSettings = ({ settings = {}, onSettingsChange, onClose }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <BaseWidgetSettings onClose={onClose} title="Calculator Settings">
      <div className="calculator-settings">
        <div className="settings-section">
          <h3>Display</h3>
          <div className="setting-item">
            <label>Show Memory Buttons</label>
            <input
              type="checkbox"
              checked={settings.showMemory !== false}
              onChange={(e) => handleSettingChange('showMemory', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Show History</label>
            <input
              type="checkbox"
              checked={settings.showHistory !== false}
              onChange={(e) => handleSettingChange('showHistory', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Sound</h3>
          <div className="setting-item">
            <label>Button Click Sound</label>
            <input
              type="checkbox"
              checked={settings.buttonSound !== false}
              onChange={(e) => handleSettingChange('buttonSound', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Precision</h3>
          <div className="setting-item">
            <label>Decimal Places</label>
            <select
              value={settings.decimalPlaces || 2}
              onChange={(e) => handleSettingChange('decimalPlaces', Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>
        </div>
      </div>
    </BaseWidgetSettings>
  );
};

CalculatorSettings.propTypes = {
  settings: PropTypes.shape({
    showMemory: PropTypes.bool,
    showHistory: PropTypes.bool,
    buttonSound: PropTypes.bool,
    decimalPlaces: PropTypes.number
  }),
  onSettingsChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CalculatorSettings; 