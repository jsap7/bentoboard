import React, { useState, useEffect } from 'react';
import BaseWidget from '../../components/BaseWidget';
import NotesSettings from './components/NotesSettings';
import { WidgetProps } from '../shared/types';
import { useWidgetState } from '../../contexts/WidgetStateContext';
import { Note, NotesSettings as NotesSettingsType } from './utils/types';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import './styles/NotesWidget.css';

interface NotesWidgetProps extends WidgetProps {}

interface NotesWidgetComponent extends React.FC<NotesWidgetProps> {
  widgetConfig: any;
}

const getDefaultSettings = (): NotesSettingsType => ({
  theme: 'modern',
  fontSize: 'medium',
  showPreview: true,
  sortBy: 'lastModified',
  sortDirection: 'desc'
});

const NotesWidget: NotesWidgetComponent = ({
  id,
  style,
  gridPosition,
  gridSize,
  onClose,
  onResize,
  onDrag
}) => {
  const [widgetState, updateWidgetState] = useWidgetState({
    id,
    initialGridPosition: gridPosition,
    initialGridSize: gridSize,
    initialSettings: getDefaultSettings(),
  });

  const settings = widgetState.settings as NotesSettingsType;
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${id}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [id]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`notes-${id}`, JSON.stringify(notes));
  }, [notes, id]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleUpdateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          ...updates,
          lastModified: new Date().toISOString()
        };
      }
      return note;
    }));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (activeNoteId === noteId) {
      setActiveNoteId(notes[0]?.id || null);
    }
  };

  const handleSettingsChange = (newSettings: NotesSettingsType) => {
    updateWidgetState({ settings: newSettings });
  };

  const activeNote = notes.find(note => note.id === activeNoteId);

  return (
    <BaseWidget
      id={id}
      title="Notes"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={NotesSettings}
    >
      <div className="notes-widget-content" data-theme={settings.theme}>
        <div className="notes-sidebar">
          <button className="new-note-button" onClick={handleCreateNote}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Note
          </button>
          <NotesList
            notes={notes}
            activeNoteId={activeNoteId}
            onNoteSelect={setActiveNoteId}
            onDeleteNote={handleDeleteNote}
            settings={settings}
          />
        </div>
        <div className="notes-editor">
          {activeNote ? (
            <NoteEditor
              note={activeNote}
              onUpdateNote={handleUpdateNote}
              settings={settings}
            />
          ) : (
            <div className="notes-empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <p>Select a note or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </BaseWidget>
  );
};

NotesWidget.widgetConfig = {
  id: 'notes',
  type: 'notes',
  title: 'Notes',
  description: 'Create and manage your notes',
  defaultSize: { width: 3, height: 4 },
  minSize: { width: 2, height: 3 },
  maxSize: { width: 6, height: 6 }
};

export default NotesWidget; 