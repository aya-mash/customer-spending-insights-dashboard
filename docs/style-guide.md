## Style Guide & Design Tokens

The application uses a custom set of CSS Custom Properties (design tokens) defined in `src/styles/tokens.css`. These tokens provide consistency across color, typography, spacing, radii, and shadows.

### Tokens Overview

Colors:
- `--color-primary`: #2F70EF (primary actions)
- `--color-accent`: #4111A4 (accent elements / charts)
- `--color-surface`: #FFFFFF (page & card surfaces)
- `--color-border`: #E3E8EF (dividers and subtle outlines)
- `--color-text`: #0B1F33 (body text)
- `--color-muted`: #6B7A90 (secondary text)

Typography:
- Font Family: `--font-sans`
- Font Sizes: `--fs-12` / `--fs-14` / `--fs-16` / `--fs-18` / `--fs-20` / `--fs-24`
- Line Heights: `--lh-tight`, `--lh-normal`
- Font Weights: `--fw-regular`, `--fw-medium`, `--fw-semibold`, `--fw-bold`

Spacing Scale:
- `--sp-4`, `--sp-8`, `--sp-12`, `--sp-16`, `--sp-24`, `--sp-32`

Shape & Elevation:
- Radius: `--radius`
- Shadows: `--shadow-sm`, `--shadow-md`

### Contrast Guidance
Approved high-contrast pairings (AA or better for normal text):
- White text (#FFFFFF) on Primary background (`--color-primary`).
- White text (#FFFFFF) on Accent background (`--color-accent`) for stronger contrast.
- Standard body text (`--color-text`) on Surface (`--color-surface`).

Aim for WCAG AA contrast ratio ≥ 4.5:1 for normal text. Avoid using muted text on low-contrast backgrounds for essential information. Swatches auto-assign light/dark foreground for readability.

### Layout Recommendations
Use a max content width of 1280px for primary reading areas. Apply responsive horizontal padding that grows from `var(--sp-16)` on small screens, `var(--sp-24)` on tablets (≥768px), and `var(--sp-32)` on large screens (≥1280px). The header remains sticky for quick navigation.

### Live Preview
Visit `/style-guide` in the running application to view interactive swatches and specimens. Each swatch is focusable and keyboard accessible to validate focus ring visibility.

### Attribution
Brand colors are inspired by public references for demo purposes. They do not represent proprietary branding.

### Single Source of Truth
All token definitions live in: `src/styles/tokens.css`. Application styles must reference these CSS variables directly—no duplication, no magic numbers.