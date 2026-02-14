# Bug: Fix tile size instability: keep board tiles a constant size while preserving responsive layout

## Metadata
issue_number: `1`
adw_id: `051a26d5`
issue_json: `{"number":1,"title":"Fix tile size instability: keep board tiles a constant size while preserving responsive layout","body":"The game board tiles (squares) are changing size across renders and/or screen sizes, making the grid look unstable and sometimes breaking the layout. Update the UI so the tiles keep a consistent, fixed size during gameplay and across re-renders, while the overall page remains responsive to the user's screen and does not overflow (no hidden controls or forced scrolling).\n\nAcceptance criteria\n\nTile size is stable: each board tile keeps the same width/height during gameplay (no resizing between moves, animations, or rerenders).\n\nGrid alignment is stable: spacing between tiles is consistent and rows/columns do not shift.\n\nThe UI fits the screen: the board and core controls are visible without needing to scroll on common desktop and mobile screen sizes.\n\nResponsive layout is maintained: the page adapts to different screen sizes without layout breaks or unexpected tile resizing."}`

## Bug Description
The 2048 game board tiles change size across renders and screen sizes, making the grid look unstable and sometimes breaking the layout. Tiles should maintain a consistent, fixed size during gameplay while the overall page remains responsive.

**Symptoms:**
- Tiles resize between moves, animations, or rerenders
- Grid spacing is inconsistent; rows/columns shift
- On some screen sizes, controls may be hidden or require scrolling

**Expected behavior:**
- Each tile maintains a constant width/height during gameplay
- Grid alignment and spacing are stable
- The board and controls are fully visible without scrolling on common screen sizes
- The page adapts responsively to different screen sizes without breaking tile dimensions

## Problem Statement
The tile sizing uses `width: '100%'` and `height: '100%'` in the `Tile` component, which makes tiles inherit their size from the CSS grid parent. The grid container in `Game.tsx` uses `gridTemplateColumns: 'repeat(4, 1fr)'` with a fixed `width: '340px'` and `height: '340px'`, which should provide stable cell sizes. However, the `1fr` fractional unit combined with `100%` tile dimensions and the CSS `transition: 'all 0.15s ease-in-out'` on tiles creates instability: the `all` transition keyword transitions **every** CSS property including layout-affecting properties like `width` and `height`, so any sub-pixel recalculation during a rerender triggers visible size flickering. Additionally, the fixed `340px` board size does not adapt to smaller screens (mobile), causing overflow and potential layout breaks.

## Solution Statement
Fix the tile size instability with two surgical changes:

1. **Replace fractional grid sizing with fixed pixel tile dimensions**: Change the grid from `repeat(4, 1fr)` to `repeat(4, 75px)` (fixed tile size) so each tile cell is always exactly the same size, eliminating any fractional recalculation.

2. **Scope the CSS transition to only visual properties**: Change `transition: 'all 0.15s ease-in-out'` to `transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out'` so transitions only apply to color changes, not to layout properties like width/height.

3. **Add responsive scaling for mobile**: Use `max-width: '100%'` on the board container and a CSS `@media` query approach via inline styles to scale the board down on smaller screens without changing the actual tile pixel dimensions.

## Steps to Reproduce
1. Open the 2048 game in a browser
2. Play the game by pressing arrow keys repeatedly
3. Observe that tiles may flicker/resize slightly between moves due to the `transition: all` property animating layout recalculations
4. Resize the browser window to a narrow width (< 380px)
5. Observe the board overflows the viewport since it has a fixed 340px width with no responsive fallback

## Root Cause Analysis
Two root causes:

1. **`transition: 'all'` on tiles** (`src/components/Tile.tsx:42`): The `all` keyword transitions every CSS property, including `width` and `height`. When React rerenders tiles (e.g., after a move), any sub-pixel layout recalculation causes `width`/`height` to animate, producing visible size flickering. This is the primary cause of tile size instability during gameplay.

2. **`gridTemplateColumns: 'repeat(4, 1fr)'`** (`src/components/Game.tsx:70`): While `1fr` with a fixed container width should theoretically produce stable sizes, fractional units can produce sub-pixel rounding differences across browsers and rerenders. Combined with `transition: all`, even tiny size differences become visible as animated resizing.

