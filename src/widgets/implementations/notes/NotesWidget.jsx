import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import NotesSettings from './NotesSettings';
import './styles/NotesWidget.css';

const NotesWidget = ({ id, onClose, onMinimize, settings = {}, onSettingsChange }) => {
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);

  // Load saved content
  useEffect(() => {
    const savedContent = localStorage.getItem(`notes_widget_${id}`);
    if (savedContent) {
      setContent(savedContent);
    }
  }, [id]);

  // Auto-save content
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (!isSaved) {
        localStorage.setItem(`notes_widget_${id}`, content);
        setIsSaved(true);
      }
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(saveTimeout);
  }, [content, id, isSaved]);

  const handleChange = (e) => {
    setContent(e.target.value);
    setIsSaved(false);
  };

  return (
    <BaseWidget
      id={id}
      title="Notes"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      onSettingsChange={onSettingsChange}
      SettingsComponent={NotesSettings}
      className="notes-widget"
    >
      <div className="notes-container">
        <textarea
          className="notes-textarea"
          value={content}
          onChange={handleChange}
          placeholder="Type your notes here..."
          spellCheck={settings.spellCheck !== false}
          style={{
            fontSize: `${settings.fontSize || 14}px`,
            fontFamily: settings.fontFamily || 'monospace',
            lineHeight: settings.lineHeight || 1.5
          }}
        />
        <div className="notes-status">
          {isSaved ? 'Saved' : 'Saving...'}
        </div>
      </div>
    </BaseWidget>
  );
};

NotesWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object,
  onSettingsChange: PropTypes.func
};

// Register the widget
const notesWidgetConfig = {
  type: 'notes',
  component: NotesWidget,
  name: 'Notes',
  description: 'A simple notepad for quick notes and thoughts',
  defaultSettings: {
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 1.5,
    spellCheck: true,
    theme: {
      backgroundColor: '#161616'
    }
  },
  defaultSize: {
    width: 3,
    height: 3
  },
  isResizable: true,
  minSize: {
    width: 2,
    height: 2
  },
  maxSize: {
    width: 6,
    height: 6
  }
};

export { NotesWidget as default, notesWidgetConfig }; 