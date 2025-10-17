import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '../mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('MSW Mock API', () => {
  it('returns a customer profile', async () => {
    const res = await fetch('/api/customers/12345/profile');
    expect(res.ok).toBe(true);
    const json = await res.json();
    expect(json.customerId).toBe('12345');
    expect(json).toHaveProperty('totalSpent');
    expect(json).toHaveProperty('currency', 'ZAR');
  });
});