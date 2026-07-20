import html2pdf, { type Html2PdfOptions } from 'html2pdf.js';

export async function exportToPdf(filename: string = 'Proposta_Comercial.pdf'): Promise<void> {
  const element = document.getElementById('proposal-document');
  if (!element) {
    throw new Error('Elemento do documento da proposta não foi encontrado.');
  }

  // Aguarda o carregamento completo das fontes web (Inter/Outfit)
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Salva a posição de scroll do preview-pane para restaurar depois
  const previewPane = document.querySelector('.preview-pane') as HTMLElement | null;
  const savedScrollTop = previewPane?.scrollTop ?? 0;

  // Rola o preview para o topo para garantir captura correta
  if (previewPane) {
    previewPane.scrollTop = 0;
  }

  // Aguarda o layout recalcular após o scroll
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 150));

  const options: Html2PdfOptions = {
    margin: 0,
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
    },
  };

  try {
    element.classList.add('pdf-mode');
    await html2pdf().set(options).from(element).save();
  } finally {
    element.classList.remove('pdf-mode');
    // Restaura a posição de scroll original
    if (previewPane) {
      previewPane.scrollTop = savedScrollTop;
    }
  }
}
