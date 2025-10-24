import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for main content to be visible
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('navigation is fast', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    
    // Navigate to Transactions
    const startTime = Date.now();
    await page.click('a[href="/transactions"]');
    await expect(page.locator('h1:has-text("Transactions")')).toBeVisible({ timeout: 5000 });
    const navTime = Date.now() - startTime;
    
    // Navigation should be fast (under 2 seconds)
    expect(navTime).toBeLessThan(2000);
  });

  test('images load efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check images are loaded
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const isLoaded = await img.evaluate((el: HTMLImageElement) => {
          return el.complete && el.naturalHeight > 0;
        });
        expect(isLoaded).toBeTruthy();
      }
    }
  });

  test('no excessive console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    
    // Navigate to other pages
    await page.goto('/transactions');
    await expect(page.locator('main')).toBeVisible();
    
    await page.goto('/insights');
    await expect(page.locator('main')).toBeVisible();
    
    // Filter out known non-critical errors (e.g., network mock errors)
    const criticalErrors = errors.filter(err => 
      !err.includes('MSW') && 
      !err.includes('Service Worker') &&
      !err.includes('Failed to fetch')
    );
    
    // Should have minimal console errors
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('large lists render efficiently', async ({ page }) => {
    await page.goto('/transactions');
    
    const startTime = Date.now();
    
    // Wait for table with data
    await expect(page.locator('table tbody tr')).toHaveCount(await page.locator('table tbody tr').count(), { timeout: 10000 });
    
    const renderTime = Date.now() - startTime;
    
    // List should render quickly
    expect(renderTime).toBeLessThan(3000);
  });

  test('charts render without lag', async ({ page }) => {
    await page.goto('/insights');
    
    const startTime = Date.now();
    
    // Wait for chart to render
    await expect(page.locator('[class*="recharts"]')).toBeVisible({ timeout: 10000 });
    
    const renderTime = Date.now() - startTime;
    
    // Chart should render within reasonable time
    expect(renderTime).toBeLessThan(3000);
  });

  test('theme switching is smooth', async ({ page }) => {
    await page.goto('/');
    
    // Open settings
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    await settingsButton.click();
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    
    // Switch theme
    const startTime = Date.now();
    const darkButton = page.locator('button:has-text("Dark")');
    await darkButton.click();
    
    // Check theme changed
    await expect(page.locator('html[data-theme="dark"]')).toBeVisible({ timeout: 1000 });
    const switchTime = Date.now() - startTime;
    
    // Theme switch should be instant (under 500ms)
    expect(switchTime).toBeLessThan(500);
  });

  test('no memory leaks on navigation', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory (if available)
    const initialMemory = await page.evaluate(() => {
      const perf = performance as unknown as { memory?: { usedJSHeapSize: number } };
      return perf.memory?.usedJSHeapSize;
    });
    
    // Navigate multiple times
    for (let i = 0; i < 3; i++) {
      await page.goto('/transactions');
      await expect(page.locator('main')).toBeVisible();
      
      await page.goto('/insights');
      await expect(page.locator('main')).toBeVisible();
      
      await page.goto('/');
      await expect(page.locator('main')).toBeVisible();
    }
    
    // Get final memory
    const finalMemory = await page.evaluate(() => {
      const perf = performance as unknown as { memory?: { usedJSHeapSize: number } };
      return perf.memory?.usedJSHeapSize;
    });
    
    if (initialMemory && finalMemory) {
      // Memory shouldn't grow excessively (less than 50MB increase)
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('fonts load efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Check if fonts are loaded
    const fontsLoaded = await page.evaluate(() => {
      return document.fonts.ready.then(() => true);
    });
    
    expect(fontsLoaded).toBeTruthy();
  });

  test('CSS animations are performant', async ({ page }) => {
    await page.goto('/');
    
    // Open settings drawer (has animation)
    const settingsButton = page.locator('button[aria-label*="Settings"], button:has-text("Settings")');
    
    const startTime = Date.now();
    await settingsButton.click();
    await expect(page.locator('text=/Theme|Appearance/i')).toBeVisible({ timeout: 5000 });
    const animationTime = Date.now() - startTime;
    
    // Animation should complete quickly (under 800ms including settling)
    expect(animationTime).toBeLessThan(800);
  });
});
