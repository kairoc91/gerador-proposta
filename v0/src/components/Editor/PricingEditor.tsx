import React from 'react';
import type { PricingSection, PricingItem } from '../../types/proposal';
import { createId } from '../../utils/defaults';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: PricingSection;
  onChange: (updated: PricingSection) => void;
}

export const PricingEditor: React.FC<Props> = ({ section, onChange }) => {
  const addItem = () => {
    const newItem: PricingItem = {
      id: createId(),
      name: 'Novo Item / Serviço',
      description: 'Descrição do serviço ou módulo',
      price: 'R$ 0,00',
    };
    onChange({ ...section, items: [...section.items, newItem] });
  };

  const updateItem = (id: string, field: keyof PricingItem, value: string) => {
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
          placeholder="Ex: Investimento & Valores"
        />
      </div>

      <div className="form-group" style={{ gap: '0.75rem' }}>
        <label className="form-label">Itens da Tabela de Preços</label>
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
                Linha {idx + 1}
              </span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => removeItem(item.id)}
                title="Remover Linha"
              >
                <Trash2 size={14} color="#f87171" />
              </button>
            </div>
            <div className="form-row">
              <input
                type="text"
                className="form-input"
                value={item.name}
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                placeholder="Nome do Serviço"
              />
              <input
                type="text"
                className="form-input"
                value={item.price}
                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                placeholder="Valor (Ex: R$ 3.500,00)"
              />
            </div>
            <input
              type="text"
              className="form-input"
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              placeholder="Descrição ou detalhamento"
            />
          </div>
        ))}

        <button
          type="button"
          className="btn-add-block"
          onClick={addItem}
          style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        >
          <Plus size={14} /> Adicionar Linha de Preço
        </button>
      </div>

      <div className="form-group">
        <label className="form-label">Condições de Pagamento</label>
        <input
          type="text"
          className="form-input"
          value={section.paymentTerms}
          onChange={(e) => onChange({ ...section, paymentTerms: e.target.value })}
          placeholder="Ex: 50% de entrada e 50% na entrega"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Observações / Notas Financeiras (Opcional)</label>
        <input
          type="text"
          className="form-input"
          value={section.notes || ''}
          onChange={(e) => onChange({ ...section, notes: e.target.value })}
          placeholder="Ex: Impostos inclusos / Faturamento via Nota Fiscal"
        />
      </div>
    </div>
  );
};
