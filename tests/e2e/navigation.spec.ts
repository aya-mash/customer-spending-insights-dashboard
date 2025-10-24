import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('navigates between all main routes', async ({ page }) => {
    // Should start on Overview
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Overview');

    // Navigate to Transactions
    await page.click('a[href="/transactions"]');
    await expect(page).toHaveURL('/transactions');
    await expect(page.locator('h1')).toContainText('Transactions');

    // Navigate to Insights
    await page.click('a[href="/insights"]');
    await expect(page).toHaveURL('/insights');
    await expect(page.locator('h1')).toContainText('Insights');

    // Navigate back to Overview
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Overview');
  });

  test('keyboard navigation works', async ({ page }) => {
    // Tab to skip link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();

    // Activate skip link
    await page.keyboard.press('Enter');
    
    // Main content should be focused
    const main = page.locator('main');
    await expect(main).toBeFocused();
  });

  test('navigation highlights active route', async ({ page }) => {
    // Overview should be active
    const overviewLink = page.locator('nav a[href="/"]');
    await expect(overviewLink).toHaveAttribute('aria-current', 'page');

    // Navigate to Transactions
    await page.click('a[href="/transactions"]');
    const transactionsLink = page.locator('nav a[href="/transactions"]');
    await expect(transactionsLink).toHaveAttribute('aria-current', 'page');
  });

  test('handles 404 for invalid routes', async ({ page }) => {
    await page.goto('/non-existent-route');
    await expect(page.locator('text=Page Not Found')).toBeVisible();
  });

  test('navigation is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigation should be visible and functional
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Should be able to navigate
    await page.click('a[href="/insights"]');
    await expect(page).toHaveURL('/insights');
  });
});
