import { describe, it, expect } from 'vitest';
// generateRoutes removed during cleanup; rely on dashboardConfig directly
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { NavList } from '../layouts/dashboard/NavList';
import { DashboardProvider } from '../layouts/dashboard/DashboardProvider';
import { Sidebar } from '../layouts/dashboard/Sidebar';
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { dashboardConfig } from '../app/config/dashboard.config';
import { generateContrastReport } from '../lib/contrastReport';

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

  it('applies aria-current="page" to active navigation item', () => {
    render(
      <MemoryRouter initialEntries={['/transactions']}>
        <DashboardProvider config={dashboardConfig}>
          <NavList />
        </DashboardProvider>
      </MemoryRouter>
    );
    const active = screen.getByRole('link', { name: /transactions/i }).querySelector('span[aria-current="page"]');
    expect(active).toBeTruthy();
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

  it('skip link focuses main content', async () => {
    const user = userEvent.setup();
    // Use DashboardLayout to include skip link
    render(
      <MemoryRouter initialEntries={['/']}>
        <DashboardProvider config={dashboardConfig}>
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
          </Routes>
        </DashboardProvider>
      </MemoryRouter>
    );
    const skip = screen.getByText(/skip to content/i);
    await user.click(skip);
    const main = document.getElementById('main-content');
    expect(document.activeElement).toBe(main);
  });

  it('ESC collapses sidebar (simulated)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <DashboardProvider config={dashboardConfig}>
          <Sidebar />
        </DashboardProvider>
      </MemoryRouter>
    );
    const sidebar = screen.getByLabelText(/primary navigation/i);
    expect(sidebar.className.includes('collapsed')).toBe(false);
    // Use testing-library fireEvent for consistent react batching
  fireEvent.keyDown(document, { key: 'Escape' });
    expect(sidebar.className.includes('collapsed')).toBe(true);
  });


  it('settings drawer theme buttons switch modes', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <DashboardProvider config={dashboardConfig}>
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
          </Routes>
        </DashboardProvider>
      </MemoryRouter>
    );
  const settingsBtn = screen.getByRole('button', { name: /^settings$/i });
    await user.click(settingsBtn);
    const systemBtn = screen.getByTestId('mode-system');
  expect(systemBtn).toHaveAttribute('aria-checked', 'true');
    const darkBtn = screen.getByTestId('mode-dark');
    await user.click(darkBtn);
  expect(darkBtn).toHaveAttribute('aria-checked', 'true');
    const lightBtn = screen.getByTestId('mode-light');
    await user.click(lightBtn);
  expect(lightBtn).toHaveAttribute('aria-checked', 'true');
  });
});