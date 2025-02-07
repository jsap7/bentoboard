import { GridSize } from 'react-grid-layout';

export interface WidgetDefinition {
  name: string;
  description: string;
  defaultSize: GridSize;
  component: React.ComponentType<any>;
}

export interface WidgetRegistry {
  [key: string]: WidgetDefinition;
}

export const useWidgetRegistry = () => {
  // This will be populated with actual widget definitions when we implement them
  const widgetRegistry: WidgetRegistry = {
    clock: {
      name: 'Clock',
      description: 'A customizable clock widget with digital and analog displays',
      defaultSize: { w: 2, h: 2 },
      component: () => null // Placeholder
    },
    todo: {
      name: 'Todo List',
      description: 'Keep track of your tasks with this simple todo list',
      defaultSize: { w: 3, h: 4 },
      component: () => null // Placeholder
    }
  };

  return { widgetRegistry };
}; 