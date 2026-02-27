import type { Page } from 'puppeteer';
import {
  highlight, highlightByText, highlightByTitle, removeHighlight,
  captureScene, delay, clickByText, goToDashboard, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureWhiteboard(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 Whiteboard scenes...');
  const results: SceneResult[] = [];

  // Ensure clean state - dismiss any open modals
  await closeModal(page);
  await delay(300);

  // Scene 1: Switch to whiteboard
  results.push(await captureScene(page, 'whiteboard', 1, [
    async () => {
      await removeHighlight(page);
      await highlightByText(page, '主畫面');
    },
    async () => {
      await removeHighlight(page);
      await goToDashboard(page);
      await delay(500);
    },
  ], outputDir));

  // Scene 2: Writing tools — edit mode
  results.push(await captureScene(page, 'whiteboard', 2, [
    async () => {
      await removeHighlight(page);
      await highlightByText(page, '編輯');
    },
    async () => {
      await removeHighlight(page);
      await clickByText(page, '編輯');
      await delay(500);
      // Highlight the textarea
      await highlight(page, 'textarea');
    },
    async () => {
      await removeHighlight(page);
      // Save and exit edit mode
      await clickByText(page, '儲存');
      await delay(400);
    },
  ], outputDir));

  // Scene 3: Schedule panel
  results.push(await captureScene(page, 'whiteboard', 3, [
    async () => {
      await removeHighlight(page);
      // Highlight the schedule area (right side)
      await highlightByText(page, '課表');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: Schedule editor
  results.push(await captureScene(page, 'whiteboard', 4, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '設定課表');
    },
    async () => {
      await removeHighlight(page);
      // Open schedule editor
      const btn = await page.$('[title="設定課表"]');
      if (btn) {
        await btn.click();
        await delay(600);
      }
    },
    async () => {
      await removeHighlight(page);
      // Close modal
      await closeModal(page);
      await delay(400);
    },
  ], outputDir));

  // Scene 5: Templates
  results.push(await captureScene(page, 'whiteboard', 5, [
    async () => {
      await removeHighlight(page);
      // Highlight the template pills (situation buttons) "今日"
      await highlightByText(page, '今日');
    },
    async () => {
      await removeHighlight(page);
      // Highlight the template editor button
      await highlightByTitle(page, '編輯模板');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  return results;
}
