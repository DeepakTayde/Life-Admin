import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/types/document';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight, Clock, PlusCircle } from 'lucide-react';

interface UpcomingRenewalsProps {
  renewals: DocumentItem[];
}

export function UpcomingRenewals({ renewals }: UpcomingRenewalsProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">Upcoming Renewals</h2>
        </div>
        <Link
          href="/documents"
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {renewals.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-900">No upcoming renewals found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You don't have any documents expiring soon or in the near future.
          </p>
          <Link
            href="/documents/new"
            className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add a Document</span>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {renewals.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/documents/${item.id}`}
                    className="font-semibold text-sm text-slate-900 hover:text-indigo-600 transition"
                  >
                    {item.title}
                  </Link>
                  <CategoryBadge category={item.category} showIcon={false} />
                </div>
                {item.documentNumber && (
                  <p className="text-xs text-slate-500 font-mono">
                    Ref: {item.documentNumber}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Expires</div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800">
                    {formatDate(item.expiryDate)}
                  </div>
                </div>

                <StatusBadge
                  status={item.status || 'ACTIVE'}
                  daysUntilExpiry={item.daysUntilExpiry}
                  showDays={true}
                />

                <Link
                  href={`/documents/${item.id}`}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                  aria-label={`View details for ${item.title}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
