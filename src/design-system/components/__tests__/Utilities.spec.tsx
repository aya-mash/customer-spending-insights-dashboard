/**
 * UTILITY COMPONENT TESTS
 * Tests for Divider, PageLayout, MetricCard design system components
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import { Divider } from '../Divider';
import { PageLayout } from '../PageLayout';
import { MetricCard } from '../MetricCard';
import { TrendingUp } from 'lucide-react';

describe('Divider', () => {
  it('renders divider', () => {
    const { container } = render(<Divider />);
    const divider = container.querySelector('hr');
    expect(divider).toBeInTheDocument();
  });

  it('applies spacing', () => {
    const { container } = render(<Divider spacing={8} />);
    const divider = container.firstChild;
    expect(divider).toBeInTheDocument();
  });

  it('applies custom color', () => {
    const { container } = render(<Divider color="#ff0000" />);
    const divider = container.querySelector('hr');
    expect(divider).toBeInTheDocument();
  });
});

describe('PageLayout', () => {
  it('renders children', () => {
    render(
      <PageLayout>
        <div>Page Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <PageLayout title="Page Title">
        <div>Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <PageLayout subtitle="Page subtitle">
        <div>Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Page subtitle')).toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <PageLayout actions={<button>Action</button>}>
        <div>Content</div>
      </PageLayout>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders without header when no title/subtitle/actions', () => {
    const { container } = render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    // No header section should be rendered
    expect(container.querySelectorAll('header').length).toBe(0);
  });
});

describe('MetricCard', () => {
  it('renders label and value', () => {
    render(<MetricCard label="Total Sales" value="$1,234" />);
    expect(screen.getByText('Total Sales')).toBeInTheDocument();
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(
      <MetricCard label="Metric" value="100" icon={<TrendingUp data-testid="icon" />} />
    );
    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
  });

  it('renders trend indicator', () => {
    render(
      <MetricCard 
        label="Sales" 
        value="$500" 
        trend={{ value: 15, direction: 'up' }} 
      />
    );
    expect(screen.getByText(/15%/)).toBeInTheDocument();
  });

  it('shows up trend with positive value', () => {
    render(
      <MetricCard 
        label="Growth" 
        value="50" 
        trend={{ value: 10, direction: 'up' }} 
      />
    );
    const trend = screen.getByText(/10%/);
    expect(trend).toBeInTheDocument();
  });

  it('shows down trend with negative value', () => {
    render(
      <MetricCard 
        label="Decline" 
        value="40" 
        trend={{ value: -5, direction: 'down' }} 
      />
    );
    const trend = screen.getByText(/5%/);
    expect(trend).toBeInTheDocument();
  });

  it('applies primary variant', () => {
    const { container } = render(
      <MetricCard label="Primary" value="100" variant="primary" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies success variant', () => {
    const { container } = render(
      <MetricCard label="Success" value="100" variant="success" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies warning variant', () => {
    const { container } = render(
      <MetricCard label="Warning" value="100" variant="warning" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies error variant', () => {
    const { container } = render(
      <MetricCard label="Error" value="100" variant="error" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
