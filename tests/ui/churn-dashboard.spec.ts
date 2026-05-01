import { test, expect } from '@playwright/test';

test.describe('Churn Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página principal do dashboard
    await page.goto('/');
  });

  test('should render the Churn Analytics section', async ({ page }) => {
    const churnSection = page.locator('#churn-analytics');
    await expect(churnSection).toBeVisible();
    
    const header = churnSection.locator('h2', { hasText: 'Análise de Churn' });
    await expect(header).toBeVisible();
  });

  test('should display Churn KPI card and charts', async ({ page }) => {
    // A seção de Análise de Churn é expandida por padrão no estado do código
    const churnSection = page.locator('#churn-analytics');
    
    // Check for Churn Card
    const churnCard = churnSection.locator('text=Taxa de Churn');
    await expect(churnCard).toBeVisible();

    // Verificar a Tabela de Alunos em Risco
    const atRiskTable = churnSection.locator('text=Alunos em Risco');
    await expect(atRiskTable).toBeVisible();
  });

  test('should toggle the Churn module visibility', async ({ page }) => {
    const churnSection = page.locator('#churn-analytics');
    const toggleButton = churnSection.locator('button', { hasText: /Recolher|Expandir/ });
    
    // Initial state is expanded (button says "Recolher")
    await expect(toggleButton).toHaveText('Recolher');
    
    // Click to collapse
    await toggleButton.click();
    await expect(toggleButton).toHaveText('Expandir');
    
    // Content should be hidden (using text check as a proxy for the conditional render)
    const churnCard = churnSection.locator('text=Taxa de Churn');
    await expect(churnCard).not.toBeVisible();
  });
});
