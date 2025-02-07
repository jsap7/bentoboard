import React from 'react';
import { WidgetStateProvider } from './contexts/WidgetStateContext';
import { GlobalProvider } from './contexts/GlobalContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import './styles.css';

function App() {
  return (
    <GlobalProvider>
      <WidgetStateProvider>
        <div className="App">
          <Header />
          <Dashboard />
        </div>
      </WidgetStateProvider>
    </GlobalProvider>
  );
}

export default App; 