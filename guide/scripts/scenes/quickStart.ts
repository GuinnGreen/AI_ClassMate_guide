import type { Page } from 'puppeteer';
import {
  highlight, highlightByText, highlightByTitle, removeHighlight,
  captureScene, delay, clickByText, clickStudent, goToDashboard, closeModal,
  login, logout,
  type SceneResult,
} from '../captureUtils';

const TEST_EMAIL = 'test_demo@school.com';
const TEST_PASSWORD = '123456';

export async function captureQuickStart(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 QuickStart scenes...');
  const results: SceneResult[] = [];

  // Scene 1: Registration page — show unauthenticated login/register page
  results.push(await captureScene(page, 'quick-start', 1, [
    async () => {
      // Logout to reach the unauthenticated login page
      await logout(page);
      // Frame 1: login page with "登入"/"註冊" tab buttons visible
    },
    async () => {
      // Click "註冊" tab to show registration form
      await clickByText(page, '註冊');
      await delay(500);
      // Frame 2: registration form with confirm-password field
    },
  ], outputDir));

  // Restore logged-in state for remaining scenes
  await login(page, TEST_EMAIL, TEST_PASSWORD);

  // Scene 2: Batch import modal — show semester date fields and import button
  results.push(await captureScene(page, 'quick-start', 2, [
    async () => {
      await removeHighlight(page);
      // Open the student manager
      await page.click('[title="管理學生"]');
      await delay(600);
      // Switch to batch import tab
      await clickByText(page, '批次匯入');
      await delay(400);
      // Frame 1: highlight semester date fields
      await highlightByText(page, '學期期間設定');
    },
    async () => {
      await removeHighlight(page);
      // Frame 2: highlight confirm import button
      await highlightByText(page, '確認匯入');
    },
    async () => {
      await removeHighlight(page);
      // Frame 3: close modal
      await closeModal(page);
      await delay(400);
    },
  ], outputDir));

  // Scene 3: Record behavior — click a student, highlight behavior buttons
  results.push(await captureScene(page, 'quick-start', 3, [
    async () => {
      await removeHighlight(page);
      await clickStudent(page, '王小明');
      await delay(600);
      // Highlight the positive behavior buttons area
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
      // Click the button to show score change
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('回答正確') && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(500);
    },
  ], outputDir));

  // Scene 4: Whiteboard — show whiteboard view
  results.push(await captureScene(page, 'quick-start', 4, [
    async () => {
      await removeHighlight(page);
      // Highlight "主畫面" to navigate to whiteboard
      await highlightByText(page, '主畫面');
    },
    async () => {
      await removeHighlight(page);
      await goToDashboard(page);
      await delay(500);
    },
  ], outputDir));

  // Scene 5: Generate AI comment — show AI mode
  results.push(await captureScene(page, 'quick-start', 5, [
    async () => {
      await removeHighlight(page);
      await clickStudent(page, '王小明');
      await delay(600);
      // Switch to AI tab
      await clickByText(page, 'AI 評語');
      await delay(500);
      await highlightByText(page, '生成 AI 評語');
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
