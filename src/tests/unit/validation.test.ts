import { describe, it, expect } from 'vitest';
import { documentCreateSchema } from '@/lib/validations/document';
import { registerSchema, loginSchema } from '@/lib/validations/auth';

describe('Document Schema Validation', () => {
  it('validates a correct document payload', () => {
    const validData = {
      title: 'Car Insurance',
      category: 'INSURANCE',
      documentNumber: 'POL-123456',
      issueDate: '2026-01-10',
      expiryDate: '2027-01-10',
      notes: 'Renew before expiry',
    };

    const result = documentCreateSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects title shorter than 2 characters', () => {
    const invalidData = {
      title: 'A',
      category: 'IDENTITY',
    };

    const result = documentCreateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toBeDefined();
    }
  });

  it('rejects title longer than 100 characters', () => {
    const invalidData = {
      title: 'A'.repeat(101),
      category: 'IDENTITY',
    };

    const result = documentCreateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const invalidData = {
      title: 'My Custom Pass',
      category: 'NON_EXISTENT_CATEGORY',
    };

    const result = documentCreateSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects issueDate that is after expiryDate', () => {
    const invalidDates = {
      title: 'Driving Licence',
      category: 'CERTIFICATION',
      issueDate: '2027-01-10',
      expiryDate: '2026-01-10', // Expiry before issue!
    };

    const result = documentCreateSchema.safeParse(invalidDates);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Issue date cannot be after the expiry date');
    }
  });

  it('accepts issueDate equal to expiryDate', () => {
    const sameDates = {
      title: 'One-Day Event Pass',
      category: 'OTHER',
      issueDate: '2026-10-15',
      expiryDate: '2026-10-15',
    };

    const result = documentCreateSchema.safeParse(sameDates);
    expect(result.success).toBe(true);
  });
});

describe('Auth Validation Schemas', () => {
  it('validates correct registration data', () => {
    const valid = {
      name: 'deepak tayde',
      email: 'deepakTayde@example.com',
      password: 'password123',
    };

    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects passwords shorter than 6 characters', () => {
    const shortPass = {
      email: 'deepakTayde@example.com',
      password: '123',
    };

    const result = registerSchema.safeParse(shortPass);
    expect(result.success).toBe(false);
  });

  it('rejects invalid emails', () => {
    const badEmail = {
      email: 'not-an-email',
      password: 'password123',
    };

    const result = loginSchema.safeParse(badEmail);
    expect(result.success).toBe(false);
  });
});
