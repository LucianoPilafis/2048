import React from 'react'
import { useTheme } from '../themes/ThemeContext'
import { PALETTES, PaletteId } from '../themes/palettes'

const paletteIds = Object.keys(PALETTES) as PaletteId[]

export const PaletteSelector: React.FC = () => {
  const { palette, paletteId, setPaletteId } = useTheme()

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      {paletteIds.map((id) => {
        const p = PALETTES[id]
        const isActive = id === paletteId
        return (
          <button
            key={id}
            onClick={() => setPaletteId(id)}
            data-palette={id}
            data-active={isActive}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              border: isActive ? `2px solid ${palette.textDark}` : '2px solid transparent',
              borderRadius: '4px',
              backgroundColor: isActive ? palette.board : 'transparent',
              color: isActive ? palette.buttonText : palette.textDark,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: isActive ? 'bold' : 'normal',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: p.board,
                border: '1px solid rgba(0,0,0,0.2)',
                flexShrink: 0
              }}
            />
            {p.name}
          </button>
        )
      })}
    </div>
  )
}
