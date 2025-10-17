import { useState, useEffect, useMemo } from 'react';
import { contrastRatio, passesAA, passesAAA } from '../../lib/contrast';

interface Props { readonly onClose?: () => void }

// List of selectable CSS variables (user enters hex or chooses). We resolve computed value.
const TOKEN_VARS = [
  '--color-bg','--color-surface','--color-brand','--color-accent','--color-text','--color-text-muted'
];

function resolveVar(variable: string): string | null {
  try {
    const styles = getComputedStyle(document.documentElement);
    const value = styles.getPropertyValue(variable).trim();
    if (/^#?[0-9a-fA-F]{6}$/.test(value)) {
      return value.startsWith('#') ? value : `#${value}`;
    }
    return null;
  } catch { return null; }
}

function normalizeHex(input: string): string {
  const v = input.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toUpperCase();
  if (/^[0-9a-fA-F]{6}$/.test(v)) return `#${v.toUpperCase()}`;
  return '#000000';
}

export function ContrastCheckerPanel({ onClose }: Props) {
  const [fg, setFg] = useState('#FFFFFF');
  const [bg, setBg] = useState('#2F70EF');
  const [fgToken, setFgToken] = useState<string>('');
  const [bgToken, setBgToken] = useState<string>('');
  const [isLarge, setIsLarge] = useState(false);

  // Update hex when token selection changes
  useEffect(()=>{ if (fgToken) { const v = resolveVar(fgToken); if (v) setFg(v); } },[fgToken]);
  useEffect(()=>{ if (bgToken) { const v = resolveVar(bgToken); if (v) setBg(v); } },[bgToken]);

  const ratio = useMemo(()=> contrastRatio(fg,bg), [fg,bg]);
  const ratioStr = ratio.toFixed(2);
  const aa = passesAA(ratio, isLarge);
  const aaa = passesAAA(ratio, isLarge);

  function swap() {
    setFg(bg); setBg(fg); const oldFgToken = fgToken; setFgToken(bgToken); setBgToken(oldFgToken);
  }

  return (
    <dialog className="contrast-panel" aria-label="Contrast checker" open>
      <div className="contrast-panel-inner">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{margin:0}}>Contrast Checker</h3>
          <button type="button" aria-label="Close contrast checker" onClick={onClose}>✕</button>
        </div>
        <label>
          <span>Foreground color</span>
          <span>
            <input
              value={fg}
              onChange={e=>setFg(normalizeHex(e.target.value))}
              aria-label="Foreground color hex"
            />
          </span>
        </label>
        <label>
          <span>Foreground token</span>
          <span>
            <select
              value={fgToken}
              onChange={e=>setFgToken(e.target.value)}
              aria-label="Foreground token"
            >
              <option value="">(none)</option>
              {TOKEN_VARS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </span>
        </label>
        <label>
          <span>Background color</span>
          <span>
            <input
              value={bg}
              onChange={e=>setBg(normalizeHex(e.target.value))}
              aria-label="Background color hex"
            />
          </span>
        </label>
        <label>
          <span>Background token</span>
          <span>
            <select
              value={bgToken}
              onChange={e=>setBgToken(e.target.value)}
              aria-label="Background token"
            >
              <option value="">(none)</option>
              {TOKEN_VARS.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </span>
        </label>
        <label style={{flexDirection:'row', alignItems:'center', gap:'6px'}}>
          <span>Large text</span>
          <input
            type="checkbox"
            checked={isLarge}
            onChange={e=>setIsLarge(e.target.checked)}
            aria-label="Large text toggle"
          />
        </label>
        <div style={{display:'flex', gap:'8px', marginTop:'4px'}}>
          <button type="button" onClick={swap} aria-label="Swap foreground and background">Swap</button>
          <button type="button" onClick={()=>{ setFgToken(''); setBgToken(''); setFg('#FFFFFF'); setBg('#2F70EF'); setIsLarge(false); }} aria-label="Reset contrast checker">Reset</button>
        </div>
        <div className="contrast-preview" style={{background:bg,color:fg, fontSize: isLarge ? '24px':'16px'}} aria-label={`Preview text contrast ratio ${ratioStr}`}>Aa Ratio {ratioStr}:1</div>
        <p className="contrast-results">AA {aa ? 'Pass' : 'Fail'} · AAA {aaa ? 'Pass' : 'Fail'} (Large text threshold 3:1)</p>
        <p className="contrast-results" style={{marginTop:'4px'}}>Esc closes panel. Selecting a token resolves its current computed hex value.</p>
      </div>
    </dialog>
  );
}