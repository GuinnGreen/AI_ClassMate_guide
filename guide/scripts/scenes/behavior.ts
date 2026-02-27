import type { Page } from 'puppeteer';
import {
  highlightByText, highlightByTitle, removeHighlight,
  captureScene, delay, clickByText, clickStudent, goToDashboard, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureBehavior(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 Behavior scenes...');
  const results: SceneResult[] = [];

  // Ensure we start from a clean state — go to dashboard first
  await goToDashboard(page);
  await delay(500);

  // Scene 1: Select a student from sidebar
  results.push(await captureScene(page, 'behavior', 1, [
    async () => {
      await removeHighlight(page);
      // Highlight a student in sidebar
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('李美玲') && btn.closest('.overflow-y-auto')) {
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
      await clickStudent(page, '李美玲');
      await delay(600);
    },
  ], outputDir));

  // Scene 2: Quick +/- behavior buttons
  results.push(await captureScene(page, 'behavior', 2, [
    async () => {
      await removeHighlight(page);
      // Highlight positive behavior buttons
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('回答正確') && btn.offsetParent !== null) {
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
      // Click the button
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('熱心服務') && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(500);
    },
  ], outputDir));

  // Scene 3: View today's records
  results.push(await captureScene(page, 'behavior', 3, [
    async () => {
      await removeHighlight(page);
      // The record list should be visible at the top
      await highlightByText(page, '正面表現');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: Coaching notes (輔導紀錄)
  results.push(await captureScene(page, 'behavior', 4, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '輔導紀錄');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 5: Custom behavior buttons
  results.push(await captureScene(page, 'behavior', 5, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '自訂按鈕');
    },
    async () => {
      await removeHighlight(page);
      // Open custom button editor
      await page.click('[title="自訂按鈕"]');
      await delay(600);
    },
    async () => {
      await removeHighlight(page);
      // Close modal
      await closeModal(page);
      await delay(400);
    },
  ], outputDir));

  return results;
}
