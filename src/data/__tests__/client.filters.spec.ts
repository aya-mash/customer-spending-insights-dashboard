import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../../mocks/server';
import { filters } from '../client';

describe('filters', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());
  it('returns categories and date range presets with valid unions', async () => {
    const data = await filters('user123');
    expect(Array.isArray(data.categories)).toBe(true);
    expect(Array.isArray(data.dateRangePresets)).toBe(true);
    for (const c of data.categories) {
      expect(typeof c.name).toBe('string');
      expect(typeof c.color).toBe('string');
      expect(typeof c.icon).toBe('string');
    }
    const allowedPeriods = new Set(['7d','30d','90d','1y']);
    for (const p of data.dateRangePresets) {
      expect(typeof p.label).toBe('string');
      expect(allowedPeriods.has(p.value)).toBe(true);
    }
  });
});