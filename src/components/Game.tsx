import React, { useState, useEffect } from 'react'
import { initializeGame, move, GameState } from '../game/logic'
import { Tile } from './Tile'
import { PaletteSelector } from './PaletteSelector'
import { useTheme } from '../themes/ThemeContext'

export const Game: React.FC = () => {
  const [state, setState] = useState<GameState>(initializeGame)
  const { palette } = useTheme()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const directionMap: Record<string, 'left' | 'right' | 'up' | 'down'> = {
          ArrowLeft: 'left',
          ArrowRight: 'right',
          ArrowUp: 'up',
          ArrowDown: 'down'
        }
        setState((prev) => move(directionMap[e.key], prev))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleNewGame = () => {
    setState(initializeGame())
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: palette.background,
        padding: '20px'
      }}
    >
      <h1 style={{ marginBottom: '20px', color: palette.textDark }}>2048</h1>

      <PaletteSelector />

      <div style={{ marginBottom: '20px', display: 'flex', gap: '40px', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '14px', color: palette.scoreLabel, margin: 0 }}>Score</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: palette.textDark, margin: '5px 0 0 0' }}>
            {state.score}
          </p>
        </div>
        <button
          onClick={handleNewGame}
          style={{
            padding: '10px 20px',
            backgroundColor: palette.buttonBg,
            color: palette.buttonText,
            border: 'none',
            borderRadius: '3px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          New Game
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 75px)',
          gridTemplateRows: 'repeat(4, 75px)',
          gap: '10px',
          backgroundColor: palette.board,
          padding: '10px',
          borderRadius: '3px',
          width: 'fit-content',
          height: 'fit-content',
          maxWidth: '100%',
          boxSizing: 'border-box' as const,
          overflow: 'hidden'
        }}
      >
        {state.grid.map((row, i) =>
          row.map((value, j) => (
            <Tile key={`${i}-${j}`} value={value} />
          ))
        )}
      </div>

      {state.won && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: palette.winBg,
            color: palette.winText,
            borderRadius: '3px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          🎉 You won! Keep going or start a new game.
        </div>
      )}

      {state.gameOver && (
        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: palette.gameOverBg,
            color: palette.gameOverText,
            borderRadius: '3px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          Game Over! Start a new game to play again.
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center', color: palette.scoreLabel, fontSize: '14px' }}>
        <p>Use arrow keys to move tiles</p>
        <p>When two tiles with the same number touch, they merge!</p>
      </div>
    </div>
  )
}
