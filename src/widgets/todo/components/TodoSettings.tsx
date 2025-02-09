import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { TodoSettings as TodoSettingsType, TodoDisplayMode } from '../TodoWidget';
import { useGlobalContext } from '../../../contexts/GlobalContext';
import SettingsBase, { SettingsSection, SettingsRow } from '../../shared/components/SettingsBase';

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
    <SettingsBase title="Todo Settings" onClose={onClose}>
      {availableModes.length > 0 && (
        <SettingsSection 
          title="Display"
          description="Choose how your todo list is displayed"
        >
          <SettingsRow
            label="View Mode"
            hint="Select the layout for your todos"
          >
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
          </SettingsRow>
        </SettingsSection>
      )}

      <SettingsSection 
        title="Appearance"
        description="Customize the visual style of your todo list"
      >
        <SettingsRow
          label="Checkbox Style"
          hint="Choose the style of the completion checkboxes"
        >
          <select
            value={settings.checkboxStyle}
            onChange={handleCheckboxStyleChange}
            className="settings-select"
          >
            <option value="square">Square</option>
            <option value="circle">Circle</option>
            <option value="minimal">Minimal</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Strikethrough Completed"
          hint="Add a line through completed todos"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.completedStyle?.strikethrough}
              onChange={handleCompletedStyleChange}
              name="strikethrough"
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        <SettingsRow
          label="Fade Completed"
          hint="Reduce opacity of completed todos"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.completedStyle?.fade}
              onChange={handleCompletedStyleChange}
              name="fade"
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Options"
        description="Configure todo list behavior"
      >
        <SettingsRow
          label="Show Completed"
          hint="Display completed todos in the list"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.showCompleted}
              onChange={handleChange}
              name="showCompleted"
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        <SettingsRow
          label="Sort By"
          hint="Choose how todos are ordered"
        >
          <select
            value={settings.sortBy}
            onChange={handleSortChange}
            className="settings-select"
          >
            <option value="createdAt">Date Created</option>
            <option value="completed">Completion Status</option>
            <option value="order">Custom Order</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Coming Soon"
        description="Features in development"
      >
        <SettingsRow
          label="Categories"
          hint="Organize todos into categories"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={false}
              disabled
              onChange={() => {}}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        <SettingsRow
          label="Due Dates"
          hint="Add deadlines to your todos"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={false}
              disabled
              onChange={() => {}}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
      </SettingsSection>
    </SettingsBase>
  );
};

export default TodoSettings; 