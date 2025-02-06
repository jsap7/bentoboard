import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import GithubStatsSettings from './GithubStatsSettings';
import { formatDistanceToNow, format } from 'date-fns';
import './styles/GithubStatsWidget.css';

const GithubStatsWidget = ({ id, onClose, onMinimize, settings = {}, onSettingsChange }) => {
  const [repoStats, setRepoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRepoStats = useCallback(async () => {
    const defaultSettings = gitHubStatsWidgetConfig.defaultSettings;
    const owner = settings.owner || defaultSettings.owner;
    const repo = settings.repo || defaultSettings.repo;
    const token = settings.githubToken || defaultSettings.githubToken;

    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `Bearer ${token}`
      };

      // Fetch all commits (we'll get the first page to get the total via Link header)
      const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`;
      const commitsResponse = await fetch(commitsUrl, { headers });
      
      if (!commitsResponse.ok) {
        const errorData = await commitsResponse.json();
        throw new Error(`Repository API error: ${errorData.message || commitsResponse.statusText}`);
      }

      // Get total commits from Link header
      const linkHeader = commitsResponse.headers.get('Link') || '';
      const totalCommits = linkHeader.match(/page=(\d+)>; rel="last"/)
        ? parseInt(linkHeader.match(/page=(\d+)>; rel="last"/)[1])
        : 1;

      // Get the first and last commit dates
      const [firstCommitResponse, lastCommitResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&page=${totalCommits}`, { headers })
      ]);

      const [firstCommit, lastCommit] = await Promise.all([
        firstCommitResponse.json(),
        lastCommitResponse.json()
      ]);

      // Get repository statistics
      const statsUrl = `https://api.github.com/repos/${owner}/${repo}/stats/code_frequency`;
      const statsResponse = await fetch(statsUrl, { headers });
      const statsData = await statsResponse.json();

      // Get repository details
      const repoDetailsUrl = `https://api.github.com/repos/${owner}/${repo}`;
      const repoResponse = await fetch(repoDetailsUrl, { headers });
      const repoDetails = await repoResponse.json();

      // Calculate total lines of code (sum of additions minus deletions)
      const totalLines = statsData.reduce((total, [_, additions, deletions]) => 
        total + additions + deletions, 0);

      setRepoStats({
        name: repoDetails.name,
        fullName: repoDetails.full_name,
        description: repoDetails.description,
        stars: repoDetails.stargazers_count,
        forks: repoDetails.forks_count,
        watchers: repoDetails.watchers_count,
        openIssues: repoDetails.open_issues_count,
        totalCommits,
        firstCommitDate: new Date(lastCommit[0].commit.author.date),
        lastCommitDate: new Date(firstCommit[0].commit.author.date),
        totalLines: Math.abs(totalLines),
        language: repoDetails.language,
        isPrivate: repoDetails.private
      });

    } catch (err) {
      console.error('GitHub API error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    fetchRepoStats();
    const interval = setInterval(fetchRepoStats, (settings.refreshInterval || 300) * 1000);
    return () => clearInterval(interval);
  }, [fetchRepoStats, settings.refreshInterval]);

  if (loading && !repoStats) {
    return (
      <BaseWidget
        id={id}
        title="GitHub Stats"
        onClose={onClose}
        onMinimize={onMinimize}
        settings={settings}
        onSettingsChange={onSettingsChange}
        SettingsComponent={GithubStatsSettings}
        className="github-stats-widget"
      >
        <div className="github-stats loading">Loading repository data...</div>
      </BaseWidget>
    );
  }

  if (error) {
    return (
      <BaseWidget
        id={id}
        title="GitHub Stats"
        onClose={onClose}
        onMinimize={onMinimize}
        settings={settings}
        onSettingsChange={onSettingsChange}
        SettingsComponent={GithubStatsSettings}
        className="github-stats-widget"
      >
        <div className="github-stats error">
          Error: {error}
          <button onClick={fetchRepoStats} className="retry-button">
            Retry
          </button>
        </div>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget
      id={id}
      title="GitHub Stats"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      onSettingsChange={onSettingsChange}
      SettingsComponent={GithubStatsSettings}
      className="github-stats-widget"
    >
      <div className="github-stats">
        <div className="repo-header">
          <div className="github-icon">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </div>
          <div className="repo-info">
            <div className="repo-name">{repoStats.name}</div>
            <div className="repo-fullname">{repoStats.fullName}</div>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Commits</div>
            <div className="stat-value">{repoStats.totalCommits.toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Lines</div>
            <div className="stat-value">{repoStats.totalLines.toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Stars</div>
            <div className="stat-value">{repoStats.stars.toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Forks</div>
            <div className="stat-value">{repoStats.forks.toLocaleString()}</div>
          </div>
        </div>
        <div className="footer-stats">
          <div className="language">
            <span className="label">Language:</span>
            <span className="value">{repoStats.language || 'N/A'}</span>
          </div>
          <div className="timespan">
            <span className="label">Active:</span>
            <span className="value">
              {format(repoStats.firstCommitDate, 'MMM d, yyyy')} - {format(repoStats.lastCommitDate, 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};

GithubStatsWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.shape({
    owner: PropTypes.string,
    repo: PropTypes.string,
    refreshInterval: PropTypes.number
  }),
  onSettingsChange: PropTypes.func
};

const gitHubStatsWidgetConfig = {
  type: 'github-stats',
  component: GithubStatsWidget,
  settingsComponent: GithubStatsSettings,
  name: 'GitHub Stats',
  description: 'Display GitHub repository statistics',
  defaultSettings: {
    owner: 'jsap7',
    repo: 'desktop-app',
    githubToken: '',
    refreshInterval: 300,
    theme: {
      backgroundColor: '#161616'
    }
  },
  defaultSize: {
    width: 2,
    height: 2
  },
  isResizable: true,
  minSize: {
    width: 2,
    height: 2
  },
  maxSize: {
    width: 3,
    height: 2
  }
};

export { GithubStatsWidget as default, gitHubStatsWidgetConfig }; 