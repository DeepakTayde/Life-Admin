export type DocumentCategory =
  | 'IDENTITY'
  | 'INSURANCE'
  | 'VEHICLE'
  | 'CERTIFICATION'
  | 'WARRANTY'
  | 'SUBSCRIPTION'
  | 'OTHER';

export type DocumentStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'NO_EXPIRY';

export interface DocumentItem {
  id: string;
  userId: string;
  title: string;
  category: DocumentCategory;
  documentNumber: string | null;
  issueDate: string | null; // ISO string in API response
  expiryDate: string | null; // ISO string in API response
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  status?: DocumentStatus;
  daysUntilExpiry?: number | null;
}

export interface DocumentFilterParams {
  search?: string;
  category?: DocumentCategory | 'ALL';
  status?: DocumentStatus | 'ALL';
  sortBy?: 'expiryDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardSummary {
  totalCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  activeCount: number;
  upcomingRenewals: DocumentItem[];
}

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  IDENTITY: 'Identity & ID',
  INSURANCE: 'Insurance',
  VEHICLE: 'Vehicle & Transport',
  CERTIFICATION: 'Certificates & Licences',
  WARRANTY: 'Warranty & Guarantees',
  SUBSCRIPTION: 'Subscriptions & Memberships',
  OTHER: 'Other Important Docs',
};

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  ACTIVE: 'Active',
  EXPIRING_SOON: 'Expiring Soon',
  EXPIRED: 'Expired',
  NO_EXPIRY: 'No Expiry',
};
