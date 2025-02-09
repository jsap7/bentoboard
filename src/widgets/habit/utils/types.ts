export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  lastCompleted: string | null;
  completedDates: string[];
  color?: string;
}

export interface HabitSettings {
  theme: 'modern' | 'minimal';
  showStreak: boolean;
  showDescription: boolean;
  sortBy: 'name' | 'streak' | 'lastCompleted';
  sortDirection: 'asc' | 'desc';
  defaultFrequency: 'daily' | 'weekly';
  defaultColor?: string;
} 