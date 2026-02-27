import type { Page } from 'puppeteer';
import {
  highlightByText, removeHighlight,
  captureScene, delay, clickByText, clickStudent, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureAiComment(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 AiComment scenes...');
  const results: SceneResult[] = [];

  // Ensure clean state
  await closeModal(page);
  await delay(300);

  // Scene 1: Confirm records exist — show student detail with daily records
  results.push(await captureScene(page, 'ai-comment', 1, [
    async () => {
      await removeHighlight(page);
      await clickStudent(page, '王小明');
      await delay(600);
      // Highlight the records area
      await highlightByText(page, '正面表現');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 2: Enter student page — highlight student in sidebar
  results.push(await captureScene(page, 'ai-comment', 2, [
    async () => {
      await removeHighlight(page);
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('王小明') && btn.closest('.overflow-y-auto')) {
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

  // Scene 3: Click generate — AI mode with generate button
  results.push(await captureScene(page, 'ai-comment', 3, [
    async () => {
      await removeHighlight(page);
      // Switch to AI tab
      await clickByText(page, 'AI 評語');
      await delay(500);
      await highlightByText(page, '生成 AI 評語');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: Review/edit — show the comment textarea area
  results.push(await captureScene(page, 'ai-comment', 4, [
    async () => {
      await removeHighlight(page);
      // Highlight the comment textarea area
      await page.evaluate(() => {
        const textareas = document.querySelectorAll('textarea');
        for (const ta of textareas) {
          if (ta.placeholder?.includes('評語') && ta.offsetParent !== null) {
            const rect = ta.getBoundingClientRect();
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

  // Scene 5: Copy/save — highlight copy button
  results.push(await captureScene(page, 'ai-comment', 5, [
    async () => {
      await removeHighlight(page);
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.title?.includes('複製') && btn.offsetParent !== null) {
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
      // Switch back to daily mode
      await clickByText(page, '日常紀錄');
      await delay(300);
    },
  ], outputDir));

  return results;
}
