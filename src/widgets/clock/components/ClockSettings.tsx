import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { ClockSettings as ClockSettingsType, ClockDisplayMode, ClockThemeMode } from '../../shared/types';
import { useGlobalContext } from '../../../contexts/GlobalContext';
import SettingsBase, { SettingsSection, SettingsRow } from '../../shared/components/SettingsBase';

const ClockSettings: React.FC<WidgetSettingsProps> = ({
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  return (
    <SettingsBase title="Clock Settings" onClose={onClose}>
      <SettingsSection 
        title="Display"
        description="Customize the appearance of your clock"
      >
        {availableModes.length > 0 && (
          <SettingsRow
            label="Mode"
            hint="Choose how the clock is displayed"
          >
            <select
              name="displayMode"
              value={settings.displayMode || 'digital'}
              onChange={handleSelectChange}
              className="settings-select"
            >
              {availableModes.map(mode => (
                <option key={mode} value={mode}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </option>
              ))}
            </select>
          </SettingsRow>
        )}
        
        <SettingsRow
          label="Theme"
          hint="Select the clock's visual style"
        >
          <select
            name="theme"
            value={settings.theme || 'modern'}
            onChange={handleSelectChange}
            className="settings-select"
          >
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Time Format"
        description="Configure how time is displayed"
      >
        <SettingsRow
          label="24-Hour Format"
          hint="Use 24-hour time format instead of AM/PM"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.use24Hour}
              onChange={handleChange}
              name="use24Hour"
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        <SettingsRow
          label="Show Seconds"
          hint="Display seconds in the time"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.showSeconds}
              onChange={handleChange}
              name="showSeconds"
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>

        {settings.showSeconds && (
          <SettingsRow
            label="Show Milliseconds"
            hint="Display milliseconds (requires seconds to be shown)"
          >
            <label className="settings-checkbox">
              <input
                type="checkbox"
                checked={settings.showMilliseconds}
                onChange={handleChange}
                name="showMilliseconds"
              />
              <span className="toggle"></span>
            </label>
          </SettingsRow>
        )}
      </SettingsSection>

      <SettingsSection 
        title="Date"
        description="Configure date display options"
      >
        <SettingsRow
          label="Show Date"
          hint="Display the current date below the time"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={settings.showDate}
              onChange={handleChange}
              name="showDate"
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
      </SettingsSection>
    </SettingsBase>
  );
};

export default ClockSettings; 