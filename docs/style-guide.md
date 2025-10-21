# Neomorphic Design System

The application uses a **Neomorphic Design System** with soft UI elements that appear molded from the surface. All design tokens are defined in `src/styles/tokens.css`.

## Core Principles

### Monochromatic Base
Elements share the same base color as the background creating a cohesive, molded appearance:
- **Light mode**: Whitish #EBF0F5
- **Dark mode**: Dark charcoal #1C1E26

### Dual Shadow Technique
- **Light shadow** (white) on top-left
- **Dark shadow** (gray-blue) on bottom-right
- Simulates light source creating depth without harsh borders

### Depth Variants

**Raised (Embossed)** - Elements protrude from surface:
- `--shadow-neumorphic-sm`: Subtle cards, chips
- `--shadow-neumorphic-md`: Buttons, panels, navigation
- `--shadow-neumorphic-lg`: Modals, headers, dialogs

**Recessed (Debossed)** - Elements pressed into surface:
- `--shadow-neumorphic-inset`: Text fields, containers
- `--shadow-neumorphic-pressed`: Active/pressed button states

**Outline**:
- `--shadow-neumorphic-ring`: Focus states, outlined borders

## Design Tokens

### Color Tokens
```css
/* Surface Colors */
--color-bg              /* Page background */
--color-surface         /* Card/panel background */
--color-surface-alt     /* Alternative surface */
--color-border          /* Borders and dividers */

/* Text Colors */
--color-text            /* Primary text */
--color-text-strong     /* Emphasized text */
--color-text-muted      /* Secondary text */

/* Brand Colors */
--brand-primary         /* Primary actions */
--brand-secondary       /* Secondary actions */

/* Semantic Colors */
--color-success         /* Positive, success states */
--color-warning         /* Caution, warning states */
--color-error           /* Errors, destructive actions */
--color-info            /* Informational messages */
```

### Shadow Tokens
All shadows are neomorphic - use these exclusively:
```css
--shadow-neumorphic-sm      /* Small raised */
--shadow-neumorphic-md      /* Medium raised */
--shadow-neumorphic-lg      /* Large raised */
--shadow-neumorphic-inset   /* Recessed */
--shadow-neumorphic-pressed /* Deep pressed */
--shadow-neumorphic-ring    /* Focus outline */
```

### Spacing Scale
```css
--sp-1: 4px
--sp-2: 8px
--sp-3: 12px
--sp-4: 16px
--sp-6: 24px
--sp-8: 32px
--sp-12: 48px
```

### Border Radius
```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-2xl: 24px
--radius-full: 9999px
```

## Component Usage

### Buttons
- Default: `--shadow-neumorphic-sm`
- Hover: `--shadow-neumorphic-md` + `translateY(-1px)`
- Active/Pressed: `--shadow-neumorphic-pressed`
- Focus: `--shadow-neumorphic-ring`

### Text Fields & Inputs
- Default: `--shadow-neumorphic-inset`
- Focus: `--shadow-neumorphic-ring`

### Cards & Panels
- Use: `--shadow-neumorphic-sm` for subtle elevation

### Tabs
- Container: `--shadow-neumorphic-inset` (debossed)
- Active tab: `--shadow-neumorphic-sm` (raised)
- Inactive tabs: `--shadow-neumorphic-pressed` (debossed)

## Accessibility

### Contrast Requirements
- **Body text**: AA contrast minimum (4.5:1)
- **Large text**: AAA contrast recommended (7:1)
- Test all color combinations in both light and dark modes

### Focus Indicators
- All interactive elements must have `:focus-visible` rings
- Use `--shadow-neumorphic-ring` for consistent focus styling

### Motion
- Respect `prefers-reduced-motion` for all animations
- Default transitions: 150ms-350ms

## Live Preview

Visit `/style-guide` in the running application to explore:
- **Overview**: Design principles and depth scale examples
- **Components**: Interactive component catalog with all states
- **Tokens**: Complete token reference and usage guide

## Single Source of Truth

All design tokens are defined in: **`src/styles/tokens.css`**

Import tokens in components:
```typescript
import { surface, spacing, radius } from '../design-system/tokens';

const styles = {
  backgroundColor: surface.surface,
  padding: spacing[4],
  borderRadius: radius.md,
  boxShadow: 'var(--shadow-neumorphic-sm)'
};
```

## Theme Support

The system supports instant theme switching:
- **Light mode**: Whitish soft UI
- **Dark mode**: Dark charcoal soft UI
- **System**: Follows OS preference

Theme changes update instantly without page reload via `data-theme` attribute and CSS custom properties.

- Provide a specific `aria-label` like `"Loading overview data"` or `"Loading charts"`.
- Prefer `getByLabelText` in tests to assert presence pre-resolution.
- Avoid redundant live region spam; use `aria-live="polite"` only if intermediate status updates occur.
- Reuse the same label string in Suspense fallbacks to keep semantics consistent.