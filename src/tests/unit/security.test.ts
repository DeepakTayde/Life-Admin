import { describe, it, expect, vi } from 'vitest';
import { documentService } from '@/services/document.service';
import { prisma } from '@/lib/prisma';

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('Security & Multi-tenant Ownership Isolation', () => {
  const userA_Id = 'user_deepakTayde_123';
  const userB_Id = 'user_deepak_456';
  const docId = 'doc_car_insurance_789';

  it('prevents User A from reading User B document', async () => {
    // When querying with User A's ID, Prisma findFirst returns null because doc belongs to User B
    vi.mocked(prisma.document.findFirst).mockResolvedValueOnce(null);

    const result = await documentService.getDocumentById(userA_Id, docId);

    expect(result).toBeNull();
    // Verify that the query strictly scoped by userId: userA_Id
    expect(prisma.document.findFirst).toHaveBeenCalledWith({
      where: {
        id: docId,
        userId: userA_Id,
      },
    });
  });

  it('prevents User A from updating User B document', async () => {
    // findFirst returns null for unauthorized user
    vi.mocked(prisma.document.findFirst).mockResolvedValueOnce(null);

    const result = await documentService.updateDocument(userA_Id, docId, {
      title: 'Hacked Title',
    });

    expect(result).toBeNull();
    // Update was blocked before touching database update
    expect(prisma.document.update).not.toHaveBeenCalled();
  });

  it('prevents User A from deleting User B document', async () => {
    // findFirst returns null for unauthorized user
    vi.mocked(prisma.document.findFirst).mockResolvedValueOnce(null);

    const result = await documentService.deleteDocument(userA_Id, docId);

    expect(result).toBe(false);
    // Delete was blocked before touching database delete
    expect(prisma.document.delete).not.toHaveBeenCalled();
  });

  it('allows document owner to access their own document', async () => {
    const mockDoc = {
      id: docId,
      userId: userB_Id,
      title: 'Health Insurance',
      category: 'INSURANCE',
      documentNumber: 'POL-999',
      issueDate: new Date('2026-01-01'),
      expiryDate: new Date('2027-01-01'),
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(prisma.document.findFirst).mockResolvedValueOnce(mockDoc as any);

    const result = await documentService.getDocumentById(userB_Id, docId);

    expect(result).not.toBeNull();
    expect(result?.title).toBe('Health Insurance');
    expect(result?.userId).toBe(userB_Id);
  });
});
