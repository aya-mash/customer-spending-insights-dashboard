import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import Overview from '../pages/Overview';

function renderOverview() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/"]}>
        <Overview />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Overview route', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
  beforeEach(() => {
    // default success handlers for summary + goals (override in specific tests as needed)
    server.use(
      http.get('/api/customers/:customerId/spending/summary', () => {
        return HttpResponse.json({ period: '30d', totalSpent: 4321.5, transactionCount: 55, averageTransaction: 78.57, topCategory: 'Groceries', comparedToPrevious: { spentChange: 3.2, transactionChange: -1.1 } });
      }),
      http.get('/api/customers/:customerId/goals', () => {
        return HttpResponse.json({ goals: [ { id: 'g1', category: 'Groceries', monthlyBudget: 1000, currentSpent: 420, percentageUsed: 42, daysRemaining: 12, status: 'on_track' }, { id: 'g2', category: 'Dining', monthlyBudget: 800, currentSpent: 710, percentageUsed: 88.75, daysRemaining: 9, status: 'warning' } ] });
      })
    );
  });
  it('loads and renders summary total and goals', async () => {
    renderOverview();
    expect(screen.getByLabelText(/loading overview data/i)).toBeTruthy();
    await waitFor(() => expect(screen.getByTestId('summary-total')).toBeInTheDocument());
    expect(screen.getByText(/Goals/i)).toBeInTheDocument();
  });
  it('error then retry recovers', async () => {
    let failedOnce = false;
    server.use(
      http.get('/api/customers/:customerId/spending/summary', () => {
        if (!failedOnce) { failedOnce = true; return HttpResponse.json({ message: 'fail' }, { status: 500 }); }
        return HttpResponse.json({ period: '30d', totalSpent: 4000, transactionCount: 40, averageTransaction: 100, topCategory: 'Groceries', comparedToPrevious: { spentChange: 5, transactionChange: 2 } });
      }),
      http.get('/api/customers/:customerId/goals', () => {
        if (!failedOnce) return HttpResponse.json({ message: 'fail' }, { status: 500 });
        return HttpResponse.json({ goals: [ { id: 'g1', category: 'Groceries', monthlyBudget: 1000, currentSpent: 500, percentageUsed: 50, daysRemaining: 10, status: 'on_track' }, { id: 'g2', category: 'Dining', monthlyBudget: 800, currentSpent: 700, percentageUsed: 87.5, daysRemaining: 12, status: 'warning' } ] });
      })
    );
    renderOverview();
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    await waitFor(() => expect(screen.getByTestId('summary-total')).toBeTruthy());
    expect(screen.getByText(/Groceries/i)).toBeTruthy();
  });
  it('partial failure surfaces alert and partial data', async () => {
    server.use(
      http.get('/api/customers/:customerId/spending/summary', () => {
        return HttpResponse.json({ period: '30d', totalSpent: 1234, transactionCount: 10, averageTransaction: 123.4, topCategory: 'Dining', comparedToPrevious: { spentChange: 1, transactionChange: -2 } });
      }),
      http.get('/api/customers/:customerId/goals', () => HttpResponse.json({ message: 'fail' }, { status: 500 }))
    );
    renderOverview();
    // Wait for alert (goals failed) while summary data becomes visible
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy());
    // Summary should have rendered (placeholder replaced)
    await waitFor(() => expect(screen.getByTestId('summary-total')).toBeInTheDocument());
  });
});
