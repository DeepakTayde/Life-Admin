'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentCategory, DocumentItem, CATEGORY_LABELS } from '@/types/document';
import { formatDateForInput } from '@/lib/utils';
import { AiExtractModal } from '@/components/documents/AiExtractModal';
import { Sparkles, Save, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface DocumentFormProps {
  initialData?: DocumentItem;
  isEditing?: boolean;
}

const CATEGORIES: DocumentCategory[] = [
  'IDENTITY',
  'INSURANCE',
  'VEHICLE',
  'CERTIFICATION',
  'WARRANTY',
  'SUBSCRIPTION',
  'OTHER',
];

export function DocumentForm({ initialData, isEditing = false }: DocumentFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState<DocumentCategory>(initialData?.category || 'INSURANCE');
  const [documentNumber, setDocumentNumber] = useState(initialData?.documentNumber || '');
  const [issueDate, setIssueDate] = useState(formatDateForInput(initialData?.issueDate));
  const [expiryDate, setExpiryDate] = useState(formatDateForInput(initialData?.expiryDate));
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Validate form before submission
  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!title.trim() || title.trim().length < 2) {
      errs.title = 'Title must be at least 2 characters';
    } else if (title.length > 100) {
      errs.title = 'Title cannot exceed 100 characters';
    }

    if (notes && notes.length > 500) {
      errs.notes = 'Notes cannot exceed 500 characters';
    }

    if (issueDate && expiryDate) {
      const issue = new Date(issueDate);
      const expiry = new Date(expiryDate);
      if (issue.getTime() > expiry.getTime()) {
        errs.issueDate = 'Issue date cannot be after the expiry date';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setGeneralError(null);

      const payload = {
        title: title.trim(),
        category,
        documentNumber: documentNumber.trim() || null,
        issueDate: issueDate || null,
        expiryDate: expiryDate || null,
        notes: notes.trim() || null,
      };

      const endpoint = isEditing ? `/api/documents/${initialData?.id}` : '/api/documents';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.errors) {
          const fieldErrs: Record<string, string> = {};
          for (const [key, val] of Object.entries(json.errors)) {
            fieldErrs[key] = Array.isArray(val) ? val[0] : (val as string);
          }
          setErrors(fieldErrs);
        }
        throw new Error(json.message || 'Failed to save document');
      }

      // Success -> navigate to documents or detail
      router.push(isEditing ? `/documents/${initialData?.id}` : '/documents');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving';
      setGeneralError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiApply = (extracted: {
    title: string;
    category: DocumentCategory;
    documentNumber?: string | null;
    issueDate?: string | null;
    expiryDate?: string | null;
    notes?: string | null;
  }) => {
    if (extracted.title) setTitle(extracted.title);
    if (extracted.category) setCategory(extracted.category);
    if (extracted.documentNumber) setDocumentNumber(extracted.documentNumber);
    if (extracted.issueDate) setIssueDate(extracted.issueDate);
    if (extracted.expiryDate) setExpiryDate(extracted.expiryDate);
    if (extracted.notes) setNotes(extracted.notes);
    setErrors({});
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isEditing ? 'Edit Document' : 'Add New Document'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isEditing
                ? 'Update document details and expiry dates'
                : 'Enter your document details to track renewals and expiry'}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl transition shadow-2xs self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Auto-fill with AI</span>
            </button>
          )}
        </div>

        {generalError && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="doc-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="doc-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              placeholder="e.g. Car Insurance, Passport, Driving Licence"
              disabled={isSubmitting}
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition ${
                errors.title
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                  : 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
          </div>

          {/* Category & Document Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="doc-category" className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="doc-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="doc-number" className="block text-xs font-semibold text-slate-700 mb-1">
                Document Number / Policy No. <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="doc-number"
                type="text"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                placeholder="e.g. POL-123456, Z1234567"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Issue Date & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="doc-issueDate" className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="doc-issueDate"
                type="date"
                value={issueDate}
                onChange={(e) => {
                  setIssueDate(e.target.value);
                  if (errors.issueDate) setErrors((prev) => ({ ...prev, issueDate: '' }));
                }}
                disabled={isSubmitting}
                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl outline-none transition ${
                  errors.issueDate
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              />
              {errors.issueDate && <p className="mt-1 text-xs text-rose-600">{errors.issueDate}</p>}
            </div>

            <div>
              <label htmlFor="doc-expiryDate" className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry / Renewal Date <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="doc-expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  if (errors.issueDate) setErrors((prev) => ({ ...prev, issueDate: '' }));
                }}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Leave empty if document does not expire
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="doc-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Notes & Renewal Instructions <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="doc-notes"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (errors.notes) setErrors((prev) => ({ ...prev, notes: '' }));
              }}
              placeholder="e.g. Renew 1 month before expiry. Agent contact: John Doe"
              rows={3}
              maxLength={500}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-between mt-1 text-[11px] text-slate-400">
              <span>{errors.notes && <span className="text-rose-600">{errors.notes}</span>}</span>
              <span>{notes.length}/500</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={isEditing ? `/documents/${initialData?.id}` : '/documents'}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel</span>
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Save Document'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <AiExtractModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleAiApply}
      />
    </>
  );
}
