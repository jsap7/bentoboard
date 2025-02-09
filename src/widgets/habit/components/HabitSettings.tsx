import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { HabitSettings as HabitSettingsType } from '../utils/types';
import SettingsBase, { SettingsSection, SettingsRow } from '../../shared/components/SettingsBase';

const HabitSettings: React.FC<WidgetSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    onSettingsChange({
      ...settings,
      [name]: newValue
    });
  };

  return (
    <SettingsBase title="Habit Settings" onClose={onClose}>
      <SettingsSection 
        title="Appearance"
        description="Customize how your habits are displayed"
      >
        <SettingsRow
          label="Theme"
          hint="Choose the visual style"
        >
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Show Streaks"
          hint="Display current streak count"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              name="showStreak"
              checked={settings.showStreak}
              onChange={handleChange}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        <SettingsRow
          label="Show Descriptions"
          hint="Display habit descriptions"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              name="showDescription"
              checked={settings.showDescription}
              onChange={handleChange}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Organization"
        description="Configure how habits are sorted"
      >
        <SettingsRow
          label="Sort By"
          hint="Choose how habits are ordered"
        >
          <select
            name="sortBy"
            value={settings.sortBy}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="name">Name</option>
            <option value="streak">Streak</option>
            <option value="lastCompleted">Last Completed</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Sort Direction"
          hint="Choose the sorting order"
        >
          <select
            name="sortDirection"
            value={settings.sortDirection}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Defaults"
        description="Set default values for new habits"
      >
        <SettingsRow
          label="Default Frequency"
          hint="Default tracking frequency for new habits"
        >
          <select
            name="defaultFrequency"
            value={settings.defaultFrequency}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Default Color"
          hint="Default color for new habits"
        >
          <input
            type="color"
            name="defaultColor"
            value={settings.defaultColor}
            onChange={handleChange}
            className="settings-color-picker"
          />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Coming Soon"
        description="Features in development"
      >
        <SettingsRow
          label="Categories"
          hint="Group habits into categories"
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
          label="Statistics"
          hint="View detailed habit statistics"
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

export default HabitSettings; 