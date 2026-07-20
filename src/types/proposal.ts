export type SectionType = 'header' | 'text' | 'deliverables' | 'pricing' | 'timeline' | 'terms';

export interface PricingItem {
  id: string;
  name?: string;               // Tipo (Sinal, Entrada, Parcelas, Reforços, Chaves, Outro)
  method?: string;             // Forma de Pagamento (Dinheiro, Imóvel, Veículo, Serviço, Material, Outro)
  paymentTermType?: string;    // Prazo (À vista, Parcelado)
  periodicity?: string;        // Periodicidade (Mensal, Trimestral, Semestral, Anual)
  installmentsCount?: number;  // Quantidade de parcelas (número inteiro)
  description?: string;
  value?: string;
  amountNumber?: number;
}

export interface PropertyItem {
  id: string;
  projectName?: string;
  unitIdentifier?: string;
  unitDescription?: string;
  totalValue?: string;
  totalValueNum?: number;
}

export interface HeaderSection {
  id: string;
  type: 'header';
  title?: string;
  brokerName?: string;
  brokerPhone?: string;
  brokerCreci?: string;
  brokerCreciNumber?: string;
  brokerCreciUf?: string;
  brokerAgency?: string;
  
  // Lista de Imóveis (1 ou mais imóveis)
  properties?: PropertyItem[];
  
  // Retrocompatibilidade opcional
  projectName?: string;
  unitIdentifier?: string;
  unitDescription?: string;
  totalValue?: string;
  totalValueNum?: number;
  
  date?: string;
  validity?: string;
  pricingItems?: PricingItem[];
  paymentTerms?: string;

  // Reajuste & Correção Monetária
  adjustmentType?: string;
  postKeysIndex?: string;
  postKeysPercentage?: string;
}

export interface TextSection {
  id: string;
  type: 'text';
  title?: string;
  content?: string;
}

export interface DeliverablesItem {
  id: string;
  title?: string;
  description?: string;
}

export interface DeliverablesSection {
  id: string;
  type: 'deliverables';
  title?: string;
  items: DeliverablesItem[];
}

export interface PricingSection {
  id: string;
  type: 'pricing';
  title?: string;
  items: PricingItem[];
  paymentTerms?: string;
  notes?: string;

  // Reajuste & Correção Monetária
  adjustmentType?: string;
  postKeysIndex?: string;
  postKeysPercentage?: string;
}

export interface TimelinePhase {
  id: string;
  name?: string;
  duration?: string;
  deliverables?: string;
}

export interface TimelineSection {
  id: string;
  type: 'timeline';
  title?: string;
  phases: TimelinePhase[];
}

export interface TermsSection {
  id: string;
  type: 'terms';
  title?: string;
  clauses?: string[];
  providerSignerName?: string;
  providerSignerRole?: string;
  clientSignerName?: string;
  clientSignerRole?: string;
}

export type Section =
  | HeaderSection
  | TextSection
  | DeliverablesSection
  | PricingSection
  | TimelineSection
  | TermsSection;

export interface Proposal {
  id: string;
  sections: Section[];
}
