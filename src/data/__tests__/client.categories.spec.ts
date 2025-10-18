import { beforeAll, afterAll, afterEach, describe, it, expect } from 'vitest';
import { server } from '../../mocks/server';
import { categories } from '../client';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('categories', () => {
  it('totals sum to totalAmount and include color/icon', async () => {
    const res = await categories('user123', { period: '30d' });
    const calc = res.categories.reduce((s, c) => s + c.amount, 0);
    expect(Number(calc.toFixed(2))).toBeCloseTo(res.totalAmount, 2);
    for (const c of res.categories) {
      expect(c.color).toMatch(/^#/);
      expect(c.icon.length).toBeGreaterThan(0);
      expect(c.percentage).toBeGreaterThan(0);
    }
    const percSum = res.categories.reduce((s, c) => s + c.percentage, 0);
    expect(percSum).toBeGreaterThan(99);
    expect(percSum).toBeLessThan(101);
  });
});
