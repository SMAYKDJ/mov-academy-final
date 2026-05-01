// tests/ui/button_test.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Platform UI Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://academiamoviment.vercel.app/');
    // Aguarde o carregamento do dashboard principal
    await page.waitForLoadState('networkidle');
  });

  test('Theme toggle switches dark/light mode', async ({ page }) => {
    // Garantir tema inicial (claro) - body deve ter bg claro
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
    // Click theme button
    const toggle = page.locator('button[aria-label*="escuro"], button[aria-label*="claro"]');
    await toggle.click();
    // Após o clique, a classe dark deve estar presente
    await expect(html).toHaveClass(/dark/);
    // Clique novamente para reverter
    await toggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('Sidebar navigation links work', async ({ page }) => {
    const links = page.locator('nav a'); // assuming nav links
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      if (!href) continue;
      await Promise.all([
        page.waitForNavigation({ url: new RegExp(href) }),
        link.click()
      ]);
      // Verify URL contains expected path
      await expect(page).toHaveURL(new RegExp(href));
      // Voltar ao dashboard para a próxima iteração
      await page.goto('https://academiamoviment.vercel.app/');
    }
  });

  test('Churn dashboard action buttons respond', async ({ page }) => {
    // Navigate to churn analytics section if needed
    const churnSection = page.locator('#churn-analytics');
    await expect(churnSection).toBeVisible();
    // Intervene button inside at-risk table first row
    const interveneBtn = page.locator('button:has-text("Intervir")').first();
    if (await interveneBtn.isVisible()) {
      await interveneBtn.click();
      // Expect toast appears
      const toast = page.locator('div[role="alert"]');
      await expect(toast).toBeVisible();
    }
    // Message button
    const messageBtn = page.locator('button:has-text("Enviar mensagem")').first();
    if (await messageBtn.isVisible()) {
      await messageBtn.click();
      const toast = page.locator('div[role="alert"]');
      await expect(toast).toBeVisible();
    }
  });
});
