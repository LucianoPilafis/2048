export type Grid = (number | null)[][]

export interface GameState {
  grid: Grid
  score: number
  moves: number
  gameOver: boolean
  won: boolean
}

export function createEmptyGrid(): Grid {
  return Array(4)
    .fill(null)
    .map(() => Array(4).fill(null))
}

export function initializeGame(): GameState {
  const grid = createEmptyGrid()
  addNewTile(grid)
  addNewTile(grid)

  return {
    grid,
    score: 0,
    moves: 0,
    gameOver: false,
    won: false
  }
}

export function addNewTile(grid: Grid): void {
  const empty = getEmptyTiles(grid)
  if (empty.length === 0) return

  const [row, col] = empty[Math.floor(Math.random() * empty.length)]
  grid[row][col] = Math.random() < 0.9 ? 2 : 4
}

export function getEmptyTiles(grid: Grid): [number, number][] {
  const empty: [number, number][] = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === null) {
        empty.push([i, j])
      }
    }
  }
  return empty
}

function slide(row: (number | null)[]): { row: (number | null)[]; score: number } {
  let score = 0
  const result = row.filter((val) => val !== null) as number[]

  for (let i = 0; i < result.length - 1; i++) {
    if (result[i] === result[i + 1]) {
      result[i] *= 2
      score += result[i]
      result.splice(i + 1, 1)
    }
  }

  while (result.length < 4) {
    result.push(null as any)
  }

  return { row: result, score }
}

export function moveLeft(state: GameState): GameState {
  const newGrid = state.grid.map((row) => [...row])
  let score = 0

  for (let i = 0; i < 4; i++) {
    const { row, score: rowScore } = slide(newGrid[i])
    newGrid[i] = row
    score += rowScore
  }

  return { ...state, grid: newGrid, score: state.score + score }
}

export function moveRight(state: GameState): GameState {
  const newGrid = state.grid.map((row) => [...row].reverse())
  let score = 0

  for (let i = 0; i < 4; i++) {
    const { row, score: rowScore } = slide(newGrid[i])
    newGrid[i] = row.reverse()
    score += rowScore
  }

  return { ...state, grid: newGrid, score: state.score + score }
}

export function moveUp(state: GameState): GameState {
  const newGrid = createEmptyGrid()
  let score = 0

  for (let j = 0; j < 4; j++) {
    const column = [
      state.grid[0][j],
      state.grid[1][j],
      state.grid[2][j],
      state.grid[3][j]
    ]
    const { row, score: colScore } = slide(column)
    score += colScore

    for (let i = 0; i < 4; i++) {
      newGrid[i][j] = row[i]
    }
  }

  return { ...state, grid: newGrid, score: state.score + score }
}

export function moveDown(state: GameState): GameState {
  const newGrid = createEmptyGrid()
  let score = 0

  for (let j = 0; j < 4; j++) {
    const column = [
      state.grid[3][j],
      state.grid[2][j],
      state.grid[1][j],
      state.grid[0][j]
    ]
    const { row, score: colScore } = slide(column)
    score += colScore

    for (let i = 0; i < 4; i++) {
      newGrid[3 - i][j] = row[i]
    }
  }

  return { ...state, grid: newGrid, score: state.score + score }
}

export function isGridEqual(grid1: Grid, grid2: Grid): boolean {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid1[i][j] !== grid2[i][j]) return false
    }
  }
  return true
}

export function canMove(state: GameState): boolean {
  const directions = [
    moveLeft(state),
    moveRight(state),
    moveUp(state),
    moveDown(state)
  ]

  return directions.some((dir) => !isGridEqual(dir.grid, state.grid))
}

export function move(direction: 'left' | 'right' | 'up' | 'down', state: GameState): GameState {
  if (state.gameOver || state.won) return state

  let newState: GameState

  switch (direction) {
    case 'left':
      newState = moveLeft(state)
      break
    case 'right':
      newState = moveRight(state)
      break
    case 'up':
      newState = moveUp(state)
      break
    case 'down':
      newState = moveDown(state)
      break
  }

  if (isGridEqual(newState.grid, state.grid)) {
    return state
  }

  addNewTile(newState.grid)
  newState.moves += 1

  // Check for win
  if (!state.won) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newState.grid[i][j] === 2048) {
          newState.won = true
          break
        }
      }
    }
  }

  // Check for game over
  if (!canMove(newState)) {
    newState.gameOver = true
  }

  return newState
}
