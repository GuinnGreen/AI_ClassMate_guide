import type { Page } from 'puppeteer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const VIEWPORT = { width: 1280, height: 800 };

/** Set up a standard viewport */
export async function setupViewport(page: Page) {
  await page.setViewport(VIEWPORT);
}

/** Login to the app */
export async function login(page: Page, email: string, password: string) {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.type('input[type="email"]', email, { delay: 30 });
  await page.type('input[type="password"]', password, { delay: 30 });
  await page.click('button[type="submit"]');
  // Wait for sidebar to appear (means we're logged in)
  await page.waitForFunction(
    () => document.body.innerText.includes('學生名單'),
    { timeout: 15000 }
  );
  await delay(1000);
}

/** Highlight an element with a red border overlay + arrow */
export async function highlight(page: Page, selector: string) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const padding = 6;

    const overlay = document.createElement('div');
    overlay.className = '__capture_highlight__';
    overlay.style.cssText = `
      position: fixed;
      left: ${rect.left - padding}px;
      top: ${rect.top - padding}px;
      width: ${rect.width + padding * 2}px;
      height: ${rect.height + padding * 2}px;
      border: 3px solid #EF4444;
      border-radius: 12px;
      pointer-events: none;
      z-index: 99999;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
    `;

    // Arrow pointing down to the element
    const arrow = document.createElement('div');
    arrow.className = '__capture_highlight__';
    arrow.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4 L16 22 M8 16 L16 24 L24 16" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    arrow.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2 - 16}px;
      top: ${rect.top - padding - 40}px;
      z-index: 99999;
      pointer-events: none;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(arrow);
  }, selector);
}

/** Highlight by text content (finds button/element containing that text) */
export async function highlightByText(page: Page, text: string) {
  await page.evaluate((txt) => {
    const allElements = document.querySelectorAll('button, a, span, div, h1, h2, h3, label');
    let target: Element | null = null;
    for (const el of allElements) {
      if (el.textContent?.includes(txt) && el.getBoundingClientRect().width > 0) {
        target = el;
        break;
      }
    }
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const padding = 6;

    const overlay = document.createElement('div');
    overlay.className = '__capture_highlight__';
    overlay.style.cssText = `
      position: fixed;
      left: ${rect.left - padding}px;
      top: ${rect.top - padding}px;
      width: ${rect.width + padding * 2}px;
      height: ${rect.height + padding * 2}px;
      border: 3px solid #EF4444;
      border-radius: 12px;
      pointer-events: none;
      z-index: 99999;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2);
    `;
    document.body.appendChild(overlay);
  }, text);
}

/** Highlight by title attribute */
export async function highlightByTitle(page: Page, title: string) {
  await highlight(page, `[title="${title}"]`);
}

/** Remove all highlights */
export async function removeHighlight(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('.__capture_highlight__').forEach(el => el.remove());
  });
}

/** Capture a frame (full page screenshot) */
export async function captureFrame(page: Page, outputPath: string) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
  });
  console.log(`  📸 ${path.basename(outputPath)}`);
}

/** Combine PNG frames into animated WebP using img2webp */
export function combineToWebP(frames: string[], output: string, frameDurationMs = 1500) {
  const dir = path.dirname(output);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // Build img2webp command: -loop 0 = infinite loop, -d = duration per frame in ms
  // img2webp -loop 0 -d 1500 frame1.png -d 1500 frame2.png ... -o output.webp
  const args = ['-loop', '0'];
  for (const frame of frames) {
    args.push('-d', String(frameDurationMs), '-lossy', '-q', '75', frame);
  }
  args.push('-o', output);

  try {
    execSync(`img2webp ${args.map(a => `"${a}"`).join(' ')}`, { stdio: 'pipe' });
    console.log(`  ✅ ${path.basename(output)} (${(fs.statSync(output).size / 1024).toFixed(0)}KB)`);
  } catch (err: unknown) {
    const e = err as { stderr?: Buffer };
    console.error(`  ❌ Failed to create ${path.basename(output)}: ${e.stderr?.toString()}`);
  }
}

/** Utility delay */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Wait for text to appear on page */
export async function waitForText(page: Page, text: string, timeout = 10000) {
  await page.waitForFunction(
    (txt: string) => document.body.innerText.includes(txt),
    { timeout },
    text
  );
}

/** Click an element by text content */
export async function clickByText(page: Page, text: string) {
  await page.evaluate((txt) => {
    const allElements = document.querySelectorAll('button, a, [role="button"]');
    for (const el of allElements) {
      if (el.textContent?.includes(txt) && (el as HTMLElement).offsetParent !== null) {
        (el as HTMLElement).click();
        return;
      }
    }
  }, text);
}

/** Click by title attribute */
export async function clickByTitle(page: Page, title: string) {
  await page.click(`[title="${title}"]`);
}

/** Click a specific student in the sidebar by name */
export async function clickStudent(page: Page, name: string) {
  await page.evaluate((n) => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (btn.textContent?.includes(n) && btn.closest('.overflow-y-auto')) {
        btn.click();
        return;
      }
    }
  }, name);
  await delay(500);
}

/** Close any open modal by clicking the X button */
export async function closeModal(page: Page) {
  await page.evaluate(() => {
    // Find the modal overlay
    const overlay = document.querySelector('.fixed.inset-0.z-50');
    if (overlay) {
      // Find the X button inside the modal
      const closeBtn = overlay.querySelector('button');
      if (closeBtn) closeBtn.click();
    }
  });
  await delay(400);
}

/** Logout: clear auth state and navigate back to login page */
export async function logout(page: Page) {
  await page.evaluate(async () => {
    localStorage.clear();
    sessionStorage.clear();
    const dbs = await indexedDB.databases();
    for (const db of dbs) {
      if (db.name) indexedDB.deleteDatabase(db.name);
    }
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await delay(800);
}

/** Navigate back to dashboard (whiteboard) by clicking "主畫面" */
export async function goToDashboard(page: Page) {
  // First close any open modals
  await closeModal(page);

  await page.evaluate(() => {
    const headers = document.querySelectorAll('h1');
    for (const h of headers) {
      if (h.textContent?.includes('主畫面')) {
        (h.closest('[class*="cursor-pointer"]') as HTMLElement)?.click();
        return;
      }
    }
  });
  await delay(800);
}

export interface SceneResult {
  name: string;
  webpPath: string;
}

/** Standard scene capture workflow: capture frames then combine */
export async function captureScene(
  page: Page,
  sceneName: string,
  stepNumber: number,
  captureSteps: (() => Promise<void>)[],
  outputDir: string,
  frameDurationMs = 1500,
): Promise<SceneResult> {
  const framesDir = path.join(outputDir, '__frames__');
  if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir, { recursive: true });

  const framePaths: string[] = [];
  for (let i = 0; i < captureSteps.length; i++) {
    await captureSteps[i]();
    const framePath = path.join(framesDir, `${sceneName}-${stepNumber}-frame${i}.png`);
    await captureFrame(page, framePath);
    framePaths.push(framePath);
  }

  const webpPath = path.join(outputDir, `${sceneName}-${stepNumber}.webp`);
  combineToWebP(framePaths, webpPath, frameDurationMs);

  // Cleanup frame PNGs
  for (const f of framePaths) {
    if (fs.existsSync(f)) fs.unlinkSync(f);
  }

  return { name: `${sceneName}-${stepNumber}`, webpPath };
}
