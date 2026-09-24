'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocumentCategory, DocumentItem, CATEGORY_LABELS } from '@/types/document';
import { formatDateForInput } from '@/lib/utils';
import { AiExtractModal } from '@/components/documents/AiExtractModal';
import { Sparkles, Save, ArrowLeft, Loader2, AlertCircle, FileCheck } from 'lucide-react';
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
      errs.title = 'Document title must be at least 2 characters';
    } else if (title.length > 100) {
      errs.title = 'Document title cannot exceed 100 characters';
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
      <div className="bg-white rounded-lg border border-[#dcdcdc] shadow-xs max-w-2xl mx-auto overflow-hidden">
        {/* Government Form Header */}
        <div className="bg-[#0b3b60] text-white p-4 sm:p-5 border-b-2 border-[#ff9933] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#ff9933]" />
              <h1 className="text-base sm:text-lg font-bold tracking-wide uppercase">
                {isEditing ? 'Update Registered Document' : 'Register New Document in Vault'}
              </h1>
            </div>
            <p className="text-[11px] text-slate-200 mt-0.5">
              {isEditing
                ? 'Update particulars, statutory expiry date, and policy details'
                : 'Enter credential particulars for automated statutory renewal monitoring'}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-[#ff9933] hover:bg-[#e67e22] rounded transition shadow-xs self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Fill with AI</span>
            </button>
          )}
        </div>

        <div className="p-5 sm:p-7">
          {generalError && (
            <div className="mb-5 p-3 rounded bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="doc-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Document / Credential Title <span className="text-[#c62828]">*</span>
              </label>
              <input
                id="doc-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder="e.g. Passport, Car Insurance, Driving Licence, Vehicle RC"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 text-xs border rounded outline-none transition bg-[#fcfdfd] ${
                  errors.title
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-300 focus:ring-2 focus:ring-[#0b3b60] focus:border-[#0b3b60]'
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-[#c62828] font-medium">{errors.title}</p>}
            </div>

            {/* Category & Document Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doc-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Service Category <span className="text-[#c62828]">*</span>
                </label>
                <select
                  id="doc-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-white text-slate-800"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="doc-number" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Document / Reference Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="doc-number"
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="e.g. POL-123456, DL-0420110012345, Z1234567"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-[#fcfdfd]"
                />
              </div>
            </div>

            {/* Issue Date & Expiry Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="doc-issueDate" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Date of Issue <span className="text-slate-400 font-normal lowercase">(optional)</span>
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
                  className={`w-full px-3 py-2 text-xs border rounded outline-none transition bg-[#fcfdfd] ${
                    errors.issueDate
                      ? 'border-rose-400 focus:ring-2 focus:ring-rose-200'
                      : 'border-slate-300 focus:ring-2 focus:ring-[#0b3b60]'
                  }`}
                />
                {errors.issueDate && <p className="mt-1 text-xs text-[#c62828] font-medium">{errors.issueDate}</p>}
              </div>

              <div>
                <label htmlFor="doc-expiryDate" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Statutory Expiry Date <span className="text-slate-400 font-normal lowercase">(optional)</span>
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
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-[#fcfdfd]"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Leave blank for permanent records (e.g. Birth Certificate, Degree)
                </p>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="doc-notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Statutory Notes &amp; Renewal Instructions <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                id="doc-notes"
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (errors.notes) setErrors((prev) => ({ ...prev, notes: '' }));
                }}
                placeholder="e.g. Requires renewal 3 weeks in advance. Claim NCB bonus with insurance agent."
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-[#fcfdfd]"
              />
              <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                <span>{errors.notes && <span className="text-[#c62828] font-medium">{errors.notes}</span>}</span>
                <span>{notes.length}/500 characters</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <Link
                href={isEditing ? `/documents/${initialData?.id}` : '/documents'}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-300 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return</span>
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#0b3b60] hover:bg-[#154a75] rounded shadow-xs transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-[#ff9933]" />
                    <span>{isEditing ? 'Save Record Updates' : 'Commit to Citizen Vault'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <AiExtractModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleAiApply}
      />
    </>
  );
}
