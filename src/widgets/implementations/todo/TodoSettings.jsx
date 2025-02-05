import React from 'react';
import PropTypes from 'prop-types';
import BaseWidgetSettings from '../../core/BaseWidgetSettings';
import './TodoSettings.css';

const TodoSettings = ({ settings = {}, onSettingsChange, onClose }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <BaseWidgetSettings onClose={onClose} title="Todo List Settings">
      <div className="todo-settings">
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>Checkbox Style</label>
            <select
              value={settings.checkboxStyle || 'square'}
              onChange={(e) => handleSettingChange('checkboxStyle', e.target.value)}
            >
              <option value="square">Square</option>
              <option value="circle">Circle</option>
            </select>
          </div>
          <div className="setting-item">
            <label>List Density</label>
            <select
              value={settings.density || 'comfortable'}
              onChange={(e) => handleSettingChange('density', e.target.value)}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Show Drag Handles</label>
            <input
              type="checkbox"
              checked={settings.showDragHandles ?? true}
              onChange={(e) => handleSettingChange('showDragHandles', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Completion Style</h3>
          <div className="setting-item">
            <label>Completed Items</label>
            <select
              value={settings.completionStyle || 'strikethrough'}
              onChange={(e) => handleSettingChange('completionStyle', e.target.value)}
            >
              <option value="strikethrough">Strikethrough</option>
              <option value="fade">Fade</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3>Behavior</h3>
          <div className="setting-item">
            <label>Sort Completed Items</label>
            <select
              value={settings.completedItemsPosition || 'bottom'}
              onChange={(e) => handleSettingChange('completedItemsPosition', e.target.value)}
            >
              <option value="keep">Keep in Place</option>
              <option value="bottom">Move to Bottom</option>
            </select>
          </div>
        </div>
      </div>
    </BaseWidgetSettings>
  );
};

TodoSettings.propTypes = {
  settings: PropTypes.shape({
    checkboxStyle: PropTypes.oneOf(['square', 'circle']),
    density: PropTypes.oneOf(['comfortable', 'compact']),
    showDragHandles: PropTypes.bool,
    completionStyle: PropTypes.oneOf(['strikethrough', 'fade', 'both']),
    completedItemsPosition: PropTypes.oneOf(['keep', 'bottom'])
  }),
  onSettingsChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TodoSettings; 