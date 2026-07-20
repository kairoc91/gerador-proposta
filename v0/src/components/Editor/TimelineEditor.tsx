import React from 'react';
import type { TimelineSection, TimelinePhase } from '../../types/proposal';
import { createId } from '../../utils/defaults';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: TimelineSection;
  onChange: (updated: TimelineSection) => void;
}

export const TimelineEditor: React.FC<Props> = ({ section, onChange }) => {
  const addPhase = () => {
    const newPhase: TimelinePhase = {
      id: createId(),
      name: `Fase ${section.phases.length + 1} - Nome da Etapa`,
      duration: '1 a 2 semanas',
      deliverables: 'Entregáveis desta etapa',
    };
    onChange({ ...section, phases: [...section.phases, newPhase] });
  };

  const updatePhase = (id: string, field: keyof TimelinePhase, value: string) => {
    const updatedPhases = section.phases.map((phase) =>
      phase.id === id ? { ...phase, [field]: value } : phase
    );
    onChange({ ...section, phases: updatedPhases });
  };

  const removePhase = (id: string) => {
    onChange({ ...section, phases: section.phases.filter((phase) => phase.id !== id) });
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
          placeholder="Ex: Cronograma de Execução"
        />
      </div>

      <div className="form-group" style={{ gap: '0.75rem' }}>
        <label className="form-label">Fases do Cronograma</label>
        {section.phases.map((phase, idx) => (
          <div
            key={phase.id}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              padding: '0.75rem',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                Etapa {idx + 1}
              </span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => removePhase(phase.id)}
                title="Remover Etapa"
              >
                <Trash2 size={14} color="#f87171" />
              </button>
            </div>
            <div className="form-row">
              <input
                type="text"
                className="form-input"
                value={phase.name}
                onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                placeholder="Nome da Fase"
              />
              <input
                type="text"
                className="form-input"
                value={phase.duration}
                onChange={(e) => updatePhase(phase.id, 'duration', e.target.value)}
                placeholder="Duração (Ex: 2 semanas)"
              />
            </div>
            <input
              type="text"
              className="form-input"
              value={phase.deliverables}
              onChange={(e) => updatePhase(phase.id, 'deliverables', e.target.value)}
              placeholder="Entregáveis / Atividades da fase"
            />
          </div>
        ))}

        <button
          type="button"
          className="btn-add-block"
          onClick={addPhase}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          <Plus size={14} /> Adicionar Fase ao Cronograma
        </button>
      </div>
    </div>
  );
};
