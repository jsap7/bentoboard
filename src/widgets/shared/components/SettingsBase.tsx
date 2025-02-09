import React from 'react';
import './SettingsBase.css';

interface SettingsBaseProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const SettingsBase: React.FC<SettingsBaseProps> = ({
  title,
  onClose,
  children
}) => {
  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2 className="settings-title">{title}</h2>
        <button className="settings-close" onClick={onClose} aria-label="Close settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="settings-content">
        {children}
      </div>
    </div>
  );
};

export const SettingsSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <div className="settings-section">
    <h3 className="settings-section-title">{title}</h3>
    {description && <div className="settings-description">{description}</div>}
    {children}
  </div>
);

export const SettingsRow: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div className="settings-row">
    <div className="settings-label">
      <span>{label}</span>
      {hint && <span className="settings-hint">{hint}</span>}
    </div>
    {children}
  </div>
);

export default SettingsBase; 