import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../../mocks/server';
import { goals } from '../client';

describe('goals', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  it('returns goal items with percentage consistency', async () => {
    const data = await goals('user123');
    expect(Array.isArray(data.goals)).toBe(true);
    for (const g of data.goals) {
      expect(typeof g.id).toBe('string');
      expect(typeof g.category).toBe('string');
      expect(typeof g.monthlyBudget).toBe('number');
      expect(typeof g.currentSpent).toBe('number');
      expect(typeof g.percentageUsed).toBe('number');
      // percentageUsed should roughly equal currentSpent/monthlyBudget*100 (allow rounding tolerance)
      const expectedPct = (g.currentSpent / g.monthlyBudget) * 100;
      expect(Math.abs(expectedPct - g.percentageUsed)).toBeLessThanOrEqual(1);
      expect(['on_track', 'warning', 'over']).toContain(g.status);
      expect(g.daysRemaining).toBeGreaterThanOrEqual(0);
    }
  });
});