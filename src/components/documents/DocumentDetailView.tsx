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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all documents</span>
        </Link>
      </div>

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Title and Top Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={document.category} />
              <StatusBadge
                status={document.status || 'ACTIVE'}
                daysUntilExpiry={document.daysUntilExpiry}
                showDays={true}
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {document.title}
            </h1>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href={`/documents/${document.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </Link>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Document Number */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Document / Policy No.</span>
              </span>
              {document.documentNumber && (
                <button
                  onClick={handleCopyDocNumber}
                  className="text-slate-400 hover:text-indigo-600 p-0.5"
                  title="Copy number"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
            <p className="font-mono text-sm sm:text-base font-bold text-slate-900">
              {document.documentNumber || <span className="text-slate-400 font-sans font-normal italic">None provided</span>}
            </p>
          </div>

          {/* Expiry Date */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Expiry / Renewal Date</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-900">
              {formatDate(document.expiryDate)}
            </p>
          </div>

          {/* Issue Date */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Issue Date</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {formatDate(document.issueDate)}
            </p>
          </div>

          {/* Days Remaining / Status summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Renewal Timeline</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {document.daysUntilExpiry === null || document.daysUntilExpiry === undefined
                ? 'No expiry date configured'
                : document.daysUntilExpiry < 0
                ? `Expired ${Math.abs(document.daysUntilExpiry)} days ago`
                : document.daysUntilExpiry === 0
                ? 'Expires today!'
                : `${document.daysUntilExpiry} days remaining`}
            </p>
          </div>
        </div>

        {/* Notes */}
        {document.notes && (
          <div className="space-y-2 pt-2">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notes &amp; Renewal Details
            </h2>
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {document.notes}
            </div>
          </div>
        )}

        {/* Record Metadata */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Added: {formatDate(document.createdAt)}</span>
          <span>Last modified: {formatDate(document.updatedAt)}</span>
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
