import type { Page } from 'puppeteer';
import {
  highlightByTitle, highlightByText, removeHighlight,
  captureScene, delay, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureArchive(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 Archive scenes...');
  const results: SceneResult[] = [];

  // Ensure clean state
  await closeModal(page);
  await delay(300);

  // Scene 1: Understand archiving — highlight semester settings button
  results.push(await captureScene(page, 'archive', 1, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '學期設定');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 2: Open semester settings modal
  results.push(await captureScene(page, 'archive', 2, [
    async () => {
      await removeHighlight(page);
      await page.click('[title="學期設定"]');
      await delay(600);
    },
    async () => {
      await removeHighlight(page);
      // Highlight the "封存學期" button
      await highlightByText(page, '封存學期');
    },
  ], outputDir));

  // Scene 3: Confirm archive — show the archive confirmation area
  results.push(await captureScene(page, 'archive', 3, [
    async () => {
      await removeHighlight(page);
      // Click "封存學期" to show confirmation input
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('封存學期') && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(500);
      // Highlight the password input and confirm button
      await highlightByText(page, '確認封存');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: New semester — close modal, show clean state
  results.push(await captureScene(page, 'archive', 4, [
    async () => {
      await removeHighlight(page);
      // Close the modal without actually archiving
      await closeModal(page);
      await delay(400);
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  return results;
}
