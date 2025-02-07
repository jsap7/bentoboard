# BentoBoard

A modern, customizable personal dashboard with widget support, built with React. BentoBoard provides a flexible grid-based layout where you can add, resize, and customize various widgets to create your perfect dashboard.

## Features

- 🎯 Grid-based dashboard layout
- 🎨 Modern, clean UI with dark theme
- 🔄 Resizable and draggable widgets
- ⚡ Real-time widget updates
- ⚙️ Customizable widget settings
- 🧩 Extensible widget system

## Getting Started

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

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

## Available Widgets

Currently available widgets:

- **Clock Widget**: Displays current time and date with customizable format options

## Adding New Widgets

BentoBoard uses a widget registry system that makes it easy to add new widgets. To create a new widget:

1. Create a new widget component in `src/widgets/`
2. Register the widget in `src/registry/widgetRegistry.js`
3. Implement the widget interface (BaseWidget)
4. Add any necessary settings and customization options

## Tech Stack

- React
- Webpack
- Babel
- CSS Modules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 