import React from 'react'
import { SettingsProvider } from './context/SettingsContext'
import TestDashboard from './widgets/test/TestDashboard'

function App() {
  return (
    <SettingsProvider>
      <TestDashboard />
    </SettingsProvider>
  )
}

export default App 