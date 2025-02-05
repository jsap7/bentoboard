import React from 'react';
import PropTypes from 'prop-types';
import BaseWidgetSettings from '../../core/BaseWidgetSettings';
import './ClockSettings.css';

const ClockSettings = ({ settings = {}, onSettingsChange, onClose, title }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <BaseWidgetSettings onClose={onClose} title={title}>
      <div className="clock-settings">
        <div className="settings-section">
          <h3>Time Display</h3>
          <div className="setting-item">
            <label>Time Format</label>
            <select 
              value={settings.is24Hour ? '24h' : '12h'}
              onChange={(e) => handleSettingChange('is24Hour', e.target.value === '24h')}
            >
              <option value="12h">12-hour</option>
              <option value="24h">24-hour</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Show Seconds</label>
            <input
              type="checkbox"
              checked={settings.showSeconds ?? true}
              onChange={(e) => handleSettingChange('showSeconds', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Date Display</h3>
          <div className="setting-item">
            <label>Show Date</label>
            <input
              type="checkbox"
              checked={settings.showDate ?? true}
              onChange={(e) => handleSettingChange('showDate', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Weekday Format</label>
            <select
              value={settings.weekdayFormat ?? 'long'}
              onChange={(e) => handleSettingChange('weekdayFormat', e.target.value)}
              disabled={!settings.showDate}
            >
              <option value="long">Full (Wednesday)</option>
              <option value="short">Short (Wed)</option>
              <option value="narrow">Narrow (W)</option>
              <option value="none">Hide</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Month Format</label>
            <select
              value={settings.monthFormat ?? 'long'}
              onChange={(e) => handleSettingChange('monthFormat', e.target.value)}
              disabled={!settings.showDate}
            >
              <option value="long">Full (February)</option>
              <option value="short">Short (Feb)</option>
              <option value="narrow">Narrow (F)</option>
              <option value="numeric">Numeric (2)</option>
              <option value="2-digit">2-digit (02)</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Year Format</label>
            <select
              value={settings.yearFormat ?? 'numeric'}
              onChange={(e) => handleSettingChange('yearFormat', e.target.value)}
              disabled={!settings.showDate}
            >
              <option value="numeric">Full (2024)</option>
              <option value="2-digit">Short (24)</option>
              <option value="none">Hide</option>
            </select>
          </div>
        </div>
      </div>
    </BaseWidgetSettings>
  );
};

ClockSettings.propTypes = {
  settings: PropTypes.shape({
    is24Hour: PropTypes.bool,
    showSeconds: PropTypes.bool,
    showDate: PropTypes.bool,
    weekdayFormat: PropTypes.oneOf(['long', 'short', 'narrow', 'none']),
    monthFormat: PropTypes.oneOf(['long', 'short', 'narrow', 'numeric', '2-digit']),
    yearFormat: PropTypes.oneOf(['numeric', '2-digit', 'none'])
  }),
  onSettingsChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default ClockSettings; 