import type { Page } from 'puppeteer';
import {
  delay,
  waitForText,
  clickByText,
  clickByTitle,
  clickStudent,
  goToDashboard,
  closeModal,
} from './captureUtils';

const STUDENT_LIST = `王小明
李美玲
張志豪
陳怡君
林佳蓉
黃建宏
吳雅婷
劉家豪`;

/** Seed the test account with sample data via real UI interactions */
export async function seedData(page: Page) {
  console.log('\n📦 Seeding test data...');

  // 1. Import 8 students
  await importStudents(page);

  // 2. Add behavior records for first 3 students
  await addBehaviorRecords(page);

  // 3. Write something on the whiteboard
  await writeWhiteboard(page);

  console.log('✅ Seed data complete!\n');
}

/** Import students via the Student Manager UI */
async function importStudents(page: Page) {
  console.log('  📋 Importing students...');

  // Check if we're on the empty state — if so, click "立即匯入學生名單"
  const hasEmptyState = await page.evaluate(() => {
    return document.body.innerText.includes('立即匯入學生名單');
  });

  if (hasEmptyState) {
    await clickByText(page, '立即匯入學生名單');
  } else {
    // Click "管理學生" button in sidebar
    await clickByTitle(page, '管理學生');
    await delay(600);
    // Switch to "批次匯入" tab
    await clickByText(page, '批次匯入');
  }
  await delay(800);

  // Wait for textarea to appear in the modal
  await page.waitForSelector('textarea', { timeout: 10000 });

  // Set textarea value using evaluate (type() doesn't handle \n well)
  const studentText = STUDENT_LIST;
  await page.evaluate((text) => {
    const ta = document.querySelector('textarea');
    if (ta) {
      // Use native input setter to trigger React's onChange
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      )!.set!;
      nativeInputValueSetter.call(ta, text);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, studentText);
  await delay(800);

  // Click "確認匯入" button
  await clickByText(page, '確認匯入');
  await delay(2000);

  // Close the modal by clicking X button (Modal doesn't support Escape key)
  await closeModal(page);
  await delay(500);

  // Verify students appeared in sidebar
  await waitForText(page, '王小明');
  console.log('  ✅ Students imported');
}

/** Add some behavior records to first 3 students */
async function addBehaviorRecords(page: Page) {
  console.log('  📊 Adding behavior records...');

  const studentsToScore = ['王小明', '李美玲', '張志豪'];

  for (const name of studentsToScore) {
    // Click student in sidebar
    await clickStudent(page, name);
    await delay(800);

    // We should be on the student detail page - make sure we're on "日常紀錄" tab
    // Then click some positive behavior buttons
    // Find and click positive buttons ("+1" buttons)
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        for (const btn of buttons) {
          if (btn.textContent?.includes('回答正確') && btn.offsetParent !== null) {
            btn.click();
            return;
          }
        }
      });
      await delay(300);
    }

    // Click one negative button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent?.includes('上課講話') && btn.offsetParent !== null) {
          btn.click();
          return;
        }
      }
    });
    await delay(300);

    console.log(`    ✅ ${name}: +3 / -1`);
  }
}

/** Write something on the whiteboard */
async function writeWhiteboard(page: Page) {
  console.log('  📝 Writing on whiteboard...');

  // Navigate to dashboard
  await goToDashboard(page);
  await delay(800);

  // Click "編輯" button on the whiteboard
  await clickByText(page, '編輯');
  await delay(500);

  // Find the textarea and type some content
  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.click();
    await textarea.type('今日作業：國語習作 P.30-31\n明天帶美勞材料\n週五校外教學，記得穿運動服', { delay: 10 });
  }
  await delay(300);

  // Click "儲存" button
  await clickByText(page, '儲存');
  await delay(500);

  console.log('  ✅ Whiteboard content written');
}
