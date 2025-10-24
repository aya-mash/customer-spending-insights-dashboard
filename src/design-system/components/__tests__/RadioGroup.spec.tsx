/**
 * RADIO GROUP TESTS
 * Tests for RadioGroup component with Tabs-style design
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { RadioGroup, type RadioOption } from '../RadioGroup';

const mockOptions: RadioOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('RadioGroup', () => {
  it('renders all radio options', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        name="test-group"
        options={mockOptions}
        value="option1"
        onChange={onChange}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('marks the selected option as checked', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        name="test-group"
        options={mockOptions}
        value="option2"
        onChange={onChange}
      />
    );

    const option1: HTMLInputElement = screen.getByDisplayValue('option1');
    const option2: HTMLInputElement = screen.getByDisplayValue('option2');
    const option3: HTMLInputElement = screen.getByDisplayValue('option3');

    expect(option1.checked).toBe(false);
    expect(option2.checked).toBe(true);
    expect(option3.checked).toBe(false);
  });

  it('calls onChange when a radio is clicked', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        name="test-group"
        options={mockOptions}
        value="option1"
        onChange={onChange}
      />
    );

    const option2 = screen.getByDisplayValue('option2');
    fireEvent.click(option2);

    expect(onChange).toHaveBeenCalledWith('option2');
  });

  it('renders with aria-label', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup
        name="test-group"
        options={mockOptions}
        value="option1"
        onChange={onChange}
        aria-label="Choose an option"
      />
    );

    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveAttribute('aria-label', 'Choose an option');
  });

  it('renders fieldset element', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup
        name="test-group"
        options={mockOptions}
        value="option1"
        onChange={onChange}
      />
    );

    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toBeInTheDocument();
  });

  it('renders with icons', () => {
    const onChange = vi.fn();
    const optionsWithIcons: RadioOption[] = [
      { value: 'option1', label: 'Option 1', icon: <span data-testid="icon-1">☀️</span> },
      { value: 'option2', label: 'Option 2', icon: <span data-testid="icon-2">🌙</span> },
    ];

    render(
      <RadioGroup
        name="test-group"
        options={optionsWithIcons}
        value="option1"
        onChange={onChange}
      />
    );

    expect(screen.getByTestId('icon-1')).toBeInTheDocument();
    expect(screen.getByTestId('icon-2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const onChange = vi.fn();
    const { container } = render(
      <RadioGroup
        name="test-group"
        options={mockOptions}
        value="option1"
        onChange={onChange}
        className="custom-radio-group"
      />
    );

    const fieldset = container.querySelector('fieldset');
    expect(fieldset).toHaveClass('custom-radio-group');
  });
});
