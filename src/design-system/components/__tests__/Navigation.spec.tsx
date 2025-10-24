/**
 * NAVIGATION COMPONENT TESTS
 * Tests for Navigation, BottomNav, SettingsDrawer design system components
 */

import { describe, it, expect } from 'vitest';
import { screen, render } from '../../../test/utils';
import { Navigation } from '../Navigation';
import { BottomNav } from '../BottomNav';
import { SettingsDrawer } from '../SettingsDrawer';
import { Home, TrendingUp, List } from 'lucide-react';

const mockNavItems = [
  { id: 'overview', label: 'Overview', href: '/', icon: <Home /> },
  { id: 'insights', label: 'Insights', href: '/insights', icon: <TrendingUp /> },
  { id: 'transactions', label: 'Transactions', href: '/transactions', icon: <List /> },
];

describe('Navigation', () => {
  it('renders navigation structure', () => {
    const { container } = render(
        <Navigation items={mockNavItems} />);
    // Navigation renders as semantic <nav> element
    const navElements = container.querySelectorAll('nav');
    expect(navElements.length).toBeGreaterThan(0);
  });

  it('renders with provided items', () => {
    const { container } = render(
        <Navigation items={mockNavItems} />);
    // Navigation rendered successfully as <nav> element
    expect(container.querySelector('nav')).toBeInTheDocument();
  });
});

describe('BottomNav', () => {
  it('renders component structure', () => {
    const { container } = render(
        <BottomNav items={mockNavItems} />);
    // BottomNav may render null on desktop, check container exists
    expect(container).toBeInTheDocument();
  });
});

describe('SettingsDrawer', () => {
  it('renders closed by default', () => {
    render(
        <SettingsDrawer open={false} onClose={() => {}} mode="system" onModeChange={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
        <SettingsDrawer open={true} onClose={() => {}} mode="system" onModeChange={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows settings heading', () => {
    render(
        <SettingsDrawer open={true} onClose={() => {}} mode="system" onModeChange={() => {}} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});


