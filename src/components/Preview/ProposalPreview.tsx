import React, { useState, useEffect } from 'react';
import type {
  Proposal,
  HeaderSection,
  PropertyItem,
} from '../../types/proposal';
import {
  parseCurrencyToNumber,
  formatNumberToCurrency,
  sortPricingItems,
  getPricingItemTotal,
} from '../../utils/defaults';

interface Props {
  proposal: Proposal;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export const ProposalPreview: React.FC<Props> = ({ proposal, previewRef }) => {
  const headerSec = proposal.sections.find((s) => s.type === 'header') as HeaderSection | undefined;

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        // Mobile view - scale down based on container margins
        const newScale = Math.min(1, (width - 32) / 794);
        setScale(newScale);
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const brokerParts: string[] = [];
  if (headerSec?.brokerName) brokerParts.push(`${headerSec.brokerName}`);
  if (headerSec?.brokerCreci) brokerParts.push(`CRECI ${headerSec.brokerCreci}`);
  if (headerSec?.brokerPhone) brokerParts.push(`Contato: ${headerSec.brokerPhone}`);
  if (headerSec?.brokerAgency) brokerParts.push(headerSec.brokerAgency);
  if (headerSec?.date) brokerParts.push(`Data: ${headerSec.date}`);

  const footerText = brokerParts.join(' • ');

  return (
    <div className="preview-pane">
      <div 
        className="preview-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: `${-1115 * (1 - scale)}px`,
        }}
      >
        <div id="proposal-document" ref={previewRef} className="a4-page">
          {headerSec && <HeaderBlock section={headerSec} />}

          {footerText && (
            <div className="proposal-footer" style={{ textAlign: 'center', justifyContent: 'center' }}>
              <span>{footerText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HeaderBlock: React.FC<{ section: HeaderSection }> = ({ section }) => {
  const rawItems = section.pricingItems || [];
  const items = sortPricingItems(rawItems);

  // Cálculo do Subtotal da Forma de Pagamento (que agora se chama TOTAL)
  const total = items.reduce((acc, item) => acc + getPricingItemTotal(item), 0);

  // Lista de Imóveis (com suporte a múltiplos imóveis)
  const properties: PropertyItem[] =
    section.properties && section.properties.length > 0
      ? section.properties
      : [
          {
            id: 'default',
            projectName: section.projectName || '',
            unitIdentifier: section.unitIdentifier || '',
            unitDescription: section.unitDescription || '',
            totalValue: section.totalValue || '',
            totalValueNum: section.totalValueNum || parseCurrencyToNumber(section.totalValue),
          },
        ];

  const overallPropertiesTotal = properties.reduce((acc, prop) => {
    const num =
      prop.totalValueNum !== undefined && !isNaN(prop.totalValueNum)
        ? prop.totalValueNum
        : parseCurrencyToNumber(prop.totalValue);
    return acc + num;
  }, 0);

  return (
    <div className="proposal-header-block" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
      <h1 className="proposal-main-title" style={{ textAlign: 'center' }}>
        {section.title || 'PROPOSTA'}
      </h1>

      {/* TABELA DE IMÓVEIS */}
      <div className="proposal-section" style={{ marginTop: '1.25rem' }}>
        <h3 className="proposal-section-title">Imóveis</h3>
        <table className="proposal-table">
          <thead>
            <tr>
              <th style={{ width: '45%', textAlign: 'left' }}>Empreendimento</th>
              <th style={{ width: '30%', textAlign: 'left' }}>Unidade</th>
              <th style={{ width: '25%', textAlign: 'left' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop.id}>
                <td style={{ fontWeight: 600, textAlign: 'left' }}>
                  {prop.projectName || 'Empreendimento não informado'}
                </td>
                <td style={{ textAlign: 'left' }}>{prop.unitIdentifier || '-'}</td>
                <td style={{ fontWeight: 700, textAlign: 'left' }}>
                  {prop.totalValue || 'R$ 0,00'}
                </td>
              </tr>
            ))}
          </tbody>
          {properties.length > 1 && overallPropertiesTotal > 0 && (
            <tfoot>
              <tr>
                <td colSpan={2} style={{ fontWeight: 700, textTransform: 'uppercase', textAlign: 'left' }}>
                  SUBTOTAL
                </td>
                <td style={{ fontWeight: 800, textAlign: 'left' }}>
                  {formatNumberToCurrency(overallPropertiesTotal)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* TABELA DA FORMA DE PAGAMENTO COM SUB-LINHA DE OBSERVAÇÃO */}
      {items.length > 0 && (
        <div className="proposal-section" style={{ marginTop: '1.5rem' }}>
          <h3 className="proposal-section-title">Forma de Pagamento</h3>
          <table className="proposal-table">
            <thead>
              <tr>
                <th style={{ width: '18%', textAlign: 'left' }}>Tipo</th>
                <th style={{ width: '15%', textAlign: 'left' }}>Forma</th>
                <th style={{ width: '14%', textAlign: 'left' }}>Prazo</th>
                <th style={{ width: '14%', textAlign: 'left' }}>Período</th>
                <th style={{ width: '9%', textAlign: 'left' }}>Qtd</th>
                <th style={{ width: '15%', textAlign: 'left' }}>Valor</th>
                <th style={{ width: '15%', textAlign: 'left' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isParcelado = item.paymentTermType === 'Parcelado' || item.name === 'Intermediárias';
                const periodLabel = isParcelado ? item.periodicity || 'Mensal' : '-';
                const qtdLabel = isParcelado && item.installmentsCount ? `${item.installmentsCount}x` : '1x';
                const itemTotal = getPricingItemTotal(item);
                const hasDescription = Boolean(item.description && item.description.trim());

                return (
                  <React.Fragment key={item.id}>
                    <tr style={{ borderBottom: hasDescription ? 'none' : '1px solid #e5e7eb' }}>
                      <td style={{ fontWeight: 600, textAlign: 'left' }}>{item.name || 'Sinal'}</td>
                      <td style={{ textAlign: 'left' }}>{item.method || 'Dinheiro'}</td>
                      <td style={{ textAlign: 'left' }}>{item.name === 'Intermediárias' ? 'Parcelado' : item.paymentTermType || 'À vista'}</td>
                      <td style={{ textAlign: 'left' }}>{periodLabel}</td>
                      <td style={{ fontWeight: 600, textAlign: 'left' }}>{qtdLabel}</td>
                      <td style={{ textAlign: 'left' }}>{item.value || 'R$ 0,00'}</td>
                      <td style={{ fontWeight: 700, textAlign: 'left' }}>
                        {formatNumberToCurrency(itemTotal)}
                      </td>
                    </tr>
                    {hasDescription && (
                      <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
                        <td
                          colSpan={7}
                          style={{
                            padding: '0.2rem 0.6rem 0.4rem 0.75rem',
                            fontSize: '8.5pt',
                            color: '#4b5563',
                            fontStyle: 'italic',
                            textAlign: 'left',
                          }}
                        >
                          <span style={{ fontWeight: 600, fontStyle: 'normal', marginRight: '0.35rem' }}>
                            Observações:
                          </span>
                          {item.description}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} style={{ fontWeight: 700, textTransform: 'uppercase', textAlign: 'left' }}>
                  TOTAL
                </td>
                <td style={{ fontWeight: 800, textAlign: 'left' }}>
                  {formatNumberToCurrency(total)}
                </td>
              </tr>
            </tfoot>
          </table>

          {section.paymentTerms && (
            <div className="pricing-note-box">
              {section.paymentTerms}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
