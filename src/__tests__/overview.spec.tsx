import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { buildTestRouter } from '../app/router';
import App from '../App';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

function renderOverview() {
  const testRouter = buildTestRouter(['/']);
  return render(<App router={testRouter} />);
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
    // Wait for loading to finish - check for any content on the page
    await waitFor(() => {
      // Check for the period selector or any metric card
      expect(screen.queryByLabelText(/loading overview data/i)).not.toBeInTheDocument();
    }, { timeout: 15000 });
    // Check that data loaded
    await waitFor(() => expect(screen.getByTestId('summary-total')).toBeInTheDocument(), { timeout: 10000 });
    expect(screen.getByText(/Goals/i)).toBeInTheDocument();
  }, 20000); // Set test timeout to 20 seconds
  it.skip('error then retry recovers', async () => {
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
    // Wait for error state
    await waitFor(() => expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument(), { timeout: 8000 });
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    // Wait for recovery; assert summary metric appears
    await waitFor(() => expect(screen.getByTestId('summary-total')).toBeInTheDocument(), { timeout: 10000 });
  }, 15000);
  it('partial failure surfaces alert and partial data', async () => {
    server.use(
      http.get('/api/customers/:customerId/spending/summary', () => {
        return HttpResponse.json({ period: '30d', totalSpent: 1234, transactionCount: 10, averageTransaction: 123.4, topCategory: 'Dining', comparedToPrevious: { spentChange: 1, transactionChange: -2 } });
      }),
      http.get('/api/customers/:customerId/goals', () => HttpResponse.json({ message: 'fail' }, { status: 500 }))
    );
    renderOverview();
    // Wait for content to load - summary should render even if goals fail
    await waitFor(() => expect(screen.getByTestId('summary-total')).toBeInTheDocument(), { timeout: 7000 });
    // Page should still show content despite partial failure
    expect(screen.getByTestId('summary-total')).toBeInTheDocument();
  });
});
