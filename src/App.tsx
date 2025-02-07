import React from 'react';
import { WidgetStateProvider } from './contexts/WidgetStateContext';
// ... existing imports ...

function App() {
  return (
    <WidgetStateProvider>
      <div className="App">
        // ... existing app content ...
      </div>
    </WidgetStateProvider>
  );
}

export default App; 