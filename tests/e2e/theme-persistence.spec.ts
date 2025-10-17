import { test, expect } from '@playwright/test';

test('theme persists after reload', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /switch to dark theme/i });
  await toggle.click();
  await page.reload();
  // After switching to dark, aria-label becomes switch to light theme.
  await expect(page.getByRole('button', { name: /switch to light theme/i })).toBeVisible();
});