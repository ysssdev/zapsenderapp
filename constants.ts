import { Plan, Campaign, Instance, Contact } from './types';

export const PLANS: Record<string, Plan> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 799,
    monthlyCredits: 2000,
    dailyLimit: 200,
    instances: 1,
    features: ['Disparo Básico', 'Upload CSV', 'Suporte Email']
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 1500,
    monthlyCredits: 10000,
    dailyLimit: 1000,
    instances: 3,
    features: ['Tudo do Starter', 'Tags Avançadas', 'Agendamento', 'Suporte Prioritário']
  },
  BUSINESS: {
    id: 'BUSINESS',
    name: 'Business',
    price: 2000,
    monthlyCredits: 50000,
    dailyLimit: 5000,
    instances: 10,
    features: ['Tudo do Pro', 'Múltiplos Usuários', 'API de Integração', 'Gerente de Conta']
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 3000,
    monthlyCredits: 200000,
    dailyLimit: 20000,
    instances: 50,
    features: ['Infra Dedicada', 'White Label', 'SLA Garantido', 'Customização Total']
  }
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Promoção Black Friday',
    message: 'Olá {{nome}}, aproveite nossas ofertas exclusivas!',
    createdAt: '2023-10-25T10:00:00Z',
    status: 'COMPLETED',
    totalContacts: 1500,
    sentCount: 1480,
    failedCount: 20,
    tags: ['promo', 'clientes-vip']
  },
  {
    id: '2',
    name: 'Lembrete de Renovação',
    message: 'Oi {{nome}}, sua assinatura vence em 3 dias.',
    createdAt: '2023-11-01T09:00:00Z',
    status: 'RUNNING',
    totalContacts: 500,
    sentCount: 215,
    failedCount: 2,
    tags: ['cobrança']
  },
  {
    id: '3',
    name: 'Novidades de Dezembro',
    message: 'Confira o que chegou na loja, {{nome}}!',
    scheduledFor: '2023-12-01T08:00:00Z',
    createdAt: '2023-11-15T14:30:00Z',
    status: 'SCHEDULED',
    totalContacts: 3000,
    sentCount: 0,
    failedCount: 0,
    tags: ['newsletter']
  }
];

export const MOCK_INSTANCES: Instance[] = [
  {
    id: 'inst_01',
    name: 'Vendas Principal',
    status: 'CONNECTED',
    provider: 'EVOLUTION',
    phone: '+55 11 99999-8888',
    battery: 85
  },
  {
    id: 'inst_02',
    name: 'Suporte Técnico',
    status: 'DISCONNECTED',
    provider: 'Z-API'
  }
];

export const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Silva', phone: '5511999991111', tags: ['vip', 'sp'], status: 'VALID' },
  { id: '2', name: 'Bob Santos', phone: '5511999992222', tags: ['lead'], status: 'VALID' },
  { id: '3', name: 'Carlos Oliveira', phone: '5511999993333', tags: ['churn'], status: 'OPT_OUT' },
  { id: '4', name: 'Diana Costa', phone: '5511999994444', tags: ['novo'], status: 'INVALID' },
];