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

export interface BaseSizeConfig<DisplayModeType> {
  category: SizeCategory;
  availableModes: DisplayModeType[];
  defaultMode: DisplayModeType;
  styles: {
    padding?: string;
    fontSize?: string;
    gap?: string;
    [key: string]: string | undefined;
  };
}

export interface BaseWidgetSizeConfig<DisplayModeType> {
  getSizeConfig: (width: number, height: number) => BaseSizeConfig<DisplayModeType>;
  defaultMode: DisplayModeType;
}

// Custom CSS Properties for widgets
export interface CustomCSSProperties extends CSSProperties {
  '--grid-width'?: number;
  '--grid-height'?: number;
  '--widget-padding'?: string;
  '--content-gap'?: string;
  '--font-size'?: string;
  [key: `--${string}`]: string | number | undefined;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  description: string;
  defaultSize: GridSize;
  defaultSettings?: any;
}

// Add new interfaces for drag and resize events
export interface DragEventData {
  mouseX: number;
  mouseY: number;
  startPosition: GridPosition;
  size: GridSize;
  widgetRect: DOMRect;
  dashboardRect: DOMRect;
}

export interface ResizeEventData {
  mouseX: number;
  mouseY: number;
  startPosition: GridPosition;
  startSize: GridSize;
  direction: {
    isLeft: boolean;
    isTop: boolean;
    isRight: boolean;
    isBottom: boolean;
  };
  widgetRect: DOMRect;
}

// Update WidgetProps to include the new event types
export interface WidgetProps {
  id: string;
  style?: CSSProperties;
  settings?: any;
  onSettingsChange?: (settings: any) => void;
  onResize?: (data: ResizeEventData) => GridSize | null;
  onDrag?: (data: DragEventData) => GridPosition | null;
  onClose?: () => void;
  gridPosition: GridPosition;
  gridSize: GridSize;
}

export interface WidgetSettingsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
  onClose: () => void;
  availableModes?: string[];
}

export interface BaseWidgetProps extends WidgetProps {
  title: string;
  children: React.ReactNode;
  SettingsComponent?: React.ComponentType<WidgetSettingsProps>;
  sizeConfig?: BaseWidgetSizeConfig<any>;
}

// Clock-specific types
export type ClockDisplayMode = 'digital' | 'analog' | 'minimal';

export interface ClockSettings {
  showSeconds: boolean;
  showDate: boolean;
  use24Hour: boolean;
  displayMode?: ClockDisplayMode;
}

export interface BaseWidgetState<T = any, S = any> {
  id: string;
  gridPosition: GridPosition;
  gridSize: GridSize;
  settings?: S;
  data?: T;
  displayMode?: string;
} 