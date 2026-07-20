import React from 'react';
import type {
  Proposal,
  HeaderSection,
  TextSection,
  DeliverablesSection,
  PricingSection,
  TimelineSection,
  TermsSection,
} from '../../types/proposal';

interface Props {
  proposal: Proposal;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

export const ProposalPreview: React.FC<Props> = ({ proposal, previewRef }) => {
  return (
    <div className="preview-pane">
      <div className="preview-wrapper">
        <div id="proposal-document" ref={previewRef} className="a4-page">
          {proposal.sections.map((section) => {
            switch (section.type) {
              case 'header':
                return <HeaderBlock key={section.id} section={section} />;
              case 'text':
                return <TextBlock key={section.id} section={section} />;
              case 'deliverables':
                return <DeliverablesBlock key={section.id} section={section} />;
              case 'pricing':
                return <PricingBlock key={section.id} section={section} />;
              case 'timeline':
                return <TimelineBlock key={section.id} section={section} />;
              case 'terms':
                return <TermsBlock key={section.id} section={section} />;
              default:
                return null;
            }
          })}

          <div className="proposal-footer">
            <span>Gerado via Proposta de Negócio</span>
            <span>Documento Confidencial</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderBlock: React.FC<{ section: HeaderSection }> = ({ section }) => (
  <div className="proposal-header-block">
    <h1 className="proposal-main-title">{section.title || 'PROPOSTA COMERCIAL'}</h1>
    {section.subtitle && <p className="proposal-subtitle">{section.subtitle}</p>}

    <div className="meta-grid">
      <div className="meta-box">
        <h4>CONTRATADO</h4>
        <p>{section.providerName || 'Seu Nome / Profissional'}</p>
        <span>{section.providerCompany}</span>
        {section.providerEmail && (
          <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.2rem' }}>
            {section.providerEmail} {section.providerPhone ? `• ${section.providerPhone}` : ''}
          </div>
        )}
      </div>

      <div className="meta-box">
        <h4>CONTRATANTE / CLIENTE</h4>
        <p>{section.clientName || 'Nome do Cliente'}</p>
        <span>{section.clientCompany || 'Empresa Cliente'}</span>
        <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: '0.2rem' }}>
          Data: {section.date} • Validade: {section.validity}
        </div>
      </div>
    </div>
  </div>
);

const TextBlock: React.FC<{ section: TextSection }> = ({ section }) => (
  <div className="proposal-section">
    <h3 className="proposal-section-title">{section.title || 'Apresentação'}</h3>
    <div className="proposal-text-content">{section.content}</div>
  </div>
);

const DeliverablesBlock: React.FC<{ section: DeliverablesSection }> = ({ section }) => (
  <div className="proposal-section">
    <h3 className="proposal-section-title">{section.title || 'Escopo & Entregáveis'}</h3>
    <div className="deliverables-grid">
      {section.items.map((item, index) => (
        <div key={item.id} className="deliverable-card">
          <div className="deliverable-icon">{index + 1}</div>
          <div className="deliverable-text">
            <h4>{item.title}</h4>
            {item.description && <p>{item.description}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PricingBlock: React.FC<{ section: PricingSection }> = ({ section }) => (
  <div className="proposal-section">
    <h3 className="proposal-section-title">{section.title || 'Investimento & Valores'}</h3>
    <table className="proposal-table">
      <thead>
        <tr>
          <th style={{ width: '30%' }}>Item / Serviço</th>
          <th style={{ width: '45%' }}>Descrição</th>
          <th style={{ width: '25%', textAlign: 'right' }}>Valor</th>
        </tr>
      </thead>
      <tbody>
        {section.items.map((item) => (
          <tr key={item.id}>
            <td style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</td>
            <td>{item.description}</td>
            <td style={{ fontWeight: 700, textAlign: 'right', color: '#2563eb' }}>
              {item.price}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {section.paymentTerms && (
      <div className="pricing-note-box">
        <strong>Condições de Pagamento:</strong> {section.paymentTerms}
      </div>
    )}

    {section.notes && (
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
        * {section.notes}
      </div>
    )}
  </div>
);

const TimelineBlock: React.FC<{ section: TimelineSection }> = ({ section }) => (
  <div className="proposal-section">
    <h3 className="proposal-section-title">{section.title || 'Cronograma'}</h3>
    <div className="timeline-list">
      {section.phases.map((phase) => (
        <div key={phase.id} className="timeline-item">
          <div className="timeline-item-header">
            <h4>{phase.name}</h4>
            <span className="timeline-badge">{phase.duration}</span>
          </div>
          {phase.deliverables && <p>{phase.deliverables}</p>}
        </div>
      ))}
    </div>
  </div>
);

const TermsBlock: React.FC<{ section: TermsSection }> = ({ section }) => (
  <div className="proposal-section" style={{ marginTop: '0.5rem' }}>
    <h3 className="proposal-section-title">{section.title || 'Termos & Aceite'}</h3>

    {section.clauses.length > 0 && (
      <ol className="clauses-list">
        {section.clauses.map((clause, idx) => (
          <li key={idx}>{clause}</li>
        ))}
      </ol>
    )}

    <div className="signatures-grid">
      <div className="signature-box">
        <div className="signature-line"></div>
        <strong>{section.providerSignerName || 'Assinatura do Contratado'}</strong>
        <span>{section.providerSignerRole || 'Contratado'}</span>
      </div>

      <div className="signature-box">
        <div className="signature-line"></div>
        <strong>{section.clientSignerName || 'Assinatura do Contratante'}</strong>
        <span>{section.clientSignerRole || 'Contratante'}</span>
      </div>
    </div>
  </div>
);
