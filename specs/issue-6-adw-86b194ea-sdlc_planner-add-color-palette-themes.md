# Feature: Add Selectable Color Palettes (Themes) for the Game UI

## Metadata
issue_number: `6`
adw_id: `86b194ea`
issue_json: `{"number":6,"title":"Add selectable color palettes (themes) for the game UI","body":"Add a palette/theme selector so the user can choose between Classic, Dark, High Contrast, and Ocean..."}`

## Feature Description
Add a palette/theme selector to the 2048 game that allows users to switch between four color schemes: Classic, Dark, High Contrast, and Ocean. Each palette defines colors for the page background, board, empty cells, dark text, and light text, plus unique tile value colors that are derived to fit the palette. Switching palettes must only affect colors — tile sizes, spacing, fonts, animations, and game logic remain untouched. The selected palette persists across page refreshes via localStorage.

## User Story
As a player
I want to choose a color palette for the game
So that I can personalize my visual experience and play in conditions that suit my environment or preferences (e.g., dark mode, high contrast for accessibility)

## Problem Statement
The 2048 game currently has a single hardcoded color scheme. Users who prefer dark themes, high-contrast accessibility themes, or simply different aesthetics have no way to customize the look. All colors are scattered as inline style literals across `Game.tsx` and `Tile.tsx`, making future theming difficult.

## Solution Statement
1. Create a centralized **palette definition module** (`src/themes/palettes.ts`) that exports all four palettes with their base colors and per-tile-value color mappings.
2. Build a **React context** (`src/themes/ThemeContext.tsx`) that stores the active palette name, persists it to `localStorage`, and exposes a setter.
3. Add a **PaletteSelector component** (`src/components/PaletteSelector.tsx`) — a simple row of labeled buttons/radio-style selectors placed above the game board.
4. Refactor `Game.tsx` and `Tile.tsx` to **consume palette colors from context** instead of hardcoded literals.
5. Wrap the app in the `ThemeProvider` in `App.tsx`.

This approach keeps all color definitions in one place, makes switching instant via React state, and preserves every non-color aspect of the existing UI.

## Relevant Files
Use these files to implement the feature:

- `src/App.tsx` — Entry component; needs to wrap children with `ThemeProvider`
- `src/components/Game.tsx` — Main game UI; all inline color literals need to be replaced with palette values from context
- `src/components/Tile.tsx` — Tile rendering; background and text color functions need to use the active palette
- `src/game/logic.ts` — Game logic; **read-only reference**, must NOT be modified
- `src/main.tsx` — React mount point; read-only reference
- `package.json` — Verify no new dependencies are needed (none are)
- `tsconfig.json` — Verify path resolution supports new subdirectory
- `.claude/commands/test_e2e.md` — Read to understand E2E test runner structure
- `.claude/commands/e2e/test_basic_query.md` — Read as example E2E test format
- `.claude/commands/e2e/test_tile_size_stability.md` — Read as example E2E test format for this specific game

### New Files
- `src/themes/palettes.ts` — Palette definitions (all four palettes with base colors and tile value color maps)
- `src/themes/ThemeContext.tsx` — React context provider and hook for active palette
- `src/components/PaletteSelector.tsx` — UI component for selecting a palette
- `.claude/commands/e2e/test_color_palette_themes.md` — E2E test spec for validating palette switching

## Implementation Plan

### Phase 1: Foundation
Define the data model for palettes and create the theme context infrastructure. This establishes the centralized color system that all components will consume.

### Phase 2: Core Implementation
Build the palette selector UI component and refactor `Game.tsx` and `Tile.tsx` to pull all colors from the theme context instead of hardcoded values. Wire the `ThemeProvider` into `App.tsx`.

### Phase 3: Integration
Verify that switching palettes updates the entire UI instantly, that the classic palette matches the current look exactly (no visual regression), that localStorage persistence works, and that no layout/sizing/animation behavior has changed.

## Step by Step Tasks

### Step 1: Create palette definitions (`src/themes/palettes.ts`)

- Define a `Palette` TypeScript interface with these fields:
  - `name: string` (display label)
  - `background: string` (page background)
  - `board: string` (board/grid background)
  - `emptyCell: string` (empty tile cell)
  - `textDark: string` (text for low-value tiles)
  - `textLight: string` (text for high-value tiles)
  - `buttonBg: string` (button background, e.g. New Game)
  - `buttonText: string` (button text color)
  - `scoreLabel: string` (secondary text like "Score" label)
  - `tileColors: Record<number, string>` (background color per tile value: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048)
  - `winBg: string` (win banner background)
  - `winText: string` (win banner text)
  - `gameOverBg: string` (game over banner background)
  - `gameOverText: string` (game over banner text)
