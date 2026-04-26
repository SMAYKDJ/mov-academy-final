import { test, expect } from '@playwright/test';

test('audit all buttons and theme toggle', async ({ page }) => {
  await page.goto('https://academiamoviment.vercel.app/');

  console.log('Testing Theme Toggle...');
  const html = page.locator('html');
  const themeToggle = page.locator('button[aria-label*="modo"], button[aria-label*="tema"]');
  
  if (await themeToggle.count() > 0) {
    const initialClass = await html.getAttribute('class') || '';
    console.log(`Initial HTML class: "${initialClass}"`);
    
    await themeToggle.first().click();
    await page.waitForTimeout(500);
    const afterFirstClickClass = await html.getAttribute('class') || '';
    console.log(`Class after first click: "${afterFirstClickClass}"`);
    
    await themeToggle.first().click();
    await page.waitForTimeout(500);
    const afterSecondClickClass = await html.getAttribute('class') || '';
    console.log(`Class after second click: "${afterSecondClickClass}"`);
    
    if (initialClass === afterFirstClickClass) {
      console.error('❌ Theme toggle failed to change HTML class!');
    } else {
      console.log('✅ Theme toggle changed HTML class successfully.');
    }
  } else {
    console.warn('⚠️ Theme toggle button not found on landing page.');
  }

  console.log('Testing other buttons...');
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons.`);
  
  for (let i = 0; i < Math.min(buttons.length, 10); i++) {
    const btn = buttons[i];
    const text = await btn.innerText();
    const label = await btn.getAttribute('aria-label');
    console.log(`Clicking button ${i}: "${text || label || 'no text'}"`);
    try {
      await btn.click({ timeout: 2000 });
      await page.waitForTimeout(300);
    } catch (e) {
      console.log(`Button ${i} click failed or timed out (might be normal if it navigated away)`);
    }
  }
  
  await page.screenshot({ path: 'button_audit_result.png', fullPage: true });
});
