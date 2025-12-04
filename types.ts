export interface Source {
  title: string;
  uri: string;
}

export interface Lead {
  id: string;
  companyName: string;
  summary: string;
  website?: string;
  emails: string[];
  phones: string[];
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  region: string;
  category: string;
  confidenceScore: number; // 0-100
  sources: Source[]; // Search grounding sources
  mapLink?: string; // Maps grounding link
  dateFound: string;
}

export interface SearchParams {
  product: string;
  region: string;
  limit: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SEARCH = 'SEARCH',
  LEADS = 'LEADS',
  N8N_CONFIG = 'N8N_CONFIG',
}

export interface N8nWebhookConfig {
  webhookUrl: string;
  autoSync: boolean;
}

export interface User {
  name: string;
  email: string;
  company: string;
  role: string;
}