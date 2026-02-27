import type { Page } from 'puppeteer';
import {
  highlight, highlightByText, highlightByTitle, removeHighlight,
  captureScene, delay, clickByText, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureStudentMgmt(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 StudentMgmt scenes...');
  const results: SceneResult[] = [];

  // Scene 1: Sidebar student list overview
  results.push(await captureScene(page, 'student-mgmt', 1, [
    async () => {
      await removeHighlight(page);
      await highlightByText(page, '學生名單');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 2: Open student manager → "管理學生" button
  results.push(await captureScene(page, 'student-mgmt', 2, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '管理學生');
    },
    async () => {
      await removeHighlight(page);
      await page.click('[title="管理學生"]');
      await delay(600);
      // Show the modal with "批次匯入" tab highlighted
      await highlightByText(page, '批次匯入');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 3: Import list — switch to import tab, show textarea with content
  results.push(await captureScene(page, 'student-mgmt', 3, [
    async () => {
      await removeHighlight(page);
      // Switch to import tab
      await clickByText(page, '批次匯入');
      await delay(400);
      // Highlight the textarea
      await highlight(page, 'textarea');
    },
    async () => {
      await removeHighlight(page);
      // Highlight the import button
      await highlightByText(page, '確認匯入');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: Edit student — show list tab with edit capabilities
  results.push(await captureScene(page, 'student-mgmt', 4, [
    async () => {
      await removeHighlight(page);
      // Switch to student list tab
      await clickByText(page, '學生列表');
      await delay(400);
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 5: Delete student — show delete flow
  results.push(await captureScene(page, 'student-mgmt', 5, [
    async () => {
      await removeHighlight(page);
      // The student list tab should still be open
      // Highlight the delete button
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('刪除') && btn.offsetParent !== null) {
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

  // Close the modal before next scene
  await closeModal(page);

  return results;
}
