# Bug: Keep 4x4 board tiles fixed: prevent tile resizing and shifting

## Metadata
issue_number: `3`
adw_id: `1be417b6`
issue_json: `{"number":3,"title":"Keep 4x4 board tiles fixed: prevent tile resizing and shifting","body":"Description\nThe 4x4 game board tiles (squares) are changing size and/or shifting, which makes the board look unstable. Fix the UI so the board is always a 4x4 grid and every tile keeps the same consistent square size during gameplay and across re-renders.\n\nAcceptance criteria\n\nThe board always renders as a 4x4 grid.\n\nAll tiles are perfect squares and remain the same width/height at all times (no resizing between moves or re-renders).\n\nRows/columns stay aligned and spacing between tiles remains consistent (no shifting/jumping).\n\nWorks correctly across common screen sizes (desktop + mobile) without breaking the board layout."}`

## Bug Description
The 2048 game board tiles are changing size and/or shifting during gameplay, making the board look unstable. Tiles should be perfect squares that maintain a constant size at all times — no resizing between moves or re-renders. Rows and columns should stay aligned with consistent spacing.

**Symptoms:**
- Tiles may resize between moves or across re-renders
- Rows/columns can shift or jump, especially when tiles appear or disappear
- Tile height is not explicitly constrained, causing inconsistent row heights depending on content

**Expected behavior:**
- The board always renders as a 4x4 grid
- All tiles are perfect 75px × 75px squares at all times
- Spacing between tiles remains consistent (no shifting/jumping)
- Works correctly across desktop and mobile screen sizes

## Problem Statement
While a previous fix (issue #1) set the grid columns to `repeat(4, 75px)` and scoped transitions to visual-only properties, the grid still has no explicit **row height** definition (`gridTemplateRows` is missing). The CSS grid defaults rows to `auto` height, meaning row height is determined by content. Combined with the Tile component using `width: '100%'` and `height: '100%'` (which depend on the grid cell sizing), tiles have no guaranteed fixed pixel height. Empty tiles (with `null` value) and tiles with numbers can produce different intrinsic content heights, causing rows to vary and tiles to not be perfect squares.

## Solution Statement
Apply two surgical CSS fixes to guarantee tile dimensions are always exactly 75px × 75px:

1. **Add explicit row height to the grid container**: Add `gridTemplateRows: 'repeat(4, 75px)'` to the board grid in `Game.tsx` so both columns and rows have fixed pixel dimensions.

2. **Set explicit fixed dimensions on Tile component**: Change the Tile component from `width: '100%'` / `height: '100%'` to `width: '75px'` / `height: '75px'` so each tile is independently locked to 75px × 75px regardless of its parent's sizing.

These two changes together ensure tiles are perfect squares that never resize, with the grid providing a fixed 4×4 layout and each tile enforcing its own dimensions.

## Steps to Reproduce
1. Open the 2048 game in a browser
2. Observe the initial board — tiles may not all be perfectly square if content-driven row heights differ from column widths
3. Press arrow keys to make several moves
4. Observe that tiles may subtly shift or resize between moves, particularly when empty cells become filled or vice versa, because the `auto` row height recalculates based on content
5. On narrower viewports, the board may not maintain the exact 4×4 square grid alignment

## Root Cause Analysis
Two root causes remain from the previous partial fix:

1. **Missing `gridTemplateRows`** (`src/components/Game.tsx:69-70`): The grid defines explicit column sizing with `gridTemplateColumns: 'repeat(4, 75px)'` but has no `gridTemplateRows` definition. CSS grid defaults rows to `auto`, which sizes rows based on their content. This means row height is not guaranteed to be 75px — it depends on the tallest content in each row. Empty tiles with no text content may produce different row heights than tiles with number values.

2. **Tile uses relative sizing** (`src/components/Tile.tsx:40-41`): The Tile component uses `width: '100%'` and `height: '100%'`, making its dimensions entirely dependent on the grid cell. Without explicit row heights, `height: '100%'` of an `auto`-height grid row can produce inconsistent results. Setting tiles to explicit `75px` dimensions guarantees they are always perfect squares.

## Relevant Files
Use these files to fix the bug:

- `src/components/Game.tsx` - Contains the board grid container. Has `gridTemplateColumns: 'repeat(4, 75px)'` but is missing `gridTemplateRows`. Needs explicit row height definition to lock the 4×4 grid to fixed dimensions.
- `src/components/Tile.tsx` - Contains the Tile component with `width: '100%'` and `height: '100%'` that depend on grid cell sizing. Needs explicit `75px` dimensions to guarantee perfect squares.
- `index.html` - Contains base CSS reset and viewport meta tag. No changes needed but verify the box-sizing reset is present (it is: `* { box-sizing: border-box }`).
- `.claude/commands/test_e2e.md` - Read to understand how to run E2E tests for validation.
- `.claude/commands/e2e/test_basic_query.md` - Read as a reference example for E2E test file format.
- `.claude/commands/e2e/test_tile_size_stability.md` - Existing E2E test file that validates tile size stability. This already exists from the prior fix and will be used for validation.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add explicit row height to the grid container in Game.tsx
- Open `src/components/Game.tsx`
- In the grid container `div` style object (around line 69-80), add `gridTemplateRows: 'repeat(4, 75px)'` alongside the existing `gridTemplateColumns: 'repeat(4, 75px)'`
- This locks both columns AND rows to exactly 75px, eliminating any content-driven row height variability

### Step 2: Set explicit fixed pixel dimensions on the Tile component
- Open `src/components/Tile.tsx`
- Change `width: '100%'` to `width: '75px'` (line 40)
- Change `height: '100%'` to `height: '75px'` (line 41)
- This makes each tile independently enforce its 75px × 75px dimensions, regardless of the grid cell sizing

### Step 3: Run validation commands
- Run all validation commands listed below to confirm the fix works with zero regressions
- Verify TypeScript compilation passes
- Verify the build succeeds
- Run the existing E2E tile size stability test

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `npx tsc --noEmit` - Run TypeScript type checking to ensure no type errors were introduced
- `npm run build` - Run the full build (tsc + vite) to validate the fix compiles and bundles correctly
- Read `.claude/commands/test_e2e.md`, then read and execute the existing E2E `.claude/commands/e2e/test_tile_size_stability.md` test file to validate tile size stability during gameplay and responsive layout

## Notes
- The fix is minimal: only two files are modified (`Game.tsx` and `Tile.tsx`) with targeted CSS changes
- The existing E2E test `test_tile_size_stability.md` already validates the exact acceptance criteria (75px tiles, consistent dimensions after moves, responsive layout) so no new E2E test file is needed
- No new dependencies are required
- The 75px tile size is consistent with the existing `gridTemplateColumns: 'repeat(4, 75px)'` and the E2E test expectations
- The previous fix (issue #1) correctly fixed the `transition: all` issue and set column sizing, but left row sizing at `auto` and tile dimensions at `100%`, which is what this fix addresses
