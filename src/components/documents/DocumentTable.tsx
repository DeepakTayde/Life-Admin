import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/types/document';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDate } from '@/lib/utils';
import { Eye, Edit3, Trash2 } from 'lucide-react';

interface DocumentTableProps {
  documents: DocumentItem[];
  onDeleteClick: (document: DocumentItem) => void;
}

export function DocumentTable({ documents, onDeleteClick }: DocumentTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-6">
                Document
              </th>
              <th scope="col" className="py-3.5 px-4">
                Category
              </th>
              <th scope="col" className="py-3.5 px-4">
                Document No.
              </th>
              <th scope="col" className="py-3.5 px-4">
                Expiry Date
              </th>
              <th scope="col" className="py-3.5 px-4">
                Status
              </th>
              <th scope="col" className="py-3.5 px-6 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                    <Link href={`/documents/${doc.id}`}>{doc.title}</Link>
                  </div>
                  {doc.notes && (
                    <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                      {doc.notes}
                    </p>
                  )}
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <CategoryBadge category={doc.category} />
                </td>

                <td className="py-4 px-4 whitespace-nowrap font-mono text-xs text-slate-600">
                  {doc.documentNumber || <span className="text-slate-300">—</span>}
                </td>

                <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-700">
                  {formatDate(doc.expiryDate)}
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge
                    status={doc.status || 'ACTIVE'}
                    daysUntilExpiry={doc.daysUntilExpiry}
                    showDays={true}
                  />
                </td>

                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="View document details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/documents/${doc.id}/edit`}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Edit document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => onDeleteClick(doc)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete document"
                      aria-label={`Delete ${doc.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
