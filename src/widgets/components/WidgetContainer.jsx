import React from 'react';
import PropTypes from 'prop-types';
import widgetRegistry from '../registry/WidgetRegistry';
import { useWidgets } from '../core/WidgetContext';
import './WidgetContainer.css';

const WidgetContainer = ({ className }) => {
  const { widgets, removeWidget, updateWidget } = useWidgets();

  const handleWidgetClose = (widgetId) => {
    removeWidget(widgetId);
  };

  const handleWidgetMinimize = (widgetId, isMinimized) => {
    updateWidget(widgetId, { isMinimized });
  };

  const handleWidgetSettingsChange = (widgetId, newSettings) => {
    updateWidget(widgetId, { settings: newSettings });
  };

  return (
    <div className={`widget-container ${className || ''}`}>
      {widgets.map(widget => {
        const widgetConfig = widgetRegistry.getWidget(widget.type);
        if (!widgetConfig) return null;

        const WidgetComponent = widgetConfig.component;
        
        return (
          <div
            key={widget.id}
            className="widget-wrapper"
            style={{
              gridColumn: `span ${widget.size?.width || widgetConfig.defaultSize.width}`,
              gridRow: `span ${widget.size?.height || widgetConfig.defaultSize.height}`
            }}
          >
            <WidgetComponent
              id={widget.id}
              settings={widget.settings || widgetConfig.defaultSettings}
              onSettingsChange={(newSettings) => handleWidgetSettingsChange(widget.id, newSettings)}
              onClose={() => handleWidgetClose(widget.id)}
              onMinimize={(isMinimized) => handleWidgetMinimize(widget.id, isMinimized)}
            />
          </div>
        );
      })}
    </div>
  );
};

WidgetContainer.propTypes = {
  className: PropTypes.string
};

export default WidgetContainer; 