'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/types/document';
import { AlertTriangle, AlertOctagon, BellRing, ArrowRight, ShieldCheck } from 'lucide-react';

interface UrgentTickerProps {
  renewals: DocumentItem[];
  expiringSoonCount: number;
  expiredCount: number;
}

export function UrgentTicker({
  renewals,
  expiringSoonCount,
  expiredCount,
}: UrgentTickerProps) {
  const hasUrgentItems = expiringSoonCount > 0 || expiredCount > 0;

  // Find the single most urgent document
  const urgentDoc = renewals.find(
    (d) => d.status === 'EXPIRING_SOON' || d.status === 'EXPIRED'
  );

  return (
    <div
      className={`border rounded-lg p-3 sm:px-4 sm:py-3 shadow-xs transition ${
        expiredCount > 0
          ? 'bg-rose-50 border-[#c62828] text-rose-950'
          : expiringSoonCount > 0
          ? 'bg-amber-50 border-[#d97706] text-amber-950'
          : 'bg-emerald-50 border-[#2e7d32] text-emerald-950'
      }`}
      role="region"
      aria-label="Statutory Renewal Notification Ticker"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          {expiredCount > 0 ? (
            <div className="w-7 h-7 rounded-md bg-[#c62828] text-white flex items-center justify-center shrink-0">
              <AlertOctagon className="w-4 h-4 animate-bounce" />
            </div>
          ) : expiringSoonCount > 0 ? (
            <div className="w-7 h-7 rounded-md bg-[#d97706] text-white flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4 animate-pulse" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-md bg-[#2e7d32] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}

          <div className="text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-black text-[10px] uppercase px-1.5 py-0.5 rounded tracking-wider ${
                  expiredCount > 0
                    ? 'bg-[#c62828] text-white'
                    : expiringSoonCount > 0
                    ? 'bg-[#d97706] text-white'
                    : 'bg-[#2e7d32] text-white'
                }`}
              >
                {hasUrgentItems ? 'Critical Statutory Alert' : 'Citizen Advisory'}
              </span>

              {urgentDoc ? (
                <span className="font-bold text-slate-900">
                  {urgentDoc.title} {urgentDoc.documentNumber ? `(#${urgentDoc.documentNumber})` : ''}
                </span>
              ) : null}
            </div>

            <p className="mt-0.5 text-slate-700 text-xs">
              {expiredCount > 0
                ? `You have ${expiredCount} expired document${
                    expiredCount > 1 ? 's' : ''
                  }. Immediate statutory renewal is required to prevent compliance lapses.`
                : expiringSoonCount > 0
                ? `Attention Required: ${expiringSoonCount} document${
                    expiringSoonCount > 1 ? 's are' : ' is'
                  } expiring within 30 days. Please initiate renewal with the respective authority.`
                : 'All registered credentials, certificates, and vehicle registrations are currently valid and up to date.'}
            </p>
          </div>
        </div>

        {hasUrgentItems && (
          <Link
            href="/documents?status=EXPIRING_SOON"
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-white shrink-0 shadow-xs transition ${
              expiredCount > 0
                ? 'bg-[#c62828] hover:bg-[#a81e1e]'
                : 'bg-[#d97706] hover:bg-[#b45309]'
            }`}
          >
            <span>Resolve Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
