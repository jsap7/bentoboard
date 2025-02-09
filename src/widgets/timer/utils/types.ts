export type TimerMode = 'timer' | 'stopwatch';

export interface TimerPreset {
  id: string;
  name: string;
  duration: number; // in seconds
}

export interface TimerSettings {
  mode: TimerMode;
  soundEnabled: boolean;
  presets: TimerPreset[];
} 