import React from 'react';
import type { HeaderSection } from '../../types/proposal';

interface Props {
  section: HeaderSection;
  onChange: (updated: HeaderSection) => void;
}

export const HeaderEditor: React.FC<Props> = ({ section, onChange }) => {
  const updateField = (field: keyof HeaderSection, value: string) => {
    onChange({ ...section, [field]: value });
  };

  return (
    <div className="section-card-body">
      <div className="form-group">
        <label className="form-label">Título da Proposta</label>
        <input
          type="text"
          className="form-input"
          value={section.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Ex: PROPOSTA COMERCIAL"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Subtítulo / Nome do Projeto</label>
        <input
          type="text"
          className="form-input"
          value={section.subtitle}
          onChange={(e) => updateField('subtitle', e.target.value)}
          placeholder="Ex: Redesign & Desenvolvimento Web"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Seu Nome / Contratado</label>
          <input
            type="text"
            className="form-input"
            value={section.providerName}
            onChange={(e) => updateField('providerName', e.target.value)}
            placeholder="Nome do profissional"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Sua Empresa</label>
          <input
            type="text"
            className="form-input"
            value={section.providerCompany}
            onChange={(e) => updateField('providerCompany', e.target.value)}
            placeholder="Sua marca / empresa"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Seu E-mail</label>
          <input
            type="email"
            className="form-input"
            value={section.providerEmail}
            onChange={(e) => updateField('providerEmail', e.target.value)}
            placeholder="contato@empresa.com"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Seu Telefone</label>
          <input
            type="text"
            className="form-input"
            value={section.providerPhone}
            onChange={(e) => updateField('providerPhone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nome do Cliente</label>
          <input
            type="text"
            className="form-input"
            value={section.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder="Nome do cliente"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Empresa do Cliente</label>
          <input
            type="text"
            className="form-input"
            value={section.clientCompany}
            onChange={(e) => updateField('clientCompany', e.target.value)}
            placeholder="Razão Social / Marca"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Data de Emissão</label>
          <input
            type="text"
            className="form-input"
            value={section.date}
            onChange={(e) => updateField('date', e.target.value)}
            placeholder="Ex: 20/07/2026"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Validade da Proposta</label>
          <input
            type="text"
            className="form-input"
            value={section.validity}
            onChange={(e) => updateField('validity', e.target.value)}
            placeholder="Ex: 15 dias"
          />
        </div>
      </div>
    </div>
  );
};
