import React from 'react';
import type { TextSection } from '../../types/proposal';

interface Props {
  section: TextSection;
  onChange: (updated: TextSection) => void;
}

export const TextEditor: React.FC<Props> = ({ section, onChange }) => {
  return (
    <div className="section-card-body">
      <div className="form-group">
        <label className="form-label">Título da Seção</label>
        <input
          type="text"
          className="form-input"
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          placeholder="Ex: Visão Geral e Objetivos"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Conteúdo / Texto Libre</label>
        <textarea
          className="form-textarea"
          style={{ minHeight: '120px' }}
          value={section.content}
          onChange={(e) => onChange({ ...section, content: e.target.value })}
          placeholder="Escreva a descrição do projeto, contexto, metas ou justificativa da proposta..."
        />
      </div>
    </div>
  );
};
