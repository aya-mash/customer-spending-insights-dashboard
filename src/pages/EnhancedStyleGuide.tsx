/**
 * ENHANCED STYLE GUIDE
 * Design system tokens and components showcase
 */

import { useState, type CSSProperties } from 'react';
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

interface ColorSwatch {
  name: string;
  value: string;
  category: 'brand' | 'neutral' | 'semantic' | 'surface' | 'text' | 'categories';
}

export function EnhancedStyleGuide() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

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
      </Stack>
    </PageLayout>
  );
}

export default EnhancedStyleGuide;
