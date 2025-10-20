# Accessibility Guide

## WCAG Compliance Standards

### Target Level: AA Compliance
- **Contrast**: ≥4.5:1 for normal text, ≥3:1 for large text (≥24px or ≥19px bold)
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper semantic markup and ARIA labels
- **Focus Management**: Visible focus indicators and logical tab order

### Testing Tools
- **axe DevTools**: Automated accessibility scanning
- **NVDA/JAWS**: Screen reader testing
- **Keyboard Only**: Navigation without mouse
- **Lighthouse**: Accessibility audit scoring

## Keyboard Navigation

### Implementation Standards
```typescript
// Focus management for modals
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement>();
  
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="modal"
    >
      {children}
    </div>
  );
}
```

### Focus Indicators
```css
/* Visible focus indicators */
.button:focus-visible,
.link:focus-visible,
.input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove mouse-only focus */
.button:focus:not(:focus-visible) {
  outline: none;
}

/* High contrast focus */
@media (prefers-contrast: high) {
  .button:focus-visible {
    outline-width: 3px;
    outline-color: var(--color-focus-high-contrast);
  }
}
```

### Tab Order Management
```typescript
// Skip navigation link
function SkipNav() {
  return (
    <a 
      href="#main-content" 
      className="skip-nav"
      onFocus={(e) => e.target.classList.add('visible')}
      onBlur={(e) => e.target.classList.remove('visible')}
    >
      Skip to main content
    </a>
  );
}

// Roving tabindex for complex widgets
function TabList({ tabs, activeTab, onTabChange }) {
  const [focusedTab, setFocusedTab] = useState(activeTab);
  
  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
        setFocusedTab(prevIndex);
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
        setFocusedTab(nextIndex);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onTabChange(index);
        break;
    }
  };
  
  return (
    <div role="tablist" className="tab-list">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          role="tab"
          tabIndex={focusedTab === index ? 0 : -1}
          aria-selected={activeTab === index}
          aria-controls={`panel-${tab.id}`}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onClick={() => onTabChange(index)}
          className="tab"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

## Screen Reader Support

### Semantic Markup
```typescript
// Proper heading hierarchy
function DashboardPage() {
  return (
    <main id="main-content">
      <h1>Spending Dashboard</h1>
      
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading">Overview</h2>
        {/* Overview content */}
      </section>
      
      <section aria-labelledby="insights-heading">
        <h2 id="insights-heading">Insights</h2>
        {/* Insights content */}
      </section>
    </main>
  );
}
```

### ARIA Labels and Descriptions
```typescript
// Chart accessibility
function DonutChart({ data, title }) {
  const chartId = useId();
  const descId = `${chartId}-desc`;
  
  const description = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const largest = data.reduce((max, item) => 
      item.value > max.value ? item : max
    );
    
    return `Spending breakdown: ${data.length} categories totaling ${formatCurrency(total)}. Largest category is ${largest.name} at ${formatCurrency(largest.value)} (${((largest.value / total) * 100).toFixed(1)}%).`;
  }, [data]);
  
  return (
    <div className="chart-container">
      <h3 id={chartId}>{title}</h3>
      <div 
        role="img" 
        aria-labelledby={chartId}
        aria-describedby={descId}
      >
        <PieChart data={data} />
      </div>
      <div id={descId} className="sr-only">
        {description}
      </div>
      
      {/* Data table alternative */}
      <details className="chart-data-table">
        <summary>View data table</summary>
        <table>
          <caption>Spending breakdown by category</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
              <th scope="col">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{formatCurrency(item.value)}</td>
                <td>{((item.value / total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
```

### Live Regions
```typescript
// Status announcements
function StatusAnnouncer() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState(0);
  
  const announce = useCallback((text: string, priority: 'polite' | 'assertive' = 'polite') => {
    setMessage(text);
    setKey(prev => prev + 1);
  }, []);
  
  return (
    <>
      <div 
        key={key}
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {message}
      </div>
      <StatusContext.Provider value={{ announce }}>
        {children}
      </StatusContext.Provider>
    </>
  );
}

// Usage in components
function TransactionFilter() {
  const { announce } = useStatus();
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const count = getFilteredCount(newFilters);
    announce(`Filter applied. Showing ${count} transactions.`);
  };
  
  return (
    <FilterControls onChange={handleFilterChange} />
  );
}
```

## Color and Contrast

### Design Token Implementation
```css
/* Color tokens with contrast ratios */
:root {
  /* Primary colors - 4.5:1 on white */
  --color-primary-600: #1d4ed8; /* 4.52:1 */
  --color-primary-700: #1e40af; /* 5.74:1 */
  
  /* Text colors */
  --color-text-primary: #111827;   /* 16.11:1 on white */
  --color-text-secondary: #6b7280; /* 4.54:1 on white */
  --color-text-tertiary: #9ca3af;  /* 3.21:1 on white - large text only */
  
  /* Status colors */
  --color-success: #16a34a; /* 4.52:1 */
  --color-warning: #ea580c; /* 4.51:1 */
  --color-error: #dc2626;   /* 5.24:1 */
}

/* Dark theme tokens */
[data-theme="dark"] {
  --color-text-primary: #f9fafb;   /* 18.7:1 on dark */
  --color-text-secondary: #d1d5db; /* 11.2:1 on dark */
  --color-text-tertiary: #9ca3af;  /* 5.8:1 on dark */
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-text-secondary: #000000;
    --color-border: #000000;
  }
  
  [data-theme="dark"] {
    --color-text-primary: #ffffff;
    --color-text-secondary: #ffffff;
    --color-border: #ffffff;
  }
}
```

### Contrast Validation
```typescript
// Runtime contrast checking
export function validateContrast(foreground: string, background: string): {
  ratio: number;
  aaSmall: boolean;
  aaLarge: boolean;
  aaaSmall: boolean;
  aaaLarge: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  
  return {
    ratio,
    aaSmall: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaSmall: ratio >= 7,
    aaaLarge: ratio >= 4.5
  };
}

// Development-only contrast checker
function ContrastChecker() {
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#ffffff');
  
  const result = validateContrast(foreground, background);
  
  if (!import.meta.env.DEV) return null;
  
  return (
    <div className="contrast-checker">
      <input 
        type="color" 
        value={foreground} 
        onChange={(e) => setForeground(e.target.value)}
        aria-label="Foreground color"
      />
      <input 
        type="color" 
        value={background} 
        onChange={(e) => setBackground(e.target.value)}
        aria-label="Background color"
      />
      
      <div className="contrast-results">
        <div>Ratio: {result.ratio.toFixed(2)}:1</div>
        <div>AA Small: {result.aaSmall ? '✓' : '✗'}</div>
        <div>AA Large: {result.aaLarge ? '✓' : '✗'}</div>
      </div>
    </div>
  );
}
```

## Form Accessibility

### Labels and Descriptions
```typescript
function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  return (
    <form>
      <div className="form-field">
        <label htmlFor="amount">Transaction Amount</label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          aria-describedby="amount-help amount-error"
          aria-invalid={!!errors.amount}
          required
        />
        <div id="amount-help" className="help-text">
          Enter the transaction amount in rands
        </div>
        {errors.amount && (
          <div id="amount-error" className="error-text" role="alert">
            {errors.amount}
          </div>
        )}
      </div>
      
      <fieldset>
        <legend>Transaction Category</legend>
        {categories.map(category => (
          <label key={category.id} className="radio-label">
            <input 
              type="radio" 
              name="category" 
              value={category.id}
              aria-describedby={`category-${category.id}-desc`}
            />
            {category.name}
            <div id={`category-${category.id}-desc`} className="category-desc">
              {category.description}
            </div>
          </label>
        ))}
      </fieldset>
    </form>
  );
}
```

### Error Handling
```typescript
// Accessible error announcements
function FormErrorHandler({ errors }: { errors: Record<string, string> }) {
  const errorCount = Object.keys(errors).length;
  const errorMessage = errorCount > 0 
    ? `Form has ${errorCount} error${errorCount === 1 ? '' : 's'}. Please review and correct.`
    : '';
  
  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className={errorCount > 0 ? 'error-summary' : 'sr-only'}
    >
      {errorMessage}
      {errorCount > 0 && (
        <ul>
          {Object.entries(errors).map(([field, error]) => (
            <li key={field}>
              <a href={`#${field}`}>{error}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Motion and Animation

### Reduced Motion Support
```css
/* Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Safe animations for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
    opacity: 1;
  }
  
  .slide-in {
    animation: none;
    transform: none;
  }
}
```

### Animation Implementation
```typescript
// Respect motion preferences
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
}

// Conditional animations
function AnimatedComponent({ children }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div 
      className={`animated-container ${prefersReducedMotion ? 'no-motion' : 'with-motion'}`}
    >
      {children}
    </div>
  );
}
```

## Testing Accessibility

### Automated Testing
```typescript
// axe-core integration
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Dashboard Accessibility', () => {
  test('should not have accessibility violations', async () => {
    render(<Dashboard />);
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
  
  test('keyboard navigation works', () => {
    render(<Navigation />);
    
    // Tab through navigation
    userEvent.tab();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveFocus();
    
    userEvent.tab();
    expect(screen.getByRole('link', { name: 'Insights' })).toHaveFocus();
  });
});
```

### Manual Testing Checklist
- [ ] Keyboard-only navigation works
- [ ] Screen reader announces content correctly
- [ ] Focus indicators are visible
- [ ] Color contrast meets AA standards
- [ ] Text scales to 200% without horizontal scrolling
- [ ] Motion respects user preferences
- [ ] Form errors are announced
- [ ] Charts have text alternatives

## Accessibility Checklist

### Pre-deployment
- [ ] axe DevTools scan passes
- [ ] Keyboard navigation tested
- [ ] Screen reader testing completed
- [ ] Contrast validation performed
- [ ] Motion preferences respected

### Ongoing Monitoring
- [ ] Accessibility CI checks configured
- [ ] Regular user testing with disabilities
- [ ] Accessibility feedback mechanism
- [ ] Team accessibility training
- [ ] Design system accessibility guidelines