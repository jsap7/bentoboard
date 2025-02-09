import React, { useState } from 'react';
import { Habit, HabitSettings } from '../utils/types';
import { isHabitDue } from '../utils/habitUtils';

interface HabitListProps {
  habits: Habit[];
  settings: HabitSettings;
  onToggleHabit: (id: string) => void;
  onDeleteHabit: (id: string) => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'lastCompleted'>) => void;
  isAddingHabit: boolean;
  onCancelAdd: () => void;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  settings,
  onToggleHabit,
  onDeleteHabit,
  onAddHabit,
  isAddingHabit,
  onCancelAdd
}) => {
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: settings.defaultFrequency,
    color: settings.defaultColor
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.name.trim()) {
      onAddHabit(newHabit);
      setNewHabit({
        name: '',
        description: '',
        frequency: settings.defaultFrequency,
        color: settings.defaultColor
      });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="habit-list">
      {habits.map(habit => {
        const isCompleted = habit.completedDates.includes(today);
        const isDue = isHabitDue(habit);

        return (
          <div
            key={habit.id}
            className={`habit-item ${isCompleted ? 'completed' : ''} ${isDue ? 'due' : ''}`}
            style={{ '--habit-color': habit.color } as React.CSSProperties}
          >
            <button
              className="habit-checkbox"
              onClick={() => onToggleHabit(habit.id)}
              aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'}`}
            >
              {isCompleted && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>

            <div className="habit-content">
              <div className="habit-header">
                <h3 className="habit-name">{habit.name}</h3>
                <button
                  className="habit-delete"
                  onClick={() => onDeleteHabit(habit.id)}
                  aria-label={`Delete ${habit.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {settings.showDescription && habit.description && (
                <p className="habit-description">{habit.description}</p>
              )}

              <div className="habit-meta">
                <span className="habit-frequency">{habit.frequency}</span>
                {settings.showStreak && habit.streak > 0 && (
                  <span className="habit-streak">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    {habit.streak}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {isAddingHabit && (
        <form className="add-habit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Habit name"
            value={newHabit.name}
            onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
            className="habit-input"
            autoFocus
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newHabit.description}
            onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
            className="habit-input"
          />
          <div className="habit-form-row">
            <select
              value={newHabit.frequency}
              onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value as 'daily' | 'weekly' })}
              className="habit-select"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <input
              type="color"
              value={newHabit.color}
              onChange={e => setNewHabit({ ...newHabit, color: e.target.value })}
              className="habit-color-picker"
            />
          </div>
          <div className="habit-form-actions">
            <button type="submit" className="habit-submit">Add Habit</button>
            <button type="button" className="habit-cancel" onClick={onCancelAdd}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HabitList; 