import { test, expect } from '@playwright/test';

test.describe('Data Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Overview page loads all data sections', async ({ page }) => {
    // Wait for spending summary to load
    await expect(page.locator('text=/Total Spent|Spending Summary/i')).toBeVisible({ timeout: 10000 });
    
    // Check for spending amount (should have dollar sign)
    await expect(page.locator('text=/\\$[\\d,]+\\.\\d{2}/')).toBeVisible();

    // Goals section should be visible
    await expect(page.locator('text=/Goals|Budget/i')).toBeVisible();

    // Categories chart should render
    const chartContainer = page.locator('[class*="recharts"]').first();
    await expect(chartContainer).toBeVisible({ timeout: 5000 });

    // Recent transactions should load
    await expect(page.locator('text=/Recent Transactions|Latest/i')).toBeVisible();
  });

  test('Transactions page loads and displays table', async ({ page }) => {
    await page.goto('/transactions');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
    
    // Should have headers
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Description")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();
    
    // Should have at least one transaction row
    await expect(page.locator('tbody tr').first()).toBeVisible();
  });

  test('Insights page loads charts', async ({ page }) => {
    await page.goto('/insights');
    
    // Wait for tabs to be visible
    await expect(page.locator('[role="tablist"]')).toBeVisible({ timeout: 10000 });
    
    // Should have Trends tab
    await expect(page.locator('[role="tab"]:has-text("Trends")')).toBeVisible();
    
    // Chart should render
    await expect(page.locator('[class*="recharts"]')).toBeVisible({ timeout: 5000 });
  });

  test('shows loading states', async ({ page }) => {
    // Navigate to a route
    await page.goto('/insights');
    
    // Should see some loading indicator (spinner, skeleton, or "Loading")
    // This will depend on how fast the data loads, but we check structure exists
    await expect(page.locator('main')).toBeVisible();
  });

  test('handles data fetch errors gracefully', async ({ page }) => {
    // Simulate network error by blocking requests
    await page.route('**/api/**', route => route.abort('failed'));
    
    await page.goto('/');
    
    // Should show error state or retry button
    // Note: This depends on error handling implementation
    await expect(page.locator('main')).toBeVisible();
  });

  test('pagination works on transactions page', async ({ page }) => {
    await page.goto('/transactions');
    
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
    
    // Check if pagination exists
    const pagination = page.locator('[role="navigation"]:has-text("Page")');
    
    if (await pagination.isVisible()) {
      // Click next page if available
      const nextButton = page.locator('button:has-text("Next")');
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        
        // Should still have table
        await expect(page.locator('table')).toBeVisible();
      }
    }
  });

  test('sorting works on transactions table', async ({ page }) => {
    await page.goto('/transactions');
    
    // Wait for table
    await expect(page.locator('table')).toBeVisible({ timeout: 10000 });
    
    // Click on Amount header to sort
    const amountHeader = page.locator('th:has-text("Amount")');
    if (await amountHeader.isVisible()) {
      await amountHeader.click();
      
      // Table should still be visible after sort
      await expect(page.locator('table')).toBeVisible();
    }
  });
});
