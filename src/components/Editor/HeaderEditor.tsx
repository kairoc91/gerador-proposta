import React, { useState } from 'react';
import type { HeaderSection, PricingItem, PropertyItem } from '../../types/proposal';
import {
  parseCurrencyToNumber,
  formatNumberToCurrency,
  createId,
  createDefaultPropertyItem,
  formatCurrencyInput,
  formatPhoneInput,
  formatCreciNumberInput,
  UF_LIST,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TERM_OPTIONS,
  PERIODICITY_OPTIONS,
  POST_KEYS_INDEX_OPTIONS,
  generatePaymentTermsText,
  getPricingItemTotal,
} from '../../utils/defaults';
import {
  Building2,
  CreditCard,
  User,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Calculator,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  section: HeaderSection;
  onChange: (updated: HeaderSection) => void;
}

const PAYMENT_TYPE_OPTIONS = ['Sinal', 'Entrada', 'Intermediárias', 'Chaves'];

export const HeaderEditor: React.FC<Props> = ({ section, onChange }) => {
  // Todos os cards colapsados por padrão ao carregar a página (null)
  const [openCard, setOpenCard] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    setOpenCard((prev) => (prev === cardId ? null : cardId));
  };

  const updateField = (field: keyof HeaderSection, value: any) => {
    const updated = { ...section, [field]: value };
    onChange(updated);
  };

  // Garantir lista de imóveis (com fallback se vier de estado legado)
  const properties: PropertyItem[] =
    section.properties && section.properties.length > 0
      ? section.properties
      : [
          {
            id: createId(),
            projectName: section.projectName || '',
            unitIdentifier: section.unitIdentifier || '',
            unitDescription: section.unitDescription || '',
            totalValue: section.totalValue || '',
            totalValueNum: section.totalValueNum || parseCurrencyToNumber(section.totalValue),
          },
        ];

  // Métodos de gerenciamento dos Imóveis
  const addProperty = () => {
    const newProp = createDefaultPropertyItem();
    updateField('properties', [...properties, newProp]);
  };

  const updateProperty = (id: string, field: keyof PropertyItem, val: any) => {
    const updatedProps = properties.map((prop) => {
      if (prop.id === id) {
        let finalVal = val;
        if (field === 'totalValue') {
          finalVal = formatCurrencyInput(val);
        }
        const updated = { ...prop, [field]: finalVal };
        if (field === 'totalValue') {
          updated.totalValueNum = parseCurrencyToNumber(finalVal);
        }
        return updated;
      }
      return prop;
    });
    updateField('properties', updatedProps);
  };

  const removeProperty = (id: string) => {
    if (properties.length <= 1) {
      alert('A proposta deve possuir ao menos um imóvel.');
      return;
    }
    updateField(
      'properties',
      properties.filter((prop) => prop.id !== id)
    );
  };

  // Soma total de todos os imóveis da proposta
  const overallPropertiesTotal = properties.reduce((acc, prop) => {
    const num =
      prop.totalValueNum !== undefined && !isNaN(prop.totalValueNum)
        ? prop.totalValueNum
        : parseCurrencyToNumber(prop.totalValue);
    return acc + num;
  }, 0);

  // Gerenciamento dos itens da Forma de Pagamento
  const items: PricingItem[] = section.pricingItems || [];

  const addPricingItem = () => {
    const newItem: PricingItem = {
      id: createId(),
      name: 'Sinal',
      method: 'Dinheiro',
      paymentTermType: 'À vista',
      description: '',
      value: 'R$ 0,00',
      amountNumber: 0,
    };
    updateField('pricingItems', [...items, newItem]);
  };

  const updatePricingItem = (id: string, field: keyof PricingItem, val: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        let finalVal = val;
        if (field === 'value') {
          finalVal = formatCurrencyInput(val);
        }
        const updated = { ...item, [field]: finalVal };
        if (field === 'value') {
          updated.amountNumber = parseCurrencyToNumber(finalVal);
        }
        return updated;
      }
      return item;
    });
    updateField('pricingItems', updatedItems);
  };

  const updatePricingItemFields = (id: string, fields: Partial<PricingItem>) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updated = { ...item, ...fields };
        if ('value' in fields) {
          updated.value = formatCurrencyInput(fields.value || '');
          updated.amountNumber = parseCurrencyToNumber(updated.value);
        }
        return updated;
      }
      return item;
    });
    updateField('pricingItems', updatedItems);
  };

  const removePricingItem = (id: string) => {
    updateField(
      'pricingItems',
      items.filter((item) => item.id !== id)
    );
  };

  // Atualização do CRECI Número (com pontos de milhar) e UF
  const handleCreciNumberChange = (rawNum: string) => {
    const maskedNum = formatCreciNumberInput(rawNum);
    const uf = section.brokerCreciUf || 'SP';
    const fullCreci = maskedNum ? `${maskedNum}/${uf}` : '';
    onChange({
      ...section,
      brokerCreciNumber: maskedNum,
      brokerCreciUf: uf,
      brokerCreci: fullCreci,
    });
  };

  const handleCreciUfChange = (uf: string) => {
    const maskedNum = section.brokerCreciNumber || '';
    const fullCreci = maskedNum ? `${maskedNum}/${uf}` : '';
    onChange({
      ...section,
      brokerCreciUf: uf,
      brokerCreci: fullCreci,
    });
  };

  // Cálculo correto do Subtotal considerando Qtd * Valor da Parcela
  const paymentSubtotal = items.reduce((acc, item) => acc + getPricingItemTotal(item), 0);

  const difference = overallPropertiesTotal > 0 ? paymentSubtotal - overallPropertiesTotal : 0;
  const isMatch = overallPropertiesTotal > 0 && Math.abs(difference) < 0.01;

  return (
    <div className="section-card-body" style={{ gap: '0.6rem' }}>
      {/* 1. DADOS DO IMÓVEL */}
      <div className={`sub-card ${openCard === 'properties' ? 'open' : ''}`}>
        <div className="sub-card-header" onClick={() => toggleCard('properties')}>
          <div className="sub-card-title">
            <Building2 size={16} color="var(--color-accent)" />
            <span style={{ color: openCard === 'properties' ? 'var(--color-accent)' : 'var(--color-text)' }}>
              1. Dados do Imóvel ({properties.length})
            </span>
          </div>
          {openCard === 'properties' ? (
            <ChevronDown size={16} color="var(--color-accent)" />
          ) : (
            <ChevronRight size={16} />
          )}
        </div>

        {openCard === 'properties' && (
          <div className="sub-card-body">
            {properties.map((prop, idx) => (
              <div
                key={prop.id}
                style={{
                  background: 'var(--color-input)',
                  border: '1px solid var(--color-surface)',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.775rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Imóvel #{idx + 1} {prop.projectName ? `- ${prop.projectName}` : ''}
                  </span>
                  {properties.length > 1 && (
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeProperty(prop.id)}
                      title="Remover Imóvel"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={prop.projectName || ''}
                    onChange={(e) => updateProperty(prop.id, 'projectName', e.target.value)}
                    placeholder="Nome do empreendimento"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={prop.unitIdentifier || ''}
                    onChange={(e) => updateProperty(prop.id, 'unitIdentifier', e.target.value)}
                    placeholder="Identificação da unidade"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontWeight: 700, color: 'var(--color-accent)' }}
                    value={prop.totalValue || ''}
                    onChange={(e) => updateProperty(prop.id, 'totalValue', e.target.value)}
                    placeholder="Valor da unidade (R$)"
                  />
                </div>
              </div>
            ))}

            {overallPropertiesTotal > 0 && properties.length > 1 && (
              <div style={{ background: 'var(--color-input)', padding: '0.6rem 0.8rem', borderRadius: '6px', fontSize: '0.825rem', display: 'flex', justifyContent: 'space-between', color: 'var(--color-accent)', fontWeight: 700 }}>
                <span>Total:</span>
                <span>{formatNumberToCurrency(overallPropertiesTotal)}</span>
              </div>
            )}

            <button
              type="button"
              className="btn-add-block"
              onClick={addProperty}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.2rem' }}
            >
              <Plus size={14} /> Adicionar
            </button>
          </div>
        )}
      </div>

      {/* 2. FORMA DE PAGAMENTO */}
      <div className={`sub-card ${openCard === 'pricing' ? 'open' : ''}`}>
        <div className="sub-card-header" onClick={() => toggleCard('pricing')}>
          <div className="sub-card-title">
            <CreditCard size={16} color="var(--color-accent)" />
            <span style={{ color: openCard === 'pricing' ? 'var(--color-accent)' : 'var(--color-text)' }}>
              2. Forma de Pagamento
            </span>
          </div>
          {openCard === 'pricing' ? (
            <ChevronDown size={16} color="var(--color-accent)" />
          ) : (
            <ChevronRight size={16} />
          )}
        </div>
        {openCard === 'pricing' && (
          <div className="sub-card-body">
            {/* QUADRO DE SUBTOTAL E CONFERÊNCIA */}
            <div
              style={{
                background: 'var(--color-input)',
                border: '1px solid var(--color-surface)',
                borderRadius: '8px',
                padding: '0.75rem 0.9rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calculator size={15} color="var(--color-accent)" /> Subtotal do Fluxo:
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                  {formatNumberToCurrency(paymentSubtotal)}
                </span>
              </div>

              {overallPropertiesTotal > 0 && (
                <div style={{ borderTop: '1px dashed var(--color-surface)', paddingTop: '0.4rem', fontSize: '0.75rem' }}>
                  {isMatch ? (
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-accent)' }}>
                      <CheckCircle2 size={14} /> 100% Coberto com o Valor Total dos Imóveis!
                    </div>
                  ) : (
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <AlertTriangle size={14} />
                      Diferença para o Valor Total ({formatNumberToCurrency(overallPropertiesTotal)}):{' '}
                      <strong style={{ color: 'var(--color-accent)' }}>{formatNumberToCurrency(difference)}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group" style={{ gap: '0.6rem', marginTop: '0.25rem' }}>
              {items.map((item, idx) => {
                const isStandardType = PAYMENT_TYPE_OPTIONS.includes(item.name || '');
                const currentSelectValue = isStandardType ? item.name : item.name ? 'Outro' : 'Sinal';

                const isStandardMethod = PAYMENT_METHOD_OPTIONS.includes(item.method || '');
                const currentMethodSelectValue = isStandardMethod ? item.method : item.method ? 'Outro' : 'Dinheiro';

                const currentTermType = item.paymentTermType || 'À vista';
                const itemTotal = getPricingItemTotal(item);

                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--color-input)',
                      border: '1px solid var(--color-surface)',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        Pagamento #{idx + 1}
                      </span>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => removePricingItem(item.id)}
                        title="Remover Parcela"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <select
                          className="form-select"
                          style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                          value={currentSelectValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== 'Outro') {
                              if (val === 'Intermediárias') {
                                updatePricingItemFields(item.id, {
                                  name: val,
                                  paymentTermType: 'Parcelado',
                                  periodicity: item.periodicity || 'Mensal',
                                });
                              } else {
                                updatePricingItem(item.id, 'name', val);
                              }
                            } else {
                              updatePricingItem(item.id, 'name', '');
                            }
                          }}
                        >
                          <option value="Sinal">Tipo: Sinal</option>
                          <option value="Entrada">Tipo: Entrada</option>
                          <option value="Intermediárias">Tipo: Intermediárias</option>
                          <option value="Chaves">Tipo: Chaves</option>
                          <option value="Outro">Tipo: Outro...</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <select
                          className="form-select"
                          style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                          value={currentMethodSelectValue}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== 'Outro') {
                              updatePricingItem(item.id, 'method', val);
                            } else {
                              updatePricingItem(item.id, 'method', '');
                            }
                          }}
                        >
                          <option value="Dinheiro">Forma: Dinheiro</option>
                          <option value="Imóvel">Forma: Imóvel</option>
                          <option value="Veículo">Forma: Veículo</option>
                          <option value="Serviço">Forma: Serviço</option>
                          <option value="Material">Forma: Material</option>
                          <option value="Outro">Forma: Outro...</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      {item.name !== 'Intermediárias' && (
                        <div className="form-group">
                          <select
                            className="form-select"
                            style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                            value={currentTermType}
                            onChange={(e) => {
                              const val = e.target.value;
                              updatePricingItem(item.id, 'paymentTermType', val);
                              if (val === 'Parcelado' && !item.periodicity) {
                                updatePricingItem(item.id, 'periodicity', 'Mensal');
                              }
                            }}
                          >
                            {PAYMENT_TERM_OPTIONS.map((term) => (
                              <option key={term} value={term}>
                                Prazo: {term}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {(currentTermType === 'Parcelado' || item.name === 'Intermediárias') ? (
                        <div className="form-group">
                          <select
                            className="form-select"
                            style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                            value={item.periodicity || 'Mensal'}
                            onChange={(e) => updatePricingItem(item.id, 'periodicity', e.target.value)}
                          >
                            {PERIODICITY_OPTIONS.map((per) => (
                              <option key={per} value={per}>
                                Periodicidade: {per}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                            value={item.value || ''}
                            onChange={(e) => updatePricingItem(item.id, 'value', e.target.value)}
                            placeholder="Valor (R$)"
                          />
                        </div>
                      )}
                    </div>

                    {(currentTermType === 'Parcelado' || item.name === 'Intermediárias') && (
                      <div className="form-row">
                        <div className="form-group">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            className="form-input"
                            style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                            value={item.installmentsCount || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updatePricingItem(item.id, 'installmentsCount', isNaN(val) ? undefined : val);
                            }}
                            placeholder="Qtd. de Parcelas"
                          />
                        </div>

                        <div className="form-group">
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                            value={item.value || ''}
                            onChange={(e) => updatePricingItem(item.id, 'value', e.target.value)}
                            placeholder="Valor da Parcela (R$)"
                          />
                        </div>
                      </div>
                    )}

                    {(currentTermType === 'Parcelado' || item.name === 'Intermediárias') && item.installmentsCount && item.installmentsCount > 1 && itemTotal > 0 && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, textAlign: 'right', marginTop: '-0.2rem' }}>
                        Subtotal do Item ({item.installmentsCount}x): {formatNumberToCurrency(itemTotal)}
                      </div>
                    )}

                    {currentSelectValue === 'Outro' && (
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-input"
                          value={item.name || ''}
                          onChange={(e) => updatePricingItem(item.id, 'name', e.target.value)}
                          placeholder="Nome Personalizado do Tipo"
                        />
                      </div>
                    )}

                    {currentMethodSelectValue === 'Outro' && (
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-input"
                          value={item.method || ''}
                          onChange={(e) => updatePricingItem(item.id, 'method', e.target.value)}
                          placeholder="Forma Personalizada"
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <input
                        type="text"
                        className="form-input"
                        value={item.description || ''}
                        onChange={(e) => updatePricingItem(item.id, 'description', e.target.value)}
                        placeholder="Observações (Ex: Na assinatura da proposta)"
                      />
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                className="btn-add-block"
                onClick={addPricingItem}
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.2rem' }}
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>

            {/* SELEÇÃO DO ÍNDICE DE REAJUSTE / CORREÇÃO MONETÁRIA */}
            <div className="form-group" style={{ marginTop: '0.5rem', gap: '0.6rem' }}>
              <select
                className="form-select"
                style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                value={section.adjustmentType || 'CUB até a entrega das chaves'}
                onChange={(e) => {
                  const type = e.target.value;
                  const index = section.postKeysIndex || 'IGP-M';
                  const pct = section.postKeysPercentage || '1.00%';
                  const terms = generatePaymentTermsText(type, index, pct);
                  onChange({
                    ...section,
                    adjustmentType: type,
                    paymentTerms: terms,
                  });
                }}
              >
                <option value="CUB em todas as parcelas">Reajuste: CUB em todas as parcelas</option>
                <option value="CUB até a entrega das chaves">Reajuste: CUB até a entrega das chaves</option>
                <option value="Sem reajuste">Reajuste: Sem reajuste</option>
                <option value="Outro...">Reajuste: Outro...</option>
              </select>

              {section.adjustmentType === 'CUB até a entrega das chaves' && (
                <div className="form-row">
                  <div className="form-group">
                    <select
                      className="form-select"
                      style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                      value={section.postKeysIndex || 'IGP-M'}
                      onChange={(e) => {
                        const index = e.target.value;
                        const type = section.adjustmentType || 'CUB até a entrega das chaves';
                        const pct = section.postKeysPercentage || '1.00%';
                        const terms = generatePaymentTermsText(type, index, pct);
                        onChange({
                          ...section,
                          postKeysIndex: index,
                          paymentTerms: terms,
                        });
                      }}
                    >
                      {POST_KEYS_INDEX_OPTIONS.map((idxOption) => (
                        <option key={idxOption} value={idxOption}>
                          Pós-chaves: {idxOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontWeight: 600, color: 'var(--color-accent)' }}
                      value={section.postKeysPercentage || ''}
                      onChange={(e) => {
                        const pct = e.target.value;
                        const type = section.adjustmentType || 'CUB até a entrega das chaves';
                        const index = section.postKeysIndex || 'IGP-M';
                        const terms = generatePaymentTermsText(type, index, pct);
                        onChange({
                          ...section,
                          postKeysPercentage: pct,
                          paymentTerms: terms,
                        });
                      }}
                      placeholder="Percentual (+ % a.m. ex: 1.00%)"
                    />
                  </div>
                </div>
              )}

              {section.adjustmentType === 'Outro...' && (
                <input
                  type="text"
                  className="form-input"
                  value={section.paymentTerms || ''}
                  onChange={(e) => updateField('paymentTerms', e.target.value)}
                  placeholder="Descreva o índice de reajuste personalizado..."
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. DADOS DO CORRETOR */}
      <div className={`sub-card ${openCard === 'broker' ? 'open' : ''}`}>
        <div className="sub-card-header" onClick={() => toggleCard('broker')}>
          <div className="sub-card-title">
            <User size={16} color="var(--color-accent)" />
            <span style={{ color: openCard === 'broker' ? 'var(--color-accent)' : 'var(--color-text)' }}>
              3. Dados do Corretor
            </span>
          </div>
          {openCard === 'broker' ? (
            <ChevronDown size={16} color="var(--color-accent)" />
          ) : (
            <ChevronRight size={16} />
          )}
        </div>

        {openCard === 'broker' && (
          <div className="sub-card-body">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={section.brokerName || ''}
                onChange={(e) => updateField('brokerName', e.target.value)}
                placeholder="Nome do Corretor / Intermediador"
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <input
                  type="text"
                  className="form-input"
                  value={section.brokerCreciNumber || ''}
                  onChange={(e) => handleCreciNumberChange(e.target.value)}
                  placeholder="CRECI N° (Ex: 12.345-F)"
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <select
                  className="form-select"
                  value={section.brokerCreciUf || 'SP'}
                  onChange={(e) => handleCreciUfChange(e.target.value)}
                >
                  {UF_LIST.map((uf) => (
                    <option key={uf} value={uf}>
                      UF: {uf}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={section.brokerPhone || ''}
                onChange={(e) => updateField('brokerPhone', formatPhoneInput(e.target.value))}
                placeholder="Telefone / WhatsApp"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-input"
                value={section.brokerAgency || ''}
                onChange={(e) => updateField('brokerAgency', e.target.value)}
                placeholder="Imobiliária / Empresa (Opcional)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
