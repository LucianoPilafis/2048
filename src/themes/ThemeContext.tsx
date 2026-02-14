import React, { createContext, useContext, useState, useEffect } from 'react'
import { Palette, PaletteId, PALETTES, DEFAULT_PALETTE_ID } from './palettes'

interface ThemeContextValue {
  palette: Palette
  paletteId: PaletteId
  setPaletteId: (id: PaletteId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getInitialPaletteId(): PaletteId {
  try {
    const stored = localStorage.getItem('2048-palette')
    if (stored && stored in PALETTES) {
      return stored as PaletteId
    }
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_PALETTE_ID
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paletteId, setPaletteId] = useState<PaletteId>(getInitialPaletteId)

  useEffect(() => {
    try {
      localStorage.setItem('2048-palette', paletteId)
    } catch {
      // localStorage unavailable
    }
  }, [paletteId])

  const value: ThemeContextValue = {
    palette: PALETTES[paletteId],
    paletteId,
    setPaletteId
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
