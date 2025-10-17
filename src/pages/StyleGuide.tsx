import { useEffect, useState, createElement } from 'react';
import { contrastRatio } from '../lib/contrast';

interface TokenColor {
  name: string;
  var: string;
}

const colorTokens: TokenColor[] = [
  { name: 'Primary', var: '--color-primary' },
  { name: 'Accent', var: '--color-accent' },
  { name: 'Surface', var: '--color-surface' },
  { name: 'Border', var: '--color-border' },
  { name: 'Text', var: '--color-text' },
  { name: 'Muted', var: '--color-muted' },
];

type SampleElement = 'h1' | 'h2' | 'p';
const typographySamples: Array<{ label: string; element: SampleElement; style: Record<string, string> }> = [
  { label: 'H1', element: 'h1', style: { fontSize: 'var(--fs-24)', fontWeight: 'var(--fw-semibold)', lineHeight: 'var(--lh-tight)' } },
  { label: 'H2', element: 'h2', style: { fontSize: 'var(--fs-20)', fontWeight: 'var(--fw-semibold)', lineHeight: 'var(--lh-tight)' } },
  { label: 'Body', element: 'p', style: { fontSize: 'var(--fs-16)', fontWeight: 'var(--fw-regular)', lineHeight: 'var(--lh-normal)' } },
  { label: 'Caption', element: 'p', style: { fontSize: 'var(--fs-12)', fontWeight: 'var(--fw-medium)', lineHeight: 'var(--lh-tight)' } },
];

const spacingTokens = ['--sp-4', '--sp-8', '--sp-12', '--sp-16', '--sp-24', '--sp-32'];


export function StyleGuide() {
  const [resolvedColors, setResolvedColors] = useState<Record<string, string>>({});
  useEffect(() => {
    function collect() {
      const rootStyles = getComputedStyle(document.documentElement);
      const map: Record<string, string> = {};
      for (const t of colorTokens) {
        map[t.var] = rootStyles.getPropertyValue(t.var).trim();
      }
      setResolvedColors(map);
    }
    collect();
    document.addEventListener('themechange', collect);
    return () => document.removeEventListener('themechange', collect);
  }, []);

  return (
    <section aria-labelledby="style-guide-heading">
      <h2 id="style-guide-heading">Style Guide</h2>
      <p>Design tokens and baseline components preview.</p>

      <div className="sg-section">
        <h3>Colors</h3>
        <ul className="swatch-grid" aria-label="Color tokens">
          {colorTokens.map(token => {
            const hex = resolvedColors[token.var] || '#FFFFFF';
            const white = '#FFFFFF';
            // For "Text" token use inverse for evaluation (choose the opposite background surface for clarity)
            const textDefault = '#0B1F33';
            const textLight = textDefault;
            const ratioWhite = contrastRatio(hex, white);
            const ratioDarkText = contrastRatio(hex, textLight);
            // pick better contrast (>=4.5 preferred). If both pass choose higher ratio.
            let fg: string;
            if (ratioWhite >= 4.5 && ratioDarkText >= 4.5) {
              fg = ratioWhite >= ratioDarkText ? white : textLight;
            } else if (ratioWhite >= 4.5) {
              fg = white;
            } else if (ratioDarkText >= 4.5) {
              fg = textLight;
            } else {
              // fallback pick higher ratio even if <4.5 (shouldn't happen for curated palette)
              fg = ratioWhite >= ratioDarkText ? white : textLight;
            }
            const ratio = contrastRatio(hex, fg).toFixed(2);
            return (
              <li key={token.var}>
                <div
                  className="swatch"
                  style={{ background: `var(${token.var})`, color: fg }}
                  aria-label={`${token.name} color ${hex} foreground ${fg} contrast ${ratio}:1`}
                >
                  <span className="swatch-label">{token.name}</span>
                  <span className="swatch-value">{hex} · {ratio}:1</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sg-section">
        <h3>Typography</h3>
        <div className="type-scale" aria-label="Typography scale samples">
          {typographySamples.map(s => (
            createElement(s.element, { key: s.label, style: s.style, className: 'type-sample' }, `${s.label} – The quick brown fox jumps over the lazy dog.`)
          ))}
        </div>
      </div>

      <div className="sg-section">
        <h3>Spacing</h3>
        <div className="spacing-scale" aria-label="Spacing scale">
          {spacingTokens.map(st => (
            <div key={st} className="spacing-block" style={{ width: '100%', padding: `var(${st})` }}>
              <span>{st.replace('--sp-', '')} ({`var(${st})`})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="sg-section">
        <h3>Contrast Demo</h3>
        <div className="contrast-demos" aria-label="Contrast examples">
          {(() => {
            const root = getComputedStyle(document.documentElement);
            const primary = root.getPropertyValue('--color-primary').trim();
            const accent = root.getPropertyValue('--color-accent').trim();
            const white = '#FFFFFF';
            const ratioPrimary = contrastRatio(primary, white).toFixed(2);
            const ratioAccent = contrastRatio(accent, white).toFixed(2);
            return (
              <>
                <div className="contrast-chip contrast-chip--primary" aria-label={`White text on primary background contrast ratio ${ratioPrimary}`}>White on Primary · {ratioPrimary}:1</div>
                <div className="contrast-chip contrast-chip--accent" aria-label={`White text on accent background contrast ratio ${ratioAccent}`}>White on Accent · {ratioAccent}:1</div>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
export default StyleGuide;