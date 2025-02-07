import React from 'react';
import BaseWidget from '../../components/BaseWidget';
import TodoSettings from './components/TodoSettings';
import { WidgetProps, BaseWidgetSizeConfig } from '../shared/types';
import './styles/TodoWidget.css';
import { useWidgetState } from '../../hooks/useWidgetState';

// Todo-specific types
export type TodoDisplayMode = 'list' | 'compact' | 'kanban';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  status: 'todo' | 'in-progress' | 'done';
  order: number;
}

export interface TodoSettings {
  displayMode?: TodoDisplayMode;
  showCompleted: boolean;
  sortBy: 'createdAt' | 'completed' | 'order';
  checkboxStyle: 'square' | 'circle' | 'minimal';
  completedStyle: {
    strikethrough: boolean;
    fade: boolean;
  };
}

interface TodoWidgetState {
  todos: TodoItem[];
  dragTarget: string | null;
}

interface TodoWidgetProps extends WidgetProps {}

interface TodoWidgetComponent extends React.FC<TodoWidgetProps> {
  widgetConfig: any;
}

// Size configuration for Todo widget
const todoSizeConfig: BaseWidgetSizeConfig<TodoDisplayMode> = {
  getSizeConfig: (width: number, height: number) => {
    if (width === 1 && height === 1) {
      return {
        category: 'tiny',
        availableModes: ['compact'],
        defaultMode: 'compact',
        styles: { padding: '0.5rem' }
      };
    }
    if ((width === 2 && height === 1) || (width === 1 && height === 2)) {
      return {
        category: 'small',
        availableModes: ['list', 'compact'],
        defaultMode: 'list',
        styles: { padding: '0.75rem' }
      };
    }
    if (width === 2 && height === 2) {
      return {
        category: 'medium',
        availableModes: ['list', 'compact'],
        defaultMode: 'list',
        styles: { padding: '1rem' }
      };
    }
    // 3x2 or larger gets kanban option
    return {
      category: 'large',
      availableModes: ['list', 'kanban'],
      defaultMode: 'list',
      styles: { padding: '1rem' }
    };
  },
  defaultMode: 'list'
};

const defaultSettings: TodoSettings = {
  showCompleted: true,
  sortBy: 'createdAt',
  checkboxStyle: 'square',
  completedStyle: {
    strikethrough: true,
    fade: true
  }
};

