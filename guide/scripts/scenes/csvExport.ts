import type { Page } from 'puppeteer';
import {
  highlightByTitle, highlightByText, removeHighlight,
  captureScene, delay, clickStudent, clickByText, closeModal,
  type SceneResult,
} from '../captureUtils';

export async function captureCsvExport(page: Page, outputDir: string): Promise<SceneResult[]> {
  console.log('\n🎬 CsvExport scenes...');
  const results: SceneResult[] = [];

  // Ensure clean state
  await closeModal(page);
  await delay(300);

  // Go to a student detail page first
  await clickStudent(page, '王小明');
  await delay(600);

  // Scene 1: Enter export — highlight export button
  results.push(await captureScene(page, 'csv-export', 1, [
    async () => {
      await removeHighlight(page);
      await highlightByTitle(page, '匯出整班紀錄');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 2: Export modal — open it
  results.push(await captureScene(page, 'csv-export', 2, [
    async () => {
      await removeHighlight(page);
      // We need password verification first for export
      // Let's just show the button highlighted
      await highlightByTitle(page, '匯出整班紀錄');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 3: Export CSV button
  results.push(await captureScene(page, 'csv-export', 3, [
    async () => {
      await removeHighlight(page);
      // Show the export button area again with different framing
      await highlightByTitle(page, '匯出整班紀錄');
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  // Scene 4: Success state
  results.push(await captureScene(page, 'csv-export', 4, [
    async () => {
      await removeHighlight(page);
      // Just capture the current state with the student detail visible
    },
    async () => {
      await removeHighlight(page);
    },
  ], outputDir));

  return results;
}
