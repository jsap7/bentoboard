# Contributing to BentoBoard

First off, thank you for considering contributing to BentoBoard! It's people like you that make BentoBoard such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check [this list](https://github.com/jsap7/desktop-app/issues) as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible
* Include your environment details (OS, browser version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/jsap7/desktop-app/issues). When creating an enhancement suggestion, please include:

* A clear and descriptive title
* A detailed description of the proposed feature
* Any possible drawbacks or limitations
* Mock-ups or examples if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Process

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/desktop-app.git
   cd desktop-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Project Structure

```
src/
├── components/        # Core components
├── contexts/         # React contexts
├── hooks/           # Custom React hooks
├── registry/        # Widget registry
├── utils/           # Utility functions
└── widgets/         # Individual widget components
    ├── clock/
    ├── todo/
    ├── weather/
    └── ...
```

### Creating a New Widget

1. Create a new directory in `src/widgets/your-widget/`
2. Implement the widget component following our [Widget Development Guide](docs/widget-development.md)
3. Register your widget in `src/registry/widgetRegistry.js`
4. Add tests and documentation

### Coding Style

* Use TypeScript for new code
* Follow the existing code style
* Use meaningful variable and function names
* Add comments for complex logic
* Keep functions small and focused
* Use proper TypeScript types and interfaces

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### Testing

* Write tests for new features
* Update tests when modifying existing functionality
* Run the test suite before submitting:
  ```bash
  npm test
  ```

## Documentation

* Update the README.md with details of changes to the interface
* Update the API documentation for any modified endpoints
* Add JSDoc comments for new functions and classes
* Update the widget development guide if adding new widget capabilities

## Community

* Join our [Discord server](https://discord.gg/bentoboard)
* Participate in [GitHub Discussions](https://github.com/jsap7/desktop-app/discussions)
* Follow us on [Twitter](https://twitter.com/bentoboard)

## Questions?

Feel free to open an issue or join our Discord server if you have any questions about contributing! 