# Design System

## Neomorphic Guidelines

**Core Principle**: Soft depth through subtle shadows and lighting, not borders or stark contrasts.

### Visual Language
- **Lighting**: Simulated light source from top-left (135°)
- **Depth**: Raised (embossed), inset (debossed), flat
- **Shadows**: Dual shadows (highlight + shadow) for depth perception
- **Colors**: Surface colors with minimal contrast (5-10% difference)

### Spacing Scale (4px base unit)
```
1 = 4px   | sm gaps
2 = 8px   | default gaps
3 = 12px  | component padding
4 = 16px  | card padding
5 = 20px  | section spacing
6 = 24px  | page padding (mobile)
8 = 32px  | page padding (desktop)
```

### Focus-Visible Strategy
- **No default outline**: Clean visual design
- **:focus-visible only**: Ring appears on keyboard navigation, hidden for mouse clicks
- **2px offset ring**: Brand primary color at 60% opacity
- **Touch targets**: Minimum 44×44px per iOS/Android HIG

### AA Contrast Requirements
- **Body text**: 4.5:1 minimum (14px+)
- **Large text**: 3:1 minimum (18px+ or 14px bold)
- **Interactive elements**: 3:1 against background
- **Disabled states**: Allowed to fall below (not interactive)

## Component Structure

```
src/design-system/
  ├── tokens.ts              # Static values (spacing, radius, shadows)
  ├── components/            # All DS components
  │   ├── Button.tsx         # Primary action button
  │   ├── Card.tsx           # Container with neomorphic depth
  │   ├── Tabs.tsx           # Tab navigation with inset + raised
  │   ├── Table.tsx          # Data grid (semantic HTML)
  │   ├── Navigation.tsx     # Sidebar nav (desktop)
  │   ├── BottomNav.tsx      # Bottom nav (mobile)
  │   └── ...
  └── hooks/
      └── useTheme.ts        # Color tokens + responsive flags
```

### JSDoc Location
Each exported component has concise JSDoc above its definition:
- **Purpose**: What it does in one line
- **Usage**: When/why to use
- **@remarks**: Accessibility notes (ARIA, keyboard, targets)
- **@example**: Minimal code snippet

Example:
```tsx
/**
 * Neomorphic button with soft shadows and focus-visible ring.
 * Use for primary actions in forms, cards, and dialogs.
 * @remarks Accessible: 44px touch targets, focus ring, aria-busy on loading
 */
export const Button = ...
```

## Adding a New Component

1. **Create file**: `src/design-system/components/MyComponent.tsx`
2. **Add JSDoc**: Purpose, usage, a11y notes, example
3. **Export**: Add to `src/design-system/components/index.tsx`
4. **Story** (optional): `MyComponent.stories.tsx` for Storybook
5. **Tests**: Unit test in `src/design-system/__tests__/`

### Component Checklist
- [ ] Uses `useTheme()` for colors (no hardcoded hex)
- [ ] `React.memo` for performance
- [ ] `forwardRef` if ref needed
- [ ] TypeScript props interface exported
- [ ] Focus-visible ring on interactive elements
- [ ] Touch target ≥44px for buttons/links
- [ ] Responsive (mobile/desktop variants if needed)

## Theme System

Colors come from **CSS custom properties** in `tokens.css`, switched via `data-theme` attribute:

```css
:root[data-theme="light"] {
  --brand-primary: #2F70EF;
  --surface-surface: #E8EAED;
  --text-primary: #1A202C;
}

:root[data-theme="dark"] {
  --brand-primary: #5B8FF9;
  --surface-surface: #1E2530;
  --text-primary: #E2E8F0;
}
```

**Runtime Access**: `useTheme()` hook provides typed color tokens:
```tsx
const { brand, surface, text, isMobile } = useTheme();
// brand.primary, surface.card, text.strong, etc.
```

---

**Note**: Design system intentionally avoids UI libraries (MUI, Chakra, etc.) for full control over neomorphic aesthetic and bundle size.
