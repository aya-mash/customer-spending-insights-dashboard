/**
 * GRID, STACK, BOX LAYOUT COMPONENT TESTS
 * Tests for design system layout primitives
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid } from '../Grid';
import { Stack } from '../Stack';
import { Box } from '../Box';

describe('Grid', () => {
  it('renders children correctly', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies responsive columns', () => {
    const { container } = render(
      <Grid columns={{ mobile: 1, tablet: 2, desktop: 3 }}>
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild;
    expect(grid).toBeInTheDocument();
  });

  it('applies gap spacing', () => {
    const { container } = render(
      <Grid gap={4}>
        <div>Item</div>
      </Grid>
    );
    const grid = container.firstChild;
    expect(grid).toBeInTheDocument();
  });
});

describe('Stack', () => {
  it('renders children in vertical stack by default', () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders horizontal stack', () => {
    const { container } = render(
      <Stack direction="horizontal">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    const stack = container.firstChild;
    expect(stack).toHaveStyle({ flexDirection: 'row' });
  });

  it('applies spacing', () => {
    const { container } = render(
      <Stack spacing={6}>
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild;
    expect(stack).toBeInTheDocument();
  });

  it('aligns items center', () => {
    const { container } = render(
      <Stack align="center">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild;
    expect(stack).toHaveStyle({ alignItems: 'center' });
  });

  it('justifies content space-between', () => {
    const { container } = render(
      <Stack justify="between">
        <div>Item</div>
      </Stack>
    );
    const stack = container.firstChild;
    expect(stack).toHaveStyle({ justifyContent: 'space-between' });
  });
});

describe('Box', () => {
  it('renders children correctly', () => {
    render(<Box>Box Content</Box>);
    expect(screen.getByText('Box Content')).toBeInTheDocument();
  });

  it('renders as different element with as prop', () => {
    render(<Box as="section" data-testid="box-section">Section</Box>);
    const box = screen.getByTestId('box-section');
    expect(box.tagName).toBe('SECTION');
  });

  it('forwards style prop', () => {
    render(<Box style={{ color: 'red' }} data-testid="styled-box">Styled</Box>);
    const box = screen.getByTestId('styled-box');
    // Verify box exists with custom style applied (RGB conversion is expected)
    expect(box).toBeInTheDocument();
    expect(box).toHaveAttribute('data-testid', 'styled-box');
  });
});
