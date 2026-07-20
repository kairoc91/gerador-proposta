import React from 'react';
import type { Proposal, Section, SectionType } from '../../types/proposal';
import { createDefaultSection } from '../../utils/defaults';
import { HeaderEditor } from './HeaderEditor';
import { TextEditor } from './TextEditor';
import { DeliverablesEditor } from './DeliverablesEditor';
import { PricingEditor } from './PricingEditor';
import { TimelineEditor } from './TimelineEditor';
import { TermsEditor } from './TermsEditor';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Layout,
  FileText,
  CheckSquare,
  DollarSign,
  Clock,
  FileCheck,
  Layers,
} from 'lucide-react';

interface Props {
  proposal: Proposal;
  onChange: (updated: Proposal) => void;
}

export const EditorSidebar: React.FC<Props> = ({ proposal, onChange }) => {
  const updateSection = (index: number, updated: Section) => {
    const updatedSections = [...proposal.sections];
    updatedSections[index] = updated;
    onChange({ ...proposal, sections: updatedSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= proposal.sections.length) return;

    const updatedSections = [...proposal.sections];
    const [moved] = updatedSections.splice(index, 1);
    updatedSections.splice(newIndex, 0, moved);
    onChange({ ...proposal, sections: updatedSections });
  };

  const removeSection = (index: number) => {
    if (proposal.sections.length <= 1) {
      alert('A proposta deve conter ao menos um bloco.');
      return;
    }
    const updatedSections = proposal.sections.filter((_, idx) => idx !== index);
    onChange({ ...proposal, sections: updatedSections });
  };

  const addSection = (type: SectionType) => {
    const newSection = createDefaultSection(type);
    onChange({ ...proposal, sections: [...proposal.sections, newSection] });
  };

  const getSectionIcon = (type: SectionType) => {
    switch (type) {
      case 'header':
        return <Layout size={16} color="#3b82f6" />;
      case 'text':
        return <FileText size={16} color="#10b981" />;
      case 'deliverables':
        return <CheckSquare size={16} color="#f59e0b" />;
      case 'pricing':
        return <DollarSign size={16} color="#ec4899" />;
      case 'timeline':
        return <Clock size={16} color="#8b5cf6" />;
      case 'terms':
        return <FileCheck size={16} color="#06b6d4" />;
    }
  };

  const getSectionLabel = (type: SectionType) => {
    switch (type) {
      case 'header':
        return 'Capa & Dados';
      case 'text':
        return 'Texto Livre';
      case 'deliverables':
        return 'Escopo & Entregáveis';
      case 'pricing':
        return 'Tabela de Preços';
      case 'timeline':
        return 'Cronograma';
      case 'terms':
        return 'Termos & Assinaturas';
    }
  };

  return (
    <div className="editor-pane">
      <div className="editor-header">
        <div className="editor-title">
          <Layers size={18} color="#3b82f6" />
          <span>Estrutura da Proposta ({proposal.sections.length})</span>
        </div>
      </div>

      <div className="editor-scroll">
        {proposal.sections.map((section, idx) => (
          <div key={section.id} className="section-card">
            <div className="section-card-header">
              <div className="section-card-title">
                {getSectionIcon(section.type)}
                <span>{getSectionLabel(section.type)}</span>
                <span className="section-type-badge">#{idx + 1}</span>
              </div>
              <div className="section-card-actions">
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                  title="Mover para cima"
                  style={{ opacity: idx === 0 ? 0.3 : 1 }}
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === proposal.sections.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  title="Mover para baixo"
                  style={{ opacity: idx === proposal.sections.length - 1 ? 0.3 : 1 }}
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => removeSection(idx)}
                  title="Excluir Bloco"
                >
                  <Trash2 size={14} color="#f87171" />
                </button>
              </div>
            </div>

            {section.type === 'header' && (
              <HeaderEditor
                section={section}
                onChange={(updated) => updateSection(idx, updated)}
              />
            )}
            {section.type === 'text' && (
              <TextEditor
                section={section}
                onChange={(updated) => updateSection(idx, updated)}
              />
            )}
            {section.type === 'deliverables' && (
              <DeliverablesEditor
                section={section}
                onChange={(updated) => updateSection(idx, updated)}
              />
            )}
            {section.type === 'pricing' && (
              <PricingEditor
                section={section}
                onChange={(updated) => updateSection(idx, updated)}
              />
            )}
            {section.type === 'timeline' && (
              <TimelineEditor
                section={section}
                onChange={(updated) => updateSection(idx, updated)}
              />
            )}
            {section.type === 'terms' && (
              <TermsEditor
                section={section}
                onChange={(updated) => updateSection(idx, updated)}
              />
            )}
          </div>
        ))}

        <div className="add-block-container">
          <div className="add-block-title">Adicionar Novo Bloco à Proposta</div>
          <div className="add-block-buttons">
            <button
              type="button"
              className="btn-add-block"
              onClick={() => addSection('text')}
            >
              <FileText size={14} /> Texto / Apresentação
            </button>
            <button
              type="button"
              className="btn-add-block"
              onClick={() => addSection('deliverables')}
            >
              <CheckSquare size={14} /> Escopo & Entregáveis
            </button>
            <button
              type="button"
              className="btn-add-block"
              onClick={() => addSection('pricing')}
            >
              <DollarSign size={14} /> Tabela de Preços
            </button>
            <button
              type="button"
              className="btn-add-block"
              onClick={() => addSection('timeline')}
            >
              <Clock size={14} /> Cronograma
            </button>
            <button
              type="button"
              className="btn-add-block"
              onClick={() => addSection('terms')}
            >
              <FileCheck size={14} /> Termos & Assinaturas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
