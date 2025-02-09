import React, { useState, useEffect, useRef } from 'react';
import { Note, NotesSettings } from '../utils/types';
import { formatDistanceToNow } from 'date-fns';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  settings: NotesSettings;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdateNote,
  settings
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  // Auto-focus title when creating new note
  useEffect(() => {
    if (note.title === 'Untitled Note' && !note.content) {
      titleRef.current?.focus();
    }
  }, [note]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = contentRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdateNote(note.id, { title: newTitle });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdateNote(note.id, { content: newContent });
  };

  return (
    <div className="note-editor" data-font-size={settings.fontSize}>
      <div className="note-editor-header">
        <input
          ref={titleRef}
          type="text"
          className="note-title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
        />
        <div className="note-meta">
          Last modified {formatDistanceToNow(new Date(note.lastModified), { addSuffix: true })}
        </div>
      </div>
      <textarea
        ref={contentRef}
        className="note-content-input"
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing..."
      />
    </div>
  );
};

export default NoteEditor; 