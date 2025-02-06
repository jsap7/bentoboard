import React from 'react';
import PropTypes from 'prop-types';
import BaseWidgetSettings from '../../core/BaseWidgetSettings';
import './styles/GithubStatsSettings.css';

const GithubStatsSettings = ({ settings = {}, onSettingsChange, onClose }) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <BaseWidgetSettings onClose={onClose} title="GitHub Stats Settings">
      <div className="github-stats-settings">
        <div className="settings-section">
          <h3>Authentication</h3>
          <div className="setting-item">
            <label>GitHub Token</label>
            <input
              type="password"
              value={settings.githubToken || ''}
              onChange={(e) => handleSettingChange('githubToken', e.target.value)}
              placeholder="Enter your GitHub token"
            />
          </div>
          <div className="setting-help">
            You need a GitHub token to access repository data. 
            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
              Generate one here
            </a>
          </div>
        </div>

        <div className="settings-section">
          <h3>Repository</h3>
          <div className="setting-item">
            <label>Owner</label>
            <input
              type="text"
              value={settings.owner || 'jsap7'}
              onChange={(e) => handleSettingChange('owner', e.target.value)}
              placeholder="GitHub username or organization"
            />
          </div>
          <div className="setting-item">
            <label>Repository</label>
            <input
              type="text"
              value={settings.repo || 'desktop-app'}
              onChange={(e) => handleSettingChange('repo', e.target.value)}
              placeholder="Repository name"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Display</h3>
          <div className="setting-item">
            <label>Show Commits</label>
            <input
              type="checkbox"
              checked={settings.showCommits !== false}
              onChange={(e) => handleSettingChange('showCommits', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Show Author</label>
            <input
              type="checkbox"
              checked={settings.showAuthor !== false}
              onChange={(e) => handleSettingChange('showAuthor', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Show Date</label>
            <input
              type="checkbox"
              checked={settings.showDate !== false}
              onChange={(e) => handleSettingChange('showDate', e.target.checked)}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Updates</h3>
          <div className="setting-item">
            <label>Refresh Interval</label>
            <select
              value={settings.refreshInterval || 300}
              onChange={(e) => handleSettingChange('refreshInterval', Number(e.target.value))}
            >
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
              <option value={600}>10 minutes</option>
              <option value={1800}>30 minutes</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Number of Commits</label>
            <select
              value={settings.commitLimit || 5}
              onChange={(e) => handleSettingChange('commitLimit', Number(e.target.value))}
            >
              <option value={3}>3 commits</option>
              <option value={5}>5 commits</option>
              <option value={10}>10 commits</option>
              <option value={15}>15 commits</option>
            </select>
          </div>
        </div>
      </div>
    </BaseWidgetSettings>
  );
};

GithubStatsSettings.propTypes = {
  settings: PropTypes.shape({
    githubToken: PropTypes.string,
    owner: PropTypes.string,
    repo: PropTypes.string,
    showCommits: PropTypes.bool,
    showAuthor: PropTypes.bool,
    showDate: PropTypes.bool,
    refreshInterval: PropTypes.number,
    commitLimit: PropTypes.number
  }),
  onSettingsChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default GithubStatsSettings; 