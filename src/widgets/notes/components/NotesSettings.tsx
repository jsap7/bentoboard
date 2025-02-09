import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { NotesSettings as NotesSettingsType } from '../utils/types';
import SettingsBase, { SettingsSection, SettingsRow } from '../../shared/components/SettingsBase';

const NotesSettings: React.FC<WidgetSettingsProps> = ({
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
    <SettingsBase title="Notes Settings" onClose={onClose}>
      <SettingsSection 
        title="Appearance"
        description="Customize how your notes look"
      >
        <SettingsRow
          label="Theme"
          hint="Choose the visual style for your notes"
        >
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="modern">Modern</option>
            <option value="minimal">Minimal</option>
            <option value="paper">Paper</option>
          </select>
        </SettingsRow>

        <SettingsRow
          label="Font Size"
          hint="Adjust the text size"
        >
          <select
            name="fontSize"
            value={settings.fontSize}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="List View"
        description="Configure how notes are displayed in the list"
      >
        <SettingsRow
          label="Show Preview"
          hint="Display a preview of note content in the list"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              name="showPreview"
              checked={settings.showPreview}
              onChange={handleChange}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        <SettingsRow
          label="Sort By"
          hint="Choose how notes are ordered"
        >
          <select
            name="sortBy"
            value={settings.sortBy}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="lastModified">Last Modified</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
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
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Coming Soon"
        description="Features in development"
      >
        <SettingsRow
          label="Auto Save"
          hint="Automatically save changes as you type"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={true}
              disabled
              onChange={() => {}}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        <SettingsRow
          label="Markdown Support"
          hint="Enable markdown formatting"
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

export default NotesSettings; 