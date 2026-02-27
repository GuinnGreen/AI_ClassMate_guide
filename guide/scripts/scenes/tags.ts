import type { Page } from 'puppeteer';
import {
  highlightByText, removeHighlight,
  captureScene, delay, clickByText, clickStudent, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureTags(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 Tags scenes...');
  const results: SceneResult[] = [];

  // Ensure clean state
  await closeModal(page);
  await delay(300);

  // Make sure we're on a student detail page in AI mode to see tags
  await clickStudent(page, '王小明');
  await delay(600);
  await clickByText(page, 'AI 評語');
  await delay(500);

  // Scene 1: Overview of tags area in AI mode
  results.push(await captureScene(page, 'tags', 1, [
    async () => {
      await removeHighlight(page);
      // The tags area should be visible - highlight the evaluation categories
      await page.evaluate(() => {
        // Find the first tag/category area
        const headers = document.querySelectorAll('h3, h4, span');
        for (const h of headers) {
          if (h.textContent?.includes('學習態度') && h.offsetParent !== null) {
            const rect = h.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.className = '__capture_highlight__';
            overlay.style.cssText = `
              position: fixed;
              left: ${rect.left - 8}px; top: ${rect.top - 8}px;
              width: ${rect.width + 16}px; height: ${rect.height + 16}px;
              border: 3px solid #EF4444; border-radius: 12px;
              pointer-events: none; z-index: 99999;
              box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
            `;
            document.body.appendChild(overlay);
            return;
          }
        }
      });
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 2: Enter tags area — highlight specific tag pills
  results.push(await captureScene(page, 'tags', 2, [
    async () => {
      await removeHighlight(page);
      // Highlight a clickable tag
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('勤奮好學') && btn.offsetParent !== null) {
            const rect = btn.getBoundingClientRect();
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
            return;
          }
        }
      });
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 3: Add tags — click some tags
  results.push(await captureScene(page, 'tags', 3, [
    async () => {
      await removeHighlight(page);
      // Click some tags
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('勤奮好學') && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(300);
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('負責盡職') && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(300);
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: Manage presets — show the tag categories
  results.push(await captureScene(page, 'tags', 4, [
    async () => {
      await removeHighlight(page);
      // Highlight the second category
      await page.evaluate(() => {
        const headers = document.querySelectorAll('h3, h4, span');
        for (const h of headers) {
          if (h.textContent?.includes('同儕互動') && h.offsetParent !== null) {
            const rect = h.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.className = '__capture_highlight__';
            overlay.style.cssText = `
              position: fixed;
              left: ${rect.left - 8}px; top: ${rect.top - 8}px;
              width: ${rect.width + 16}px; height: ${rect.height + 16}px;
              border: 3px solid #EF4444; border-radius: 12px;
              pointer-events: none; z-index: 99999;
              box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
            `;
            document.body.appendChild(overlay);
            return;
          }
        }
      });
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 5: Tags + comment combined view
  results.push(await captureScene(page, 'tags', 5, [
    async () => {
      await removeHighlight(page);
      // Show the generate button with tags selected
      await highlightByText(page, '生成 AI 評語');
    },
    async () => {
      await removeHighlight(page);
      // Go back to daily mode
      await clickByText(page, '日常紀錄');
      await delay(300);
    },
  ], outputDir));

  return results;
}
