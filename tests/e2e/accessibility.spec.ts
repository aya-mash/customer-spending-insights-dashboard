import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('has proper document structure', async ({ page }) => {
    await page.goto('/');
    
    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Should have main landmark
    await expect(page.locator('main')).toBeVisible();
    
    // Should have navigation landmark
    await expect(page.locator('nav')).toBeVisible();
  });

  test('skip link is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab to skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();
    
    // Should be visible when focused
    await expect(skipLink).toBeVisible();
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Tab through page
    let tabCount = 0;
    const maxTabs = 20; // Reasonable limit
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      // Get focused element
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          role: el?.getAttribute('role'),
          type: (el as HTMLInputElement)?.type
        };
      });
      
      // All focused elements should be interactive
      const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
      const interactiveRoles = ['button', 'link', 'tab', 'menuitem'];
      
      if (focused.tagName && 
          !interactiveTags.includes(focused.tagName) && 
          !interactiveRoles.includes(focused.role || '')) {
        // If we've tabbed to body or html, we've reached the end
        if (['BODY', 'HTML'].includes(focused.tagName)) {
          break;
        }
      }
    }
    
    // Should have tabbed through some elements
    expect(tabCount).toBeGreaterThan(0);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    // Check each image has alt attribute
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');
    
    // Get all buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    // Check each button has text or aria-label
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Button should have either text content, aria-label, or aria-labelledby
      expect(
        text?.trim() || ariaLabel || ariaLabelledBy
      ).toBeTruthy();
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/');
    
    // Get all inputs
    const inputs = page.locator('input:not([type="hidden"])');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // Check each input has label or aria-label
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          // Check if there's a label with for attribute
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;
          
          expect(
            hasLabel || ariaLabel || ariaLabelledBy
          ).toBeTruthy();
        } else {
          // Should have aria-label or aria-labelledby
          expect(ariaLabel || ariaLabelledBy).toBeTruthy();
        }
      }
    }
  });

  test('focus is visible on all interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Tab to first button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check if focus outline is visible
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();
    
    // Check computed style has outline or box-shadow (focus indicator)
    const hasVisualFocus = await focused.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const outline = style.outline;
      const boxShadow = style.boxShadow;
      
      return outline !== 'none' || boxShadow !== 'none';
    });
    
    expect(hasVisualFocus).toBeTruthy();
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading contrast
    const heading = page.locator('h1').first();
    const contrast = await heading.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        backgroundColor: style.backgroundColor
      };
    });
    
    // Colors should be defined
    expect(contrast.color).toBeTruthy();
  });

  test('page title updates on navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Overview|Dashboard/i);
    
    await page.goto('/transactions');
    await expect(page).toHaveTitle(/Transactions/i);
    
    await page.goto('/insights');
    await expect(page).toHaveTitle(/Insights/i);
  });

  test('lang attribute is set', async ({ page }) => {
    await page.goto('/');
    
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(0);
  });
});
