export type UserRole = 'SDR' | 'Manager' | 'Designer' | 'Production' | 'QA' | 'Admin' | 'GM' | 'CEO';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  brand_ids: string[];
  active_brand_id: string | null;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Invoice Sent' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  display_id: string;
  customer_id: string;
  brand_id: string;
  source: string;
  assigned_sdr_id?: string;
  status: LeadStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
  sla_deadline?: string;
  created_at: string;
  updated_at: string;
  // Join fields
  customer?: {
    name: string;
    email: string;
  };
}

export type OrderStatus = 'Awaiting_Payment' | 'Design' | 'Production' | 'QA' | 'Shipping' | 'Delivered';

export interface Order {
  id: string;
  display_id: string;
  quote_id: string;
  customer_id: string;
  brand_id: string;
  status: OrderStatus;
  total: number;
  currency: string;
  created_at: string;
  updated_at: string;
  // Join fields
  customer?: {
    name: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  currency: string;
  settings: BrandSettings;
  is_active: boolean;
}

export interface BrandSettings {
  tax_rate: number;
  sla_minutes_lead: number;
  enable_auto_assignment: boolean;
  [key: string]: any;
}
