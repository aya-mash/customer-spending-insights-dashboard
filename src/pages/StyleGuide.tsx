/**
 * STYLE GUIDE
 * Design system tokens and components showcase with integrated contrast checker and neomorphic examples
 */

import { useState, useEffect, type CSSProperties } from 'react';
import { PageLayout, Card, Stack, Grid, Heading, Text, Button, Badge, Divider } from '../design-system/components/index';
import { 
  brand, 
  neutral, 
  semantic, 
  surface, 
  text as textColors,
  spacing,
  fontSize,
  fontWeight,
  radius,
  shadow,
  categories
} from '../design-system/tokens';
import { contrastRatio } from '../lib/contrast';
import { ContrastCheckerPanel } from '../design-system/components/ContrastCheckerPanel';
import { Palette } from 'lucide-react';

interface ColorSwatch {
  name: string;
  value: string;
  category: 'brand' | 'neutral' | 'semantic' | 'surface' | 'text' | 'categories';
}

export function StyleGuide() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [showContrastChecker, setShowContrastChecker] = useState(false);
  const [circleButtonPressed, setCircleButtonPressed] = useState(false);
  const [squareButtonPressed, setSquareButtonPressed] = useState(false);

  // Close dialog on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showContrastChecker) {
        setShowContrastChecker(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showContrastChecker]);

  // Collect all color tokens
  const brandColors: ColorSwatch[] = [
    { name: 'Primary', value: brand.primary, category: 'brand' },
    { name: 'Secondary', value: brand.secondary, category: 'brand' },
    { name: 'Tertiary', value: brand.accent, category: 'brand' },
    { name: 'Hover', value: brand.primaryHover, category: 'brand' },
  ];

  const neutralColors: ColorSwatch[] = [
    { name: 'Gray 50', value: neutral[50], category: 'neutral' },
    { name: 'Gray 100', value: neutral[100], category: 'neutral' },
    { name: 'Gray 200', value: neutral[200], category: 'neutral' },
    { name: 'Gray 300', value: neutral[300], category: 'neutral' },
    { name: 'Gray 400', value: neutral[400], category: 'neutral' },
    { name: 'Gray 500', value: neutral[500], category: 'neutral' },
    { name: 'Gray 600', value: neutral[600], category: 'neutral' },
    { name: 'Gray 700', value: neutral[700], category: 'neutral' },
    { name: 'Gray 800', value: neutral[800], category: 'neutral' },
    { name: 'Gray 900', value: neutral[900], category: 'neutral' },
  ];

  const semanticColors: ColorSwatch[] = [
    { name: 'Success', value: semantic.success, category: 'semantic' },
    { name: 'Warning', value: semantic.warning, category: 'semantic' },
    { name: 'Danger', value: semantic.error, category: 'semantic' },
    { name: 'Info', value: semantic.info, category: 'semantic' },
  ];

  const categoryColors: ColorSwatch[] = [
    { name: 'Dining', value: categories.dining.main, category: 'categories' },
    { name: 'Transportation', value: categories.transport.main, category: 'categories' },
    { name: 'Shopping', value: categories.shopping.main, category: 'categories' },
    { name: 'Entertainment', value: categories.entertainment.main, category: 'categories' },
    { name: 'Groceries', value: categories.groceries.main, category: 'categories' },
    { name: 'Utilities', value: categories.utilities.main, category: 'categories' },
  ];

  const copyToClipboard = (text: string, token: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getContrastInfo = (bg: string, fg: string = '#FFFFFF'): string => {
    const ratio = contrastRatio(bg, fg);
    const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';
    return `${ratio.toFixed(2)}:1 (${level})`;
  };

  const swatchStyle = (bgColor: string): CSSProperties => {
    const ratio = contrastRatio(bgColor, '#FFFFFF');
    const textColor = ratio >= 4.5 ? '#FFFFFF' : '#1F2937';
    
    return {
      backgroundColor: bgColor,
      color: textColor,
      padding: spacing[4],
      borderRadius: radius.md,
      border: `1px solid ${surface.border}`,
      cursor: 'pointer',
      transition: 'transform 150ms ease',
      minHeight: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    };
  };

  return (
    <PageLayout title="Design System Style Guide">
      <Stack direction="vertical" spacing={8}>
        {/* Introduction */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={3}>
            <Heading level={2}>Design tokens and baseline components preview.</Heading>
            <Text variant="body">
              This page showcases all design system tokens, components, and patterns used throughout the application.
              Click any color swatch to copy its hex value.
            </Text>
          </Stack>
        </Card>

        {/* Brand Colors */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Brand Colors</Heading>
            <Grid columns={{ mobile: 2, tablet: 4 }} gap={4}>
              {brandColors.map(color => (
                <div
                  key={color.name}
                  style={swatchStyle(color.value)}
                  onClick={() => copyToClipboard(color.value, color.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${color.name} color ${color.value}`}
                >
                  <Text variant="bodySm" style={{ fontWeight: 600 }}>{color.name}</Text>
                  <div>
                    <Text variant="caption" style={{ opacity: 0.9 }}>{color.value}</Text>
                    <br />
                    <Text variant="caption" style={{ opacity: 0.8, fontSize: '11px' }}>
                      {getContrastInfo(color.value)}
                    </Text>
                  </div>
                  {copiedToken === color.name && (
                    <Text variant="caption" style={{ fontWeight: 600 }}>✓ Copied!</Text>
                  )}
                </div>
              ))}
            </Grid>
          </Stack>
        </Card>

        {/* Semantic Colors */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Semantic Colors</Heading>
            <Grid columns={{ mobile: 2, tablet: 4 }} gap={4}>
              {semanticColors.map(color => (
                <div
                  key={color.name}
                  style={swatchStyle(color.value)}
                  onClick={() => copyToClipboard(color.value, color.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Text variant="bodySm" style={{ fontWeight: 600 }}>{color.name}</Text>
                  <div>
                    <Text variant="caption" style={{ opacity: 0.9 }}>{color.value}</Text>
                    <br />
                    <Text variant="caption" style={{ opacity: 0.8, fontSize: '11px' }}>
                      {getContrastInfo(color.value)}
                    </Text>
                  </div>
                </div>
              ))}
            </Grid>
          </Stack>
        </Card>

        {/* Neutral Colors */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Neutral Colors</Heading>
            <Grid columns={{ mobile: 5, tablet: 10 }} gap={2}>
              {neutralColors.map(color => (
                <div
                  key={color.name}
                  style={{
                    ...swatchStyle(color.value),
                    minHeight: '80px',
                    padding: spacing[2],
                  }}
                  onClick={() => copyToClipboard(color.value, color.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Text variant="caption" style={{ fontSize: '10px', fontWeight: 600 }}>
                    {color.name.replace('Gray ', '')}
                  </Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </Card>

        {/* Category Colors */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Category Colors</Heading>
            <Grid columns={{ mobile: 2, tablet: 3, desktop: 6 }} gap={4}>
              {categoryColors.map(color => (
                <div
                  key={color.name}
                  style={swatchStyle(color.value)}
                  onClick={() => copyToClipboard(color.value, color.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Text variant="bodySm" style={{ fontWeight: 600 }}>{color.name}</Text>
                  <Text variant="caption" style={{ opacity: 0.9 }}>{color.value}</Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </Card>

        {/* Typography */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Typography</Heading>
            <Divider />
            <Stack direction="vertical" spacing={3}>
              <div>
                <Heading level={1}>H1 – The quick brown fox jumps over the lazy dog.</Heading>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.h1} · {fontWeight.bold}
                </Text>
              </div>
              <div>
                <Heading level={2}>H2 – The quick brown fox jumps over the lazy dog.</Heading>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.h2} · {fontWeight.semibold}
                </Text>
              </div>
              <div>
                <Heading level={3}>H3 – The quick brown fox jumps over the lazy dog.</Heading>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.h3} · {fontWeight.semibold}
                </Text>
              </div>
              <div>
                <Heading level={4}>H4 – The quick brown fox jumps over the lazy dog.</Heading>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.h4} · {fontWeight.semibold}
                </Text>
              </div>
              <div>
                <Text variant="bodyLg">Body Large – The quick brown fox jumps over the lazy dog.</Text>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.bodyLg} · {fontWeight.regular}
                </Text>
              </div>
              <div>
                <Text variant="body">Body – The quick brown fox jumps over the lazy dog.</Text>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.body} · {fontWeight.regular}
                </Text>
              </div>
              <div>
                <Text variant="bodySm">Body Small – The quick brown fox jumps over the lazy dog.</Text>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.bodySm} · {fontWeight.regular}
                </Text>
              </div>
              <div>
                <Text variant="caption">Caption – The quick brown fox jumps over the lazy dog.</Text>
                <Text variant="caption" style={{ color: textColors.muted }}>
                  {fontSize.caption} · {fontWeight.medium}
                </Text>
              </div>
            </Stack>
          </Stack>
        </Card>

        {/* Spacing Scale */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Spacing</Heading>
            <Stack direction="vertical" spacing={2}>
              {Object.entries(spacing).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[4],
                  }}
                >
                  <Text variant="bodySm" style={{ minWidth: '60px', fontWeight: 600 }}>
                    {key}
                  </Text>
                  <div
                    style={{
                      height: '24px',
                      width: value,
                      backgroundColor: brand.primary,
                      borderRadius: radius.sm,
                    }}
                  />
                  <Text variant="caption" style={{ color: textColors.muted }}>
                    {value}
                  </Text>
                </div>
              ))}
            </Stack>
          </Stack>
        </Card>

        {/* Components */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Components</Heading>
            <Divider />
            
            {/* Buttons */}
            <div>
              <Text variant="bodySm" style={{ fontWeight: 600, marginBottom: spacing[3] }}>
                Buttons
              </Text>
              <Stack direction="horizontal" spacing={3} wrap>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" size="small">Small</Button>
                <Button variant="primary" size="large">Large</Button>
              </Stack>
            </div>

            <Divider />

            {/* Badges */}
            <div>
              <Text variant="bodySm" style={{ fontWeight: 600, marginBottom: spacing[3] }}>
                Badges
              </Text>
              <Stack direction="horizontal" spacing={3} wrap>
                <Badge variant="default">Default</Badge>
                <Badge variant="info">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Danger</Badge>
              </Stack>
            </div>

            <Divider />

            {/* Cards */}
            <div>
              <Text variant="bodySm" style={{ fontWeight: 600, marginBottom: spacing[3] }}>
                Cards
              </Text>
              <Grid columns={{ mobile: 1, tablet: 2 }} gap={4}>
                <Card padding={4}>
                  <Heading level={4}>Card Title</Heading>
                  <Text variant="body">This is a card with default padding and styling.</Text>
                </Card>
                <Card padding={4} style={{ backgroundColor: surface.surfaceAlt }}>
                  <Heading level={4}>Alt Surface Card</Heading>
                  <Text variant="body">This card uses the alternate surface color.</Text>
                </Card>
              </Grid>
            </div>
          </Stack>
        </Card>

        {/* Border Radius */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Border Radius</Heading>
            <Grid columns={{ mobile: 2, tablet: 4 }} gap={4}>
              {Object.entries(radius).map(([key, value]) => (
                <div key={key} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: brand.primary,
                      borderRadius: value,
                      margin: '0 auto',
                      marginBottom: spacing[2],
                    }}
                  />
                  <Text variant="bodySm" style={{ fontWeight: 600 }}>{key}</Text>
                  <Text variant="caption" style={{ color: textColors.muted }}>{value}</Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </Card>

        {/* Shadows */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <Heading level={3}>Shadows</Heading>
            <Grid columns={{ mobile: 1, tablet: 3 }} gap={6}>
              {Object.entries(shadow).map(([key, value]) => (
                <div key={key}>
                  <div
                    style={{
                      height: '100px',
                      backgroundColor: surface.card,
                      borderRadius: radius.md,
                      boxShadow: value,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing[2],
                    }}
                  >
                    <Text variant="body" style={{ fontWeight: 600 }}>{key}</Text>
                  </div>
                  <Text variant="caption" style={{ color: textColors.muted, fontSize: '11px' }}>
                    {value}
                  </Text>
                </div>
              ))}
            </Grid>
          </Stack>
        </Card>

        {/* Contrast Checker */}
        {/* Contrast Checker Section - Now a Dialog */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={4}>
            <div>
              <Heading level={3}>Contrast Checker</Heading>
              <Text variant="body" color="muted" style={{ marginTop: spacing[2] }}>
                Click the floating button (bottom-right) to open the contrast checker dialog.
              </Text>
            </div>
          </Stack>
        </Card>

        {/* Neomorphic Design System Section */}
        <Card padding={6}>
          <Stack direction="vertical" spacing={6}>
            <div>
              <Heading level={2}>Neomorphic Design System</Heading>
              <Text variant="body" color="muted" style={{ marginTop: spacing[2] }}>
                Soft, monochromatic design with subtle shadows creating a molded-from-surface appearance.
              </Text>
            </div>

            <Divider />

            {/* Circular Examples */}
            <div>
              <Heading level={3} style={{ marginBottom: spacing[4] }}>Circular Elements</Heading>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: spacing[6],
                marginTop: spacing[4],
              }}>
                {/* Raised Button */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onMouseDown={() => setCircleButtonPressed(true)}
                    onMouseUp={() => setCircleButtonPressed(false)}
                    onMouseLeave={() => setCircleButtonPressed(false)}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: surface.surface,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: circleButtonPressed ? 'var(--shadow-neumorphic-pressed)' : 'var(--shadow-neumorphic-md)',
                      transition: 'all 200ms ease',
                      fontSize: fontSize.bodySm,
                      fontWeight: fontWeight.semibold,
                      color: brand.primary,
                    }}
                  >
                    Button
                  </button>
                  <Text variant="caption" color="muted" style={{ marginTop: spacing[2], display: 'block' }}>
                    Raised/Embossed
                  </Text>
                </div>

                {/* Debossed Input */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: surface.surface,
                    boxShadow: 'var(--shadow-neumorphic-inset)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}>
                    <input
                      type="text"
                      placeholder="Input"
                      style={{
                        width: '70px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        textAlign: 'center',
                        fontSize: fontSize.bodySm,
                        color: textColors.primary,
                      }}
                    />
                  </div>
                  <Text variant="caption" color="muted" style={{ marginTop: spacing[2], display: 'block' }}>
                    Depressed/Debossed
                  </Text>
                </div>

                {/* Ring */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: surface.surface,
                    border: `5px solid ${surface.surface}`,
                    boxShadow: 'var(--shadow-neumorphic-ring)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      boxShadow: 'var(--shadow-neumorphic-inset)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: fontSize.caption,
                      color: textColors.muted,
                    }}>
                      Ring
                    </div>
                  </div>
                  <Text variant="caption" color="muted" style={{ marginTop: spacing[2], display: 'block' }}>
                    Raised Ring
                  </Text>
                </div>
              </div>
            </div>

            <Divider />

            {/* Square Examples */}
            <div>
              <Heading level={3} style={{ marginBottom: spacing[4] }}>Rounded Square Elements</Heading>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: spacing[6],
                marginTop: spacing[4],
              }}>
                {/* Square Button */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onMouseDown={() => setSquareButtonPressed(true)}
                    onMouseUp={() => setSquareButtonPressed(false)}
                    onMouseLeave={() => setSquareButtonPressed(false)}
                    style={{
                      width: '140px',
                      height: '100px',
                      borderRadius: radius.lg,
                      backgroundColor: surface.surface,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: squareButtonPressed ? 'var(--shadow-neumorphic-pressed)' : 'var(--shadow-neumorphic-md)',
                      transition: 'all 200ms ease',
                      fontSize: fontSize.bodySm,
                      fontWeight: fontWeight.semibold,
                      color: brand.primary,
                    }}
                  >
                    Button
                  </button>
                  <Text variant="caption" color="muted" style={{ marginTop: spacing[2], display: 'block' }}>
                    Raised/Embossed
                  </Text>
                </div>

                {/* Square Input */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '140px',
                    height: '100px',
                    borderRadius: radius.lg,
                    backgroundColor: surface.surface,
                    boxShadow: 'var(--shadow-neumorphic-inset)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    padding: spacing[3],
                  }}>
                    <input
                      type="text"
                      placeholder="Enter..."
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        textAlign: 'center',
                        fontSize: fontSize.bodySm,
                        color: textColors.primary,
                      }}
                    />
                  </div>
                  <Text variant="caption" color="muted" style={{ marginTop: spacing[2], display: 'block' }}>
                    Depressed/Debossed
                  </Text>
                </div>

                {/* Square Ring */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '140px',
                    height: '100px',
                    borderRadius: radius.lg,
                    backgroundColor: surface.surface,
                    border: `5px solid ${surface.surface}`,
                    boxShadow: 'var(--shadow-neumorphic-ring)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}>
                    <div style={{
                      width: '100px',
                      height: '70px',
                      borderRadius: radius.md,
                      boxShadow: 'var(--shadow-neumorphic-inset)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: fontSize.caption,
                      color: textColors.muted,
                    }}>
                      Ring
                    </div>
                  </div>
                  <Text variant="caption" color="muted" style={{ marginTop: spacing[2], display: 'block' }}>
                    Raised Ring
                  </Text>
                </div>
              </div>
            </div>

            <Divider />

            {/* Tabs Example */}
            <div>
              <Heading level={3} style={{ marginBottom: spacing[4] }}>Debossed Tabs</Heading>
              <div style={{ textAlign: 'center', marginTop: spacing[4] }}>
                <div style={{
                  display: 'inline-flex',
                  gap: spacing[2],
                  background: surface.surface,
                  padding: spacing[2],
                  borderRadius: radius.lg,
                  boxShadow: 'var(--shadow-neumorphic-inset)',
                }}>
                  <button style={{
                    background: surface.surface,
                    border: 'none',
                    padding: `${spacing[3]} ${spacing[4]}`,
                    borderRadius: radius.md,
                    fontSize: fontSize.body,
                    fontWeight: fontWeight.semibold,
                    color: brand.primary,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-neumorphic-sm)',
                    transform: 'translateY(-1px)',
                  }}>
                    Active
                  </button>
                  <button style={{
                    background: surface.surface,
                    border: 'none',
                    padding: `${spacing[3]} ${spacing[4]}`,
                    borderRadius: radius.md,
                    fontSize: fontSize.body,
                    fontWeight: fontWeight.medium,
                    color: textColors.muted,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-neumorphic-inset)',
                  }}>
                    Inactive
                  </button>
                  <button style={{
                    background: surface.surface,
                    border: 'none',
                    padding: `${spacing[3]} ${spacing[4]}`,
                    borderRadius: radius.md,
                    fontSize: fontSize.body,
                    fontWeight: fontWeight.medium,
                    color: textColors.muted,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-neumorphic-inset)',
                  }}>
                    Another
                  </button>
                </div>
                <Text variant="caption" color="muted" style={{ marginTop: spacing[3], display: 'block' }}>
                  Container debossed, active tab raised, inactive tabs recessed
                </Text>
              </div>
            </div>
          </Stack>
        </Card>
      </Stack>

      {/* Floating Action Button (FAB) for Contrast Checker */}
      <button
        onClick={() => setShowContrastChecker(true)}
        style={{
          position: 'fixed',
          bottom: spacing[6],
          right: spacing[6],
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: brand.primary,
          color: textColors.inverse,
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-neumorphic-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 200ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = shadow['2xl'];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-neumorphic-lg)';
        }}
        aria-label="Open Contrast Checker"
      >
        <Palette size={24} />
      </button>

      {/* Contrast Checker Dialog */}
      {showContrastChecker && (
        <>
          {/* Backdrop - Solid overlay (neomorphic design) */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: surface.overlay,
              zIndex: 1300,
            }}
            onClick={() => setShowContrastChecker(false)}
          />
          {/* Dialog */}
          <ContrastCheckerPanel onClose={() => setShowContrastChecker(false)} />
        </>
      )}
    </PageLayout>
  );
}

export default StyleGuide;
