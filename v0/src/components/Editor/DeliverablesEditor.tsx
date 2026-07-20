import React from 'react';
import type { DeliverablesSection, DeliverablesItem } from '../../types/proposal';
import { createId } from '../../utils/defaults';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: DeliverablesSection;
  onChange: (updated: DeliverablesSection) => void;
}

export const DeliverablesEditor: React.FC<Props> = ({ section, onChange }) => {
  const addItem = () => {
    const newItem: DeliverablesItem = {
      id: createId(),
      title: 'Novo Entregável',
      description: 'Descrição do item a ser entregue',
    };
    onChange({ ...section, items: [...section.items, newItem] });
  };

  const updateItem = (id: string, field: keyof DeliverablesItem, value: string) => {
    const updatedItems = section.items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...section, items: updatedItems });
  };

  const removeItem = (id: string) => {
    onChange({ ...section, items: section.items.filter((item) => item.id !== id) });
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
          placeholder="Ex: Escopo & Entregáveis"
        />
      </div>

      <div className="form-group" style={{ gap: '0.75rem' }}>
        <label className="form-label">Lista de Itens do Escopo</label>
        {section.items.map((item, idx) => (
          <div
            key={item.id}
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
                Item {idx + 1}
              </span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => removeItem(item.id)}
                title="Remover Item"
              >
                <Trash2 size={14} color="#f87171" />
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              value={item.title}
              onChange={(e) => updateItem(item.id, 'title', e.target.value)}
              placeholder="Título do Entregável"
            />
            <input
              type="text"
              className="form-input"
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              placeholder="Detalhes ou especificações"
            />
          </div>
        ))}

        <button
          type="button"
          className="btn-add-block"
          onClick={addItem}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          <Plus size={14} /> Adicionar Item ao Escopo
        </button>
      </div>
    </div>
  );
};
