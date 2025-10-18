import { beforeAll, afterAll, afterEach, describe, it, expect } from 'vitest';
import { server } from '../../mocks/server';
import { spendingSummary } from '../client';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('spendingSummary', () => {
  it('echoes requested period and matches shape', async () => {
    const res = await spendingSummary('user123', '7d');
    expect(res.period).toBe('7d');
    expect(typeof res.totalSpent).toBe('number');
    expect(typeof res.transactionCount).toBe('number');
    expect(typeof res.averageTransaction).toBe('number');
    expect(res.averageTransaction).toBeCloseTo(res.totalSpent / res.transactionCount, 1);
    expect(res.comparedToPrevious).toHaveProperty('spentChange');
  });
});
