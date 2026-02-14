import { chromium } from 'playwright';
import path from 'path';

const SCREENSHOT_DIR = '/home/luciano/agentic/agents/86b194ea/sdlc_implementor/img/color_palette_themes/';
const BASE_URL = 'http://localhost:5173';

// Helper to convert rgb(r, g, b) to hex
function rgbToHex(rgb) {
  if (!rgb) return null;
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return rgb; // already hex or other format
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Helper to compare hex colors (case insensitive)
function colorsMatch(actual, expected) {
  if (!actual || !expected) return false;
  return actual.toUpperCase() === expected.toUpperCase();
}

async function runTest() {
  const results = {
    test_name: 'Color Palette Themes',
    status: 'passed',
    screenshots: [],
    steps: [],
    error: null
  };

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    // Helper to log step result
    function stepResult(stepNum, description, passed, detail = '') {
      const status = passed ? 'PASSED' : 'FAILED';
      const entry = { step: stepNum, description, status, detail };
      results.steps.push(entry);
      console.log(`Step ${stepNum}: ${description} - ${status}${detail ? ' (' + detail + ')' : ''}`);
      if (!passed) {
        results.status = 'failed';
        if (!results.error) {
          results.error = `Step ${stepNum}: ${description} - ${detail}`;
        }
      }
      return passed;
    }

    // Step 1: Navigate to http://localhost:5173
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    stepResult(1, 'Navigate to http://localhost:5173', true);

    // Step 2: Take initial screenshot
    const ss1 = path.join(SCREENSHOT_DIR, '01_initial_classic_palette.png');
    await page.screenshot({ path: ss1, fullPage: true });
    results.screenshots.push(ss1);
    stepResult(2, 'Take screenshot 01_initial_classic_palette.png', true);

    // Step 3: Verify page title heading "2048" is visible
    const heading = await page.$('h1');
    const headingText = heading ? await heading.textContent() : null;
    const headingVisible = heading ? await heading.isVisible() : false;
    stepResult(3, 'Verify page title heading "2048" is visible',
      headingVisible && headingText === '2048',
      `heading text: "${headingText}", visible: ${headingVisible}`);

    // Step 4: Verify palette selector with four options: Classic, Dark, High Contrast, Ocean
    const paletteButtons = await page.$$('button[data-palette]');
    const paletteNames = [];
    for (const btn of paletteButtons) {
      const text = await btn.textContent();
      paletteNames.push(text.trim());
    }
    const expectedPalettes = ['Classic', 'Dark', 'High Contrast', 'Ocean'];
    const palettesMatch = expectedPalettes.every(p => paletteNames.some(n => n.includes(p)));
    stepResult(4, 'Verify palette selector with four options',
      paletteButtons.length === 4 && palettesMatch,
      `Found ${paletteButtons.length} buttons: ${paletteNames.join(', ')}`);

    // Step 5: Verify Classic is active by default
    const classicBtn = await page.$('button[data-palette="classic"]');
    const classicActive = classicBtn ? await classicBtn.getAttribute('data-active') : null;
    stepResult(5, 'Verify Classic palette is selected/active by default',
      classicActive === 'true',
      `data-active="${classicActive}"`);

    // Step 6: Click the "Dark" palette button
    const darkBtn = await page.$('button[data-palette="dark"]');
    await darkBtn.click();
    await page.waitForTimeout(300); // wait for transition
    stepResult(6, 'Click the "Dark" palette button', true);

    // Step 7: Verify page background changes to #0F1115
    const darkBgRgb = await page.evaluate(() => {
      // The outer container is the first child div of the Game component
      const container = document.querySelector('div[style*="min-height"]');
      if (container) return getComputedStyle(container).backgroundColor;
      return null;
    });
    const darkBgHex = rgbToHex(darkBgRgb);
    stepResult(7, 'Verify page background changes to #0F1115',
      colorsMatch(darkBgHex, '#0F1115'),
      `actual: ${darkBgHex} (${darkBgRgb})`);

    // Step 8: Verify board background changes to dark color
    const darkBoardRgb = await page.evaluate(() => {
      const board = document.querySelector('div[style*="grid-template-columns"]');
      if (board) return getComputedStyle(board).backgroundColor;
      return null;
    });
    const darkBoardHex = rgbToHex(darkBoardRgb);
    // Dark board is #1E2430
    stepResult(8, 'Verify board background changes to dark color',
      colorsMatch(darkBoardHex, '#1E2430'),
      `actual: ${darkBoardHex} (${darkBoardRgb})`);

    // Step 9: Take screenshot
    const ss2 = path.join(SCREENSHOT_DIR, '02_dark_palette.png');
    await page.screenshot({ path: ss2, fullPage: true });
    results.screenshots.push(ss2);
    stepResult(9, 'Take screenshot 02_dark_palette.png', true);

    // Step 10: Click "High Contrast" palette button
    const hcBtn = await page.$('button[data-palette="highContrast"]');
    await hcBtn.click();
    await page.waitForTimeout(300);
    stepResult(10, 'Click the "High Contrast" palette button', true);

    // Step 11: Verify page background changes to #FFFFFF
    const hcBgRgb = await page.evaluate(() => {
      const container = document.querySelector('div[style*="min-height"]');
      if (container) return getComputedStyle(container).backgroundColor;
      return null;
    });
    const hcBgHex = rgbToHex(hcBgRgb);
    stepResult(11, 'Verify page background changes to #FFFFFF',
      colorsMatch(hcBgHex, '#FFFFFF'),
      `actual: ${hcBgHex} (${hcBgRgb})`);

    // Step 12: Verify board background changes to #000000
    const hcBoardRgb = await page.evaluate(() => {
      const board = document.querySelector('div[style*="grid-template-columns"]');
      if (board) return getComputedStyle(board).backgroundColor;
      return null;
    });
    const hcBoardHex = rgbToHex(hcBoardRgb);
    stepResult(12, 'Verify board background changes to #000000',
      colorsMatch(hcBoardHex, '#000000'),
      `actual: ${hcBoardHex} (${hcBoardRgb})`);

    // Step 13: Take screenshot
    const ss3 = path.join(SCREENSHOT_DIR, '03_high_contrast_palette.png');
    await page.screenshot({ path: ss3, fullPage: true });
    results.screenshots.push(ss3);
    stepResult(13, 'Take screenshot 03_high_contrast_palette.png', true);

    // Step 14: Click "Ocean" palette button
    const oceanBtn = await page.$('button[data-palette="ocean"]');
    await oceanBtn.click();
    await page.waitForTimeout(300);
    stepResult(14, 'Click the "Ocean" palette button', true);

    // Step 15: Verify page background changes to #EAF6FF
    const oceanBgRgb = await page.evaluate(() => {
      const container = document.querySelector('div[style*="min-height"]');
      if (container) return getComputedStyle(container).backgroundColor;
      return null;
    });
    const oceanBgHex = rgbToHex(oceanBgRgb);
    stepResult(15, 'Verify page background changes to #EAF6FF',
      colorsMatch(oceanBgHex, '#EAF6FF'),
      `actual: ${oceanBgHex} (${oceanBgRgb})`);

    // Step 16: Take screenshot
    const ss4 = path.join(SCREENSHOT_DIR, '04_ocean_palette.png');
    await page.screenshot({ path: ss4, fullPage: true });
    results.screenshots.push(ss4);
    stepResult(16, 'Take screenshot 04_ocean_palette.png', true);

    // Step 17: Click "Classic" palette button
    const classicBtn2 = await page.$('button[data-palette="classic"]');
    await classicBtn2.click();
    await page.waitForTimeout(300);
    stepResult(17, 'Click the "Classic" palette button', true);

    // Step 18: Verify page background returns to #faf8f3
    const classicBgRgb = await page.evaluate(() => {
      const container = document.querySelector('div[style*="min-height"]');
      if (container) return getComputedStyle(container).backgroundColor;
      return null;
    });
    const classicBgHex = rgbToHex(classicBgRgb);
    stepResult(18, 'Verify page background returns to Classic color #FAF8F3',
      colorsMatch(classicBgHex, '#FAF8F3'),
      `actual: ${classicBgHex} (${classicBgRgb})`);

    // Step 19: Take screenshot
    const ss5 = path.join(SCREENSHOT_DIR, '05_classic_restored.png');
    await page.screenshot({ path: ss5, fullPage: true });
    results.screenshots.push(ss5);
    stepResult(19, 'Take screenshot 05_classic_restored.png', true);

    // Step 20: Verify tile sizes remain 75px x 75px
    // We check tiles across all palettes by cycling through them
    const tileSizeCheck = await page.evaluate(() => {
      const tiles = document.querySelectorAll('div[style*="grid-template-columns"] > div');
      const sizes = [];
      for (const tile of tiles) {
        const rect = tile.getBoundingClientRect();
        sizes.push({ width: Math.round(rect.width), height: Math.round(rect.height) });
      }
      return sizes;
    });
    const allTiles75 = tileSizeCheck.every(s => s.width === 75 && s.height === 75);
    stepResult(20, 'Verify tile sizes remain 75px x 75px',
      allTiles75,
      `Tiles found: ${tileSizeCheck.length}, sizes: ${tileSizeCheck.length > 0 ? JSON.stringify(tileSizeCheck[0]) : 'none'}, all 75px: ${allTiles75}`);

    // Also check tiles in other palettes
    // Switch to Dark, check tiles
    await (await page.$('button[data-palette="dark"]')).click();
    await page.waitForTimeout(200);
    const darkTileSizes = await page.evaluate(() => {
      const tiles = document.querySelectorAll('div[style*="grid-template-columns"] > div');
      return Array.from(tiles).map(t => {
        const r = t.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
      });
    });
    const darkTiles75 = darkTileSizes.every(s => s.width === 75 && s.height === 75);

    // Switch to High Contrast, check tiles
    await (await page.$('button[data-palette="highContrast"]')).click();
    await page.waitForTimeout(200);
    const hcTileSizes = await page.evaluate(() => {
      const tiles = document.querySelectorAll('div[style*="grid-template-columns"] > div');
      return Array.from(tiles).map(t => {
        const r = t.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
      });
    });
    const hcTiles75 = hcTileSizes.every(s => s.width === 75 && s.height === 75);

    // Switch to Ocean, check tiles
    await (await page.$('button[data-palette="ocean"]')).click();
    await page.waitForTimeout(200);
    const oceanTileSizes = await page.evaluate(() => {
      const tiles = document.querySelectorAll('div[style*="grid-template-columns"] > div');
      return Array.from(tiles).map(t => {
        const r = t.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
      });
    });
    const oceanTiles75 = oceanTileSizes.every(s => s.width === 75 && s.height === 75);

    if (!darkTiles75 || !hcTiles75 || !oceanTiles75) {
      // Update step 20 if cross-palette check fails
      const detail = `Classic: ${allTiles75}, Dark: ${darkTiles75}, HC: ${hcTiles75}, Ocean: ${oceanTiles75}`;
      if (allTiles75) {
        // Replace the step 20 entry
        results.steps[results.steps.length - 1] = {
          step: 20,
          description: 'Verify tile sizes remain 75px x 75px across all palettes',
          status: 'FAILED',
          detail
        };
        results.status = 'failed';
        if (!results.error) results.error = `Step 20: Tile size inconsistency: ${detail}`;
      }
    } else {
      console.log(`  Step 20 cross-palette tile check: Classic: ${allTiles75}, Dark: ${darkTiles75}, HC: ${hcTiles75}, Ocean: ${oceanTiles75} - all PASSED`);
    }

    // Switch back to Classic for the persistence test
    await (await page.$('button[data-palette="classic"]')).click();
    await page.waitForTimeout(200);

    // Step 21: Reload the page
    await page.reload({ waitUntil: 'networkidle' });
    stepResult(21, 'Reload the page', true);

    // Step 22: Verify Classic palette persists after refresh
    const classicBtnAfterRefresh = await page.$('button[data-palette="classic"]');
    const classicActiveAfterRefresh = classicBtnAfterRefresh ? await classicBtnAfterRefresh.getAttribute('data-active') : null;
    stepResult(22, 'Verify Classic palette persists after refresh',
      classicActiveAfterRefresh === 'true',
      `data-active="${classicActiveAfterRefresh}"`);

    // Step 23: Take final screenshot
    const ss6 = path.join(SCREENSHOT_DIR, '06_post_refresh.png');
    await page.screenshot({ path: ss6, fullPage: true });
    results.screenshots.push(ss6);
    stepResult(23, 'Take screenshot 06_post_refresh.png', true);

  } catch (err) {
    results.status = 'failed';
    results.error = err.message;
    console.error('Test execution error:', err.message);
  } finally {
    if (browser) await browser.close();
  }

  // Final output
  console.log('\n========================================');
  console.log('FINAL TEST RESULTS');
  console.log('========================================');
  const output = {
    test_name: results.test_name,
    status: results.status,
    screenshots: results.screenshots,
    error: results.error
  };
  console.log(JSON.stringify(output, null, 2));
  console.log('========================================');
  console.log('\nDetailed Step Results:');
  for (const step of results.steps) {
    console.log(`  Step ${step.step}: [${step.status}] ${step.description}${step.detail ? ' - ' + step.detail : ''}`);
  }
}

runTest();
