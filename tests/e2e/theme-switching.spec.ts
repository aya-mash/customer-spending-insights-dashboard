import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('defaults to light theme', async ({ page }) => {
    // Check data-theme attribute
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('can switch to dark theme via settings', async ({ page }) => {
    // Open settings drawer
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    await settingsButton.click();
    
    // Wait for settings drawer to open
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    
    // Click dark theme button
    const darkButton = page.locator('button:has-text("Dark")');
    await darkButton.click();
    
    // Check theme changed
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    // Theme should persist in localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');
  });

  test('can switch to system theme', async ({ page }) => {
    // Open settings
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    await settingsButton.click();
    
    // Wait for drawer
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    
    // Click system theme button
    const systemButton = page.locator('button:has-text("System")');
    await systemButton.click();
    
    // localStorage should be cleared for system
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBeNull();
  });

  test('persists theme across page reloads', async ({ page }) => {
    // Set dark theme
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    await settingsButton.click();
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    
    const darkButton = page.locator('button:has-text("Dark")');
    await darkButton.click();
    
    // Reload page
    await page.reload();
    
    // Theme should still be dark
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('theme applies to all routes', async ({ page }) => {
    // Set dark theme
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    await settingsButton.click();
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    
    const darkButton = page.locator('button:has-text("Dark")');
    await darkButton.click();
    
    // Close settings drawer (click outside or press Escape)
    await page.keyboard.press('Escape');
    
    // Navigate to different routes
    await page.goto('/transactions');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    
    await page.goto('/insights');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('settings drawer closes on Escape key', async ({ page }) => {
    // Open settings
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    await settingsButton.click();
    
    // Wait for drawer
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Drawer should close
    await expect(page.locator('text=/Theme|Appearance/i')).not.toBeVisible({ timeout: 2000 });
  });

  test('theme buttons are keyboard accessible', async ({ page }) => {
    // Open settings
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    await settingsButton.click();
    
    // Wait for drawer
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    
    // Tab to dark button and activate with Enter
    await page.keyboard.press('Tab');
    const darkButton = page.locator('button:has-text("Dark")');
    
    // Focus dark button
    await darkButton.focus();
    await page.keyboard.press('Enter');
    
    // Theme should change
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});
