import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import dashboardConfig from '../app/config/dashboard.config';
import { TransactionsRoute } from '../app/routes/TransactionsRoute';
import * as client from '../data/client';
import type { FiltersResponse, TransactionsPage } from '../data/models';

const mockFilters: FiltersResponse = {
  categories: [
    { name: 'Food', color: '#ff9900', icon: 'Utensils' },
    { name: 'Travel', color: '#3366ff', icon: 'Plane' },
  ],
  dateRangePresets: [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
  ]
};

function makePage(total = 40, offset = 0, limit = 20): TransactionsPage {
  return {
    transactions: Array.from({ length: Math.min(limit, total - offset) }).map((_, i) => ({
      id: 't' + (offset + i),
      date: new Date(2025, 8, 1 + i).toISOString(),
      merchant: 'Shop ' + i,
      category: i % 2 ? 'Travel' : 'Food',
      amount: i % 3 ? 123.45 : -50.5,
      description: 'Desc',
      paymentMethod: 'Card',
      icon: 'Circle',
      categoryColor: '#000'
    })),
    pagination: { total, limit, offset, hasMore: offset + limit < total }
  };
}

describe('TransactionsRoute', () => {
  it('syncs category chip to URL and back', async () => {
    vi.spyOn(client, 'filters').mockResolvedValue(mockFilters);
    vi.spyOn(client, 'transactions').mockResolvedValue(makePage());
    render(
      <MemoryRouter initialEntries={['/transactions']}>\n        <DashboardProvider config={dashboardConfig}>\n          <TransactionsRoute />\n        </DashboardProvider>\n      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByRole('table', { name: /Transactions table/i })).toBeInTheDocument());
    const foodChip = screen.getByRole('button', { name: 'Food' });
    fireEvent.click(foodChip);
    await waitFor(() => expect(foodChip).toHaveAttribute('aria-pressed', 'true'));
  });

  it('toggles date sort aria-sort states', async () => {
    vi.spyOn(client, 'filters').mockResolvedValue(mockFilters);
    vi.spyOn(client, 'transactions').mockResolvedValue(makePage());
    render(
      <MemoryRouter initialEntries={['/transactions']}>\n        <DashboardProvider config={dashboardConfig}>\n          <TransactionsRoute />\n        </DashboardProvider>\n      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    const dateHeader = screen.getByRole('button', { name: 'Date' });
    expect(dateHeader).toHaveAttribute('aria-sort', 'descending');
    fireEvent.click(dateHeader);
    await waitFor(() => expect(dateHeader).toHaveAttribute('aria-sort', 'ascending'));
  });

  it('paging disables next at end', async () => {
    vi.spyOn(client, 'filters').mockResolvedValue(mockFilters);
    vi.spyOn(client, 'transactions').mockResolvedValue(makePage(40, 0, 20));
    render(
      <MemoryRouter initialEntries={['/transactions']}>\n        <DashboardProvider config={dashboardConfig}>\n          <TransactionsRoute />\n        </DashboardProvider>\n      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument());
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    // mock second page
    (client.transactions as unknown as () => Promise<unknown>) = () => Promise.resolve(makePage(40, 20, 20));
    await waitFor(() => expect(nextBtn).toBeEnabled());
  });

  it('error then retry restores list', async () => {
    const filtersSpy = vi.spyOn(client, 'filters').mockRejectedValueOnce(new Error('fail filters')).mockResolvedValue(mockFilters);
    const txSpy = vi.spyOn(client, 'transactions').mockRejectedValueOnce(new Error('fail tx')).mockResolvedValue(makePage());
    render(
      <MemoryRouter initialEntries={['/transactions']}>\n        <DashboardProvider config={dashboardConfig}>\n          <TransactionsRoute />\n        </DashboardProvider>\n      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Retry/i }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    expect(filtersSpy).toHaveBeenCalledTimes(2);
    expect(txSpy).toHaveBeenCalledTimes(2);
  });
});
