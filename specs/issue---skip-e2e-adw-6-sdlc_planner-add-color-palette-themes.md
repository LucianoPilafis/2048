# Feature: Add selectable color palettes (themes) for the game UI

## Metadata
issue_number: `--skip-e2e`
adw_id: `6`
issue_json: ``

## Feature Description
Add a palette/theme selector to the 2048 game so the user can choose between Classic, Dark, High Contrast, and Ocean color themes. Applying a palette changes only the game colors (background, board, tiles, text) without affecting gameplay, layout, sizing, or animations. The selected palette persists after page refresh via localStorage.

## User Story
As a player
I want to choose a color palette for the game
So that I can personalize my visual experience and play in conditions that suit my environment or preferences (e.g., dark mode, high contrast for accessibility)

## Problem Statement
Currently the 2048 game has a single hard-coded color scheme. Users with different visual preferences, accessibility needs, or environmental conditions (e.g., low-light settings) have no way to customize the game's appearance.

## Solution Statement
Introduce a theme system with four predefined palettes (Classic, Dark, High Contrast, Ocean). A React Context provider manages the active palette, a `PaletteSelector` component lets users switch themes, and localStorage persists the selection. All color references in the UI read from the active palette, ensuring only colors change while layout, sizing, fonts, and animations remain untouched.

## Relevant Files
Use these files to implement the feature:

- `src/App.tsx` — Root component; wraps the app in `ThemeProvider`
- `src/components/Game.tsx` — Main game component; uses palette colors for background, board, score, buttons, and status messages
- `src/components/Tile.tsx` — Tile component; uses palette colors for tile backgrounds and text
- `src/game/logic.ts` — Game logic; should NOT be modified (purely logic, no colors)
- `src/main.tsx` — Entry point; should NOT be modified
- Read `.claude/commands/test_e2e.md`, and `.claude/commands/e2e/test_basic_query.md` to understand how to create an E2E test file

### New Files
- `src/themes/palettes.ts` — Palette definitions (Palette interface, PaletteId type, PALETTES record with all four themes, DEFAULT_PALETTE_ID)
- `src/themes/ThemeContext.tsx` — React Context for theme state management (ThemeProvider, useTheme hook, localStorage persistence)
- `src/components/PaletteSelector.tsx` — UI component that renders palette buttons and allows switching
- `.claude/commands/e2e/test_color_palette_themes.md` — E2E test specification for validating palette switching

## Implementation Plan
### Phase 1: Foundation
Define the palette data model and create the four palette definitions. Each palette includes: name, background, board, emptyCell, textDark, textLight, buttonBg, buttonText, scoreLabel, tileColors (Record<number, string> mapping tile values to colors), winBg, winText, gameOverBg, gameOverText. Export a `Palette` interface, `PaletteId` union type, `PALETTES` record, and `DEFAULT_PALETTE_ID`.

### Phase 2: Core Implementation
1. Create the `ThemeContext` with a `ThemeProvider` that holds `paletteId` state, reads/writes it to localStorage under key `2048-palette`, and exposes `palette`, `paletteId`, and `setPaletteId` via context.
2. Create the `PaletteSelector` component that lists all palette options as buttons with a color swatch, highlights the active palette, and calls `setPaletteId` on click.
3. Update `App.tsx` to wrap the application in `ThemeProvider`.
4. Update `Game.tsx` to consume `useTheme()` and apply palette colors to background, board, score, buttons, and win/game-over banners.
5. Update `Tile.tsx` to consume `useTheme()` and apply palette-based tile background and text colors.

### Phase 3: Integration
Ensure all color references come from the active palette so switching themes updates the entire UI consistently. Verify that no layout properties (width, height, gap, padding, font-size, border-radius) are affected by palette changes. Confirm localStorage persistence by checking that a page refresh restores the last selected palette.

## Step by Step Tasks

### Step 1: Create palette definitions file
- Create `src/themes/palettes.ts`
- Define the `Palette` interface with all required color properties: `name`, `background`, `board`, `emptyCell`, `textDark`, `textLight`, `buttonBg`, `buttonText`, `scoreLabel`, `tileColors` (Record<number, string>), `winBg`, `winText`, `gameOverBg`, `gameOverText`
- Define `PaletteId` type as `'classic' | 'dark' | 'highContrast' | 'ocean'`
- Export `DEFAULT_PALETTE_ID = 'classic'`
- Define `PALETTES` record with all four palettes using the exact base colors from the issue:
  - **Classic**: background `#FAF8EF`, board `#BBADA0`, emptyCell `#CDC1B4`, textDark `#776E65`, textLight `#F9F6F2`
  - **Dark**: background `#0F1115`, board `#1E2430`, emptyCell `#2B3342`, textDark `#0F1115`, textLight `#E6E6E6`
  - **High Contrast**: background `#FFFFFF`, board `#000000`, emptyCell `#333333`, textDark `#000000`, textLight `#FFFFFF`
  - **Ocean**: background `#EAF6FF`, board `#2B6CB0`, emptyCell `#63B3ED`, textDark `#0B1320`, textLight `#F7FAFC`
- For each palette, derive appropriate values for `buttonBg`, `buttonText`, `scoreLabel`, `tileColors`, `winBg`, `winText`, `gameOverBg`, `gameOverText` that maintain good visual contrast

