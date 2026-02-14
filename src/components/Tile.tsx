import React from 'react'

interface TileProps {
  value: number | null
}

export const Tile: React.FC<TileProps> = ({ value }) => {
  const getBackgroundColor = (val: number | null): string => {
    const colors: Record<number, string> = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e'
    }
    return colors[val!] || '#cdc1b4'
  }

  const getTextColor = (val: number | null): string => {
    return val === null || val === 2 || val === 4 ? '#776e65' : '#f9f6f2'
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
