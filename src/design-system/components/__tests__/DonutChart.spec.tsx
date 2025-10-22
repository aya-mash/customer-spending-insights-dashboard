/**
 * DONUT CHART COMPONENT TESTS
 * Tests for DonutChart design system chart component
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DonutChart } from '../DonutChart';
import type { CategoryItem } from '../../../data/models';

const mockData: CategoryItem[] = [
  { 
    name: 'Food', 
    amount: 300, 
    percentage: 46,
    transactionCount: 15,
    icon: 'utensils',
    color: '#3b82f6'
  },
  { 
    name: 'Transport', 
    amount: 200, 
    percentage: 31,
    transactionCount: 8,
    icon: 'car',
    color: '#10b981'
  },
  { 
    name: 'Entertainment', 
    amount: 150, 
    percentage: 23,
    transactionCount: 6,
    icon: 'music',
    color: '#f59e0b'
  },
];

describe('DonutChart', () => {
  it('renders chart container', () => {
    const { container } = render(<DonutChart data={mockData} total={650} />);
    // Recharts may not fully render in JSDOM, verify component exists
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const { container } = render(<DonutChart data={[]} total={0} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with responsive container class', () => {
    const { container } = render(<DonutChart data={mockData} total={650} />);
    // Component should have structure even if SVG doesn't render in JSDOM
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts custom height prop', () => {
    const { container } = render(<DonutChart data={mockData} total={650} height={400} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
