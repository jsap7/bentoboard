import React, { useState } from 'react';
import BaseWidget from '../../components/BaseWidget';
import { WidgetProps } from '../shared/types';
import { useWidgetState } from '../../contexts/WidgetStateContext';
import { Bookmark } from './utils/types';
import { BookmarkSettings } from './utils/types';
import BookmarkSettingsComponent from './components/BookmarkSettings';
import './styles/BookmarksWidget.css';

interface BookmarksWidgetProps extends WidgetProps {}

interface BookmarksWidgetComponent extends React.FC<BookmarksWidgetProps> {
  widgetConfig: any;
}

interface EditingBookmark {
  id: string;
  title: string;
  url: string;
}

interface BookmarksData {
  bookmarks: Bookmark[];
}

const getDefaultSettings = (): BookmarkSettings => ({
  theme: 'modern',
  showIcons: true,
  sortBy: 'title',
  sortDirection: 'asc'
});

const BookmarksWidget: BookmarksWidgetComponent = ({
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
    initialData: { bookmarks: [] }
  });

  const settings = widgetState.settings as BookmarkSettings;
  const bookmarksData = widgetState.data as BookmarksData;
  const bookmarks = bookmarksData?.bookmarks || [];
  const [editingBookmark, setEditingBookmark] = useState<EditingBookmark | null>(null);

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookmark) return;

    const url = editingBookmark.url.startsWith('http') ? editingBookmark.url : `https://${editingBookmark.url}`;
    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: editingBookmark.title || new URL(url).hostname,
      url: url,
      createdAt: new Date().toISOString()
    };

    updateWidgetState({
      data: {
        bookmarks: [...bookmarks, newBookmark]
      }
    });
    setEditingBookmark(null);
  };

  const handleDeleteBookmark = (id: string) => {
    updateWidgetState({
      data: {
        bookmarks: bookmarks.filter((bookmark: Bookmark) => bookmark.id !== id)
      }
    });
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBookmark) return;

    const url = editingBookmark.url.startsWith('http') ? editingBookmark.url : `https://${editingBookmark.url}`;
    updateWidgetState({
      data: {
        bookmarks: bookmarks.map((bookmark: Bookmark) =>
          bookmark.id === editingBookmark.id
            ? {
                ...bookmark,
                title: editingBookmark.title,
                url: url
              }
            : bookmark
        )
      }
    });
    setEditingBookmark(null);
  };

  const handleCancelEdit = () => {
    setEditingBookmark(null);
  };

  const sortedBookmarks = [...bookmarks].sort((a: Bookmark, b: Bookmark) => {
    const aValue = a[settings.sortBy];
    const bValue = b[settings.sortBy];
    return settings.sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  return (
    <BaseWidget
      id={id}
      title="Bookmarks"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      onSettingsChange={(newSettings) => updateWidgetState({ settings: newSettings })}
      SettingsComponent={BookmarkSettingsComponent}
    >
      <div className="bookmarks-widget-content" data-theme={settings.theme}>
        <div className="bookmarks-header">
          <button
            className="add-bookmark-button"
            onClick={() => setEditingBookmark({ id: '', title: '', url: '' })}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Bookmark
          </button>
        </div>

        <div className="bookmarks-list">
          {editingBookmark && !editingBookmark.id && (
            <form className="add-bookmark-form" onSubmit={handleAddBookmark}>
              <input
                type="text"
                placeholder="Title"
                value={editingBookmark.title}
                onChange={e => setEditingBookmark({ ...editingBookmark, title: e.target.value })}
                className="bookmark-input"
              />
              <input
                type="text"
                placeholder="URL"
                value={editingBookmark.url}
                onChange={e => setEditingBookmark({ ...editingBookmark, url: e.target.value })}
                className="bookmark-input"
                required
              />
              <div className="bookmark-form-actions">
                <button type="submit" className="bookmark-submit">Add</button>
                <button type="button" className="bookmark-cancel" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </form>
          )}

          {sortedBookmarks.map((bookmark: Bookmark) => (
            <div key={bookmark.id} className="bookmark-item">
              {editingBookmark?.id === bookmark.id ? (
                <form className="edit-bookmark-form" onSubmit={handleSaveEdit}>
                  <input
                    type="text"
                    value={editingBookmark.title}
                    onChange={e => setEditingBookmark({ ...editingBookmark, title: e.target.value })}
                    className="bookmark-input"
                  />
                  <input
                    type="text"
                    value={editingBookmark.url}
                    onChange={e => setEditingBookmark({ ...editingBookmark, url: e.target.value })}
                    className="bookmark-input"
                    required
                  />
                  <div className="bookmark-form-actions">
                    <button type="submit" className="bookmark-submit">Save</button>
                    <button type="button" className="bookmark-cancel" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bookmark-link"
                  >
                    {settings.showIcons && (
                      <img
                        src={`https://icons.duckduckgo.com/ip3/${new URL(bookmark.url).hostname}.ico`}
                        alt=""
                        className="bookmark-icon"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    <span className="bookmark-title">{bookmark.title}</span>
                  </a>
                  <div className="bookmark-actions">
                    <button
                      className="bookmark-edit"
                      onClick={() => handleEditBookmark(bookmark)}
                      aria-label="Edit bookmark"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="bookmark-delete"
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      aria-label="Delete bookmark"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {bookmarks.length === 0 && !editingBookmark && (
            <div className="bookmarks-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <p>Add your first bookmark</p>
            </div>
          )}
        </div>
      </div>
    </BaseWidget>
  );
};

BookmarksWidget.widgetConfig = {
  id: 'bookmarks',
  type: 'bookmarks',
  title: 'Bookmarks',
  description: 'Save and organize your favorite links',
  defaultSize: { width: 2, height: 3 },
  minSize: { width: 2, height: 2 },
  maxSize: { width: 4, height: 6 }
};

export default BookmarksWidget; 