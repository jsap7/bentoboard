import React from 'react';
import { GridPosition, GridSize } from '../widgets/shared/types';

interface WidgetState {
  id: string;
  gridPosition: GridPosition;
  gridSize: GridSize;
  settings?: any;
  data?: any;
}

interface WidgetStateContextType {
  states: { [key: string]: WidgetState };
  updateState: (id: string, updates: Partial<WidgetState>) => void;
  removeState: (id: string) => void;
}

const WidgetStateContext = React.createContext<WidgetStateContextType>({
  states: {},
  updateState: () => {},
  removeState: () => {},
});

// Helper function to safely interact with localStorage
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

export const WidgetStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [states, setStates] = React.useState<{ [key: string]: WidgetState }>({});

  // Save states to localStorage whenever they change
  React.useEffect(() => {
    Object.entries(states).forEach(([id, state]) => {
      storage.set(`widget-${id}`, state);
    });
  }, [states]);

  const updateState = React.useCallback((id: string, updates: Partial<WidgetState>) => {
    setStates(prevStates => {
      const newState = {
        ...prevStates,
        [id]: {
          ...prevStates[id],
          ...updates,
        },
      };
      return newState;
    });
  }, []);

  const removeState = React.useCallback((id: string) => {
    setStates(prevStates => {
      const newStates = { ...prevStates };
      delete newStates[id];
      storage.remove(`widget-${id}`);
      return newStates;
    });
  }, []);

  return (
    <WidgetStateContext.Provider value={{ states, updateState, removeState }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

export const useWidgetState = (config: {
  id: string;
  initialGridPosition: GridPosition;
  initialGridSize: GridSize;
  initialSettings?: any;
  initialData?: any;
}) => {
  const { states, updateState } = React.useContext(WidgetStateContext);
  
  // Initialize state if it doesn't exist
  React.useEffect(() => {
    if (!states[config.id]) {
      // Try to load existing state from localStorage
      const savedState = storage.get(`widget-${config.id}`);
      
      const initialState = savedState || {
        id: config.id,
        gridPosition: config.initialGridPosition,
        gridSize: config.initialGridSize,
        settings: config.initialSettings || {},
        data: config.initialData || {}
      };
      
      updateState(config.id, initialState);
    }
  }, [config.id]);

  const widgetState = states[config.id] || {
    id: config.id,
    gridPosition: config.initialGridPosition,
    gridSize: config.initialGridSize,
    settings: config.initialSettings || {},
    data: config.initialData || {}
  };

  const updateWidgetState = React.useCallback((updates: Partial<WidgetState>) => {
    updateState(config.id, updates);
  }, [config.id, updateState]);

  return [widgetState, updateWidgetState] as const;
}; 