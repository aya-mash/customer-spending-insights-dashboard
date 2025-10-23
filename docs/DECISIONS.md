# Architectural Decision Records (ADRs)

Lightweight decision log. Each ADR captures **why** a choice was made, not just **what** was chosen.

---

## ADR-0001: Neomorphic Design System over UI Libraries

**Context**: Need cohesive, accessible UI. MUI/Chakra offer components but enforce their aesthetic.

**Decision**: Build custom neomorphic design system from scratch.

**Rationale**:
- Full control over soft shadows, depth, lighting model
- Smaller bundle (no unused MUI components)
- Easier to meet WCAG AA with custom color tokens
- Design differentiation (unique visual identity)

**Trade-offs**: More initial dev time, but long-term flexibility and performance win.

---

## ADR-0002: Mobile Card List for Transactions (No Horizontal Scroll)

**Context**: Transactions table has 6+ columns. Horizontal scroll on mobile is poor UX.

**Decision**: Desktop = semantic table, Mobile = stacked cards (one transaction per card).

**Rationale**:
- Touch-friendly: cards are tappable, scrollable vertically
- Accessibility: screen readers handle card lists better than wide tables
- Prevents pinch-zoom and accidental column misalignment

**Implementation**: `useTheme().isMobile` toggles rendering mode in `Table.tsx`.

---

## ADR-0003: Runtime Theme Switching (CSS Custom Properties + Data Attributes)

**Context**: Users expect instant light/dark toggle without page reload.

**Decision**: CSS variables scoped by `data-theme` attribute, React context manages mode.

**Rationale**:
- No FOUC: pre-hydration script sets theme before React mounts
- Instant switching: CSS variables update immediately on attribute change
- System preference support: `data-mode="system"` tracks OS preference
- Avoids inline styles or CSS-in-JS recalculation overhead

**Trade-offs**: Requires careful CSS organization, but performance and UX benefits outweigh complexity.

---

## ADR-0004: No Automatic Retry on Failed Requests

**Context**: TanStack Query retries failed requests 3x by default. This causes flickering and confusing loading states.

**Decision**: `retry: false` in QueryClient config. Manual retry via UI button.

**Rationale**:
- User control: explicit "Try Again" button provides clarity
- Prevents "fail-then-succeed" Flash of Error (FoE)
- Better for transient network issues: user knows to retry
- Aligns with skeleton → data → error → manual retry UX flow

**Implementation**: `QueryClient` default options + retry buttons in error states.

---

## ADR-0005: Server-Side Pagination for Transactions

**Context**: Transaction list can grow to 1000+ rows. Client-side pagination loads all data upfront.

**Decision**: Backend returns paginated results. Frontend requests page + page size.

**Rationale**:
- Performance: only fetch visible rows
- Scalability: works with millions of transactions
- Sorting/filtering efficiency: server handles heavy computation

**Trade-offs**: Requires backend pagination API. Offline capability limited.

**Future**: Consider virtualization (react-window) for very long pages.

---

## ADR-0006: AWS Amplify Authenticator for Auth UI

**Context**: Need sign-up, sign-in, password reset, MFA support. Custom auth forms take weeks.

**Decision**: Use `@aws-amplify/ui-react` Authenticator component with theming.

**Rationale**:
- Built-in accessibility, mobile responsive, i18n support
- Integrates with AWS Cognito out of the box
- Themeable via CSS custom properties (matches neomorphic design)
- Reduces auth-related security bugs (battle-tested by AWS)

**Implementation**: Wrapped in `ThemedAuthenticator` with custom logo and styles.

---

**Adding New ADRs**: Follow format above. Keep to ≤10 lines per decision. Focus on **why**, not implementation details.
