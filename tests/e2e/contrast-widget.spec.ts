import { test, expect } from '@playwright/test';

test('contrast widget opens and calculates ratio', async ({ page }) => {
  await page.goto('/?contrastWidget=1');
  const fab = page.getByRole('button', { name: /open contrast checker/i });
  await fab.click();
  const dialog = page.getByRole('dialog', { name: /contrast checker/i });
  await expect(dialog).toBeVisible();
  const fgInput = dialog.getByLabel('Foreground color hex');
  await fgInput.fill('#FFFFFF');
  const bgInput = dialog.getByLabel('Background color hex');
  await bgInput.fill('#000000');
  const preview = dialog.getByLabel(/preview text contrast ratio/i);
  await expect(preview).toContainText(/21\.00:1/i);
});