3. **Fixed `340px` board with no responsive fallback** (`src/components/Game.tsx:75-76`): The board has a hardcoded pixel width that doesn't adapt to screens narrower than ~360px, causing overflow on mobile devices.

## Relevant Files
Use these files to fix the bug:

- `src/components/Tile.tsx` - Contains the Tile component with the problematic `transition: 'all'` style that causes size flickering during rerenders. The `width: '100%'` and `height: '100%'` styles inherit size from the grid parent.
- `src/components/Game.tsx` - Contains the Game component with the board grid container. Uses `gridTemplateColumns: 'repeat(4, 1fr)'` and fixed `width: '340px'`, `height: '340px'`. This is where grid sizing and responsive layout need to be updated.
- `index.html` - Contains base CSS reset styles. May need a viewport meta tag check (already present).
- `.claude/commands/test_e2e.md` - Read to understand how to create and run E2E tests.
- `.claude/commands/e2e/test_basic_query.md` - Read as a reference example for E2E test file format.

### New Files
- `.claude/commands/e2e/test_tile_size_stability.md` - New E2E test file to validate tile size stability during gameplay and responsive layout.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Fix the CSS transition in Tile component
- Open `src/components/Tile.tsx`
- Change line 42 from `transition: 'all 0.15s ease-in-out'` to `transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out'`
- This scopes transitions to only visual properties (background-color and text color), preventing layout properties from being animated during rerenders

### Step 2: Fix the grid sizing in Game component
- Open `src/components/Game.tsx`
- Change `gridTemplateColumns: 'repeat(4, 1fr)'` to `gridTemplateColumns: 'repeat(4, 75px)'`
- Change `width: '340px'` to `width: 'fit-content'` so the container width is derived from the fixed tile sizes plus gap/padding rather than an independent value
- Change `height: '340px'` to `height: 'fit-content'` for the same reason
- Add `maxWidth: '100%'` to the grid container to prevent overflow on small screens
- This ensures each tile cell is always exactly 75px x 75px, with the container fitting tightly around the grid

### Step 3: Add responsive scaling to the board container
- In `src/components/Game.tsx`, wrap the grid `div` in an outer container `div` if needed, or add `boxSizing: 'border-box'` to ensure padding doesn't cause overflow
- Add `overflow: 'hidden'` as a safety measure on the grid wrapper to prevent any edge-case overflow
- Verify the board container with `fit-content` width stays centered via the existing `alignItems: 'center'` on the parent flex container

### Step 4: Create E2E test file for tile size stability
- Read `.claude/commands/e2e/test_basic_query.md` and `.claude/commands/e2e/test_complex_query.md` as reference examples
- Create a new E2E test file at `.claude/commands/e2e/test_tile_size_stability.md` that validates:
  - Tiles render with consistent dimensions on initial load
  - Tile dimensions remain stable after making moves (arrow key presses)
  - Grid alignment and spacing are consistent
  - The board and controls fit within the viewport without scrolling
  - Take screenshots at each verification step
- The test should use Playwright to measure actual tile element dimensions before and after moves and assert they match

### Step 5: Run validation commands
- Run all validation commands listed below to confirm the fix works with zero regressions
- Verify TypeScript compilation passes
- Verify the build succeeds
- Run the E2E test to validate tile stability

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `npx tsc --noEmit` - Run TypeScript type checking to ensure no type errors were introduced
- `npm run build` - Run the full build (tsc + vite) to validate the fix compiles and bundles correctly
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `.claude/commands/e2e/test_tile_size_stability.md` test file to validate tile size stability during gameplay and responsive layout

## Notes
- The fix is minimal: only two files are modified (`Tile.tsx` and `Game.tsx`) with targeted CSS changes
- The 75px tile size is calculated from the original layout: (340px - 10px padding*2 - 10px gap*3) / 4 = 75px per tile, so the visual appearance remains identical
- No new dependencies are needed
- The `transition: all` anti-pattern is a common CSS bug that causes layout flickering in React apps since React reconciliation can trigger sub-pixel recalculations
- The `fit-content` width approach is preferred over a hardcoded pixel width because it derives the container size from the actual grid content, making it more maintainable
