export type PlanTier = 'STARTER' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface Plan {
  id: PlanTier;
  name: string;
  price: number;
  monthlyCredits: number;
  dailyLimit: number;
  instances: number;
  features: string[];
}

export interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  company: string;
  plan: PlanTier;
  credits: number;
  creditsUsedToday: number;
  avatarUrl?: string;
  role?: 'admin' | 'user';
}

export type CampaignStatus = 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  message: string;
  scheduledFor?: string; // ISO Date
  createdAt: string;
  status: CampaignStatus;
  total: number;
  sent: number;
  failed: number;
  progress: number;
  tags?: string[];
  mediaUrl?: string;
  mediaType?: string;
  mediaName?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  status: 'VALID' | 'INVALID' | 'OPT_OUT';
  lastInteracted?: string;
}

export interface Instance {
  id: string;
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'PAIRING';
  provider: 'Z-API' | 'EVOLUTION' | 'BAILEYS' | 'CLOUD_API';
  phone?: string;
  battery?: number;
}