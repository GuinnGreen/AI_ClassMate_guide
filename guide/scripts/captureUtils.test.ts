import assert from 'node:assert/strict';
import test from 'node:test';
import type { Page } from 'puppeteer';
import {
  AUTH_EMULATOR_URL,
  assertSafeCaptureEnvironment,
  login,
  provisionDemoAuthEmulatorAccount,
} from './captureUtils.ts';

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
    type: async (selector: string) => { calls.push(`type:${selector}`); },
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
  let provisionRequests = 0;

  await assert.rejects(
    login(page, 'placeholder@example.invalid', 'placeholder-password', {
      fetchImpl: async () => {
        provisionRequests++;
        return { ok: true, status: 200, json: async () => ({}) };
      },
    }),
    { message: 'Capture refused: expected development + Firebase emulators, received {"appEnvironment":"production","firebaseEmulators":"true"}' },
  );
  assert.deepEqual(calls, ['goto', 'evaluate']);
  assert.equal(provisionRequests, 0);
});

test('login rejects missing markers before selectors, credentials, or other post-navigation work', async () => {
  const { calls, page } = fakeLoginPage({});
  let provisionRequests = 0;

  await assert.rejects(
    login(page, 'placeholder@example.invalid', 'placeholder-password', {
      fetchImpl: async () => {
        provisionRequests++;
        return { ok: true, status: 200, json: async () => ({}) };
      },
    }),
    { message: 'Capture refused: expected development + Firebase emulators, received {}' },
  );
  assert.deepEqual(calls, ['goto', 'evaluate']);
  assert.equal(provisionRequests, 0);
});

test('safe login provisions the Auth Emulator account before typing credentials', async () => {
  const { calls, page } = fakeLoginPage({
    appEnvironment: 'development',
    firebaseEmulators: 'true',
  });
  const fetchImpl = async (url: string, init?: RequestInit) => {
    calls.push('provision');
    assert.equal(url, `${AUTH_EMULATOR_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-classmate-ai`);
    assert.equal(init?.method, 'POST');
    assert.equal(init?.redirect, 'error');
    assert.deepEqual(JSON.parse(String(init?.body)), {
      email: 'test_demo@school.com',
      password: '123456',
      returnSecureToken: false,
    });
    return {
      ok: true,
      status: 200,
      json: async () => ({ localId: 'demo-user' }),
    };
  };

  await login(page, 'test_demo@school.com', '123456', {
    fetchImpl,
    postLoginDelayMs: 0,
  });

  assert.deepEqual(calls.slice(0, 6), [
    'goto',
    'evaluate',
    'provision',
    'waitForSelector',
    'type:input[type="email"]',
    'type:input[type="password"]',
  ]);
});

test('Auth Emulator provisioning tolerates an existing demo account', async () => {
  let requestCount = 0;
  await provisionDemoAuthEmulatorAccount('test_demo@school.com', '123456', {
    fetchImpl: async () => {
      requestCount++;
      return {
        ok: false,
        status: 400,
        json: async () => ({ error: { message: 'EMAIL_EXISTS' } }),
      };
    },
  });
  assert.equal(requestCount, 1);
});

test('Auth provisioning refuses a remote endpoint before fetch', async () => {
  let requestCount = 0;
  await assert.rejects(
    provisionDemoAuthEmulatorAccount('test_demo@school.com', '123456', {
      authEmulatorUrl: 'https://identitytoolkit.googleapis.com',
      fetchImpl: async () => {
        requestCount++;
        return { ok: true, status: 200, json: async () => ({}) };
      },
    }),
    /Auth provisioning refused/,
  );
  assert.equal(requestCount, 0);
});
