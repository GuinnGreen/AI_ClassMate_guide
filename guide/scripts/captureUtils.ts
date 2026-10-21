import type { Page } from 'puppeteer';
import { execFileSync } from 'child_process';
import { randomUUID } from 'node:crypto';
import fs from 'fs';
import path from 'path';

const VIEWPORT = { width: 1280, height: 800 };
export const AUTH_EMULATOR_URL = 'http://127.0.0.1:9099';

interface AuthFetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

type AuthFetch = (url: string, init?: RequestInit) => Promise<AuthFetchResponse>;

interface AuthProvisionOptions {
  authEmulatorUrl?: string;
  fetchImpl?: AuthFetch;
}

interface LoginOptions extends AuthProvisionOptions {
  postLoginDelayMs?: number;
}

/** Set up a standard viewport */
export async function setupViewport(page: Page) {
  await page.setViewport(VIEWPORT);
}

export async function assertSafeCaptureEnvironment(page: Page) {
  const environment = await page.evaluate(() => ({
    appEnvironment: document.documentElement.dataset.appEnvironment,
    firebaseEmulators: document.documentElement.dataset.firebaseEmulators,
  }));

  if (environment.appEnvironment !== 'development' || environment.firebaseEmulators !== 'true') {
    throw new Error(
      `Capture refused: expected development + Firebase emulators, received ${JSON.stringify(environment)}`,
    );
  }
}

export async function provisionDemoAuthEmulatorAccount(
  email: string,
  password: string,
  options: AuthProvisionOptions = {},
) {
  const authEmulatorUrl = (options.authEmulatorUrl ?? AUTH_EMULATOR_URL).replace(/\/$/, '');
  if (authEmulatorUrl !== AUTH_EMULATOR_URL) {
    throw new Error(`Auth provisioning refused: expected ${AUTH_EMULATOR_URL}, received ${authEmulatorUrl}`);
  }

  const fetchImpl = options.fetchImpl ?? (globalThis.fetch as unknown as AuthFetch);
  const response = await fetchImpl(
    `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-classmate-ai`,
    {
      method: 'POST',
      redirect: 'error',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    },
  );
  if (response.ok) return;

  const body = await response.json().catch(() => ({})) as {
    error?: { message?: string };
  };
  if (body.error?.message?.startsWith('EMAIL_EXISTS')) return;
  throw new Error(
    `Auth Emulator account provisioning failed (${response.status}): ${body.error?.message ?? 'unknown error'}`,
  );
}

/** Login to the app */
export async function login(
  page: Page,
  email: string,
  password: string,
  options: LoginOptions = {},
) {
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await assertSafeCaptureEnvironment(page);
  await provisionDemoAuthEmulatorAccount(email, password, options);
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.type('input[type="email"]', email, { delay: 30 });
  await page.type('input[type="password"]', password, { delay: 30 });
  await page.click('button[type="submit"]');
  // Wait for sidebar to appear (means we're logged in)
  await page.waitForFunction(
    () => document.body.innerText.includes('學生名單'),
    { timeout: 15000 }
  );
  await delay(options.postLoginDelayMs ?? 1000);
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
  const temporaryOutput = `${output}.${randomUUID()}.tmp`;

  // Build img2webp command: -loop 0 = infinite loop, -d = duration per frame in ms
  // img2webp -loop 0 -d 1500 frame1.png -d 1500 frame2.png ... -o output.webp
  const args = ['-loop', '0'];
  for (const frame of frames) {
    args.push('-d', String(frameDurationMs), '-lossy', '-q', '75', frame);
  }
  args.push('-o', temporaryOutput);

  try {
    execFileSync('img2webp', args, { stdio: 'pipe' });
    if (!fs.existsSync(temporaryOutput)) throw new Error('missing WebP artifact');
    const outputSize = fs.statSync(temporaryOutput).size;
    if (outputSize <= 0) throw new Error('empty WebP artifact');
    fs.renameSync(temporaryOutput, output);
    console.log(`  ✅ ${path.basename(output)} (${(outputSize / 1024).toFixed(0)}KB)`);
  } catch (err: unknown) {
    if (fs.existsSync(temporaryOutput)) fs.unlinkSync(temporaryOutput);
    const e = err as { stderr?: Buffer; message?: string };
    const detail = e.stderr?.toString().trim() || e.message;
    throw new Error(
      `Failed to create ${path.basename(output)}${detail ? `: ${detail}` : ''}`,
      { cause: err },
    );
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
