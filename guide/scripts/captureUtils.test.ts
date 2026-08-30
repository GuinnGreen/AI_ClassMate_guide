import assert from 'node:assert/strict';
import test from 'node:test';
import type { Page } from 'puppeteer';
import { assertSafeCaptureEnvironment, login } from './captureUtils.ts';

type Markers = Record<string, string | undefined>;

async function evaluateWithDocument<TResult>(
  markers: Markers,
  pageFunction: () => TResult | Promise<TResult>,
): Promise<TResult> {
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { documentElement: { dataset: markers } },
  });

  try {
    return await pageFunction();
  } finally {
    if (originalDocument) {
      Object.defineProperty(globalThis, 'document', originalDocument);
    } else {
      delete (globalThis as { document?: unknown }).document;
    }
  }
}

function fakePage(markers: Markers): Page {
  return {
    evaluate: async (pageFunction: () => unknown) => evaluateWithDocument(markers, pageFunction),
  } as unknown as Page;
}

async function expectCaptureRefusal(
  markers: Markers,
  expectedMessage: string,
) {
  await assert.rejects(
    assertSafeCaptureEnvironment(fakePage(markers)),
    (error: unknown) => {
      assert.equal(error instanceof Error, true);
      assert.equal((error as Error).message, expectedMessage);
      return true;
    },
  );
}

function fakeLoginPage(markers: Markers) {
  const calls: string[] = [];
  const page = {
    goto: async () => { calls.push('goto'); },
    evaluate: async (pageFunction: () => unknown) => {
      calls.push('evaluate');
      return evaluateWithDocument(markers, pageFunction);
    },
    waitForSelector: async () => { calls.push('waitForSelector'); },
    type: async () => { calls.push('type'); },
    click: async () => { calls.push('click'); },
    waitForFunction: async () => { calls.push('waitForFunction'); },
  } as unknown as Page;

  return { calls, page };
}

test('allows capture only for development with Firebase emulators explicitly enabled', async () => {
  await assertSafeCaptureEnvironment(fakePage({
    appEnvironment: 'development',
    firebaseEmulators: 'true',
  }));
});

test('refuses capture in production even when the emulator marker is true', async () => {
  await expectCaptureRefusal(
    { appEnvironment: 'production', firebaseEmulators: 'true' },
    'Capture refused: expected development + Firebase emulators, received {"appEnvironment":"production","firebaseEmulators":"true"}',
  );
});

test('refuses capture when the emulator marker is not literally true', async () => {
  await expectCaptureRefusal(
    { appEnvironment: 'development', firebaseEmulators: 'false' },
    'Capture refused: expected development + Firebase emulators, received {"appEnvironment":"development","firebaseEmulators":"false"}',
  );
});

test('refuses capture when environment markers are missing', async () => {
  await expectCaptureRefusal(
    {},
    'Capture refused: expected development + Firebase emulators, received {}',
  );
});

test('login rejects production before selectors, credentials, or other post-navigation work', async () => {
  const { calls, page } = fakeLoginPage({
    appEnvironment: 'production',
    firebaseEmulators: 'true',
  });

  await assert.rejects(
    login(page, 'placeholder@example.invalid', 'placeholder-password'),
    { message: 'Capture refused: expected development + Firebase emulators, received {"appEnvironment":"production","firebaseEmulators":"true"}' },
  );
  assert.deepEqual(calls, ['goto', 'evaluate']);
});

test('login rejects missing markers before selectors, credentials, or other post-navigation work', async () => {
  const { calls, page } = fakeLoginPage({});

  await assert.rejects(
    login(page, 'placeholder@example.invalid', 'placeholder-password'),
    { message: 'Capture refused: expected development + Firebase emulators, received {}' },
  );
  assert.deepEqual(calls, ['goto', 'evaluate']);
});
