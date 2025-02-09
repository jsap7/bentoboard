import { SizeCategory } from '../../shared/types';

export type WeatherDisplayMode = 'detailed' | 'minimal';
export type WeatherUnit = 'celsius' | 'fahrenheit';

export interface WeatherSettings {
  displayMode?: WeatherDisplayMode;
  unit: WeatherUnit;
  location?: string;
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
  useCurrentLocation: boolean;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  description: string;
  icon: string;
  location: string;
  lastUpdated: Date;
}

export interface WeatherSizeConfig {
  category: SizeCategory;
  availableModes: WeatherDisplayMode[];
  defaultMode: WeatherDisplayMode;
  styles: {
    padding?: string;
    fontSize?: string;
    gap?: string;
  };
} 