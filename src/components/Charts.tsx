import type { ReactElement } from 'react';

// Placeholder chart area; future implementation can render Recharts components lazily.
export function Charts(): ReactElement {
  return (
    <div aria-label="Charts area" style={{display:'grid', gap:'16px', marginTop:'12px'}}>
      <div style={{background:'var(--color-surface)', padding:'12px', borderRadius:'8px'}}>Chart placeholder A</div>
      <div style={{background:'var(--color-surface)', padding:'12px', borderRadius:'8px'}}>Chart placeholder B</div>
    </div>
  );
}
export default Charts;