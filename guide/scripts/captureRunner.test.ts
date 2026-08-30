import assert from 'node:assert/strict';
import test from 'node:test';
import { runCaptureCli } from './captureRunner.ts';

test('capture runner preserves failure and marks the CLI exit as nonzero', async () => {
  const processState: { exitCode?: number } = {};

  await assert.rejects(
    runCaptureCli(async () => {
      throw new Error('synthetic capture failure');
    }, processState),
    /synthetic capture failure/,
  );
  assert.equal(processState.exitCode, 1);
});
