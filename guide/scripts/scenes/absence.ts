import type { Page } from 'puppeteer';
import {
  removeHighlight,
  captureScene, delay, clickStudent, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureAbsence(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 Absence scenes...');
  const results: SceneResult[] = [];

  // Ensure clean state
  await closeModal(page);
  await delay(300);

  // Scene 1: Select a student
  results.push(await captureScene(page, 'absence', 1, [
    async () => {
      await removeHighlight(page);
      // Highlight 陳怡君 in sidebar
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('陳怡君') && btn.closest('.overflow-y-auto')) {
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
      await clickStudent(page, '陳怡君');
      await delay(600);
    },
  ], outputDir));

  // Scene 2: Record absence — highlight absence button area
  results.push(await captureScene(page, 'absence', 2, [
    async () => {
      await removeHighlight(page);
      // Find and highlight the absence button (假 button in the student detail header)
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.trim() === '假' && btn.offsetParent !== null) {
            const rect = btn.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.className = '__capture_highlight__';
            overlay.style.cssText = `
              position: fixed;
              left: ${rect.left - 6}px; top: ${rect.top - 6}px;
              width: ${rect.width + 12}px; height: ${rect.height + 12}px;
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
      // Click the absence button to expand options
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.trim() === '假' && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(500);
      // Highlight the expanded absence type options
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('病假') && btn.offsetParent !== null) {
            const rect = btn.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.className = '__capture_highlight__';
            overlay.style.cssText = `
              position: fixed;
              left: ${rect.left - 6}px; top: ${rect.top - 6}px;
              width: ${rect.width + 12}px; height: ${rect.height + 12}px;
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
  ], outputDir));

  // Scene 3: View absence record in sidebar
  results.push(await captureScene(page, 'absence', 3, [
    async () => {
      await removeHighlight(page);
      // Click "病假" to set it
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('病假') && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(800);
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: Edit/cancel absence
  results.push(await captureScene(page, 'absence', 4, [
    async () => {
      await removeHighlight(page);
      // Highlight the absence badge that can be clicked to remove
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('[title*="取消請假"]');
        for (const btn of buttons) {
          if (btn.offsetParent !== null) {
            const rect = btn.getBoundingClientRect();
            const overlay = document.createElement('div');
            overlay.className = '__capture_highlight__';
            overlay.style.cssText = `
              position: fixed;
              left: ${rect.left - 6}px; top: ${rect.top - 6}px;
              width: ${rect.width + 12}px; height: ${rect.height + 12}px;
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
      // Cancel the absence
      await page.evaluate(() => {
        const btns = document.querySelectorAll('[title*="取消請假"]');
        for (const btn of btns) {
          if (btn.offsetParent !== null) {
            (btn as HTMLElement).click();
            return;
          }
        }
      });
      await delay(500);
    },
  ], outputDir));

  return results;
}
