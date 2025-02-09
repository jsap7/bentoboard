import React from 'react';
import { Note, NotesSettings } from '../utils/types';
import { formatDistanceToNow } from 'date-fns';

interface NotesListProps {
  notes: Note[];
  activeNoteId: string | null;
  onNoteSelect: (id: string) => void;
  onDeleteNote: (id: string) => void;
  settings: NotesSettings;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  activeNoteId,
  onNoteSelect,
  onDeleteNote,
  settings
}) => {
  const sortedNotes = [...notes].sort((a, b) => {
    const aValue = a[settings.sortBy];
    const bValue = b[settings.sortBy];
    const modifier = settings.sortDirection === 'desc' ? -1 : 1;
    return aValue.localeCompare(bValue) * modifier;
  });

  const getPreviewText = (content: string) => {
    return content.length > 60 ? content.slice(0, 60) + '...' : content;
  };

  return (
    <div className="notes-list">
      {sortedNotes.map(note => (
        <div
          key={note.id}
          className={`note-item ${activeNoteId === note.id ? 'active' : ''}`}
          onClick={() => onNoteSelect(note.id)}
        >
          <div className="note-item-content">
            <div className="note-item-header">
              <h3 className="note-item-title">{note.title || 'Untitled Note'}</h3>
              <button
                className="note-delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                aria-label="Delete note"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {settings.showPreview && (
              <p className="note-item-preview">{getPreviewText(note.content)}</p>
            )}
            <div className="note-item-meta">
              {formatDistanceToNow(new Date(note.lastModified), { addSuffix: true })}
            </div>
          </div>
        </div>
      ))}
      {notes.length === 0 && (
        <div className="notes-empty-message">
          No notes yet
        </div>
      )}
    </div>
  );
};

export default NotesList; 