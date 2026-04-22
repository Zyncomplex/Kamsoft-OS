export type UserRole = 'SDR' | 'Manager' | 'Designer' | 'Production' | 'QA' | 'Admin' | 'GM' | 'CEO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Invoice Sent' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  source: string;
  brand: string;
  country: string;
  assignedSdrId?: string;
  status: LeadStatus;
  createdAt: string;
  lastActivityAt: string;
  slaDeadline: string;
}

export type OrderStatus = 'Awaiting Payment' | 'Design' | 'Production' | 'QA' | 'Shipping' | 'Delivered';

export interface Order {
  id: string;
  leadId: string;
  customerName: string;
  brand: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}
