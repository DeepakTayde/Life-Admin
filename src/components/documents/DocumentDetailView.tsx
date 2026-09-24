'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DocumentItem } from '@/types/document';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDate } from '@/lib/utils';
import { DeleteConfirmModal } from '@/components/documents/DeleteConfirmModal';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Calendar,
  Hash,
  FileText,
  Clock,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

interface DocumentDetailViewProps {
  document: DocumentItem;
}

export function DocumentDetailView({ document }: DocumentDetailViewProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyDocNumber = () => {
    if (document.documentNumber) {
      navigator.clipboard.writeText(document.documentNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/documents/${document.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to delete');
      }

      router.push('/documents');
      router.refresh();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Could not delete document. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back link */}
      <div>
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3b60] hover:text-[#154a75] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Document Vault</span>
        </Link>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-lg border border-[#dcdcdc] shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#0b3b60] text-white p-4 sm:p-5 border-b-2 border-[#ff9933] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/15 text-white">
                Official Record #{document.id.slice(0, 8)}
              </span>
              <StatusBadge
                status={document.status || 'ACTIVE'}
                daysUntilExpiry={document.daysUntilExpiry}
                showDays={true}
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {document.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href={`/documents/${document.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 rounded transition shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#0b3b60]" />
              <span>Update</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#c62828] hover:bg-[#a81e1e] rounded transition shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Expunge</span>
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          {/* Classification & Category */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Classification:</span>
            <CategoryBadge category={document.category} />
          </div>

          {/* Key Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Document Number */}
            <div className="p-3.5 rounded bg-[#f4f6f9] border border-[#dcdcdc] space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  <span>Document / Reference No.</span>
                </span>
                {document.documentNumber && (
                  <button
                    type="button"
                    onClick={handleCopyDocNumber}
                    className="text-slate-500 hover:text-[#0b3b60] p-0.5"
                    title="Copy reference number"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-[#2e7d32]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <p className="font-mono text-sm sm:text-base font-bold text-slate-900">
                {document.documentNumber || (
                  <span className="text-slate-400 font-sans font-normal italic text-xs">
                    Not recorded
                  </span>
                )}
              </p>
            </div>

            {/* Expiry Date */}
            <div className="p-3.5 rounded bg-[#f4f6f9] border border-[#dcdcdc] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Statutory Expiry / Renewal Date</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                {formatDate(document.expiryDate)}
              </p>
            </div>

            {/* Issue Date */}
            <div className="p-3.5 rounded bg-[#f4f6f9] border border-[#dcdcdc] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Issue / Registration Date</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 font-mono">
                {formatDate(document.issueDate)}
              </p>
            </div>

            {/* Days Remaining / Status summary */}
            <div className="p-3.5 rounded bg-[#f4f6f9] border border-[#dcdcdc] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Renewal Timeline</span>
              </div>
              <p className="text-sm font-bold text-slate-900">
                {document.daysUntilExpiry === null || document.daysUntilExpiry === undefined
                  ? 'No expiry date configured'
                  : document.daysUntilExpiry < 0
                  ? `Overdue by ${Math.abs(document.daysUntilExpiry)} days`
                  : document.daysUntilExpiry === 0
                  ? 'Expires today!'
                  : `${document.daysUntilExpiry} days remaining`}
              </p>
            </div>
          </div>

          {/* Notes */}
          {document.notes && (
            <div className="space-y-1.5 pt-1">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Statutory Notes &amp; Policy Details
              </h2>
              <div className="p-3.5 rounded bg-slate-50 border border-[#dcdcdc] text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {document.notes}
              </div>
            </div>
          )}

          {/* Record Metadata */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
            <span>Registered: {formatDate(document.createdAt)}</span>
            <span>Last Updated: {formatDate(document.updatedAt)}</span>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        documentTitle={document.title}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
