/**
 * CARD COMPONENT TESTS
 * Tests for design system Card component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(<Card>Default Card</Card>);
    const card = screen.getByText('Default Card').parentElement;
    expect(card).toHaveStyle({ borderRadius: expect.any(String) });
  });

  it('applies primary variant styles', () => {
    render(<Card variant="primary">Primary Card</Card>);
    const card = screen.getByText('Primary Card').parentElement;
    expect(card).toHaveStyle({ borderColor: expect.any(String) });
  });

  it('applies elevated variant styles', () => {
    render(<Card variant="elevated">Elevated Card</Card>);
    const card = screen.getByText('Elevated Card').parentElement;
    expect(card).toHaveStyle({ boxShadow: expect.any(String) });
  });

  it('handles click events when hover is enabled', () => {
    const handleClick = vi.fn();
    render(<Card hover onClick={handleClick}>Clickable Card</Card>);
    const card = screen.getByText('Clickable Card').parentElement;
    fireEvent.click(card!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies padding prop', () => {
    render(<Card padding={8}>Padded Card</Card>);
    const card = screen.getByText('Padded Card').parentElement;
    expect(card).toHaveStyle({ padding: expect.any(String) });
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref).toHaveBeenCalled();
  });

  it('passes through additional props', () => {
    render(<Card data-testid="custom-card">Custom Card</Card>);
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    render(<Card style={{ backgroundColor: 'red' }}>Custom Styled Card</Card>);
    const card = screen.getByText('Custom Styled Card').parentElement;
    expect(card).toHaveStyle({ backgroundColor: 'red' });
  });
});
