'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/types/document';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight, Clock, Plus, ExternalLink } from 'lucide-react';

interface UpcomingRenewalsProps {
  renewals: DocumentItem[];
}

export function UpcomingRenewals({ renewals }: UpcomingRenewalsProps) {
  return (
    <div className="bg-white rounded-lg border border-[#dcdcdc] shadow-xs overflow-hidden">
      {/* Government Table Header */}
      <div className="bg-[#0b3b60] text-white px-5 py-3 border-b-2 border-[#ff9933] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#ff9933]" />
          <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase">
            Official Statutory Expiry &amp; Renewal Schedule
          </h2>
        </div>
        <Link
          href="/documents"
          className="text-xs font-semibold text-[#ff9933] hover:text-white flex items-center gap-1 transition"
        >
          <span>All Vault Records</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {renewals.length === 0 ? (
        <div className="p-8 text-center bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-800">
            No impending expiry dates logged
          </p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
            You do not have any certificates or policies due for renewal in the near future.
          </p>
          <Link
            href="/documents/new"
            className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded bg-[#0b3b60] text-white text-xs font-semibold hover:bg-[#154a75] transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register a Document</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-[#dcdcdc] uppercase text-[10px] tracking-wider">
                <th scope="col" className="py-2.5 px-4">
                  Document Particulars
                </th>
                <th scope="col" className="py-2.5 px-3">
                  Category
                </th>
                <th scope="col" className="py-2.5 px-3">
                  Statutory Expiry
                </th>
                <th scope="col" className="py-2.5 px-3">
                  Status
                </th>
                <th scope="col" className="py-2.5 px-3 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {renewals.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`hover:bg-amber-50/40 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfdfd]'
                  }`}
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/documents/${item.id}`}
                      className="font-bold text-slate-900 hover:text-[#0b3b60] flex items-center gap-1"
                    >
                      <span>{item.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </Link>
                    {item.documentNumber && (
                      <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                        Ref: {item.documentNumber}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <CategoryBadge category={item.category} showIcon={false} />
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-800 font-mono">
                      {formatDate(item.expiryDate)}
                    </span>
                    {item.daysUntilExpiry !== null && item.daysUntilExpiry !== undefined && (
                      <span className="text-[10px] text-slate-500 block font-sans">
                        {item.daysUntilExpiry < 0
                          ? `${Math.abs(item.daysUntilExpiry)} days overdue`
                          : `${item.daysUntilExpiry} days remaining`}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge
                      status={item.status || 'ACTIVE'}
                      daysUntilExpiry={item.daysUntilExpiry}
                      showDays={false}
                    />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href={`/documents/${item.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-[#0b3b60] bg-slate-100 hover:bg-[#0b3b60] hover:text-white rounded transition border border-slate-300"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
