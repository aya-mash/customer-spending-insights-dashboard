import { test, expect } from '@playwright/test';

test('theme persists after reload', async ({ page }) => {
  await page.goto('/');
  // Open settings drawer
  const settingsBtn = page.getByRole('button', { name: /settings/i });
  await settingsBtn.click();
  // Select Dark mode radio
  const darkRadio = page.getByRole('radio', { name: /dark/i });
  await darkRadio.click();
  // Close settings (ESC or close button)
  const closeBtn = page.getByRole('button', { name: /close settings panel/i });
  await closeBtn.click();
  // Reload and verify persistence: html[data-theme="dark"] OR dark radio active again
  await page.reload();
  await settingsBtn.click();
  const darkRadioAfter = page.getByRole('radio', { name: /dark/i });
  await expect(darkRadioAfter).toHaveAttribute('aria-checked', 'true');
});