export interface CaptureProcessState {
  exitCode?: string | number | null;
}

export async function runCaptureCli(
  capture: () => Promise<void>,
  processState: CaptureProcessState = process,
): Promise<void> {
  try {
    await capture();
  } catch (error) {
    processState.exitCode = 1;
    throw error;
  }
}
