import React from 'react';
import type { TermsSection } from '../../types/proposal';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: TermsSection;
  onChange: (updated: TermsSection) => void;
}

export const TermsEditor: React.FC<Props> = ({ section, onChange }) => {
  const addClause = () => {
    onChange({
      ...section,
      clauses: [...section.clauses, 'Nova cláusula ou condição de contratação.'],
    });
  };

  const updateClause = (index: number, value: string) => {
    const updated = [...section.clauses];
    updated[index] = value;
    onChange({ ...section, clauses: updated });
  };

  const removeClause = (index: number) => {
    onChange({
      ...section,
      clauses: section.clauses.filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className="section-card-body">
      <div className="form-group">
        <label className="form-label">Título da Seção</label>
        <input
          type="text"
          className="form-input"
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          placeholder="Ex: Termos e Condições"
        />
      </div>

      <div className="form-group" style={{ gap: '0.5rem' }}>
        <label className="form-label">Cláusulas e Condições</label>
        {section.clauses.map((clause, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              className="form-input"
              value={clause}
              onChange={(e) => updateClause(idx, e.target.value)}
              placeholder={`Cláusula ${idx + 1}`}
            />
            <button
              type="button"
              className="btn-icon"
              onClick={() => removeClause(idx)}
              title="Remover Cláusula"
            >
              <Trash2 size={14} color="#f87171" />
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-add-block"
          onClick={addClause}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          <Plus size={14} /> Adicionar Cláusula
        </button>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nome do Signatário (Contratado)</label>
          <input
            type="text"
            className="form-input"
            value={section.providerSignerName}
            onChange={(e) => onChange({ ...section, providerSignerName: e.target.value })}
            placeholder="Nome para Assinatura"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Cargo / Função</label>
          <input
            type="text"
            className="form-input"
            value={section.providerSignerRole}
            onChange={(e) => onChange({ ...section, providerSignerRole: e.target.value })}
            placeholder="Ex: Diretor Comercial"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nome do Signatário (Cliente)</label>
          <input
            type="text"
            className="form-input"
            value={section.clientSignerName}
            onChange={(e) => onChange({ ...section, clientSignerName: e.target.value })}
            placeholder="Nome do Cliente para Assinatura"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Cargo / Função (Cliente)</label>
          <input
            type="text"
            className="form-input"
            value={section.clientSignerRole}
            onChange={(e) => onChange({ ...section, clientSignerRole: e.target.value })}
            placeholder="Ex: Gerente de Projetos"
          />
        </div>
      </div>
    </div>
  );
};
