/**
 * DESIGN SYSTEM EXPORTS TEST
 * Verifies all components are properly exported
 */

import { describe, it, expect } from 'vitest';
import * as DesignSystem from '../index';

describe('Design System Exports', () => {
  describe('Components', () => {
    it('exports Badge', () => {
      expect(DesignSystem.Badge).toBeDefined();
    });

    it('exports BottomNav', () => {
      expect(DesignSystem.BottomNav).toBeDefined();
    });

    it('exports Box', () => {
      expect(DesignSystem.Box).toBeDefined();
    });

    it('exports Button', () => {
      expect(DesignSystem.Button).toBeDefined();
    });

    it('exports Card', () => {
      expect(DesignSystem.Card).toBeDefined();
    });

    it('exports Divider', () => {
      expect(DesignSystem.Divider).toBeDefined();
    });

    it('exports DonutChart', () => {
      expect(DesignSystem.DonutChart).toBeDefined();
    });

    it('exports FilterChip', () => {
      expect(DesignSystem.FilterChip).toBeDefined();
    });

    it('exports Grid', () => {
      expect(DesignSystem.Grid).toBeDefined();
    });

    it('exports Heading', () => {
      expect(DesignSystem.Heading).toBeDefined();
    });

    it('exports MetricCard', () => {
      expect(DesignSystem.MetricCard).toBeDefined();
    });

    it('exports Navigation', () => {
      expect(DesignSystem.Navigation).toBeDefined();
    });

    it('exports PageLayout', () => {
      expect(DesignSystem.PageLayout).toBeDefined();
    });

    it('exports Pagination', () => {
      expect(DesignSystem.Pagination).toBeDefined();
    });

    it('exports Select', () => {
      expect(DesignSystem.Select).toBeDefined();
    });

    it('exports SettingsDrawer', () => {
      expect(DesignSystem.SettingsDrawer).toBeDefined();
    });

    it('exports Stack', () => {
      expect(DesignSystem.Stack).toBeDefined();
    });

    it('exports Table', () => {
      expect(DesignSystem.Table).toBeDefined();
    });

    it('exports Text', () => {
      expect(DesignSystem.Text).toBeDefined();
    });

    it('exports TextField', () => {
      expect(DesignSystem.TextField).toBeDefined();
    });
  });
});
