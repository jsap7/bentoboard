import React from 'react'
import Timer from './components/timer/Timer'
import { SettingsProvider } from './context/SettingsContext.jsx'

function App() {
  return (
    <SettingsProvider>
      <div className="app-container">
        <Timer />
      </div>
    </SettingsProvider>
  )
}

export default App 