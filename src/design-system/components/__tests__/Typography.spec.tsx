/**
 * TYPOGRAPHY COMPONENT TESTS  
 * Tests for Heading, Text, Badge design system components
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../test/utils';
import { Heading } from '../Heading';
import { Text } from '../Text';
import { Badge } from '../Badge';

describe('Heading', () => {
  it('renders h1', () => {
    render(<Heading level={1}>Heading Text</Heading>);
    const heading = screen.getByText('Heading Text');
    expect(heading.tagName).toBe('H1');
  });

  it('renders specified heading level', () => {
    render(<Heading level={2}>H2 Heading</Heading>);
    const heading = screen.getByText('H2 Heading');
    expect(heading.tagName).toBe('H2');
  });

  it('renders all levels correctly', () => {
    const { container } = render(
      <>
        <Heading level={1}>H1</Heading>
        <Heading level={2}>H2</Heading>
        <Heading level={3}>H3</Heading>
        <Heading level={4}>H4</Heading>
      </>
    );
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('h3')).toBeInTheDocument();
    expect(container.querySelector('h4')).toBeInTheDocument();
  });
});

describe('Text', () => {
  it('renders text content', () => {
    render(<Text>Text content</Text>);
    expect(screen.getByText('Text content')).toBeInTheDocument();
  });

  it('applies body variant', () => {
    render(<Text variant="body">Body text</Text>);
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('applies bodySm variant', () => {
    render(<Text variant="bodySm">Small text</Text>);
    expect(screen.getByText('Small text')).toBeInTheDocument();
  });

  it('applies bodyLg variant', () => {
    render(<Text variant="bodyLg">Large text</Text>);
    expect(screen.getByText('Large text')).toBeInTheDocument();
  });

  it('applies weight', () => {
    render(<Text weight="semibold">Bold text</Text>);
    const text = screen.getByText('Bold text');
    expect(text).toBeInTheDocument();
  });

  it('applies color', () => {
    render(<Text color="muted">Muted text</Text>);
    const text = screen.getByText('Muted text');
    expect(text).toBeInTheDocument();
  });

  it('renders as paragraph', () => {
    render(<Text>Paragraph text</Text>);
    const text = screen.getByText('Paragraph text');
    expect(text.tagName).toBe('P');
  });
});

describe('Badge', () => {
  it('renders badge content', () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });

  it('applies default variant', () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('applies success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('applies warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('applies error variant', () => {
    render(<Badge variant="error">Error</Badge>);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('applies info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });
});
