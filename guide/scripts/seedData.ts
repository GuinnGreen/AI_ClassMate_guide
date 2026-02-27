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

/** Clean all existing data (students + whiteboard) so we start fresh */
export async function cleanData(page: Page, password: string) {
  console.log('\n🧹 Cleaning existing data...');

  // Wait for Firebase data to fully load — poll until student count stabilizes
  console.log('  ⏳ Waiting for Firebase data to load...');
  await delay(2000);
  let prevCount = -1;
  for (let i = 0; i < 5; i++) {
    const currentCount = await page.evaluate(() => {
      const match = document.body.innerText.match(/學生名單\s*\((\d+)\)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    if (currentCount === prevCount && i > 0) break; // stabilized
    prevCount = currentCount;
    await delay(1500);
  }
  const studentCount = prevCount;

  if (studentCount > 0) {
    // Step 1: Clear whiteboard FIRST (before deleting students, since whiteboard only shows when students exist)
    console.log('  📝 Clearing whiteboard...');
    await goToDashboard(page);
    await delay(1000);

    // Click "編輯" button on whiteboard (only exists when not viewing a student)
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent?.trim() === '編輯' && (btn as HTMLElement).offsetParent !== null) {
          (btn as HTMLElement).click();
          return;
        }
      }
    });
    await delay(800);

    // Clear the textarea
    await page.evaluate(() => {
      const ta = document.querySelector('textarea');
      if (ta) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype, 'value'
        )!.set!;
        nativeInputValueSetter.call(ta, '');
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await delay(500);

    // Click "儲存" — use page.evaluate to ensure we click the right button
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent?.trim() === '儲存' && (btn as HTMLElement).offsetParent !== null) {
          (btn as HTMLElement).click();
          return;
        }
      }
    });
    await delay(1000);
    console.log('  ✅ Whiteboard cleared');

    // Step 2: Delete all students via Student Manager
    console.log('  🗑️  Deleting all students...');
    await page.evaluate(() => {
      const btn = document.querySelector('[title="管理學生"]') as HTMLElement;
      if (btn) btn.click();
    });
    await delay(1000);

    // Wait for the Student Manager modal
    await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 10000 });
    await delay(500);

    // Click the select-all checkbox button
    // It's a button with p-2 class containing a Square/CheckSquare SVG icon
    // Located in the modal content area (not the header X button)
    await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0.z-50');
      if (!modal) return;
      // Get the content area (the scrollable div after the header)
      const contentArea = modal.querySelector('.max-h-\\[80vh\\]') || modal.querySelector('.p-6');
      if (!contentArea) return;
      const buttons = contentArea.querySelectorAll('button');
      for (const btn of buttons) {
        const svg = btn.querySelector('svg');
        const rect = btn.getBoundingClientRect();
        // Select-all is a small icon button (p-2 = ~36px)
        if (svg && rect.width > 0 && rect.width < 60 && rect.height < 60) {
          (btn as HTMLElement).click();
          return;
        }
      }
    });
    await delay(800);

    // Verify selection — wait for "已選擇" text
    await page.waitForFunction(
      () => document.body.innerText.includes('已選擇'),
      { timeout: 5000 }
    );
    console.log('  ✅ All students selected');

    // Click the "刪除" button (red, contains Trash2 icon)
    await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0.z-50');
      if (!modal) return;
      const buttons = modal.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent?.trim() || '';
        if (text.includes('刪除') && !text.includes('確認') && (btn as HTMLElement).offsetParent !== null) {
          (btn as HTMLElement).click();
          return;
        }
      }
    });
    await delay(800);

    // Enter password in the confirmation modal
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await delay(300);
    // Use nativeInputValueSetter to set the password (type() can fail with React controlled inputs)
    await page.evaluate((pwd) => {
      const input = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (input) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 'value'
        )!.set!;
        nativeInputValueSetter.call(input, pwd);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, password);
    await delay(500);

    // Click "確認刪除"
    await clickByText(page, '確認刪除');
    await delay(3000);

    // Wait for empty state
    await page.waitForFunction(
      () => document.body.innerText.includes('立即匯入學生名單'),
      { timeout: 15000 }
    );
    console.log('  ✅ All students deleted');
  } else {
    console.log('  ℹ️  No students to delete (empty account)');
  }

  console.log('✅ Clean complete!\n');
}

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
  await delay(1000);

  // Wait for the modal to appear
  await page.waitForSelector('.fixed.inset-0.z-50', { timeout: 10000 });
  await delay(500);

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

  // Set textarea content using nativeInputValueSetter (replace, not append)
  await page.evaluate(() => {
    const ta = document.querySelector('textarea');
    if (ta) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, 'value'
      )!.set!;
      nativeInputValueSetter.call(ta, '今日作業：國語習作 P.30-31\n明天帶美勞材料\n週五校外教學，記得穿運動服');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await delay(300);

  // Click "儲存" button
  await clickByText(page, '儲存');
  await delay(500);

  console.log('  ✅ Whiteboard content written');
}
