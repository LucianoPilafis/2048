export interface Palette {
  name: string
  background: string
  board: string
  emptyCell: string
  textDark: string
  textLight: string
  buttonBg: string
  buttonText: string
  scoreLabel: string
  tileColors: Record<number, string>
  winBg: string
  winText: string
  gameOverBg: string
  gameOverText: string
}

export type PaletteId = 'classic' | 'dark' | 'highContrast' | 'ocean'

export const DEFAULT_PALETTE_ID: PaletteId = 'classic'

export const PALETTES: Record<PaletteId, Palette> = {
  classic: {
    name: 'Classic',
    background: '#FAF8EF',
    board: '#bbada0',
    emptyCell: '#cdc1b4',
    textDark: '#776e65',
    textLight: '#f9f6f2',
    buttonBg: '#8f7a66',
    buttonText: '#f9f6f2',
    scoreLabel: '#9f8f7f',
    tileColors: {
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
    },
    winBg: '#edc22e',
    winText: '#776e65',
    gameOverBg: '#f67c5f',
    gameOverText: '#f9f6f2'
  },
  dark: {
    name: 'Dark',
    background: '#0F1115',
    board: '#1E2430',
    emptyCell: '#2B3342',
    textDark: '#0F1115',
    textLight: '#E6E6E6',
    buttonBg: '#3B4252',
    buttonText: '#E6E6E6',
    scoreLabel: '#8892A0',
    tileColors: {
      2: '#4C566A',
      4: '#5E6A82',
      8: '#BF616A',
      16: '#D08770',
      32: '#EBCB8B',
      64: '#A3BE8C',
      128: '#88C0D0',
      256: '#81A1C1',
      512: '#5E81AC',
      1024: '#B48EAD',
      2048: '#A3BE8C'
    },
    winBg: '#A3BE8C',
    winText: '#0F1115',
    gameOverBg: '#BF616A',
    gameOverText: '#E6E6E6'
  },
  highContrast: {
    name: 'High Contrast',
    background: '#FFFFFF',
    board: '#000000',
    emptyCell: '#333333',
    textDark: '#000000',
    textLight: '#FFFFFF',
    buttonBg: '#000000',
    buttonText: '#FFFFFF',
    scoreLabel: '#555555',
    tileColors: {
      2: '#CCCCCC',
      4: '#AAAAAA',
      8: '#FF6600',
      16: '#FF3300',
      32: '#CC0000',
      64: '#990000',
      128: '#0066FF',
      256: '#0033CC',
      512: '#003399',
      1024: '#6600CC',
      2048: '#FFD700'
    },
    winBg: '#FFD700',
    winText: '#000000',
    gameOverBg: '#FF0000',
    gameOverText: '#FFFFFF'
  },
  ocean: {
    name: 'Ocean',
    background: '#EAF6FF',
    board: '#2B6CB0',
    emptyCell: '#63B3ED',
    textDark: '#0B1320',
    textLight: '#F7FAFC',
    buttonBg: '#2C5282',
    buttonText: '#F7FAFC',
    scoreLabel: '#4A90B8',
    tileColors: {
      2: '#BEE3F8',
      4: '#90CDF4',
      8: '#63B3ED',
      16: '#4299E1',
      32: '#3182CE',
      64: '#2B6CB0',
      128: '#2C5282',
      256: '#2A4365',
      512: '#1A365D',
      1024: '#1E4D6E',
      2048: '#48BB78'
    },
    winBg: '#48BB78',
    winText: '#0B1320',
    gameOverBg: '#E53E3E',
    gameOverText: '#F7FAFC'
  }
}
