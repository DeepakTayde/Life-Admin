import { prisma } from '@/lib/prisma';
import { calculateExpiryStatus, getDaysUntilExpiry, toStartOfDay } from '@/lib/utils';
import { DashboardSummary, DocumentItem } from '@/types/document';

export const dashboardService = {
  /**
   * Get dashboard statistics and upcoming renewals for the authenticated user
   */
  async getDashboardSummary(userId: string): Promise<DashboardSummary> {
    const today = toStartOfDay(new Date());
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    // Fetch user documents with required fields for counts & renewals
    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: {
        expiryDate: { sort: 'asc', nulls: 'last' },
      },
    });

    let expiringSoonCount = 0;
    let expiredCount = 0;
    let activeCount = 0;

    const mappedDocs: DocumentItem[] = documents.map((doc) => {
      const status = calculateExpiryStatus(doc.expiryDate, today);
      if (status === 'EXPIRING_SOON') expiringSoonCount++;
      else if (status === 'EXPIRED') expiredCount++;
      else if (status === 'ACTIVE') activeCount++;

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
        status,
        daysUntilExpiry: getDaysUntilExpiry(doc.expiryDate, today),
      };
    });

    // Upcoming renewals: documents with an expiryDate, sorted soonest first
    // Including both expiring soon and active future renewals
    const upcomingRenewals = mappedDocs
      .filter((doc) => doc.expiryDate !== null && (doc.status === 'EXPIRING_SOON' || doc.status === 'ACTIVE'))
      .slice(0, 5);

    return {
      totalCount: documents.length,
      expiringSoonCount,
      expiredCount,
      activeCount,
      upcomingRenewals,
    };
  },
};
