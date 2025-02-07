import { useState, useEffect } from 'react';
import { GridPosition, GridSize } from '../widgets/shared/types';

export interface WidgetState<T = any, S = any> {
  id: string;
  gridPosition: GridPosition;
  gridSize: GridSize;
  settings?: S;
  data?: T;
}

export function useWidgetState<T = any, S = any>({
  id,
  initialGridPosition,
  initialGridSize,
  initialSettings,
  initialData
}: {
  id: string;
  initialGridPosition: GridPosition;
  initialGridSize: GridSize;
  initialSettings?: S;
  initialData?: T;
}): [WidgetState<T, S>, (updates: Partial<WidgetState<T, S>>) => void] {
  // Initialize state from localStorage or use initial values
  const [state, setState] = useState<WidgetState<T, S>>(() => {
    const savedState = localStorage.getItem(`widget-${id}`);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Handle date objects in the data
      if (parsed.data) {
        Object.keys(parsed.data).forEach(key => {
          if (parsed.data[key] && typeof parsed.data[key] === 'string' && parsed.data[key].match(/^\d{4}-\d{2}-\d{2}T/)) {
            parsed.data[key] = new Date(parsed.data[key]);
          }
        });
      }
      return parsed;
    }
    return {
      id,
      gridPosition: initialGridPosition,
      gridSize: initialGridSize,
      settings: initialSettings,
      data: initialData
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(`widget-${id}`, JSON.stringify(state));
  }, [id, state]);

  // Update state with partial changes
  const updateState = (updates: Partial<WidgetState<T, S>>) => {
    setState(current => ({
      ...current,
      ...updates
    }));
  };

  return [state, updateState];
}

// Helper function to clear widget state from localStorage
export function clearWidgetState(id: string): void {
  localStorage.removeItem(`widget-${id}`);
}

// Helper function to get all saved widget states
export function getAllWidgetStates(): { [key: string]: WidgetState } {
  const states: { [key: string]: WidgetState } = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('widget-')) {
      const widgetId = key.replace('widget-', '');
      const state = localStorage.getItem(key);
      if (state) {
        states[widgetId] = JSON.parse(state);
      }
    }
  }
  return states;
} 