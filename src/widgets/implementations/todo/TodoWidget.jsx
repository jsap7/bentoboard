import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import TodoSettings from './TodoSettings';
import { useGlobalSettings } from '../../../shared/context/GlobalSettingsContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TodoWidget.css';

// StrictModeDroppable component to handle React 18 Strict Mode
const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const TodoItem = React.memo(({ todo, index, onToggle, onDelete, onEdit, globalSettings, settings = {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    } else {
      setEditText(todo.text); // Reset if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
    <Draggable draggableId={String(todo.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`todo-item ${todo.completed ? 'completed' : ''} ${settings.density === 'compact' ? 'compact' : ''}`}
          data-rbd-dragging={snapshot.isDragging}
          data-completion-style={settings.completionStyle || 'strikethrough'}
        >
          {settings.showDragHandles !== false && (
            <div className="drag-handle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="16" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="18" x2="16" y2="18" />
              </svg>
            </div>
          )}
          <button 
            className={`todo-checkbox ${settings.checkboxStyle === 'circle' ? 'circle' : ''}`}
            onClick={() => onToggle(todo.id)}
            aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
            style={{ '--accent-color': globalSettings.theme.buttonColor }}
          >
            {todo.completed && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              className="todo-text-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <span 
              className="todo-text"
              onClick={() => setIsEditing(true)}
            >
              {todo.text}
            </span>
          )}
          <button 
            className="todo-delete" 
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </Draggable>
  );
});

const TodoWidget = ({ id, onClose, onMinimize, settings = {}, onSettingsChange }) => {
  const { settings: globalSettings } = useGlobalSettings();
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(`todo_widget_${id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    localStorage.setItem(`todo_widget_${id}`, JSON.stringify(todos));
  }, [todos, id]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setTodos(prev => [...prev, {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }]);
    setNewTodo('');
  };

  const toggleTodo = useCallback((todoId) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((todoId) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  }, []);

  const editTodo = useCallback((todoId, newText) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId ? { ...todo, text: newText } : todo
    ));
  }, []);

  const handleDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // If we're using bottom sorting, we need to maintain the order
    if (settings.completedItemsPosition === 'bottom') {
      const incomplete = items.filter(todo => !todo.completed);
      const complete = items.filter(todo => todo.completed);
      setTodos([...incomplete, ...complete]);
    } else {
      setTodos(items);
    }
  }, [todos, settings.completedItemsPosition]);

  const handleSettingsChange = (newSettings) => {
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Sort todos based on settings
  const sortedTodos = useMemo(() => {
    if (settings.completedItemsPosition === 'bottom') {
      const incomplete = todos.filter(todo => !todo.completed);
      const complete = todos.filter(todo => todo.completed);
      return [...incomplete, ...complete];
    }
    return todos;
  }, [todos, settings.completedItemsPosition]);

  return (
    <BaseWidget
      id={id}
      title="Todo List"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={TodoSettings}
      className="todo-widget"
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="todo-container">
          <form onSubmit={handleAddTodo} className="todo-form">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="todo-input"
            />
            <button 
              type="submit" 
              className="todo-add-button" 
              disabled={!newTodo.trim()}
              style={{ '--accent-color': globalSettings.theme.buttonColor }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </form>
          <div className="todo-list">
            <StrictModeDroppable droppableId="todos">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sortedTodos.map((todo, index) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      index={index}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={editTodo}
                      globalSettings={globalSettings}
                      settings={settings}
                    />
                  ))}
                  {provided.placeholder}
                  {todos.length === 0 && (
                    <div className="todo-empty">No tasks yet. Add one above!</div>
                  )}
                </div>
              )}
            </StrictModeDroppable>
          </div>
        </div>
      </DragDropContext>
    </BaseWidget>
  );
};

TodoWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object,
  onSettingsChange: PropTypes.func
};

// Register the widget
const todoWidgetConfig = {
  type: 'todo',
  component: TodoWidget,
  name: 'Todo List',
  description: 'Keep track of tasks and ideas',
  defaultSettings: {
    checkboxStyle: 'square',
    density: 'comfortable',
    showDragHandles: true,
    completionStyle: 'strikethrough',
    completedItemsPosition: 'keep',
    theme: {
      backgroundColor: '#161616'
    }
  },
  defaultSize: {
    width: 3,
    height: 4
  }
};

export { TodoWidget as default, todoWidgetConfig }; 