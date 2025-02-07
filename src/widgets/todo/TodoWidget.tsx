import React from 'react';
import BaseWidget from '../../components/BaseWidget';
import TodoSettings from './components/TodoSettings';
import { WidgetProps, WidgetSizeConfig } from '../shared/types';
import './styles/TodoWidget.css';
import { useWidgetState } from '../../hooks/useWidgetState';

// Todo-specific types
export type TodoDisplayMode = 'list' | 'compact' | 'kanban';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoSettings {
  displayMode?: TodoDisplayMode;
  showCompleted: boolean;
  sortBy: 'createdAt' | 'completed';
}

interface TodoWidgetState {
  todos: TodoItem[];
}

interface TodoWidgetProps extends WidgetProps {}

interface TodoWidgetComponent extends React.FC<TodoWidgetProps> {
  widgetConfig: any;
}

// Size configuration for Todo widget
const todoSizeConfig: WidgetSizeConfig<TodoDisplayMode> = {
  getSizeConfig: (width, height) => {
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
    initialSettings: externalSettings || { showCompleted: true, sortBy: 'createdAt' },
    initialData: { todos: [] }
  });

  const [newTodoText, setNewTodoText] = React.useState('');

  // Use the todos from persistent state
  const todos = widgetState.data?.todos || [];
  const settings = widgetState.settings!;

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date()
    };

    updateWidgetState({
      data: { todos: [...todos, newTodo] }
    });
    setNewTodoText('');
  };

  const handleToggleTodo = (id: string) => {
    updateWidgetState({
      data: {
        todos: todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      }
    });
  };

  const handleDeleteTodo = (id: string) => {
    updateWidgetState({
      data: {
        todos: todos.filter(todo => todo.id !== id)
      }
    });
  };

  const handleSettingsChange = (newSettings: TodoSettings) => {
    updateWidgetState({ settings: newSettings });
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const filteredTodos = React.useMemo(() => {
    let filtered = [...todos];
    if (!settings.showCompleted) {
      filtered = filtered.filter(todo => !todo.completed);
    }
    
    // Only sort if explicitly set to 'completed', otherwise maintain creation order
    if (settings.sortBy === 'completed') {
      filtered.sort((a, b) => {
        return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
      });
    }
    
    return filtered;
  }, [todos, settings.showCompleted, settings.sortBy]);

  const renderTodoList = () => (
    <div className="todo-list">
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
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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
    <div className="todo-list compact">
      <div className="todo-count">
        {todos.filter(t => !t.completed).length} remaining
      </div>
      <ul className="todo-items">
        {filteredTodos.slice(0, 3).map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <label className="todo-checkbox">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
              />
              <span className="checkmark"></span>
            </label>
            <span className="todo-text">{todo.text}</span>
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
      gridPosition={widgetState.gridPosition}
      gridSize={widgetState.gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={TodoSettings}
      sizeConfig={todoSizeConfig}
    >
      {renderContent()}
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