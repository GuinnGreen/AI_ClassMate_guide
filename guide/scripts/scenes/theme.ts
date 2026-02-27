import type { Page } from 'puppeteer';
import {
  highlightByTitle, removeHighlight,
  captureScene, delay, goToDashboard, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureTheme(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 Theme scenes...');
  const results: SceneResult[] = [];

  // Ensure clean state
  await closeModal(page);
  await delay(300);

  // Scene 1: Settings area overview — sidebar footer
  results.push(await captureScene(page, 'theme', 1, [
    async () => {
      await removeHighlight(page);
      // Highlight the settings area at sidebar footer
      await page.evaluate(() => {
        // Find the footer area with theme buttons
        const footer = document.querySelector('[class*="border-t"][class*="shrink-0"]');
        if (footer && footer.getBoundingClientRect().width > 0) {
          const rect = footer.getBoundingClientRect();
          const overlay = document.createElement('div');
          overlay.className = '__capture_highlight__';
          overlay.style.cssText = `
            position: fixed;
            left: ${rect.left - 4}px; top: ${rect.top - 4}px;
            width: ${rect.width + 8}px; height: ${rect.height + 8}px;
            border: 3px solid #EF4444; border-radius: 12px;
            pointer-events: none; z-index: 99999;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
          `;
          document.body.appendChild(overlay);
        }
      });
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 2: Toggle dark mode
  results.push(await captureScene(page, 'theme', 2, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '切換深色模式');
    },
    async () => {
      await removeHighlight(page);
      // Toggle dark mode on
      await page.click('[title="切換深色模式"]');
      await delay(800);
    },
    async () => {
      await removeHighlight(page);
      // Toggle dark mode back off (we want light mode for remaining screenshots)
      await page.click('[title="切換深色模式"]');
      await delay(500);
    },
  ], outputDir));

  // Scene 3: Font size adjustment
  results.push(await captureScene(page, 'theme', 3, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '放大字體');
    },
    async () => {
      await removeHighlight(page);
      // Increase font size
      await page.click('[title="放大字體"]');
      await delay(500);
    },
    async () => {
      await removeHighlight(page);
      // Reset font size
      await page.click('[title="縮小字體"]');
      await delay(300);
    },
  ], outputDir));

  // Scene 4: Clock size on whiteboard
  results.push(await captureScene(page, 'theme', 4, [
    async () => {
      await removeHighlight(page);
      await goToDashboard(page);
      await delay(500);
      // The whiteboard should show the clock - highlight clock size buttons
      await page.evaluate(() => {
        // Look for clock size buttons in the whiteboard header area
        const allBtns = document.querySelectorAll('button');
        let found = false;
        for (const btn of allBtns) {
          // Clock size buttons are near the clock display
          if (btn.closest('[class*="flex-1"][class*="overflow-hidden"]') &&
            btn.querySelector('svg') &&
            !found) {
            const rect = btn.getBoundingClientRect();
            if (rect.width > 0 && rect.width < 40) {
              const overlay = document.createElement('div');
              overlay.className = '__capture_highlight__';
              overlay.style.cssText = `
                position: fixed;
                left: ${rect.left - 4}px; top: ${rect.top - 4}px;
                width: ${rect.width + 8}px; height: ${rect.height + 8}px;
                border: 3px solid #EF4444; border-radius: 12px;
                pointer-events: none; z-index: 99999;
                box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
              `;
              document.body.appendChild(overlay);
              found = true;
            }
          }
        }
      });
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  return results;
}
