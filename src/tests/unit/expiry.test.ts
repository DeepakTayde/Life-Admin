import { describe, it, expect } from 'vitest';
import { calculateExpiryStatus, getDaysUntilExpiry, toStartOfDay } from '@/lib/utils';

describe('Document Expiry Status Calculation', () => {
  const referenceDate = new Date('2026-10-01T12:00:00Z');

  it('returns NO_EXPIRY when expiry date is null or undefined', () => {
    expect(calculateExpiryStatus(null, referenceDate)).toBe('NO_EXPIRY');
    expect(calculateExpiryStatus(undefined, referenceDate)).toBe('NO_EXPIRY');
    expect(calculateExpiryStatus('', referenceDate)).toBe('NO_EXPIRY');
  });

  it('returns EXPIRED when expiry date is before reference date', () => {
    // Yesterday
    const pastDate = new Date('2026-09-30T10:00:00Z');
    expect(calculateExpiryStatus(pastDate, referenceDate)).toBe('EXPIRED');

    // 1 year ago
    const oneYearAgo = new Date('2025-10-01T00:00:00Z');
    expect(calculateExpiryStatus(oneYearAgo, referenceDate)).toBe('EXPIRED');
  });

  it('returns EXPIRING_SOON when expiry date is today', () => {
    const todayExpiry = new Date('2026-10-01T23:59:59Z');
    expect(calculateExpiryStatus(todayExpiry, referenceDate)).toBe('EXPIRING_SOON');
  });

  it('returns EXPIRING_SOON when expiry date is within 30 days', () => {
    // 15 days ahead
    const fifteenDays = new Date('2026-10-16T00:00:00Z');
    expect(calculateExpiryStatus(fifteenDays, referenceDate)).toBe('EXPIRING_SOON');

    // Exactly 30 days ahead (October has 31 days, so Oct 31 is +30 days)
    const thirtyDays = new Date('2026-10-31T00:00:00Z');
    expect(calculateExpiryStatus(thirtyDays, referenceDate)).toBe('EXPIRING_SOON');
  });

  it('returns ACTIVE when expiry date is more than 30 days away', () => {
    // 31 days ahead
    const thirtyOneDays = new Date('2026-11-01T00:00:00Z');
    expect(calculateExpiryStatus(thirtyOneDays, referenceDate)).toBe('ACTIVE');

    // 2 years ahead
    const futureDate = new Date('2028-10-01T00:00:00Z');
    expect(calculateExpiryStatus(futureDate, referenceDate)).toBe('ACTIVE');
  });

  it('correctly calculates days remaining until expiry', () => {
    expect(getDaysUntilExpiry(null, referenceDate)).toBeNull();

    // 10 days in future
    const tenDays = new Date('2026-10-11T00:00:00Z');
    expect(getDaysUntilExpiry(tenDays, referenceDate)).toBe(10);

    // 5 days in past
    const fiveDaysAgo = new Date('2026-09-26T00:00:00Z');
    expect(getDaysUntilExpiry(fiveDaysAgo, referenceDate)).toBe(-5);
  });
});
