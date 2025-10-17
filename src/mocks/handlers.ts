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
  const limit = Math.min(Number.parseInt(getParam(url, 'limit', '20'), 10), 100);
  const offset = Number.parseInt(getParam(url, 'offset', '0'), 10) || 0;
    const category = url.searchParams.get('category') || undefined;
    return HttpResponse.json(makeTransactions(limit, offset, category));
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