# E2E Test: Tile Size Stability

Test that 2048 game board tiles maintain consistent dimensions during gameplay and that the layout is responsive.

## User Story

As a player
I want the game board tiles to remain a constant size during gameplay
So that the grid looks stable and the layout does not break across screen sizes

## Test Steps

1. Navigate to the `Application URL`
2. Take a screenshot of the initial board state
3. **Verify** the page title heading "2048" is visible
4. **Verify** core UI elements are present:
   - Game board (grid) with 16 tile cells
   - Score display
   - New Game button
   - Instruction text ("Use arrow keys to move tiles")

5. Measure the width and height of every tile cell element on the board
6. **Verify** all tile cells have identical width (expected: 75px)
7. **Verify** all tile cells have identical height (expected: 75px)
8. Take a screenshot showing the measured tile dimensions

9. Press the ArrowRight key to make a move
10. Wait 300ms for any transitions to complete
11. Measure the width and height of every tile cell element again
12. **Verify** all tile dimensions match the dimensions measured in step 5 (no resizing after a move)
13. Take a screenshot after the first move

14. Press the ArrowDown key to make another move
15. Wait 300ms for any transitions to complete
16. Measure the width and height of every tile cell element again
17. **Verify** all tile dimensions still match the original dimensions from step 5
18. Take a screenshot after the second move

19. **Verify** the board and controls (score, New Game button, instructions) are fully visible within the viewport without scrolling
20. Take a screenshot of the full page showing all elements are visible

## Success Criteria
- All 16 tile cells render with consistent 75px x 75px dimensions on initial load
- Tile dimensions remain exactly the same after making moves (ArrowRight, ArrowDown)
- Grid alignment and spacing are consistent (no shifting rows/columns)
- The board and all core controls fit within the viewport without scrolling
- 5 screenshots are taken
