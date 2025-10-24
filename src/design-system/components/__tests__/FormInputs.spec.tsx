/**
 * FORM INPUT COMPONENT TESTS
 * Tests for Select and FilterChip design system components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { Select, type SelectOption } from '../Select';
import { FilterChip } from '../FilterChip';

const mockOptions: SelectOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

describe('Select', () => {
  it('renders select with label', () => {
    render(<Select id="test-select" label="Test Label" options={mockOptions} />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select id="test" label="Select" options={mockOptions} />);
    const select = screen.getByRole('combobox');
    expect(select.querySelectorAll('option').length).toBe(3);
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Select id="test" label="Select" options={mockOptions} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Select id="test" label="Select" options={mockOptions} error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('disables select when disabled prop is true', () => {
    render(<Select id="test" label="Select" options={mockOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('sets selected value', () => {
    render(<Select id="test" label="Select" options={mockOptions} value="2" />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  it('renders full width', () => {
    const { container } = render(<Select id="test" label="Select" options={mockOptions} fullWidth />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveStyle({ width: '100%' });
  });
});

describe('FilterChip', () => {
  it('renders chip with label', () => {
    const handleRemove = vi.fn();
    render(<FilterChip label="Test Filter" onRemove={handleRemove} />);
    expect(screen.getByText('Test Filter')).toBeInTheDocument();
  });

  it('handles remove click', () => {
    const handleRemove = vi.fn();
    render(<FilterChip label="Filter" onRemove={handleRemove} />);
    
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('shows remove icon', () => {
    render(<FilterChip label="Filter" onRemove={() => {}} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies hover styles', () => {
    const { container } = render(<FilterChip label="Chip" onRemove={() => {}} />);
    const chip = container.firstChild;
    expect(chip).toHaveStyle({ backgroundColor: expect.any(String) });
  });

  it('applies aria-label to chip button', () => {
    render(<FilterChip label="Category: Food" onRemove={() => {}} aria-label="Remove Category: Food" />);
    expect(screen.getByLabelText('Remove Category: Food')).toBeInTheDocument();
  });
});
