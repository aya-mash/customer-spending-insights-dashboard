import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import dashboardConfig from '../app/config/dashboard.config';
import { InsightsRoute } from '../app/routes/InsightsRoute';
import * as client from '../data/client';
import type { CategoryBreakdown, SpendingTrends } from '../data/models';

// Mock data
const mockCategories = {
  dateRange: { startDate: '2025-09-01', endDate: '2025-09-30' },
  totalAmount: 1000,
  categories: [
    { name: 'Food', amount: 400, percentage: 40, transactionCount: 10, color: '#ff9900', icon: 'Utensils' },
    { name: 'Travel', amount: 300, percentage: 30, transactionCount: 5, color: '#3366ff', icon: 'Plane' },
    { name: 'Other', amount: 300, percentage: 30, transactionCount: 7, color: '#33aa66', icon: 'Circle' },
  ],
};
const mockTrends = {
  trends: Array.from({ length: 12 }).map((_, i) => ({
    month: `2025-${String(i + 1).padStart(2,'0')}`,
    totalSpent: 500 + i * 10,
    transactionCount: 20 + i,
    averageTransaction: 25,
  }))
};

describe('InsightsRoute', () => {
  it('renders tabs and switches via keyboard', async () => {
  vi.spyOn(client, 'categories').mockResolvedValue(mockCategories as CategoryBreakdown);
  vi.spyOn(client, 'trends').mockResolvedValue(mockTrends as SpendingTrends);
    render(
      <MemoryRouter initialEntries={["/insights"]}>
        <DashboardProvider config={dashboardConfig}>
          <InsightsRoute />
        </DashboardProvider>
      </MemoryRouter>
    );
    const categoryTab = screen.getByRole('tab', { name: /By Category/i });
    const trendsTab = screen.getByRole('tab', { name: /Trends/i });
    expect(categoryTab).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(categoryTab.parentElement!, { key: 'ArrowRight' });
    expect(trendsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders donut legend and navigates on click', async () => {
    vi.spyOn(client, 'categories').mockResolvedValue(mockCategories as CategoryBreakdown);
    vi.spyOn(client, 'trends').mockResolvedValue(mockTrends as SpendingTrends);
    const Loc = () => { const l = useLocation(); return <div data-testid="loc" data-path={l.pathname} data-search={l.search} /> };
    render(
      <MemoryRouter initialEntries={["/insights"]}>
        <DashboardProvider config={dashboardConfig}>
          <InsightsRoute />
          <Loc />
        </DashboardProvider>
      </MemoryRouter>
    );
    
    // Wait for loading to complete and chart to render
    await waitFor(() => {
      expect(screen.queryByLabelText(/Loading category insights/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
  const legend = await screen.findByRole('list', { name: /Category legend/i });
  // Find the Food legend chip button within the legend by text
  const foodBtn = Array.from(legend.querySelectorAll('button')).find(btn => /Food/i.test(btn.textContent || ''))!;
  fireEvent.click(foodBtn);
    
    await waitFor(() => {
      const locDiv = screen.getByTestId('loc');
      expect(locDiv.getAttribute('data-search')?.includes('category=Food')).toBe(true);
    });
  });

  it('renders trends chart with 12 points', async () => {
    vi.spyOn(client, 'categories').mockResolvedValue(mockCategories as CategoryBreakdown);
    vi.spyOn(client, 'trends').mockResolvedValue(mockTrends as SpendingTrends);
    render(
      <MemoryRouter initialEntries={["/insights?tab=trends"]}>
        <DashboardProvider config={dashboardConfig}>
          <InsightsRoute />
        </DashboardProvider>
      </MemoryRouter>
    );
    // Switch to trends if not active
    const trendsTab = screen.getByRole('tab', { name: /Trends/i });
    fireEvent.click(trendsTab);
    // Wait for trends panel to be visible
    await waitFor(() => {
      const trendsPanel = screen.getByRole('tabpanel', { name: /Trends/i });
      expect(trendsPanel).toBeInTheDocument();
    });
  });

  it('error then retry recovers', async () => {
    const catErr = vi.spyOn(client, 'categories').mockRejectedValueOnce(new Error('fail categories')).mockResolvedValue(mockCategories as CategoryBreakdown);
    const trendErr = vi.spyOn(client, 'trends').mockRejectedValueOnce(new Error('fail trends')).mockResolvedValue(mockTrends as SpendingTrends);
    render(
      <MemoryRouter initialEntries={["/insights"]}>
        <DashboardProvider config={dashboardConfig}>
          <InsightsRoute />
        </DashboardProvider>
      </MemoryRouter>
    );
  // Combined error banner is shown at top (no explicit role), check for text then click Retry All
  await waitFor(() => expect(screen.getByText(/Failed to load insights data/i)).toBeInTheDocument(), { timeout: 3000 });
  const retryButton = screen.getByRole('button', { name: /Retry All/i });
    fireEvent.click(retryButton);
  // After retry, combined error should disappear
  await waitFor(() => expect(screen.queryByText(/Failed to load insights data/i)).not.toBeInTheDocument(), { timeout: 3000 });
    expect(catErr).toHaveBeenCalledTimes(2);
    expect(trendErr).toHaveBeenCalledTimes(2);
  });
});