import React, { useState } from 'react';
import { Download, RotateCcw, FileCheck2, Loader2 } from 'lucide-react';
import { exportToPdf } from '../../utils/pdfExporter';
import type { Proposal } from '../../types/proposal';

interface Props {
  proposal: Proposal;
  onReset: () => void;
}

export const Header: React.FC<Props> = ({ proposal, onReset }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const headerSec = proposal.sections.find((s) => s.type === 'header');
      const clientName = (headerSec as any)?.clientCompany || (headerSec as any)?.clientName || 'Proposta';
      const cleanName = clientName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Proposta_${cleanName}.pdf`;

      await exportToPdf(filename);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao exportar o PDF. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetConfirm = () => {
    if (window.confirm('Deseja realmente reiniciar e limpar os dados da proposta atual?')) {
      onReset();
    }
  };

  return (
    <header className="top-navbar">
      <div className="brand-logo">
        <FileCheck2 size={24} color="#3b82f6" />
        <span>Gerador de Proposta</span>
        <span className="brand-badge">A4 Live</span>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleResetConfirm}
          title="Limpar e Reiniciar Proposta"
        >
          <RotateCcw size={16} /> Limpar
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Exportando PDF...
            </>
          ) : (
            <>
              <Download size={16} /> Exportar PDF
            </>
          )}
        </button>
      </div>
    </header>
  );
};
