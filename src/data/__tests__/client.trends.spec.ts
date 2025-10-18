import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../../mocks/server';
import { trends } from '../client';

describe('trends', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  it('returns <= requested months of trend points with shape integrity', async () => {
    const data = await trends('user123', { months: 6 });
    expect(Array.isArray(data.trends)).toBe(true);
    expect(data.trends.length).toBeGreaterThan(0);
    expect(data.trends.length).toBeLessThanOrEqual(6);
    for (const m of data.trends) {
      expect(m.month).toMatch(/^\d{4}-\d{2}$/);
      expect(typeof m.totalSpent).toBe('number');
      expect(typeof m.transactionCount).toBe('number');
      expect(typeof m.averageTransaction).toBe('number');
    }
  });
  it('caps months at handler maximum (requesting 50 => <=24)', async () => {
    const data = await trends('user123', { months: 50 });
    expect(data.trends.length).toBeLessThanOrEqual(24);
  });
});