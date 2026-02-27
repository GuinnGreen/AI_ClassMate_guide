import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, setupViewport, delay } from './captureUtils';
import { cleanData, seedData } from './seedData';
import { captureQuickStart } from './scenes/quickStart';
import { captureStudentMgmt } from './scenes/studentMgmt';
import { captureBehavior } from './scenes/behavior';
import { captureWhiteboard } from './scenes/whiteboard';
import { captureAiComment } from './scenes/aiComment';
import { captureTags } from './scenes/tags';
import { captureAbsence } from './scenes/absence';
import { captureTheme } from './scenes/theme';
import { captureCsvExport } from './scenes/csvExport';
import { captureArchive } from './scenes/archive';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../public/images');

const TEST_EMAIL = 'test_demo@school.com';
const TEST_PASSWORD = '123456';

async function main() {
  console.log('🚀 Starting capture process...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await setupViewport(page);

  // Handle all dialogs (alert/confirm) automatically
  page.on('dialog', async (dialog) => {
    console.log(`  💬 Dialog: "${dialog.message()}" → accept`);
    try {
      await dialog.accept();
    } catch {
      // Dialog may have already been dismissed
    }
  });

  try {
    // Step 1: Login
    console.log('🔐 Logging in...');
    await login(page, TEST_EMAIL, TEST_PASSWORD);
    console.log('✅ Logged in successfully\n');

    // Step 2: Clean all existing data then seed fresh
    await cleanData(page, TEST_PASSWORD);
    await seedData(page);

    // Step 3: Capture all scenes
    const allResults = [];

    allResults.push(...await captureQuickStart(page, OUTPUT_DIR));
    allResults.push(...await captureStudentMgmt(page, OUTPUT_DIR));
    allResults.push(...await captureBehavior(page, OUTPUT_DIR));
    allResults.push(...await captureWhiteboard(page, OUTPUT_DIR));
    allResults.push(...await captureAiComment(page, OUTPUT_DIR));
    allResults.push(...await captureTags(page, OUTPUT_DIR));
    allResults.push(...await captureAbsence(page, OUTPUT_DIR));
    allResults.push(...await captureTheme(page, OUTPUT_DIR));
    allResults.push(...await captureCsvExport(page, OUTPUT_DIR));
    allResults.push(...await captureArchive(page, OUTPUT_DIR));

    console.log(`\n🎉 Done! Generated ${allResults.length} animated WebP files.`);
    console.log('\nFiles:');
    for (const r of allResults) {
      console.log(`  ${r.name}.webp`);
    }
  } catch (err) {
    console.error('❌ Capture failed:', err);
    // Take a debug screenshot
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'debug-error.png') });
    console.log('  Debug screenshot saved to debug-error.png');
  } finally {
    await browser.close();
  }
}

main();
