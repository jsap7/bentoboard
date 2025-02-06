import { widgetRegistry } from './core/WidgetRegistry';
import { weatherWidgetConfig } from './implementations/weather/WeatherWidget';
import { notesWidgetConfig } from './implementations/notes/NotesWidget';
import { calculatorWidgetConfig } from './implementations/calculator/CalculatorWidget';
import { gitHubStatsWidgetConfig } from './implementations/github-stats/GithubStatsWidget';

export function initializeWidgets() {
  widgetRegistry.register(weatherWidgetConfig);
  widgetRegistry.register(notesWidgetConfig);
  widgetRegistry.register(calculatorWidgetConfig);
  widgetRegistry.register(gitHubStatsWidgetConfig);
}

export { widgetRegistry }; 