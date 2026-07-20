import { test, expect } from '@playwright/test';

test.describe('Gerador de Proposta - Testes de Integridade E2E', () => {
  test('deve carregar a página inicial com preview vazio e preencher os dados corretamente', async ({ page }) => {
    // 1. Navega até a aplicação
    await page.goto('/');
    
    // Verifica a presença do título da navbar e preview principal
    await expect(page.locator('.brand-logo')).toContainText('Gerador de Proposta');
    await expect(page.locator('#proposal-document')).toContainText('PROPOSTA');

    // 2. Preenche os dados do imóvel no painel esquerdo
    // Abre a seção 1 (Dados do Imóvel)
    await page.click('text=1. Dados do Imóvel');
    
    // Preenche Empreendimento e Unidade
    await page.fill('input[placeholder="Nome do empreendimento"]', 'Residencial Bella Vista');
    await page.fill('input[placeholder="Identificação da unidade"]', 'Apto 101');
    
    // Preenche o valor total do imóvel
    await page.fill('input[placeholder="Valor da unidade (R$)"]', '50000000'); // equivale a R$ 500.000,00

    // 3. Verifica se as informações foram refletidas no preview da folha A4 instantaneamente
    const previewDoc = page.locator('#proposal-document');
    await expect(previewDoc).toContainText('Residencial Bella Vista');
    await expect(previewDoc).toContainText('Apto 101');
    await expect(previewDoc).toContainText('R$ 500.000,00');
  });

  test('deve cadastrar descrição no Sinal e exportar PDF com sucesso', async ({ page }) => {
    await page.goto('/');

    // Abre a seção 2 (Forma de Pagamento)
    await page.click('text=2. Forma de Pagamento');

    // Preenche a observação/descrição do Sinal
    await page.fill('input[placeholder="Observações (Ex: Na assinatura da proposta)"]', 'Entrada na assinatura do contrato de compra');

    // Verifica se a observação reativa apareceu no preview
    const previewDoc = page.locator('#proposal-document');
    await expect(previewDoc).toContainText('Observações:Entrada na assinatura do contrato de compra');

    // Intercepta e escuta o evento de download do PDF
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Exportar PDF")');
    const download = await downloadPromise;

    // Garante que o download foi concluído com sucesso e o arquivo é válido
    const filename = download.suggestedFilename();
    expect(filename).toContain('Proposta_');
    expect(filename.endsWith('.pdf')).toBe(true);

    const path = await download.path();
    expect(path).not.toBeNull();
  });

  test('deve alternar entre abas de Editor e Preview corretamente em dispositivos móveis', async ({ page }) => {
    // Define viewport móvel
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // 1. Em mobile, a barra de abas deve estar visível
    const tabsContainer = page.locator('.mobile-tabs');
    await expect(tabsContainer).toBeVisible();

    // 2. Aba padrão deve ser o Editor
    await expect(page.locator('.editor-wrapper')).toBeVisible();
    await expect(page.locator('.preview-wrapper-pane')).not.toBeVisible();

    // 3. Clica na aba "Visualizar PDF"
    await page.click('text=Visualizar PDF');

    // 4. Editor deve sumir e Preview deve aparecer
    await expect(page.locator('.editor-wrapper')).not.toBeVisible();
    await expect(page.locator('.preview-wrapper-pane')).toBeVisible();

    // 5. Clica de volta na aba "Editar Proposta"
    await page.click('text=Editar Proposta');
    await expect(page.locator('.editor-wrapper')).toBeVisible();
    await expect(page.locator('.preview-wrapper-pane')).not.toBeVisible();
  });
});
