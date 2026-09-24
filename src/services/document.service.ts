import { prisma } from '@/lib/prisma';
import { calculateExpiryStatus, getDaysUntilExpiry } from '@/lib/utils';
import { DocumentFilterInput, DocumentCreateInput, DocumentUpdateInput } from '@/lib/validations/document';
import { DocumentItem } from '@/types/document';
import { Prisma } from '@prisma/client';

/**
 * Format a Prisma Document record to our standardized DocumentItem
 */
function mapToDocumentItem(doc: {
  id: string;
  userId: string;
  title: string;
  category: string;
  documentNumber: string | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): DocumentItem {
  return {
    id: doc.id,
    userId: doc.userId,
    title: doc.title,
    category: doc.category as DocumentItem['category'],
    documentNumber: doc.documentNumber,
    issueDate: doc.issueDate ? doc.issueDate.toISOString() : null,
    expiryDate: doc.expiryDate ? doc.expiryDate.toISOString() : null,
    notes: doc.notes,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    status: calculateExpiryStatus(doc.expiryDate),
    daysUntilExpiry: getDaysUntilExpiry(doc.expiryDate),
  };
}

export const documentService = {
  /**
   * Get all documents for an authenticated user with filtering, search, and sorting
   */
  async getDocuments(userId: string, filters: DocumentFilterInput = {}): Promise<DocumentItem[]> {
    const whereClause: Prisma.DocumentWhereInput = {
      userId,
    };

    // Category filter
    if (filters.category && filters.category !== 'ALL') {
      whereClause.category = filters.category;
    }

    // Search by title or document number (case-insensitive)
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.trim();
      whereClause.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { documentNumber: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Sorting
    const sortBy = filters.sortBy || 'expiryDate';
    const sortOrder = filters.sortOrder || 'asc';

    let orderBy: Prisma.DocumentOrderByWithRelationInput;
    if (sortBy === 'title') {
      orderBy = { title: sortOrder };
    } else if (sortBy === 'createdAt') {
      orderBy = { createdAt: sortOrder };
    } else {
      // Expiry date ordering with nulls last
      orderBy = { expiryDate: { sort: sortOrder, nulls: 'last' } };
    }

    const records = await prisma.document.findMany({
      where: whereClause,
      orderBy,
    });

    let items = records.map(mapToDocumentItem);

    // Status filter (post-mapping to ensure calculated expiry accuracy)
    if (filters.status && filters.status !== 'ALL') {
      items = items.filter((item) => item.status === filters.status);
    }

    return items;
  },

  /**
   * Get single document by ID, securely scoped by userId
   */
  async getDocumentById(userId: string, id: string): Promise<DocumentItem | null> {
    const record = await prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!record) {
      return null;
    }

    return mapToDocumentItem(record);
  },

  /**
   * Create a new document for the authenticated user
   */
  async createDocument(userId: string, data: DocumentCreateInput): Promise<DocumentItem> {
    const record = await prisma.document.create({
      data: {
        userId,
        title: data.title,
        category: data.category,
        documentNumber: data.documentNumber ?? null,
        issueDate: data.issueDate ?? null,
        expiryDate: data.expiryDate ?? null,
        notes: data.notes ?? null,
      },
    });

    return mapToDocumentItem(record);
  },

  /**
   * Update an existing document, verifying ownership first
   */
  async updateDocument(
    userId: string,
    id: string,
    data: DocumentUpdateInput
  ): Promise<DocumentItem | null> {
    // Verify existence & ownership
    const existing = await prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return null;
    }

    const record = await prisma.document.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.documentNumber !== undefined && { documentNumber: data.documentNumber }),
        ...(data.issueDate !== undefined && { issueDate: data.issueDate }),
        ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return mapToDocumentItem(record);
  },

  /**
   * Delete document, verifying ownership first
   */
  async deleteDocument(userId: string, id: string): Promise<boolean> {
    // Verify existence & ownership
    const existing = await prisma.document.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return false;
    }

    await prisma.document.delete({
      where: { id },
    });

    return true;
  },
};
