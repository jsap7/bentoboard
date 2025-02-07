import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { TodoSettings as TodoSettingsType, TodoDisplayMode } from '../TodoWidget';

const TodoSettings: React.FC<WidgetSettingsProps> = ({
  settings = { showCompleted: true, sortBy: 'createdAt' },
  onSettingsChange,
  onClose,
  availableModes = []
}) => {
  // Ensure we have a settings change handler
  const handleSettingsChange = (newSettings: Partial<TodoSettingsType>) => {
    if (onSettingsChange) {
      onSettingsChange({
        ...settings,
        ...newSettings
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSettingsChange({
      [e.target.name]: e.target.checked
    });
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSettingsChange({
      displayMode: e.target.value as TodoDisplayMode
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSettingsChange({
      sortBy: e.target.value as 'createdAt' | 'completed'
    });
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2 className="settings-title">Todo Settings</h2>
        <button className="settings-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="todo-settings-body">
        {availableModes.length > 0 && (
          <div className="todo-settings-option">
            <label htmlFor="displayMode">Display Mode</label>
            <select
              id="displayMode"
              name="displayMode"
              value={settings.displayMode || 'list'}
              onChange={handleModeChange}
              className="todo-settings-select"
            >
              {availableModes.map(mode => (
                <option key={mode} value={mode}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="todo-settings-option">
          <label className="todo-checkbox" htmlFor="showCompleted">
            <input
              type="checkbox"
              id="showCompleted"
              name="showCompleted"
              checked={settings.showCompleted}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <span>Show Completed Tasks</span>
          </label>
        </div>
        <div className="todo-settings-option">
          <label htmlFor="sortBy">Sort By</label>
          <select
            id="sortBy"
            name="sortBy"
            value={settings.sortBy}
            onChange={handleSortChange}
            className="todo-settings-select"
          >
            <option value="createdAt">Date Created</option>
            <option value="completed">Completion Status</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TodoSettings; 