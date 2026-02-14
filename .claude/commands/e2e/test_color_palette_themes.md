# E2E Test: Color Palette Themes

Test that the 2048 game palette selector allows switching between four color themes and that the selected palette persists across page refreshes.

## User Story

As a player
I want to choose a color palette for the game
So that I can personalize my visual experience and play in conditions that suit my environment or preferences (e.g., dark mode, high contrast for accessibility)

## Test Steps

1. Navigate to the `Application URL`
2. Take a screenshot of the initial state (should be Classic palette)
3. **Verify** the page title heading "2048" is visible
4. **Verify** a palette selector is present with four options: Classic, Dark, High Contrast, Ocean
5. **Verify** the Classic palette is selected/active by default
6. Click the "Dark" palette button
7. **Verify** the page background changes to `#0F1115` (or very close)
8. **Verify** the board background changes to a dark color
9. Take a screenshot of the Dark palette state
10. Click the "High Contrast" palette button
11. **Verify** the page background changes to `#FFFFFF`
12. **Verify** the board background changes to `#000000`
13. Take a screenshot of the High Contrast palette state
14. Click the "Ocean" palette button
15. **Verify** the page background changes to `#EAF6FF` (or very close)
16. Take a screenshot of the Ocean palette state
17. Click the "Classic" palette button
18. **Verify** the page background returns to the original Classic color
19. Take a screenshot confirming Classic palette is restored
20. **Verify** tile sizes remain 75px x 75px throughout all palette switches (no layout changes)
21. Reload the page
22. **Verify** the last selected palette (Classic) persists after refresh
23. Take a screenshot of the post-refresh state

## Success Criteria

- Palette selector is visible and lists all four palettes
- Switching palettes changes only colors, not layout
- Each palette applies correct background and board colors
- Tile dimensions remain 75px x 75px after every switch
- Selected palette persists after page reload
- 6 screenshots are taken
