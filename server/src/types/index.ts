export enum UserRole {
  CEO = 'CEO',
  GM = 'GM',
  Manager = 'Manager',
  SDR = 'SDR',
  Designer = 'Designer',
  QA = 'QA',
  Production = 'Production',
  Admin = 'Admin',
}

export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Invoice_Sent = 'Invoice_Sent',
  Won = 'Won',
  Lost = 'Lost',
}

export enum OrderStatus {
  Awaiting_Payment = 'Awaiting_Payment',
  Design = 'Design',
  Production = 'Production',
  QA = 'QA',
  Shipping = 'Shipping',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

export enum QuoteStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Expired = 'Expired',
}

export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled',
}

export enum ProductionStatus {
  Queued = 'Queued',
  In_Production = 'In_Production',
  Finishing = 'Finishing',
  Ready = 'Ready',
  Shipped_To_QA = 'Shipped_To_QA',
  Completed = 'Completed',
}

export enum DesignStatus {
  Pending = 'Pending',
  In_Progress = 'In_Progress',
  Awaiting_Approval = 'Awaiting_Approval',
  Revision = 'Revision',
  Approved = 'Approved',
}

export enum QAStatus {
  Pending = 'Pending',
  In_Progress = 'In_Progress',
  Passed = 'Passed',
  Failed = 'Failed',
}

export enum ShipmentStatus {
  Label_Created = 'Label_Created',
  Picked_Up = 'Picked_Up',
  In_Transit = 'In_Transit',
  Delivered = 'Delivered',
  Exception = 'Exception',
}

export enum IntegrationType {
  stripe = 'stripe',
  fedex = 'fedex',
  dhl = 'dhl',
  ups = 'ups',
  ringcentral = 'ringcentral',
  gmail = 'gmail',
  tawkto = 'tawkto',
}

export enum MessageSenderType {
  staff = 'staff',
  customer = 'customer',
  system = 'system',
}

export enum ConversationChannel {
  email = 'email',
  chat = 'chat',
  phone = 'phone',
  internal = 'internal',
}

export enum PriorityLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
}
