import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { TodoSettings as TodoSettingsType, TodoDisplayMode } from '../TodoWidget';
import { useGlobalContext } from '../../../contexts/GlobalContext';

const TodoSettings: React.FC<WidgetSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose,
  availableModes = []
}) => {
  const { theme } = useGlobalContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      [e.target.name]: e.target.checked
    });
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      displayMode: e.target.value as TodoDisplayMode
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      sortBy: e.target.value
    });
  };

  const handleCheckboxStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      checkboxStyle: e.target.value
    });
  };

  const handleCompletedStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      completedStyle: {
        ...settings.completedStyle,
        [e.target.name]: e.target.checked
      }
    });
  };

  return (
    <>
      <div className="settings-header">
        <h2 className="settings-title">Todo</h2>
        <button className="settings-close" onClick={onClose} aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="settings-content" style={{ '--accent-color': theme.accentColor } as React.CSSProperties}>
        {availableModes.length > 0 && (
          <div className="settings-section">
            <h3 className="settings-section-title">Display</h3>
            <div className="settings-option">
              <span className="settings-option-label">View Mode</span>
              <select
                value={settings.displayMode || 'list'}
                onChange={handleModeChange}
                className="settings-select"
              >
                {availableModes.map(mode => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="settings-section">
          <h3 className="settings-section-title">Appearance</h3>
          <div className="settings-option">
            <span className="settings-option-label">Checkbox Style</span>
            <select
              value={settings.checkboxStyle}
              onChange={handleCheckboxStyleChange}
              className="settings-select"
            >
              <option value="square">Square</option>
              <option value="circle">Circle</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          <div className="settings-option">
            <span className="settings-option-label">Strikethrough Completed</span>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.completedStyle?.strikethrough}
                onChange={handleCompletedStyleChange}
                name="strikethrough"
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-option">
            <span className="settings-option-label">Fade Completed</span>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.completedStyle?.fade}
                onChange={handleCompletedStyleChange}
                name="fade"
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Options</h3>
          <div className="settings-option">
            <span className="settings-option-label">Show Completed</span>
            <label className="settings-switch">
              <input
                type="checkbox"
                checked={settings.showCompleted}
                onChange={handleChange}
                name="showCompleted"
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-option">
            <span className="settings-option-label">Sort By</span>
            <select
              value={settings.sortBy}
              onChange={handleSortChange}
              className="settings-select"
            >
              <option value="createdAt">Date Created</option>
              <option value="completed">Completion Status</option>
              <option value="order">Custom Order</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Coming Soon</h3>
          <div className="settings-option">
            <span className="settings-option-label">Categories</span>
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
            <span className="settings-option-label">Due Dates</span>
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
    </>
  );
};

export default TodoSettings; 