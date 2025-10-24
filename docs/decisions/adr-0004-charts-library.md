# ADR-0004: Charts Library - Recharts

**Status**: Accepted  
**Date**: 2024-11-16

## Context

Need interactive charts (donut, line) with responsive design, accessibility support, and React integration. Must handle real-time data updates and theming.

## Decision

Chosen **Recharts 3.3** over Chart.js, Victory, and custom Canvas implementation.

## Rationale

**Why Recharts?**

- Declarative React components (`<PieChart>`, `<LineChart>`)
- Built on D3 (battle-tested SVG generation)
- Responsive containers with automatic resizing
- Animation support with reduced-motion respect
- TypeScript support

**Alternatives Rejected**:

- **Chart.js**: Imperative API, poor React integration, ref management
- **Victory**: Larger bundle (150KB vs. Recharts 100KB), slower updates
- **Custom Canvas**: 2-3 weeks development time, accessibility challenges

## Trade-offs

**Advantages**:

- ✅ Declarative syntax matches React patterns
- ✅ Interactive tooltips and click handlers out of box
- ✅ Theme integration via CSS variables
- ✅ Accessibility: SVG with proper ARIA labels

**Disadvantages**:

- ❌ 100KB gzipped bundle cost
- ❌ Performance issues with >1000 data points (not a concern for our use case)
- ❌ Some customization requires low-level D3 knowledge

## Implementation

### Donut Chart with Interaction

```typescript
<PieChart>
  <Pie
    data={categories}
    innerRadius={80}
    outerRadius={120}
    onClick={(data) => navigate(`/transactions?category=${data.name}`)}
  />
  <Tooltip content={<CustomTooltip />} />
</PieChart>
```

### Lazy Loading

```typescript
// Reduce initial bundle
const TrendsChart = lazy(() => import("./TrendsChart"));
```

### Theme Integration

```typescript
// Use CSS variables for colors
const chartColors = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
};
```

## Bundle Impact

| Library       | Size (gzipped) | Lazy-loaded?            |
| ------------- | -------------- | ----------------------- |
| Recharts core | ~100KB         | ❌ (used in Overview)   |
| TrendsChart   | ~20KB          | ✅ (Insights page only) |

**Mitigation**: Charts lazy-loaded at route level, not on initial page load.

## Performance Considerations

- Use `isAnimationActive={!reducedMotion}` for accessibility
- Limit data points (max 50 categories, 24 months)
- Debounce window resize events in `ResponsiveContainer`

## Accessibility

```typescript
<PieChart aria-label="Category spending breakdown">
  <Pie aria-describedby="donut-summary" />
</PieChart>
<div id="donut-summary" className="sr-only">
  Top category: Groceries at R 4,230 (34% of total)
</div>
```

## Future Considerations

- Evaluate Tremor (Recharts wrapper) for opinionated defaults
- Consider Visx (Airbnb) if need more control
- Monitor bundle size; if >150KB, explore tree-shaking

## Last Updated

December 2024
