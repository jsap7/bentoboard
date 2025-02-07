import { CSSProperties } from 'react';

export interface GridPosition {
  column: number;
  row: number;
}

export interface GridSize {
  width: number;
  height: number;
}

// Base size configuration system
export type SizeCategory = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';

export interface SizeConfig<DisplayModeType> {
  category: SizeCategory;
  availableModes: DisplayModeType[];
  defaultMode: DisplayModeType;
  styles?: CSSProperties;
}

export interface WidgetSizeConfig<DisplayModeType> {
  getSizeConfig: (width: number, height: number) => SizeConfig<DisplayModeType>;
  defaultMode: DisplayModeType;
}

// Custom CSS Properties for widgets
export interface CustomCSSProperties extends CSSProperties {
  '--grid-width'?: number;
  '--grid-height'?: number;
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
  availableModes?: any[];
}

export interface BaseWidgetProps extends WidgetProps {
  title: string;
  children: React.ReactNode;
  SettingsComponent?: React.ComponentType<WidgetSettingsProps>;
  sizeConfig?: WidgetSizeConfig<any>;
}

// Clock-specific types
export type ClockDisplayMode = 'digital' | 'analog' | 'minimal';

export interface ClockSettings {
  showSeconds: boolean;
  showDate: boolean;
  use24Hour: boolean;
  displayMode?: ClockDisplayMode;
} 