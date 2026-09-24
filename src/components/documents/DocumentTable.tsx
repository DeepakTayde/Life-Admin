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
    <div className="bg-white rounded-lg border border-[#dcdcdc] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0b3b60] text-white border-b-2 border-[#ff9933] text-[11px] font-bold uppercase tracking-wider">
              <th scope="col" className="py-3 px-4">
                Document Particulars
              </th>
              <th scope="col" className="py-3 px-3">
                Classification
              </th>
              <th scope="col" className="py-3 px-3">
                Reference / ID
              </th>
              <th scope="col" className="py-3 px-3">
                Statutory Expiry
              </th>
              <th scope="col" className="py-3 px-3">
                Status
              </th>
              <th scope="col" className="py-3 px-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.map((doc, idx) => (
              <tr
                key={doc.id}
                className={`hover:bg-amber-50/40 transition-colors group ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                }`}
              >
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900 group-hover:text-[#0b3b60] transition">
                    <Link href={`/documents/${doc.id}`}>{doc.title}</Link>
                  </div>
                  {doc.notes && (
                    <p className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                      {doc.notes}
                    </p>
                  )}
                </td>

                <td className="py-3 px-3 whitespace-nowrap">
                  <CategoryBadge category={doc.category} />
                </td>

                <td className="py-3 px-3 whitespace-nowrap font-mono text-xs text-slate-700">
                  {doc.documentNumber || <span className="text-slate-400">—</span>}
                </td>

                <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-800 font-mono">
                  {formatDate(doc.expiryDate)}
                </td>

                <td className="py-3 px-3 whitespace-nowrap">
                  <StatusBadge
                    status={doc.status || 'ACTIVE'}
                    daysUntilExpiry={doc.daysUntilExpiry}
                    showDays={true}
                  />
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/documents/${doc.id}`}
                      className="p-1.5 text-slate-600 hover:text-[#0b3b60] hover:bg-slate-100 rounded transition"
                      title="Inspect record"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <Link
                      href={`/documents/${doc.id}/edit`}
                      className="p-1.5 text-slate-600 hover:text-[#0b3b60] hover:bg-slate-100 rounded transition"
                      title="Update record"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onDeleteClick(doc)}
                      className="p-1.5 text-slate-500 hover:text-[#c62828] hover:bg-rose-50 rounded transition"
                      title="Expunge record from vault"
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
