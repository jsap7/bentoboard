import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseWidget from '../../core/BaseWidget';
import './TodoWidget.css';

const TodoWidget = ({ id, onClose, onMinimize, settings = {} }) => {
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

  const toggleTodo = (todoId) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (todoId) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  return (
    <BaseWidget
      id={id}
      title="Todo List"
      onClose={onClose}
      onMinimize={onMinimize}
      settings={settings}
      className="todo-widget"
    >
      <div className="todo-container">
        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="todo-add-button" disabled={!newTodo.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </form>
        <div className="todo-list">
          {todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <button 
                className="todo-checkbox" 
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
              >
                {todo.completed && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <span className="todo-text">{todo.text}</span>
              <button 
                className="todo-delete" 
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete task"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="todo-empty">No tasks yet. Add one above!</div>
          )}
        </div>
      </div>
    </BaseWidget>
  );
};

TodoWidget.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onMinimize: PropTypes.func,
  settings: PropTypes.object
};

// Register the widget
const todoWidgetConfig = {
  type: 'todo',
  component: TodoWidget,
  name: 'Todo List',
  description: 'Keep track of tasks and ideas',
  defaultSettings: {
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