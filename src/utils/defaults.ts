import type {
  Proposal,
  HeaderSection,
  PropertyItem,
  PricingItem,
} from '../types/proposal';

export const UF_LIST = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const PAYMENT_METHOD_OPTIONS = ['Dinheiro', 'Imóvel', 'Veículo', 'Serviço', 'Material'];
export const PAYMENT_TERM_OPTIONS = ['À vista', 'Parcelado'];
export const PERIODICITY_OPTIONS = ['Mensal', 'Trimestral', 'Semestral', 'Anual'];

export const POST_KEYS_INDEX_OPTIONS = ['IGP-M', 'IPCA', 'INPC'];

export function generatePaymentTermsText(
  adjustmentType: string,
  postKeysIndex?: string,
  postKeysPercentage?: string
): string {
  const index = postKeysIndex || 'IGP-M';
  const percentage = postKeysPercentage || '1.00%';

  switch (adjustmentType) {
    case 'CUB em todas as parcelas':
      return 'Correção monetária pelo CUB em todas as parcelas.';
    case 'CUB até a entrega das chaves':
      return `Correção monetária pelo CUB até a entrega das chaves; após a entrega, reajuste pelo ${index} acrescido de juros de ${percentage} ao mês.`;
    case 'Sem reajuste':
      return 'Valores fixos e irreajustáveis.';
    default:
      return 'Reajuste conforme condições específicas informadas nas observações.';
  }
}

export function getPricingItemTotal(item: PricingItem): number {
  const isParcelado = item.paymentTermType === 'Parcelado' || item.name === 'Intermediárias';
  const price = parseCurrencyToNumber(item.value);
  
  if (isParcelado) {
    const installments = item.installmentsCount || 1;
    return price * installments;
  }
  
  return price;
}

export function getPaymentOrderWeight(item: PricingItem): number {
  const name = (item.name || '').toLowerCase();
  if (name.includes('sinal') || name.includes('entrada')) return 1;
  if (name.includes('mensal') || name.includes('mensais')) return 2;
  if (name.includes('balão') || name.includes('balao') || name.includes('reforço') || name.includes('intermediária')) return 3;
  if (name.includes('chave') || name.includes('entrega')) return 4;
  if (name.includes('financiamento') || name.includes('banco') || name.includes('fgts')) return 5;
  return 6;
}

export function sortPricingItems(items: PricingItem[]): PricingItem[] {
  return [...items].sort((a, b) => getPaymentOrderWeight(a) - getPaymentOrderWeight(b));
}

export function createId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getTodayDateString(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
  const yyyy = today.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function parseCurrencyToNumber(val?: string | number): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  const clean = val.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export function formatNumberToCurrency(num: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

export function formatCurrencyInput(val: string): string {
  const clean = val.replace(/\D/g, '');
  if (!clean) return '';
  const num = parseFloat(clean) / 100;
  return formatNumberToCurrency(num);
}

export function formatPhoneInput(val: string): string {
  const clean = val.replace(/\D/g, '');
  if (clean.length <= 10) {
    return clean.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return clean.substring(0, 11).replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}

export function formatCreciNumberInput(val: string): string {
  const clean = val.replace(/\D/g, '');
  if (!clean) return '';
  const formatted = clean.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return formatted;
}

export function createDefaultPropertyItem(): PropertyItem {
  return {
    id: createId(),
    projectName: '',
    unitIdentifier: '',
    unitDescription: '',
    totalValue: '',
    totalValueNum: 0,
  };
}

export function createDefaultPricingItem(): PricingItem {
  return {
    id: createId(),
    name: 'Sinal',
    method: 'Dinheiro',
    paymentTermType: 'À vista',
    periodicity: 'Mensal',
    installmentsCount: undefined,
    description: '',
    value: '',
    amountNumber: 0,
  };
}

export function createDefaultHeaderSection(): HeaderSection {
  const defaultAdj = 'CUB em todas as parcelas';
  const defaultText = generatePaymentTermsText(defaultAdj);

  return {
    id: createId(),
    type: 'header',
    title: 'PROPOSTA',
    brokerName: '',
    brokerPhone: '',
    brokerCreci: '',
    brokerCreciNumber: '',
    brokerCreciUf: 'SP',
    brokerAgency: '',
    properties: [createDefaultPropertyItem()],
    date: getTodayDateString(),
    validity: '',
    adjustmentType: defaultAdj,
    postKeysIndex: 'IGP-M',
    postKeysPercentage: '',
    paymentTerms: defaultText,
    pricingItems: [createDefaultPricingItem()],
  };
}

export function createInitialProposal(): Proposal {
  return {
    id: createId(),
    sections: [
      createDefaultHeaderSection(),
    ],
  };
}
