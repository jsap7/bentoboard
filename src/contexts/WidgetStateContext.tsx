import React from 'react';
import { GridPosition, GridSize, WidgetConfig } from '../widgets/shared/types';

interface WidgetState {
  id: string;
  gridPosition: GridPosition;
  gridSize: GridSize;
  settings: any;
}

interface WidgetStateContextType {
  states: { [key: string]: WidgetState };
  updateState: (id: string, updates: Partial<WidgetState>) => void;
}

const WidgetStateContext = React.createContext<WidgetStateContextType>({
  states: {},
  updateState: () => {},
});

export const WidgetStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [states, setStates] = React.useState<{ [key: string]: WidgetState }>(() => {
    // Load saved states from localStorage
    const savedStates = localStorage.getItem('widgetStates');
    return savedStates ? JSON.parse(savedStates) : {};
  });

  // Save states to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('widgetStates', JSON.stringify(states));
  }, [states]);

  const updateState = React.useCallback((id: string, updates: Partial<WidgetState>) => {
    setStates(prevStates => ({
      ...prevStates,
      [id]: {
        ...prevStates[id],
        ...updates,
      },
    }));
  }, []);

  return (
    <WidgetStateContext.Provider value={{ states, updateState }}>
      {children}
    </WidgetStateContext.Provider>
  );
};

export const useWidgetState = (config: {
  id: string;
  initialGridPosition: GridPosition;
  initialGridSize: GridSize;
  initialSettings: any;
}) => {
  const { states, updateState } = React.useContext(WidgetStateContext);
  
  // Initialize state if it doesn't exist
  React.useEffect(() => {
    if (!states[config.id]) {
      updateState(config.id, {
        id: config.id,
        gridPosition: config.initialGridPosition,
        gridSize: config.initialGridSize,
        settings: config.initialSettings,
      });
    }
  }, [config.id]);

  const widgetState = states[config.id] || {
    id: config.id,
    gridPosition: config.initialGridPosition,
    gridSize: config.initialGridSize,
    settings: config.initialSettings,
  };

  const updateWidgetState = React.useCallback((updates: Partial<WidgetState>) => {
    updateState(config.id, updates);
  }, [config.id, updateState]);

  return [widgetState, updateWidgetState] as const;
}; 