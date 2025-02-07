import { CSSProperties } from 'react';

export interface GridPosition {
  x: number;
  y: number;
}

export interface GridSize {
  width: number;
  height: number;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  description: string;
  defaultSize: GridSize;
  defaultSettings?: any;
}

export interface WidgetProps {
  id: string;
  style?: CSSProperties;
  settings?: any;
  onSettingsChange?: (settings: any) => void;
  onResize?: (size: GridSize) => void;
  onDrag?: (position: GridPosition) => void;
  onClose?: () => void;
  gridPosition: GridPosition;
  gridSize: GridSize;
}

export interface WidgetSettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onClose: () => void;
}

export interface BaseWidgetProps extends WidgetProps {
  title: string;
  children: React.ReactNode;
  SettingsComponent?: React.ComponentType<WidgetSettingsProps>;
} 