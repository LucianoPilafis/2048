# Bug: Fix tile size instability - ensure tiles have explicit height for stable rendering

## Metadata
issue_number: `2`
adw_id: `6ffc5aae`
issue_json: `{"number":2,"title":"bug: #1 - Fix tile size instability: keep board tiles a constant size while preserving responsive layout","body":"## Summary\n\nFixes tile size instability issues where the game board tiles are changing size across renders and screen sizes, making the grid look unstable and sometimes breaking the layout.\n\n## Implementation Plan\n\nSee [specs/issue-1-adw-051a26d5-sdlc_planner-fix-tile-size-stability.md](../blob/bug-issue-1-adw-051a26d5-fix-tile-size-stability/specs/issue-1-adw-051a26d5-sdlc_planner-fix-tile-size-stability.md) for detailed implementation plan.\n\n## Closes\n\nCloses #1\n\n## ADW Tracking\n\nADW ID: 051a26d5\n\n## Changes Made\n\n- Created comprehensive implementation plan for tile size stability\n- Defined acceptance criteria and implementation steps\n- Specified CSS updates needed for fixed tile dimensions\n- Planned responsive layout adjustments\n- Outlined testing approach for various screen sizes\n\n## Key Implementation Details\n\nThe plan addresses:\n- Fixed tile dimensions using explicit width/height\n- Consistent grid spacing and alignment\n- Responsive layout that adapts to screen sizes\n- Prevention of overflow and scroll issues\n- Stable rendering across re-renders and animations"}`

## Bug Description
The 2048 game board tiles still exhibit size instability. While a previous fix (PR #2, ADW `051a26d5`) addressed the `transition: all` issue and changed grid columns to `repeat(4, 75px)`, the tiles still lack an explicit **row height**. The grid has `gridTemplateColumns: 'repeat(4, 75px)'` but no `gridTemplateRows` or `gridAutoRows`, so row height is determined by content (the text inside each tile). This means:

- Empty tiles (value `null`) render with zero or minimal height since they have no text content, causing rows to collapse
- Tiles with different font sizes (the `fontSize` changes at value > 1024) cause row height to shift
- The `height: '100%'` on the Tile component resolves to the content-driven row height, not to an explicit 75px

**Symptoms:**
- Tile rows may have inconsistent heights depending on content
- Empty tiles collapse or have minimal height
- Grid looks unstable when tiles appear/disappear during moves
- The grid height is not predictable because rows are content-sized

**Expected behavior:**
- Every tile cell is exactly 75px x 75px regardless of content
- Empty and filled tiles have identical dimensions
- Grid maintains a stable, predictable layout at all times

## Problem Statement
The grid rows have no explicit height definition. While columns are fixed at 75px via `gridTemplateColumns: 'repeat(4, 75px)'`, rows default to `auto` sizing which makes their height depend on content. Combined with `height: '100%'` on tiles (which resolves to the content-driven auto height), this creates instability when tile content changes between moves.

## Solution Statement
Add `gridAutoRows: '75px'` to the grid container in `Game.tsx` to give every row a fixed 75px height, matching the column width. This ensures each grid cell is exactly 75px x 75px regardless of content. The Tile component's `width: '100%'` and `height: '100%'` will then correctly resolve to 75px x 75px from the fixed grid cell dimensions.

## Steps to Reproduce
1. Open the 2048 game in a browser
2. Inspect the grid tiles using browser dev tools
3. Observe that tile row heights depend on content — empty rows may collapse or have inconsistent heights
4. Play several moves and observe grid height may shift slightly as tiles with different content (or empty tiles) appear in different rows
5. Especially noticeable when a row transitions from having all filled tiles to having empty tiles

## Root Cause Analysis
The grid container in `src/components/Game.tsx` defines fixed column widths via `gridTemplateColumns: 'repeat(4, 75px)'` but does not define row heights. CSS Grid defaults rows to `auto` height, which sizes them to fit their content. Since tiles use `height: '100%'` (inheriting from the auto-sized row), the actual rendered height depends on:
- Whether the tile has text content (null vs number)
- The font size of the content (which changes at value > 1024)

Adding `gridAutoRows: '75px'` explicitly sets every row to 75px, making each grid cell a fixed 75x75 square regardless of content.

## Relevant Files
Use these files to fix the bug:

- `src/components/Game.tsx` - Contains the board grid container. Missing `gridAutoRows` property to fix row height. This is the only file that needs modification.
- `src/components/Tile.tsx` - Contains the Tile component. Uses `width: '100%'` and `height: '100%'` which will correctly resolve to 75x75 once the grid rows are fixed. No changes needed, but read for context.
- `.claude/commands/test_e2e.md` - Read to understand how to create and run E2E tests.
- `.claude/commands/e2e/test_basic_query.md` - Read as a reference example for E2E test file format.
- `.claude/commands/e2e/test_tile_size_stability.md` - Existing E2E test for tile size stability. Review to ensure it covers the fix validation.

### New Files
- No new files needed. The existing `.claude/commands/e2e/test_tile_size_stability.md` already validates tile dimensions are 75x75, which will catch this fix.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add explicit row height to the grid container
- Open `src/components/Game.tsx`
- Add `gridAutoRows: '75px'` to the grid container's style object (the `div` at line 67 with `display: 'grid'`)
- Place it after the `gridTemplateColumns` property for readability
- This ensures every grid row is exactly 75px, matching the column width

### Step 2: Verify TypeScript compilation and build
- Run `npx tsc --noEmit` to verify no type errors
- Run `npm run build` to verify the build succeeds

### Step 3: Run E2E test to validate tile size stability
- Read `.claude/commands/test_e2e.md` to understand the E2E test runner
- Read and execute the existing `.claude/commands/e2e/test_tile_size_stability.md` E2E test to validate:
  - All 16 tile cells render at exactly 75px x 75px
  - Tile dimensions remain stable after moves
  - Grid alignment and spacing are consistent
  - Board and controls fit within the viewport

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `npx tsc --noEmit` - Run TypeScript type checking to ensure no type errors were introduced
- `npm run build` - Run the full build (tsc + vite) to validate the fix compiles and bundles correctly
- Read `.claude/commands/test_e2e.md`, then read and execute the existing `.claude/commands/e2e/test_tile_size_stability.md` E2E test to validate tile size stability during gameplay and responsive layout

## Notes
- This is a single-line fix: adding `gridAutoRows: '75px'` to the grid container
- The previous fix (PR #2, ADW `051a26d5`) correctly addressed the `transition: all` issue and column sizing, but missed the row height definition
- The 75px value matches the column width from `gridTemplateColumns: 'repeat(4, 75px)'` to create square tiles
- No new dependencies are needed
- The existing E2E test (`test_tile_size_stability.md`) already validates 75x75 tile dimensions, so it will catch this fix
