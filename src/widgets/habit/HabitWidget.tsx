import React, { useState, useEffect } from 'react';
import BaseWidget from '../../components/BaseWidget';
import HabitSettings from './components/HabitSettings';
import HabitList from './components/HabitList';
import { WidgetProps } from '../shared/types';
import { useWidgetState } from '../../contexts/WidgetStateContext';
import { Habit, HabitSettings as HabitSettingsType } from './utils/types';
import { getDefaultSettings, calculateStreak, isHabitDue } from './utils/habitUtils';
import './styles/HabitWidget.css';

interface HabitWidgetProps extends WidgetProps {}

interface HabitWidgetComponent extends React.FC<HabitWidgetProps> {
  widgetConfig: any;
}

const HabitWidget: HabitWidgetComponent = ({
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

  const settings = widgetState.settings as HabitSettingsType;
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem(`habits-${id}`);
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, [id]);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`habits-${id}`, JSON.stringify(habits));
  }, [habits, id]);

  const handleAddHabit = (habit: Omit<Habit, 'id' | 'streak' | 'completedDates' | 'lastCompleted'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      streak: 0,
      completedDates: [],
      lastCompleted: null
    };
    setHabits([...habits, newHabit]);
    setIsAddingHabit(false);
  };

  const handleToggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const wasCompletedToday = habit.completedDates.includes(today);
        let newCompletedDates = wasCompletedToday
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];

        return {
          ...habit,
          completedDates: newCompletedDates,
          lastCompleted: wasCompletedToday ? null : today,
          streak: calculateStreak(newCompletedDates, habit.frequency)
        };
      }
      return habit;
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const handleSettingsChange = (newSettings: HabitSettingsType) => {
    updateWidgetState({ settings: newSettings });
  };

  const sortedHabits = [...habits].sort((a, b) => {
    switch (settings.sortBy) {
      case 'name':
        return settings.sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'streak':
        return settings.sortDirection === 'asc'
          ? a.streak - b.streak
          : b.streak - a.streak;
      case 'lastCompleted':
        const aDate = a.lastCompleted || '0';
        const bDate = b.lastCompleted || '0';
        return settings.sortDirection === 'asc'
          ? aDate.localeCompare(bDate)
          : bDate.localeCompare(aDate);
      default:
        return 0;
    }
  });

  return (
    <BaseWidget
      id={id}
      title="Habits"
      style={style}
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      onSettingsChange={handleSettingsChange}
      SettingsComponent={HabitSettings}
    >
      <div className="habit-widget-content" data-theme={settings.theme}>
        <div className="habit-header">
          <button 
            className="add-habit-button"
            onClick={() => setIsAddingHabit(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Habit
          </button>
        </div>

        <HabitList
          habits={sortedHabits}
          settings={settings}
          onToggleHabit={handleToggleHabit}
          onDeleteHabit={handleDeleteHabit}
          onAddHabit={handleAddHabit}
          isAddingHabit={isAddingHabit}
          onCancelAdd={() => setIsAddingHabit(false)}
        />

        {habits.length === 0 && !isAddingHabit && (
          <div className="habits-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v6m0 0v6m0-6h6m-6 0H6" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p>Add your first habit to start tracking</p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

HabitWidget.widgetConfig = {
  id: 'habit',
  type: 'habit',
  title: 'Habit Tracker',
  description: 'Track and maintain daily and weekly habits',
  defaultSize: { width: 2, height: 3 },
  minSize: { width: 2, height: 2 },
  maxSize: { width: 4, height: 6 }
};

export default HabitWidget; 