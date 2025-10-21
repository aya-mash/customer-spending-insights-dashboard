/**
 * TEXTFIELD COMPONENT TESTS
 * Tests for design system TextField component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextField } from '../TextField';
import { Search } from 'lucide-react';

describe('TextField', () => {
  it('renders input with label', () => {
    render(<TextField id="test-input" label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders input with placeholder', () => {
    render(<TextField id="test" placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<TextField id="test" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders with start icon', () => {
    render(<TextField id="test" label="Search" startIcon={<Search />} />);
    expect(screen.getByLabelText('Search')).toBeInTheDocument();
  });

  it('renders with end icon', () => {
    render(<TextField id="test" label="Input" endIcon={<Search />} />);
    expect(screen.getByLabelText('Input')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<TextField id="test" label="Input" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styles when error prop is present', () => {
    render(<TextField id="test" label="Input" error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders full width', () => {
    render(<TextField id="test" label="Input" fullWidth />);
    const container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).toHaveStyle({ width: '100%' });
  });

  it('disables input when disabled prop is true', () => {
    render(<TextField id="test" label="Input" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies required attribute', () => {
    render(<TextField id="test" label="Input" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('passes through additional input props', () => {
    render(<TextField id="test" label="Input" type="email" maxLength={50} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<TextField id="test" label="Input" ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
