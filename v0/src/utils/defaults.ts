import type {
  Proposal,
  HeaderSection,
  TextSection,
  DeliverablesSection,
  PricingSection,
  TimelineSection,
  TermsSection,
  Section,
  SectionType,
} from '../types/proposal';

export function createId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function createDefaultHeaderSection(): HeaderSection {
  return {
    id: createId(),
    type: 'header',
    title: 'PROPOSTA COMERCIAL',
    subtitle: 'Título do Projeto / Serviço',
    providerName: '',
    providerCompany: '',
    providerEmail: '',
    providerPhone: '',
    clientName: '',
    clientCompany: '',
    date: new Date().toLocaleDateString('pt-BR'),
    validity: '15 dias',
  };
}

export function createDefaultSection(type: SectionType): Section {
  const id = createId();
  switch (type) {
    case 'header':
      return createDefaultHeaderSection();
    case 'text':
      return {
        id,
        type: 'text',
        title: 'Visão Geral & Apresentação',
        content: 'Descreva aqui os detalhes da proposta, contexto do cliente e solução recomendada.',
      } as TextSection;
    case 'deliverables':
      return {
        id,
        type: 'deliverables',
        title: 'Escopo & Entregáveis',
        items: [
          { id: createId(), title: 'Entregável 1', description: 'Descrição detalhada do primeiro item entregável' },
          { id: createId(), title: 'Entregável 2', description: 'Descrição detalhada do segundo item entregável' },
        ],
      } as DeliverablesSection;
    case 'pricing':
      return {
        id,
        type: 'pricing',
        title: 'Investimento & Valores',
        items: [
          { id: createId(), name: 'Serviço / Módulo 1', description: 'Detalhamento dos custos do módulo', price: 'R$ 5.000,00' },
        ],
        paymentTerms: '50% no aceite da proposta e 50% na conclusão e entrega final.',
        notes: 'Valores válidos conforme prazo estipulado na proposta.',
      } as PricingSection;
    case 'timeline':
      return {
        id,
        type: 'timeline',
        title: 'Cronograma de Execução',
        phases: [
          { id: createId(), name: 'Fase 1 - Alinhamento e Planejamento', duration: '1 a 2 semanas', deliverables: 'Kickoff e Definição de Requisitos' },
          { id: createId(), name: 'Fase 2 - Execução e Desenvolvimento', duration: '3 a 4 semanas', deliverables: 'Entrega da Versão Beta' },
        ],
      } as TimelineSection;
    case 'terms':
      return {
        id,
        type: 'terms',
        title: 'Termos e Condições',
        clauses: [
          'Esta proposta comercial possui validade de 15 dias a contar de sua emissão.',
          'Quaisquer alterações de escopo sofrerão revisão de prazos e valores.',
        ],
        providerSignerName: '',
        providerSignerRole: 'Contratado',
        clientSignerName: '',
        clientSignerRole: 'Contratante',
      } as TermsSection;
  }
}

export function createInitialProposal(): Proposal {
  return {
    id: createId(),
    sections: [createDefaultHeaderSection()],
  };
}
