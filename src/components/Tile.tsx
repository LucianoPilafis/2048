import React from 'react'
import { useTheme } from '../themes/ThemeContext'

interface TileProps {
  value: number | null
}

export const Tile: React.FC<TileProps> = ({ value }) => {
  const { palette } = useTheme()

  const getBackgroundColor = (val: number | null): string => {
    if (val === null) return palette.emptyCell
    return palette.tileColors[val] || palette.emptyCell
  }

  const getTextColor = (val: number | null): string => {
    return val === null || val === 2 || val === 4 ? palette.textDark : palette.textLight
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: getBackgroundColor(value),
        color: getTextColor(value),
        fontSize: value! > 1024 ? '30px' : '40px',
        fontWeight: 'bold',
        borderRadius: '3px',
        width: '75px',
        height: '75px',
        transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out'
      }}
    >
      {value}
    </div>
  )
}
