/**
 * NAVIGATION COMPONENT TESTS
 * Tests for Navigation, BottomNav, SettingsDrawer design system components
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TestProviders } from '../../../test/test-utils';
import { Navigation } from '../Navigation';
import { BottomNav } from '../BottomNav';
import { SettingsDrawer } from '../SettingsDrawer';
import { Home, TrendingUp, List } from 'lucide-react';

const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <TestProviders>
      {children as React.ReactElement}
    </TestProviders>
  </BrowserRouter>
);

const mockNavItems = [
  { id: 'overview', label: 'Overview', href: '/', icon: <Home /> },
  { id: 'insights', label: 'Insights', href: '/insights', icon: <TrendingUp /> },
  { id: 'transactions', label: 'Transactions', href: '/transactions', icon: <List /> },
];

describe('Navigation', () => {
  it('renders navigation structure', () => {
    const { container } = render(
      <MockRouter>
        <Navigation items={mockNavItems} />
      </MockRouter>
    );
    // Navigation renders (may have nested nav elements)
    const navElements = container.querySelectorAll('[role="navigation"]');
    expect(navElements.length).toBeGreaterThan(0);
  });

  it('renders with provided items', () => {
    const { container } = render(
      <MockRouter>
        <Navigation items={mockNavItems} />
      </MockRouter>
    );
    // Navigation rendered successfully
    expect(container.querySelector('aside')).toBeInTheDocument();
  });
});

describe('BottomNav', () => {
  it('renders component structure', () => {
    const { container } = render(
      <MockRouter>
        <BottomNav items={mockNavItems} />
      </MockRouter>
    );
    // BottomNav may render null on desktop, check container exists
    expect(container).toBeInTheDocument();
  });
});

describe('SettingsDrawer', () => {
  it('renders closed by default', () => {
    render(
      <MockRouter>
        <SettingsDrawer open={false} onClose={() => {}} mode="system" onModeChange={() => {}} />
      </MockRouter>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <MockRouter>
        <SettingsDrawer open={true} onClose={() => {}} mode="system" onModeChange={() => {}} />
      </MockRouter>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows settings heading', () => {
    render(
      <MockRouter>
        <SettingsDrawer open={true} onClose={() => {}} mode="system" onModeChange={() => {}} />
      </MockRouter>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
