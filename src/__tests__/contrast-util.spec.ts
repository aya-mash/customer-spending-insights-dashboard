import { describe, it, expect } from 'vitest';
import { relativeLuminance, contrastRatio, passesAA, passesAAA, isLargeTextNormal, isLargeTextBold } from '../lib/contrast';

describe('contrast utilities', () => {
  it('computes luminance', () => {
    const lumWhite = relativeLuminance('#FFFFFF');
    const lumBlack = relativeLuminance('#000000');
    expect(lumWhite).toBeGreaterThan(lumBlack);
  });
  it('calculates contrast ratio correctly', () => {
    const ratio = contrastRatio('#FFFFFF', '#000000');
    expect(ratio).toBeGreaterThan(20); // 21:1 exact, allow >20
  });
  it('validates AA and AAA', () => {
    const r = 4.6;
    expect(passesAA(r,false)).toBe(true);
    expect(passesAAA(r,false)).toBe(false);
    const largeRatio = 3.2;
    expect(passesAA(largeRatio,true)).toBe(true);
  });
  it('detects large text eligibility', () => {
    expect(isLargeTextNormal(24)).toBe(true);
    expect(isLargeTextNormal(23)).toBe(false);
    expect(isLargeTextBold(19)).toBe(true);
    expect(isLargeTextBold(18)).toBe(false);
  });
});