### Step 2: Create ThemeContext provider
- Create `src/themes/ThemeContext.tsx`
- Define `ThemeContextValue` interface with `palette: Palette`, `paletteId: PaletteId`, `setPaletteId: (id: PaletteId) => void`
- Create `ThemeContext` with `createContext<ThemeContextValue | null>(null)`
- Implement `getInitialPaletteId()` that reads from `localStorage.getItem('2048-palette')` and falls back to `DEFAULT_PALETTE_ID`
- Implement `ThemeProvider` component that:
  - Uses `useState<PaletteId>(getInitialPaletteId)` for palette state
  - Uses `useEffect` to write `paletteId` to localStorage on change
  - Provides `{ palette: PALETTES[paletteId], paletteId, setPaletteId }` via context
- Export `useTheme()` hook that consumes the context and throws if used outside provider

### Step 3: Create PaletteSelector component
- Create `src/components/PaletteSelector.tsx`
- Import `useTheme` and `PALETTES`, `PaletteId`
- Render a row of buttons, one for each palette
- Each button shows a small color swatch (circle) with the palette's board color and the palette name
- Active palette button gets a highlighted border and bold text
- Add `data-palette={id}` and `data-active={isActive}` attributes for testability
- Style: flex row with gap, wrapped, centered

### Step 4: Update App.tsx to use ThemeProvider
- Import `ThemeProvider` from `./themes/ThemeContext`
- Wrap the existing JSX content inside `<ThemeProvider>...</ThemeProvider>`

### Step 5: Update Game.tsx to use palette colors
- Import `useTheme` from `../themes/ThemeContext`
- Import `PaletteSelector` component
- Call `const { palette } = useTheme()` in the component
- Replace all hard-coded color values with palette references:
  - Page background: `palette.background`
  - Title color: `palette.textDark`
  - Score label color: `palette.scoreLabel`
  - Score value color: `palette.textDark`
  - Button background: `palette.buttonBg`, text: `palette.buttonText`
  - Board background: `palette.board`
  - Win banner: bg `palette.winBg`, text `palette.winText`
  - Game over banner: bg `palette.gameOverBg`, text `palette.gameOverText`
  - Instruction text: `palette.scoreLabel`
- Add `<PaletteSelector />` between the title and the score/button row
- Do NOT change any layout properties (widths, heights, gaps, padding, grid template, font sizes, border radii)

### Step 6: Update Tile.tsx to use palette colors
- Import `useTheme` from `../themes/ThemeContext`
- Call `const { palette } = useTheme()` in the component
- Update `getBackgroundColor` to use `palette.emptyCell` for empty cells and `palette.tileColors[val]` for valued tiles
- Update `getTextColor` to use `palette.textDark` for low values (2, 4) and `palette.textLight` for higher values
- Do NOT change any layout properties (width: 75px, height: 75px, font sizes, border-radius)
- Keep the existing `transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out'` for smooth palette switching

### Step 7: Create E2E test specification
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_basic_query.md` to understand the format
- Create `.claude/commands/e2e/test_color_palette_themes.md` with test steps that validate:
  1. Initial state shows Classic palette
  2. Palette selector is visible with four options
  3. Clicking Dark changes background to `#0F1115`
  4. Clicking High Contrast changes background to `#FFFFFF`, board to `#000000`
  5. Clicking Ocean changes background to `#EAF6FF`
  6. Switching back to Classic restores original colors
  7. Tile sizes remain 75px throughout all switches
  8. Page reload preserves the last selected palette
  9. Take 6 screenshots at key states

### Step 8: Run validation commands
- Run `npx tsc --noEmit` to verify TypeScript compiles without errors
- Run `npm run build` to verify the production build succeeds
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_color_palette_themes.md` to validate this functionality works

## Testing Strategy
### Unit Tests
- Verify `PALETTES` object contains exactly four palettes with all required properties
- Verify `DEFAULT_PALETTE_ID` is `'classic'`
- Verify `useTheme()` throws when used outside `ThemeProvider`
- Verify `ThemeProvider` initializes with classic palette when localStorage is empty
- Verify `ThemeProvider` reads and applies stored palette from localStorage

### Edge Cases
- localStorage is unavailable (private browsing) — should gracefully fall back to classic
- Invalid palette ID stored in localStorage — should fall back to classic
- Rapid palette switching — should not cause visual glitches or stale state
- All tile values (2 through 2048) should have readable contrast in every palette

## Acceptance Criteria
- A palette selector is visible in the UI and lists exactly four options: Classic, Dark, High Contrast, Ocean
- Switching palettes updates only colors (background, board, tiles, text) — no changes to tile sizes (75px), spacing, fonts, animations, or game logic
- The selected palette applies immediately and consistently across the entire game UI
- Text remains readable (sufficient contrast) on every palette
- The chosen palette persists after page refresh via localStorage
- TypeScript compiles without errors (`tsc --noEmit`)
- Production build succeeds (`npm run build`)
- E2E test passes confirming all palette switches and persistence

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `cd /home/luciano/agentic && npx tsc --noEmit` — Run TypeScript type checking to ensure no type errors
- `cd /home/luciano/agentic && npm run build` — Run production build to ensure it compiles successfully
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_color_palette_themes.md` E2E test file to validate palette switching functionality works end-to-end

## Notes
- The feature is purely cosmetic — it must not modify `src/game/logic.ts` or any game state management
- The `transition` property on tiles (`background-color 0.15s ease-in-out, color 0.15s ease-in-out`) provides smooth color transitions when switching palettes
- The Classic palette colors should match the original 2048 game colors as closely as possible
- Future palettes can be added by simply extending the `PaletteId` type and `PALETTES` record
- The `data-palette` and `data-active` attributes on palette buttons support automated testing
