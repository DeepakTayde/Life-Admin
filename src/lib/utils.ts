import { DocumentCategory, DocumentStatus } from '@/types/document';

/**
 * Merge class names safely
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Standardize date to start of day (midnight) in local/UTC calculation
 * to prevent minute-level shifts from affecting expiry classification.
 */
export function toStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Centralized Document Expiry Status Rule
 *
 * Rules (from PRD Section 6):
 * - NO_EXPIRY: expiry date is null or undefined
 * - EXPIRED: expiry date is before today
 * - EXPIRING_SOON: expiry date is today or within the next 30 days
 * - ACTIVE: expiry date is more than 30 days away
 */
export function calculateExpiryStatus(
  expiryDate: Date | string | null | undefined,
  referenceDate: Date = new Date()
): DocumentStatus {
  if (!expiryDate) {
    return 'NO_EXPIRY';
  }

  const exp = toStartOfDay(new Date(expiryDate));
  if (isNaN(exp.getTime())) {
    return 'NO_EXPIRY';
  }

  const today = toStartOfDay(referenceDate);
  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'EXPIRED';
  }

  if (diffDays <= 30) {
    return 'EXPIRING_SOON';
  }

  return 'ACTIVE';
}

/**
 * Calculate difference in whole days between expiry date and reference date (today)
 */
export function getDaysUntilExpiry(
  expiryDate: Date | string | null | undefined,
  referenceDate: Date = new Date()
): number | null {
  if (!expiryDate) {
    return null;
  }

  const exp = toStartOfDay(new Date(expiryDate));
  if (isNaN(exp.getTime())) {
    return null;
  }

  const today = toStartOfDay(referenceDate);
  const diffTime = exp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Human readable date format (e.g., "12 Oct 2026")
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Format date for HTML date inputs (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Status badge styling
 * Ensures color is not the only indicator - provides distinct badges & accessible styling
 */
export function getStatusBadgeConfig(status: DocumentStatus): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Active / Verified',
        badgeClass: 'bg-[#2e7d32] text-white border-[#256629]',
        dotClass: 'bg-white',
      };
    case 'EXPIRING_SOON':
      return {
        label: 'Expiring Soon',
        badgeClass: 'bg-[#d97706] text-white border-[#b45309]',
        dotClass: 'bg-white animate-pulse',
      };
    case 'EXPIRED':
      return {
        label: 'Expired / Action Required',
        badgeClass: 'bg-[#c62828] text-white border-[#a81e1e]',
        dotClass: 'bg-white',
      };
    case 'NO_EXPIRY':
    default:
      return {
        label: 'No Expiry',
        badgeClass: 'bg-[#546e7a] text-white border-[#455a64]',
        dotClass: 'bg-white',
      };
  }
}

/**
 * Category styling & badge configuration
 */
export function getCategoryBadgeClass(category: DocumentCategory): string {
  switch (category) {
    case 'IDENTITY':
      return 'bg-blue-50 text-blue-700 border-blue-200/60';
    case 'INSURANCE':
      return 'bg-purple-50 text-purple-700 border-purple-200/60';
    case 'VEHICLE':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
    case 'CERTIFICATION':
      return 'bg-teal-50 text-teal-700 border-teal-200/60';
    case 'WARRANTY':
      return 'bg-amber-50 text-amber-800 border-amber-200/60';
    case 'SUBSCRIPTION':
      return 'bg-pink-50 text-pink-700 border-pink-200/60';
    case 'OTHER':
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200/60';
  }
}
