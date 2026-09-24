import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/types/document';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDate } from '@/lib/utils';
import { Eye, Edit3, Trash2, Calendar, Hash } from 'lucide-react';

interface DocumentCardProps {
  document: DocumentItem;
  onDeleteClick: (document: DocumentItem) => void;
}

export function DocumentCard({ document, onDeleteClick }: DocumentCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Link
              href={`/documents/${document.id}`}
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition block line-clamp-1"
            >
              {document.title}
            </Link>
            <CategoryBadge category={document.category} />
          </div>

          <StatusBadge
            status={document.status || 'ACTIVE'}
            daysUntilExpiry={document.daysUntilExpiry}
            showDays={true}
          />
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          {document.documentNumber && (
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{document.documentNumber}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Expires:</span>
            </div>
            <span className="font-semibold text-slate-800">
              {formatDate(document.expiryDate)}
            </span>
          </div>

          {document.notes && (
            <p className="text-slate-500 line-clamp-2 pt-1 italic text-[11px]">
              &ldquo;{document.notes}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        <Link
          href={`/documents/${document.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
          title="View document details"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </Link>

        <Link
          href={`/documents/${document.id}/edit`}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition"
          title="Edit document"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Link>

        <button
          onClick={() => onDeleteClick(document)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
          title="Delete document"
          aria-label={`Delete ${document.title}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
