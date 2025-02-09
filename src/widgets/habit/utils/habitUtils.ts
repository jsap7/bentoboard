import { HabitSettings } from './types';

export const getDefaultSettings = (): HabitSettings => ({
  theme: 'modern',
  showStreak: true,
  showDescription: true,
  sortBy: 'name',
  sortDirection: 'asc',
  defaultFrequency: 'daily',
  defaultColor: '#6366f1'
});

export const calculateStreak = (completedDates: string[], frequency: 'daily' | 'weekly'): number => {
  if (completedDates.length === 0) return 0;

  const sortedDates = [...completedDates].sort((a, b) => b.localeCompare(a));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = today;
  let lastCompletedDate = new Date(sortedDates[0]);
  lastCompletedDate.setHours(0, 0, 0, 0);

  // If the habit wasn't completed today/this week, check if it's still within the grace period
  const gracePeriod = frequency === 'daily' ? 1 : 7; // 1 day for daily, 7 days for weekly
  const timeDiff = Math.floor((today.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (timeDiff > gracePeriod) return 0;

  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    if (frequency === 'daily') {
      // For daily habits, check consecutive days
      const dayDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff <= 1) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    } else {
      // For weekly habits, check if there's at least one completion in each week
      const weekDiff = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 7));
      if (weekDiff <= 1) {
        streak++;
        currentDate = date;
      } else {
        break;
      }
    }
  }

  return streak;
};

export const isHabitDue = (habit: { frequency: string; completedDates: string[] }): boolean => {
  if (habit.completedDates.length === 0) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastCompletedDate = new Date(habit.completedDates[habit.completedDates.length - 1]);
  lastCompletedDate.setHours(0, 0, 0, 0);

  if (habit.frequency === 'daily') {
    return today.getTime() > lastCompletedDate.getTime();
  } else {
    // For weekly habits, check if it was completed this week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return lastCompletedDate < startOfWeek;
  }
}; 