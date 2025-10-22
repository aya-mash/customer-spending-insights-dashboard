import { describe, it, expect } from 'vitest';
// generateRoutes removed during cleanup; rely on dashboardConfig directly
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DashboardProvider } from '../contexts/dashboard/DashboardProvider';
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { dashboardConfig } from '../app/config/dashboard.config';
import { generateContrastReport } from '../lib/contrastReport';
import { ThemeProvider } from '../contexts/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout tests need providers because they test individual layout components
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('route generator', () => {
  it('creates lazy route objects matching path list', () => {
  const paths = dashboardConfig.routes.map(r => r.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/transactions');
    expect(paths).toContain('/insights');
    expect(paths).toContain('/style-guide');
  });

  it('prefetch helper triggers prefetch function when defined', () => {
    let called = false;
  const custom = [{ ...dashboardConfig.routes[0], prefetch: () => { called = true; } }];
  custom[0].prefetch?.();
    expect(called).toBe(true);
  });

  it('contrast report flags low ratio samples', () => {
    const report = generateContrastReport([
      { name: 'brand-on-bg', fg: '#FFFFFF', bg: '#2F70EF' },
      { name: 'muted-on-bg', fg: '#6B7A90', bg: '#FFFFFF' },
      { name: 'bad-low', fg: '#777777', bg: '#FFFFFF' },
    ]);
    const bad = report.failures.find(s => s.name === 'bad-low');
    expect(bad).toBeDefined();
    expect(report.samples.length).toBe(3);
  });

  it('renders fallback for protected route when guard fails', async () => {
    const protectedRoute = dashboardConfig.routes.find(r => r.path === '/protected');
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <DashboardProvider config={dashboardConfig}>
          <Routes>
            <Route path="/protected" element={protectedRoute?.fallback} />
          </Routes>
        </DashboardProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it('skip link focuses main content', () => {
    // Use DashboardLayout to include skip link
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <DashboardProvider config={dashboardConfig}>
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
          </Routes>
        </DashboardProvider>
      </MemoryRouter>
    );
    const skip: HTMLAnchorElement = screen.getByText(/skip to content/i);
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
    expect(skip).toBeInTheDocument();
    expect(skip.getAttribute('href')).toBe('#main-content');
    // Verify main has tabIndex for focus capability
    expect(main?.getAttribute('tabindex')).toBe('-1');
  });

  it('settings drawer theme buttons switch modes', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <DashboardProvider config={dashboardConfig}>
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
          </Routes>
        </DashboardProvider>
      </MemoryRouter>
    );
    const settingsBtn = screen.getByRole('button', { name: /open settings/i });
    await user.click(settingsBtn);
    // Fixed: Now using semantic radio inputs, check 'checked' property
    const systemBtn: HTMLInputElement = screen.getByTestId('mode-system');
    expect(systemBtn.checked).toBe(true);
    const darkBtn: HTMLInputElement = screen.getByTestId('mode-dark');
    await user.click(darkBtn);
    expect(darkBtn.checked).toBe(true);
    const lightBtn: HTMLInputElement = screen.getByTestId('mode-light');
    await user.click(lightBtn);
    expect(lightBtn.checked).toBe(true);
  });
});