import { http, HttpResponse } from 'msw';
import {
  makeProfile,
  makeSpendingSummary,
  makeSpendingCategories,
  makeSpendingTrends,
  makeTransactions,
  makeGoals,
  makeFilters,
} from './factories';

function getParam(url: URL, name: string, fallback: string): string {
  return url.searchParams.get(name) || fallback;
}

// Handlers implementing spec-accurate mock endpoints. Deterministic seeds handled in factories.
export const handlers = [
  // Health
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),

  // Customer profile
  http.get('/api/customers/:customerId/profile', ({ params }) => {
    const { customerId } = params as { customerId: string };
    return HttpResponse.json(makeProfile(customerId));
  }),

  // Spending summary
  http.get('/api/customers/:customerId/spending/summary', ({ request }) => {
    const url = new URL(request.url);
    const period = getParam(url, 'period', '30d');
    return HttpResponse.json(makeSpendingSummary(period));
  }),

  // Spending by category
  http.get('/api/customers/:customerId/spending/categories', ({ request }) => {
    const url = new URL(request.url);
    const period = getParam(url, 'period', '30d');
    const startDate = url.searchParams.get('startDate') || undefined;
    const endDate = url.searchParams.get('endDate') || undefined;
    return HttpResponse.json(makeSpendingCategories(period, startDate, endDate));
  }),

  // Monthly spending trends
  http.get('/api/customers/:customerId/spending/trends', ({ request }) => {
    const url = new URL(request.url);
    const monthsStr = getParam(url, 'months', '12');
  const months = Math.min(Number.parseInt(monthsStr, 10) || 12, 24);
    return HttpResponse.json(makeSpendingTrends(months));
  }),

  // Transactions list
  http.get('/api/customers/:customerId/transactions', ({ request }) => {
    const url = new URL(request.url);
    const limit = Math.min(Number.parseInt(getParam(url, 'limit', '20'), 10) || 20, 100);
    const offset = Number.parseInt(getParam(url, 'offset', '0'), 10) || 0;
    const category = url.searchParams.get('category') || undefined;
    const sortBy = getParam(url, 'sortBy', 'date_desc');
    const payload = makeTransactions(limit, offset, category);
    const sorted = [...payload.transactions];
    switch (sortBy) {
      case 'date_asc':
        sorted.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case 'amount_desc':
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount_asc':
        sorted.sort((a, b) => a.amount - b.amount);
        break;
      case 'date_desc':
      default:
        sorted.sort((a, b) => b.date.localeCompare(a.date));
        break;
    }
    return HttpResponse.json({ ...payload, transactions: sorted });
  }),

  // Goals
  http.get('/api/customers/:customerId/goals', () => {
    return HttpResponse.json(makeGoals());
  }),

  // Filters
  http.get('/api/customers/:customerId/filters', () => {
    return HttpResponse.json(makeFilters());
  }),
];