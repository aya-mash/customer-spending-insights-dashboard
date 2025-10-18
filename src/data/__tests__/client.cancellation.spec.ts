import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../../mocks/server';
import { spendingSummary } from '../client';

describe('cancellation', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

  it('aborts an in-flight request and surfaces an error', async () => {
    const controller = new AbortController();
    const p = spendingSummary('user123', '7d', controller.signal);
    controller.abort();
    let err: unknown;
    try {
      await p;
    } catch (e) {
      err = e;
    }
    expect(err).toBeTruthy();
    // Axios throws a generic error message; normalized error may not carry status.
    if (err instanceof Error) {
      expect(err.message).toMatch(/aborted|canceled|Network Error/i);
    }
  });
});