- Define the **Classic** palette using the exact colors currently hardcoded in `Game.tsx` and `Tile.tsx`:
  - `background: '#faf8f3'`, `board: '#bbada0'`, `emptyCell: '#cdc1b4'`, `textDark: '#776e65'`, `textLight: '#f9f6f2'`
  - `buttonBg: '#8f7a66'`, `buttonText: '#f9f6f2'`, `scoreLabel: '#9f8f7f'`
  - `tileColors`: `{2:'#eee4da', 4:'#ede0c8', 8:'#f2b179', 16:'#f59563', 32:'#f67c5f', 64:'#f65e3b', 128:'#edcf72', 256:'#edcc61', 512:'#edc850', 1024:'#edc53f', 2048:'#edc22e'}`
  - `winBg: '#edc22e'`, `winText: '#776e65'`, `gameOverBg: '#f67c5f'`, `gameOverText: '#f9f6f2'`
- Define the **Dark** palette:
  - `background: '#0F1115'`, `board: '#1E2430'`, `emptyCell: '#2B3342'`, `textDark: '#0F1115'`, `textLight: '#E6E6E6'`
  - `buttonBg: '#3B4252'`, `buttonText: '#E6E6E6'`, `scoreLabel: '#8892A0'`
  - `tileColors`: derive dark-theme-appropriate tile colors (muted/darkened versions with good contrast against dark text and light text)
  - `winBg: '#A3BE8C'`, `winText: '#0F1115'`, `gameOverBg: '#BF616A'`, `gameOverText: '#E6E6E6'`
- Define the **High Contrast** palette:
  - `background: '#FFFFFF'`, `board: '#000000'`, `emptyCell: '#333333'`, `textDark: '#000000'`, `textLight: '#FFFFFF'`
  - `buttonBg: '#000000'`, `buttonText: '#FFFFFF'`, `scoreLabel: '#555555'`
  - `tileColors`: high-contrast distinct colors per tile value
  - `winBg: '#FFD700'`, `winText: '#000000'`, `gameOverBg: '#FF0000'`, `gameOverText: '#FFFFFF'`
- Define the **Ocean** palette:
  - `background: '#EAF6FF'`, `board: '#2B6CB0'`, `emptyCell: '#63B3ED'`, `textDark: '#0B1320'`, `textLight: '#F7FAFC'`
  - `buttonBg: '#2C5282'`, `buttonText: '#F7FAFC'`, `scoreLabel: '#4A90B8'`
  - `tileColors`: ocean-blue-toned tile colors
  - `winBg: '#48BB78'`, `winText: '#0B1320'`, `gameOverBg: '#E53E3E'`, `gameOverText: '#F7FAFC'`
- Export a `PALETTES` record keyed by palette id (`classic`, `dark`, `highContrast`, `ocean`) and a `PaletteId` type.
- Export a `DEFAULT_PALETTE_ID` constant set to `'classic'`.

### Step 2: Create theme context (`src/themes/ThemeContext.tsx`)

- Create a React context that holds `{ palette: Palette; paletteId: PaletteId; setPaletteId: (id: PaletteId) => void }`.
- Create a `ThemeProvider` component that:
  - Initializes `paletteId` state from `localStorage.getItem('2048-palette')` (falling back to `DEFAULT_PALETTE_ID`).
  - On `paletteId` change, writes to `localStorage.setItem('2048-palette', paletteId)`.
  - Looks up the active `Palette` from `PALETTES[paletteId]`.
  - Provides context value to children.
- Export a `useTheme` hook that calls `useContext` and throws if used outside provider.

### Step 3: Create PaletteSelector component (`src/components/PaletteSelector.tsx`)

- Import `useTheme` and `PALETTES`, `PaletteId`.
- Render a horizontal row of buttons, one per palette.
- Each button:
  - Shows the palette's `name` as label.
  - Has a small color swatch (circle or square) showing the palette's `board` color.
  - Has an active/selected state indicator (border or bold) when it matches the current `paletteId`.
  - Calls `setPaletteId` on click.
- Style the selector to be compact and not disrupt the existing layout. Place it visually above the score/new-game row.
- The selector itself should also respect the active palette for its own text/background colors so it looks integrated.

### Step 4: Refactor `Game.tsx` to use theme context

- Import `useTheme` from `ThemeContext`.
- Call `const { palette } = useTheme()` at the top of the component.
- Replace every hardcoded color literal with the corresponding palette field:
  - Page background `#faf8f3` → `palette.background`
  - Title color `#776e65` → `palette.textDark`
  - Score label color `#9f8f7f` → `palette.scoreLabel`
  - Score value color `#776e65` → `palette.textDark`
  - Button background `#8f7a66` → `palette.buttonBg`
  - Button text `#f9f6f2` → `palette.buttonText`
  - Board background `#bbada0` → `palette.board`
  - Win banner background `#edc22e` → `palette.winBg`
  - Win banner text `#776e65` → `palette.winText`
  - Game over background `#f67c5f` → `palette.gameOverBg`
  - Game over text `#f9f6f2` → `palette.gameOverText`
  - Instruction text `#9f8f7f` → `palette.scoreLabel`
- Render `<PaletteSelector />` above the score/button row.
- Do NOT change any layout properties (widths, heights, gaps, padding, grid template, font sizes, border radii).