const TodoWidget: TodoWidgetComponent = ({
  id,
  style,
  gridPosition,
  gridSize,
  settings: externalSettings,
  onSettingsChange,
  onClose,
  onResize,
  onDrag
}) => {
  const [widgetState, updateWidgetState] = useWidgetState<TodoWidgetState, TodoSettings>({
    id,
    initialGridPosition: gridPosition,
    initialGridSize: gridSize,
    initialSettings: {
      ...defaultSettings,
      ...(externalSettings || {})
    },
    initialData: { 
      todos: [],
      dragTarget: null 
    }
  });

  // Ensure settings are complete by merging with defaults
  const settings = React.useMemo(() => ({
    ...defaultSettings,
    ...widgetState.settings,
    completedStyle: {
      ...defaultSettings.completedStyle,
      ...(widgetState.settings?.completedStyle || {})
    }
  }), [widgetState.settings]);

  const [newTodoText, setNewTodoText] = React.useState('');
  const [draggedTodo, setDraggedTodo] = React.useState<TodoItem | null>(null);

  // Use the todos from persistent state
  const todos = widgetState.data?.todos || [];

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date(),
      status: 'todo',
      order: todos.length
    };

    updateWidgetState({
      data: { 
        todos: [...todos, newTodo],
        dragTarget: widgetState.data?.dragTarget || null
      }
    });
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    updateWidgetState({
      data: {
        todos: todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
        dragTarget: widgetState.data?.dragTarget || null
      }
    });
  };

  const handleDeleteTodo = (id: string) => {
    updateWidgetState({
      data: {
        todos: todos.filter(todo => todo.id !== id),
        dragTarget: widgetState.data?.dragTarget || null
      }
    });
  };

  const handleSettingsChange = (newSettings: TodoSettings) => {
    const mergedSettings = {
      ...defaultSettings,
      ...newSettings,
      completedStyle: {
        ...defaultSettings.completedStyle,
        ...(newSettings.completedStyle || {})
      }
    };
    updateWidgetState({ settings: mergedSettings });
    if (onSettingsChange) {
      onSettingsChange(mergedSettings);
    }
  };

  const filteredTodos = React.useMemo(() => {
    let filtered = [...todos];
    if (!settings.showCompleted) {
      filtered = filtered.filter(todo => !todo.completed);
    }
    
    switch (settings.sortBy) {
      case 'completed':
        filtered.sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);
        break;
      case 'order':
        filtered.sort((a, b) => a.order - b.order);
        break;
      default:
        // 'createdAt' - maintain creation order (default)
        break;
    }
    
    return filtered;
  }, [todos, settings.showCompleted, settings.sortBy]);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, todo: TodoItem) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify(todo));
    e.currentTarget.classList.add('dragging');
    setDraggedTodo(todo);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragging');
    setDraggedTodo(null);
    
    // Remove all drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    const target = e.currentTarget;
    if (target && !target.classList.contains('dragging')) {
      target.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLIElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedTodo) return;
    
    const dropTargetId = e.currentTarget.getAttribute('data-id');
    if (!dropTargetId || dropTargetId === draggedTodo.id) return;

    const updatedTodos = [...todos];
    const draggedIndex = updatedTodos.findIndex(t => t.id === draggedTodo.id);
    const dropIndex = updatedTodos.findIndex(t => t.id === dropTargetId);
    
    if (draggedIndex === -1 || dropIndex === -1) return;

    // Remove the dragged item and insert it at the new position
    const [draggedItem] = updatedTodos.splice(draggedIndex, 1);
    updatedTodos.splice(dropIndex, 0, draggedItem);
    
    // Update order numbers
    updatedTodos.forEach((todo, index) => {
      todo.order = index;
    });

    // Update state with new todo order
    updateWidgetState({
      data: { 
        todos: updatedTodos,
        dragTarget: null
      }
    });
    
    setDraggedTodo(null);
  };

  const renderTodoList = () => (
    <div className="todo-list" data-checkbox-style={settings.checkboxStyle}>
      <form onSubmit={handleAddTodo} className="todo-input-form">
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <button type="submit" className="todo-add-button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
          Add
        </button>
      </form>
      <ul className="todo-items">
        {filteredTodos.map(todo => (
          <li
            key={todo.id}
            data-id={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, todo)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-status={todo.status}
            data-completed-style={[
              todo.completed && settings.completedStyle?.strikethrough && 'strikethrough',
              todo.completed && settings.completedStyle?.fade && 'fade'
            ].filter(Boolean).join(' ')}
          >
            <label className="todo-checkbox">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
              />
              <span className="checkmark"></span>
            </label>
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="todo-delete-button"
              title="Delete todo"
            >
              ×
            </button>
          </li>
        ))}
        {filteredTodos.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem', 
            opacity: 0.6,
            fontSize: '0.9rem' 
          }}>
            No todos yet
          </div>
        )}
      </ul>
    </div>
  );

  const renderCompactList = () => (
    <div className="todo-list compact" data-checkbox-style={settings.checkboxStyle}>
      <div className="todo-count">
        {todos.filter(t => !t.completed).length} remaining
      </div>
      <ul className="todo-items">
        {filteredTodos.slice(0, 3).map(todo => (
          <li
            key={todo.id}
            data-id={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, todo)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-status={todo.status}
            data-completed-style={[
              todo.completed && settings.completedStyle?.strikethrough && 'strikethrough',
              todo.completed && settings.completedStyle?.fade && 'fade'
            ].filter(Boolean).join(' ')}
          >
            <label className="todo-checkbox">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
              />
              <span className="checkmark"></span>
            </label>
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="todo-delete-button"
              title="Delete todo"
            >
              ×
            </button>
          </li>
        ))}
        {filteredTodos.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem', 
            opacity: 0.6,
            fontSize: '0.85rem' 
          }}>
            No todos
          </div>
        )}
      </ul>
    </div>
  );

  const renderContent = () => {
    const mode = settings.displayMode || todoSizeConfig.defaultMode;
    switch (mode) {
      case 'compact':
        return renderCompactList();
      case 'kanban':
        // We'll implement the kanban view later
        return <div>Kanban view coming soon!</div>;
      case 'list':
      default:
        return renderTodoList();
    }
  };

  return (
    <BaseWidget
      id={id}
      title="Todo"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={TodoSettings}
      sizeConfig={todoSizeConfig}
    >
      <div 
        className="todo-widget-content"
        data-checkbox-style={settings.checkboxStyle}
      >
        {renderContent()}
      </div>
    </BaseWidget>
  );
};

TodoWidget.widgetConfig = {
  id: 'todo',
  type: 'todo',
  title: 'Todo List',
  description: 'Keep track of tasks and todos',
  defaultSize: { width: 2, height: 2 }
};

export default TodoWidget; 