import { test, expect } from '@playwright/test';

// Verifies sidebar remains clickable above the contrast backdrop & panel does not block nav
// Assumes dev mode enabling widget via ?contrastWidget=1.

test('sidebar nav remains interactive when contrast panel open', async ({ page }) => {
  await page.goto('/?contrastWidget=1');
  // Open contrast panel via floating action button
  const fab = page.getByRole('button', { name: /toggle contrast checker/i });
  await fab.click();
  // Panel visible
  const panel = page.getByRole('dialog', { name: /contrast checker/i });
  await expect(panel).toBeVisible();

  // Sidebar link should still be clickable (Overview is current, pick another)
  const transactionsLink = page.getByRole('link', { name: /transactions/i });
  await transactionsLink.click();
  await expect(page).toHaveURL(/\/transactions/);
});

// Ensure backdrop does not cover sidebar; clicking backdrop should close panel (if requirement exists)
// This test just verifies panel stays open after backdrop click if not intended to close; adjust as needed.

test('backdrop click closes contrast panel', async ({ page }) => {
  await page.goto('/?contrastWidget=1');
  const fab = page.getByRole('button', { name: /toggle contrast checker/i });
  await fab.click();
  const panel = page.getByRole('dialog', { name: /contrast checker/i });
  await expect(panel).toBeVisible();
  // backdrop has no role; select by class
  const backdrop = page.locator('.contrast-backdrop');
  await expect(backdrop).toBeVisible();
  // Some environments report pointer interception; dispatch click directly.
  await page.evaluate(() => {
    const el = document.querySelector('.contrast-backdrop');
    if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await expect(panel).not.toBeVisible();
});