### Step 5: Refactor `Tile.tsx` to use theme context

- Import `useTheme` from `ThemeContext`.
- Call `const { palette } = useTheme()` at the top of the component.
- Replace `getBackgroundColor`:
  - Use `palette.tileColors[val]` for known tile values, fallback to `palette.emptyCell`.
- Replace `getTextColor`:
  - Use `palette.textDark` for values `null`, `2`, `4`; otherwise `palette.textLight`.
- Do NOT change tile dimensions (`width: 75px`, `height: 75px`), font sizes, or transition properties.

### Step 6: Wire ThemeProvider in `App.tsx`

- Import `ThemeProvider` from `src/themes/ThemeContext.tsx`.
- Wrap the `<Game />` component inside `<ThemeProvider>`.

### Step 7: Create E2E test spec (`.claude/commands/e2e/test_color_palette_themes.md`)

- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_tile_size_stability.md` to understand the format.
- Create the E2E test file with these test steps:
  1. Navigate to the Application URL.
  2. Take a screenshot of the initial state (should be Classic palette).
  3. **Verify** the page title heading "2048" is visible.
  4. **Verify** a palette selector is present with four options: Classic, Dark, High Contrast, Ocean.
  5. **Verify** the Classic palette is selected/active by default.
  6. Click the "Dark" palette button.
  7. **Verify** the page background changes to `#0F1115` (or very close).
  8. **Verify** the board background changes to a dark color.
  9. Take a screenshot of the Dark palette state.
  10. Click the "High Contrast" palette button.
  11. **Verify** the page background changes to `#FFFFFF`.
  12. **Verify** the board background changes to `#000000`.
  13. Take a screenshot of the High Contrast palette state.
  14. Click the "Ocean" palette button.
  15. **Verify** the page background changes to `#EAF6FF` (or very close).
  16. Take a screenshot of the Ocean palette state.
  17. Click the "Classic" palette button.
  18. **Verify** the page background returns to the original Classic color.
  19. Take a screenshot confirming Classic palette is restored.
  20. **Verify** tile sizes remain 75px x 75px throughout all palette switches (no layout changes).
  21. Reload the page.
  22. **Verify** the last selected palette (Classic) persists after refresh.
  23. Take a screenshot of the post-refresh state.
- Success Criteria:
  - Palette selector is visible and lists all four palettes.
  - Switching palettes changes only colors, not layout.
  - Each palette applies correct background and board colors.
  - Tile dimensions remain 75px x 75px after every switch.
  - Selected palette persists after page reload.
  - 6 screenshots are taken.

### Step 8: Run validation commands

- Run `npx tsc --noEmit` from the project root to check TypeScript compilation.
- Run `npm run build` to verify the production build succeeds.
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_color_palette_themes.md` to validate this functionality works end-to-end.

## Testing Strategy

### Unit Tests
- No new unit test files are strictly required since the feature is purely presentational. However, the TypeScript compiler (`tsc --noEmit`) validates type correctness of all palette definitions and context usage.
- The build (`npm run build`) validates the entire application compiles and bundles correctly.

### Edge Cases
- **Classic palette must be pixel-perfect match**: The Classic palette colors must exactly match the current hardcoded values so there is zero visual regression.
- **Unknown tile values**: Tiles with values not in the `tileColors` map (if the game were extended beyond 2048) should fall back to `palette.emptyCell`.
- **localStorage unavailable**: If localStorage is blocked (e.g., private browsing on some browsers), the app should still work with the default palette without crashing.
- **Rapid palette switching**: Clicking palette buttons quickly should not cause flickering or state inconsistencies.

## Acceptance Criteria
- A palette selector is visible in the UI and lists four options: Classic, Dark, High Contrast, Ocean.
- Switching palettes instantly updates all game colors (background, board, tiles, text, buttons, banners).
- Switching palettes does NOT change tile sizes (75px x 75px), spacing, gap sizes, font sizes, animations, or game logic.
- The Classic palette produces an identical visual result to the current hardcoded colors.
- Text is readable on every palette (appropriate contrast between text and tile/background colors).
- The chosen palette persists across page refreshes via localStorage.
- TypeScript compiles without errors (`tsc --noEmit`).
- Production build succeeds (`npm run build`).
- E2E test `test_color_palette_themes` passes.

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `npx tsc --noEmit` - Run TypeScript type checking to ensure no type errors
- `npm run build` - Run production build to validate the app compiles and bundles without errors
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_color_palette_themes.md` E2E test to validate palette switching works end-to-end

## Notes
- No new npm dependencies are needed. The feature uses only React's built-in `createContext`/`useContext`/`useState`/`useEffect` and the browser's `localStorage` API.
- The `src/themes/` directory is new and groups all theming concerns together, keeping them separate from game logic and components.
- Future palettes can be added by simply adding a new entry to the `PALETTES` record in `palettes.ts` — no other code changes needed.
- The tile value color maps for Dark, High Contrast, and Ocean palettes should be carefully chosen to maintain visual distinctness between different tile values while fitting the overall palette aesthetic.
