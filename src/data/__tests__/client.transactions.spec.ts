import { beforeAll, afterAll, afterEach, describe, it, expect } from 'vitest';
import { server } from '../../mocks/server';
import { transactions } from '../client';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('transactions', () => {
  it('respects limit and offset', async () => {
    const page = await transactions('user123', { limit: 5, offset: 0 });
    expect(page.transactions).toHaveLength(5);
    expect(page.pagination.limit).toBe(5);
  });
  it('sorts by amount descending', async () => {
    const page = await transactions('user123', { limit: 10, sortBy: 'amount_desc' });
    const amounts = page.transactions.map(t => t.amount);
    const sorted = [...amounts].sort((a, b) => b - a);
    expect(amounts).toEqual(sorted);
  });
  it('sorts by date ascending', async () => {
    const page = await transactions('user123', { limit: 10, sortBy: 'date_asc' });
    const dates = page.transactions.map(t => t.date);
    const sorted = [...dates].sort((a, b) => a.localeCompare(b));
    expect(dates).toEqual(sorted);
  });
});
