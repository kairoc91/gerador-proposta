export type SectionType = 'header' | 'text' | 'deliverables' | 'pricing' | 'timeline' | 'terms';

export interface HeaderSection {
  id: string;
  type: 'header';
  title: string;
  subtitle: string;
  providerName: string;
  providerCompany: string;
  providerEmail: string;
  providerPhone: string;
  clientName: string;
  clientCompany: string;
  date: string;
  validity: string;
}

export interface TextSection {
  id: string;
  type: 'text';
  title: string;
  content: string;
}

export interface DeliverablesItem {
  id: string;
  title: string;
  description: string;
}

export interface DeliverablesSection {
  id: string;
  type: 'deliverables';
  title: string;
  items: DeliverablesItem[];
}

export interface PricingItem {
  id: string;
  name: string;
  description: string;
  price: string;
}

export interface PricingSection {
  id: string;
  type: 'pricing';
  title: string;
  items: PricingItem[];
  paymentTerms: string;
  notes?: string;
}

export interface TimelinePhase {
  id: string;
  name: string;
  duration: string;
  deliverables: string;
}

export interface TimelineSection {
  id: string;
  type: 'timeline';
  title: string;
  phases: TimelinePhase[];
}

export interface TermsSection {
  id: string;
  type: 'terms';
  title: string;
  clauses: string[];
  providerSignerName: string;
  providerSignerRole: string;
  clientSignerName: string;
  clientSignerRole: string;
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
