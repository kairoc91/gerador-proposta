import html2pdf, { type Html2PdfOptions } from 'html2pdf.js';

export async function exportToPdf(filename: string = 'Proposta_Comercial.pdf'): Promise<void> {
  const element = document.getElementById('proposal-document');
  if (!element) {
    throw new Error('Elemento do documento da proposta não foi encontrado.');
  }

  const options: Html2PdfOptions = {
    margin: [8, 8, 8, 8],
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

  await html2pdf().set(options).from(element).save();
}
