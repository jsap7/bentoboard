import React from 'react';
import { WidgetSettingsProps } from '../../shared/types';
import { TimerSettings as TimerSettingsType, TimerPreset } from '../utils/types';
import SettingsBase, { SettingsSection, SettingsRow } from '../../shared/components/SettingsBase';

const TimerSettings: React.FC<WidgetSettingsProps> = ({
  settings,
  onSettingsChange,
  onClose
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onSettingsChange({
      ...settings,
      [name]: checked
    });
  };

  const handlePresetChange = (presetId: string, field: keyof TimerPreset, value: string | number) => {
    onSettingsChange({
      ...settings,
      presets: (settings.presets as TimerPreset[]).map(preset =>
        preset.id === presetId
          ? { ...preset, [field]: field === 'duration' ? Number(value) * 60 : value }
          : preset
      )
    });
  };

  return (
    <SettingsBase title="Timer Settings" onClose={onClose}>
      <SettingsSection 
        title="General"
        description="Configure timer behavior"
      >
        <SettingsRow
          label="Sound Notification"
          hint="Play a sound when timer completes"
        >
          <label className="settings-checkbox">
            <input
              type="checkbox"
              name="soundEnabled"
              checked={settings.soundEnabled}
              onChange={handleChange}
            />
            <span className="toggle"></span>
          </label>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection 
        title="Timer Presets"
        description="Customize your timer presets"
      >
        {(settings.presets as TimerPreset[]).map(preset => (
          <SettingsRow
            key={preset.id}
            label={`${preset.name} Duration`}
            hint="Duration in minutes"
          >
            <input
              type="number"
              className="settings-input"
              value={preset.duration / 60}
              onChange={(e) => handlePresetChange(preset.id, 'duration', e.target.value)}
              min="1"
              max="120"
              style={{ width: '80px' }}
            />
          </SettingsRow>
        ))}
      </SettingsSection>

      <SettingsSection 
        title="Coming Soon"
        description="Features in development"
      >
        <SettingsRow
          label="Custom Presets"
          hint="Add and remove timer presets"
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
          label="Custom Sounds"
          hint="Choose different notification sounds"
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

export default TimerSettings; 