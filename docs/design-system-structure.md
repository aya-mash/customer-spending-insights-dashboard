# Design System Component Structure

## Overview

The design system has been reorganized into a modular structure with individual component files for better maintainability and tree-shaking.

## Directory Structure

```
src/design-system/
├── index.ts              # Main export - tokens, utilities, helpers
├── tokens.ts             # Design tokens (colors, spacing, typography, etc.)
├── components/
│   ├── index.tsx         # Component exports
│   ├── Card.tsx          # Card container component
│   ├── Button.tsx        # Button with variants and states
│   ├── Grid.tsx          # Responsive CSS Grid layout
│   ├── Stack.tsx         # Flexbox layout primitive
│   ├── Heading.tsx       # Semantic heading (h1-h4)
│   ├── Text.tsx          # Typography component
│   ├── Badge.tsx         # Category/status badges
│   ├── PageLayout.tsx    # Page wrapper with header
│   ├── Divider.tsx       # Horizontal rule
│   └── MetricCard.tsx    # Financial metric display card
```

## Usage

### Import Tokens and Utilities

```typescript
import { 
  brand, 
  spacing, 
  fontSize,
  useBreakpoint,
  useResponsiveValue,
  formatCurrency 
} from '@/design-system';
```

### Import Components

```typescript
// Named imports (recommended)
import { Card, Button, Grid, MetricCard } from '@/design-system/components';

// Or from specific files
import { Card } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
```

## Component Features

### All Components Include:
- ✅ TypeScript type safety with exported prop types
- ✅ Mobile-first responsive design
- ✅ Inline styles generated from design tokens
- ✅ Respect for `prefers-reduced-motion`
- ✅ Proper focus states and accessibility
- ✅ Minimum 44px touch targets on mobile
- ✅ Forward ref support

### Individual Component Files:

#### **Card.tsx**
- Variants: default, primary, elevated
- Optional hover effect with lift animation
- Responsive padding prop
- Export: `Card`, `CardProps`

#### **Button.tsx**
- Variants: primary, secondary, ghost, danger
- Sizes: small, medium, large
- Loading state with spinner
- Icon support (left/right positioning)
- Full-width option
- Export: `Button`, `ButtonProps`

#### **Grid.tsx**
- Responsive columns: `{mobile: 1, tablet: 2, desktop: 4}`
- Responsive gap spacing
- CSS Grid-based
- Export: `Grid`, `GridProps`

#### **Stack.tsx**
- Direction: horizontal, vertical
- Align: start, center, end, stretch
- Justify: start, center, end, between, around
- Responsive spacing
- Optional wrap
- Export: `Stack`, `StackProps`

#### **Heading.tsx**
- Levels: 1, 2, 3, 4 (maps to h1-h4)
- Semantic HTML
- Proper font sizing and weights
- Export: `Heading`, `HeadingProps`

#### **Text.tsx**
- Variants: body, bodyLg, bodySm, caption
- Colors: primary, muted, strong, inverse, disabled
- Optional weight override
- Export: `Text`, `TextProps`

#### **Badge.tsx**
- Category support (auto-colors from tokens)
- Variants: default, success, warning, error, info
- Pill-shaped design
- Export: `Badge`, `BadgeProps`

#### **PageLayout.tsx**
- Standard page wrapper
- Optional title, subtitle, actions
- Responsive padding
- Max-width constraint (1440px)
- Export: `PageLayout`, `PageLayoutProps`

#### **Divider.tsx**
- Horizontal rule with configurable spacing
- Uses border color token
- Export: `Divider`, `DividerProps`

#### **MetricCard.tsx**
- Financial metric display
- Icon support with colored background
- Trend indicator (up/down with percentage)
- Variants: default, primary, success, warning, error
- Export: `MetricCard`, `MetricCardProps`

## Benefits of This Structure

1. **Tree Shaking**: Import only the components you need
2. **Maintainability**: Each component in its own file
3. **Type Safety**: All prop types are exported
4. **Discoverability**: Easy to find and understand components
5. **Performance**: Smaller bundle sizes
6. **Developer Experience**: Clear file organization

## Next Steps

1. Migrate pages to use these components
2. Remove CSS file dependencies
3. Test responsive behavior at all breakpoints
4. Verify accessibility compliance

## Migration Path

```typescript
// OLD (CSS-dependent)
import { Card, CardHeader, CardContent } from '@/components/Card';
<Card className="card card--elevation-2">...</Card>

// NEW (Design system)
import { Card } from '@/design-system/components';
<Card variant="elevated" padding={6}>...</Card>
```
