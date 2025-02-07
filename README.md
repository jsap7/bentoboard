# BentoBoard 🍱

A modern, customizable personal dashboard with a beautiful dark UI and widget support. BentoBoard provides a flexible grid-based layout where you can add, resize, and customize various widgets to create your perfect dashboard.

![BentoBoard Screenshot](BentoBoard.jpeg)

## ✨ Features

- 🎯 Responsive grid-based dashboard layout (12×6 by default)
- 🎨 Modern, clean UI with dark theme and frosted glass effects
- 🔄 Draggable and resizable widgets with smart snapping
- 💾 Persistent widget states and settings via localStorage
- ⚡ Real-time widget updates
- 🎭 Multiple widget themes and display modes
- 🎛️ Global settings for fonts and accent colors
- 🧩 Extensible widget system

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jsap7/desktop-app.git
cd desktop-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will open in your default browser at `http://localhost:3000`.

## 🧩 Available Widgets

### Clock Widget
- Digital time display with multiple themes
- Configurable date display
- 12/24-hour format support
- Optional seconds and milliseconds
- Multiple display modes: Digital and Minimal

### Todo Widget
- Add, complete, and delete tasks
- Drag and drop reordering
- Multiple view modes
- Persistent task storage
- Customizable checkbox styles

## 🛠️ Creating New Widgets

BentoBoard uses a widget registry system that makes it easy to add new widgets. Here's how to create a new widget:

1. Create a new directory in `src/widgets/your-widget/`:
```
your-widget/
├── YourWidget.tsx
├── components/
│   └── YourWidgetSettings.tsx
├── utils/
│   └── yourWidgetUtils.ts
└── styles/
    └── YourWidget.css
```

2. Implement your widget component:
```typescript
import React from 'react';
import BaseWidget from '../../components/BaseWidget';
import { WidgetProps } from '../shared/types';
import './styles/YourWidget.css';

const YourWidget: React.FC<WidgetProps> = ({
  id,
  gridPosition,
  gridSize,
  settings,
  onClose,
  onResize,
  onDrag
}) => {
  return (
    <BaseWidget
      id={id}
      title="Your Widget"
      gridPosition={gridPosition}
      gridSize={gridSize}
      onClose={onClose}
      onResize={onResize}
      onDrag={onDrag}
      settings={settings}
      SettingsComponent={YourWidgetSettings}
    >
      {/* Your widget content */}
    </BaseWidget>
  );
};

// Widget configuration
YourWidget.widgetConfig = {
  id: 'your-widget',
  type: 'your-widget',
  title: 'Your Widget',
  description: 'Description of your widget',
  defaultSize: { width: 2, height: 2 }
};

export default YourWidget;
```

3. Register your widget in `src/registry/widgetRegistry.js`:
```javascript
import YourWidget from '../widgets/your-widget/YourWidget';
import { FiBox } from 'react-icons/fi'; // Choose an icon

// Register your widget
registerWidget('your-widget', {
  component: YourWidget,
  icon: FiBox,
  title: 'Your Widget',
  description: 'Description of your widget',
  defaultSize: { width: 2, height: 2 }
});
```

### Widget Development Guidelines

1. **State Management**
   - Use the `useWidgetState` hook for persistent state
   - Implement proper cleanup in useEffect hooks
   - Handle widget resizing gracefully

2. **Styling**
   - Follow the existing CSS naming conventions
   - Use CSS variables for theming
   - Support different size categories
   - Implement proper dark theme support

3. **Settings**
   - Create a settings component if needed
   - Use the standard settings UI components
   - Implement proper validation
   - Save settings using the widget state context

4. **Performance**
   - Optimize re-renders using React.memo where appropriate
   - Use proper event cleanup
   - Implement proper loading states

## 🎨 Customization

### Theme System
BentoBoard uses a theme system with CSS variables. Key customization points:

- Accent colors
- Font families
- Widget-specific themes
- Frosted glass effects
- Grid layout settings

### Grid System
The dashboard uses a 12×6 grid by default. Widgets can:

- Span multiple grid cells
- Be dragged to any position
- Auto-snap to grid
- Detect collisions
- Maintain aspect ratio (optional)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 