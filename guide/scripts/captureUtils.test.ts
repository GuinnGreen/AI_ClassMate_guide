import assert from 'node:assert/strict';
import test from 'node:test';
import type { Page } from 'puppeteer';
import { assertSafeCaptureEnvironment } from './captureUtils.ts';

function fakePage(markers: Record<string, string | undefined>): Page {
  return {
    evaluate: async () => ({
      appEnvironment: markers.appEnvironment,
      firebaseEmulators: markers.firebaseEmulators,
    }),
  } as unknown as Page;
}

async function expectCaptureRefusal(
  markers: Record<string, string | undefined>,
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
