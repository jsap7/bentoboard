import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { BookmarkSettings as BookmarkSettingsType } from '../utils/types';
import SettingsBase, { SettingsSection, SettingsRow } from '../../shared/components/SettingsBase';

const BookmarkSettings: React.FC<WidgetSettingsProps> = ({
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
    <SettingsBase title="Bookmark Settings" onClose={onClose}>
      <SettingsSection 
        title="Appearance"
        description="Customize how your bookmarks are displayed"
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
          label="Show Icons"
          hint="Display website favicons"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              name="showIcons"
              checked={settings.showIcons}
              onChange={handleChange}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Organization"
        description="Configure how bookmarks are sorted"
      >
        <SettingsRow
          label="Sort By"
          hint="Choose how bookmarks are ordered"
        >
          <select
            name="sortBy"
            value={settings.sortBy}
            onChange={handleChange}
            className="settings-select"
          >
            <option value="title">Title</option>
            <option value="createdAt">Date Added</option>
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
        title="Coming Soon"
        description="Features in development"
      >
        <SettingsRow
          label="Categories"
          hint="Organize bookmarks into categories"
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
          label="Import/Export"
          hint="Import and export your bookmarks"
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

export default BookmarkSettings; 