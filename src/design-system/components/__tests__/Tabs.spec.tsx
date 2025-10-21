/**
 * TABS COMPONENT TESTS
 * Tests for design system Tabs component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, type TabItem } from '../Tabs';

const mockItems: TabItem[] = [
  { key: 'tab1', label: 'Tab 1' },
  { key: 'tab2', label: 'Tab 2' },
  { key: 'tab3', label: 'Tab 3' },
];

describe('Tabs', () => {
  it('renders all tabs', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('marks active tab with aria-selected', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab2" onChange={onChange} />);
    
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
    
    expect(tab1).toHaveAttribute('aria-selected', 'false');
    expect(tab2).toHaveAttribute('aria-selected', 'true');
    expect(tab3).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange when tab is clicked', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('handles keyboard navigation with Arrow Right', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />);
    
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    
    expect(onChange).toHaveBeenCalledWith('tab2');
  });

  it('handles keyboard navigation with Arrow Left', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab2" onChange={onChange} />);
    
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    fireEvent.keyDown(tab2, { key: 'ArrowLeft' });
    
    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('wraps around when navigating past last tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab3" onChange={onChange} />);
    
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
    fireEvent.keyDown(tab3, { key: 'ArrowRight' });
    
    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('wraps around when navigating before first tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />);
    
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    fireEvent.keyDown(tab1, { key: 'ArrowLeft' });
    
    expect(onChange).toHaveBeenCalledWith('tab3');
  });

  it('handles Home key to go to first tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab3" onChange={onChange} />);
    
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
    fireEvent.keyDown(tab3, { key: 'Home' });
    
    expect(onChange).toHaveBeenCalledWith('tab1');
  });

  it('handles End key to go to last tab', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab1" onChange={onChange} />);
    
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    fireEvent.keyDown(tab1, { key: 'End' });
    
    expect(onChange).toHaveBeenCalledWith('tab3');
  });

  it('sets tabIndex correctly for active and inactive tabs', () => {
    const onChange = vi.fn();
    render(<Tabs items={mockItems} activeTab="tab2" onChange={onChange} />);
    
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
    
    expect(tab1).toHaveAttribute('tabIndex', '-1');
    expect(tab2).toHaveAttribute('tabIndex', '0');
    expect(tab3).toHaveAttribute('tabIndex', '-1');
  });

  it('uses custom aria-label for tab items', () => {
    const itemsWithAriaLabel: TabItem[] = [
      { key: 'tab1', label: 'Tab 1', 'aria-label': 'First tab' },
      { key: 'tab2', label: 'Tab 2', 'aria-label': 'Second tab' },
    ];
    const onChange = vi.fn();
    render(<Tabs items={itemsWithAriaLabel} activeTab="tab1" onChange={onChange} />);
    
    expect(screen.getByRole('tab', { name: 'First tab' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Second tab' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Tabs items={mockItems} activeTab="tab1" onChange={onChange} className="custom-tabs" />
    );
    
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toHaveClass('custom-tabs');
  });
});
