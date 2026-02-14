import React from 'react'
import { Game } from './components/Game'
import { ThemeProvider } from './themes/ThemeContext'

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <Game />
      </div>
    </ThemeProvider>
  )
}

export default App
