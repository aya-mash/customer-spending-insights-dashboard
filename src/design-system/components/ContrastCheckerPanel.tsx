/**
 * CONTRAST CHECKER PANEL - Soft Modern Design
 * WCAG contrast ratio validator with modern UI
 */

import { useState, useMemo, type CSSProperties } from 'react';
import { contrastRatio, passesAA, passesAAA } from '../../lib/contrast';
import { radius, spacing, spacingNum, transition, easing } from '../tokens';
import { useTheme } from '../index';
import { X, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface Props { readonly onClose?: () => void }

const TOKEN_VARS = [
  '--color-bg','--color-surface','--brand-primary','--color-accent','--color-text','--color-text-muted'
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
  const { surface, text: textColors, brand } = useTheme();
  
  const [fgInput, setFgInput] = useState('#FFFFFF');
  const [bgInput, setBgInput] = useState('#2F70EF');
  const [fgToken, setFgToken] = useState<string>('');
  const [bgToken, setBgToken] = useState<string>('');
  const [isLarge, setIsLarge] = useState(false);

  // Derive hex from token or use input value
  const fg = useMemo(() => {
    if (fgToken) {
      const v = resolveVar(fgToken);
      return v || fgInput;
    }
    return fgInput;
  }, [fgToken, fgInput]);

  const bg = useMemo(() => {
    if (bgToken) {
      const v = resolveVar(bgToken);
      return v || bgInput;
    }
    return bgInput;
  }, [bgToken, bgInput]);

  const ratio = useMemo(()=> contrastRatio(fg,bg), [fg,bg]);
  const ratioStr = ratio.toFixed(2);
  const aa = passesAA(ratio, isLarge);
  const aaa = passesAAA(ratio, isLarge);

  function swap() {
    const oldFgInput = fgInput;
    const oldFgToken = fgToken;
    setFgInput(bgInput);
    setBgInput(oldFgInput);
    setFgToken(bgToken);
    setBgToken(oldFgToken);
  }

  const panelStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: surface.surface,
    borderRadius: radius.xl,
    boxShadow: 'var(--shadow-neumorphic-sm)',
    padding: spacing[6],
    width: '90%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto',
    zIndex: 1400,
    border: `1px solid ${surface.border}`,
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[5],
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: textColors.primary,
  };

  const closeButtonStyle: CSSProperties = {
    background: 'transparent',
    border: 'none',
    padding: spacing[2],
    cursor: 'pointer',
    borderRadius: radius.md,
    color: textColors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all ${transition.fast} ${easing.standard}`,
  };

  const labelStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
    marginBottom: spacing[4],
  };

  const labelTextStyle: CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: textColors.secondary,
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
    borderRadius: radius.md,
    border: `1px solid ${surface.border}`,
    backgroundColor: surface.surface,
    color: textColors.primary,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: `all ${transition.fast} ${easing.standard}`,
  };

  const buttonStyle: CSSProperties = {
    padding: `${spacingNum[3]}px ${spacingNum[4]}px`,
    borderRadius: radius.md,
    border: `1px solid ${surface.border}`,
    backgroundColor: surface.surface,
    color: textColors.primary,
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[2],
    transition: `all ${transition.fast} ${easing.standard}`,
    fontFamily: 'inherit',
  };

  const previewStyle: CSSProperties = {
    background: bg,
    color: fg,
    fontSize: isLarge ? '24px' : '16px',
    padding: spacing[6],
    borderRadius: radius.lg,
    textAlign: 'center',
    fontWeight: 600,
    marginTop: spacing[5],
    marginBottom: spacing[4],
    border: `2px solid ${surface.border}`,
  };

  const resultItemStyle = (passed: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: radius.md,
    backgroundColor: passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: passed ? '#059669' : '#DC2626',
    fontSize: '14px',
    fontWeight: 500,
  });

  return (
    <dialog style={panelStyle} aria-label="Contrast checker" open>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Contrast Checker</h3>
        <button
          type="button"
          style={closeButtonStyle}
          aria-label="Close contrast checker"
          onClick={onClose}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = surface.hover;
            e.currentTarget.style.color = textColors.primary;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = textColors.secondary;
          }}
        >
          <X size={20} />
        </button>
      </div>

      <label style={labelStyle}>
        <span style={labelTextStyle}>Foreground Color</span>
        <input
          style={inputStyle}
          value={fg}
          onChange={e=>setFgInput(normalizeHex(e.target.value))}
          aria-label="Foreground color hex"
          onFocus={e => e.currentTarget.style.borderColor = brand.primary}
          onBlur={e => e.currentTarget.style.borderColor = surface.border}
        />
      </label>

      <label style={labelStyle}>
        <span style={labelTextStyle}>Foreground Token</span>
        <select
          style={inputStyle}
          value={fgToken}
          onChange={e=>setFgToken(e.target.value)}
          aria-label="Foreground token"
          onFocus={e => e.currentTarget.style.borderColor = brand.primary}
          onBlur={e => e.currentTarget.style.borderColor = surface.border}
        >
          <option value="">(none)</option>
          {TOKEN_VARS.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </label>

      <label style={labelStyle}>
        <span style={labelTextStyle}>Background Color</span>
        <input
          style={inputStyle}
          value={bg}
          onChange={e=>setBgInput(normalizeHex(e.target.value))}
          aria-label="Background color hex"
          onFocus={e => e.currentTarget.style.borderColor = brand.primary}
          onBlur={e => e.currentTarget.style.borderColor = surface.border}
        />
      </label>

      <label style={labelStyle}>
        <span style={labelTextStyle}>Background Token</span>
        <select
          style={inputStyle}
          value={bgToken}
          onChange={e=>setBgToken(e.target.value)}
          aria-label="Background token"
          onFocus={e => e.currentTarget.style.borderColor = brand.primary}
          onBlur={e => e.currentTarget.style.borderColor = surface.border}
        >
          <option value="">(none)</option>
          {TOKEN_VARS.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </label>

      <label style={{display:'flex', alignItems:'center', gap: spacing[2], marginBottom: spacing[4]}}>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e=>setIsLarge(e.target.checked)}
          aria-label="Large text toggle"
        />
        <span style={{fontSize:'14px', color: textColors.primary}}>Large text (≥18px / ≥14px bold)</span>
      </label>

      <div style={{display:'flex', gap: spacing[3], marginBottom: spacing[5]}}>
        <button
          type="button"
          style={buttonStyle}
          onClick={swap}
          aria-label="Swap foreground and background"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = surface.hover;
            e.currentTarget.style.borderColor = brand.primary;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = surface.surface;
            e.currentTarget.style.borderColor = surface.border;
          }}
        >
          <RefreshCw size={16} /> Swap
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={()=>{ setFgToken(''); setBgToken(''); setFgInput('#FFFFFF'); setBgInput('#2F70EF'); setIsLarge(false); }}
          aria-label="Reset contrast checker"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = surface.hover;
            e.currentTarget.style.borderColor = brand.primary;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = surface.surface;
            e.currentTarget.style.borderColor = surface.border;
          }}
        >
          Reset
        </button>
      </div>

      <div style={previewStyle} aria-label={`Preview text contrast ratio ${ratioStr}`}>
        Aa
        <div style={{fontSize:'16px', marginTop: spacing[2], fontWeight: 500}}>
          Ratio {ratioStr}:1
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap: spacing[2]}}>
        <div style={resultItemStyle(aa)}>
          {aa ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>WCAG AA {aa ? 'Pass' : 'Fail'} (≥{isLarge ? '3' : '4.5'}:1)</span>
        </div>
        <div style={resultItemStyle(aaa)}>
          {aaa ? <Check size={18} /> : <AlertCircle size={18} />}
          <span>WCAG AAA {aaa ? 'Pass' : 'Fail'} (≥{isLarge ? '4.5' : '7'}:1)</span>
        </div>
      </div>

      <p style={{fontSize:'12px', color: textColors.muted, marginTop: spacing[4], marginBottom: 0}}>
        Press Esc to close. Selecting a token resolves its computed value.
      </p>
    </dialog>
  );
}