'use client';

import React, { useState } from 'react';
import { Sparkles, X, Loader2, Check } from 'lucide-react';
import { DocumentCategory } from '@/types/document';

interface ExtractedData {
  title: string;
  category: DocumentCategory;
  documentNumber?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  notes?: string | null;
}

interface AiExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: ExtractedData) => void;
}

export function AiExtractModal({ isOpen, onClose, onApply }: AiExtractModalProps) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ExtractedData | null>(null);

  if (!isOpen) return null;

  const handleExtract = async () => {
    if (!text.trim() || text.trim().length < 5) {
      setError('Please paste text that includes document details (at least 5 characters).');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to extract data');
      }

      setPreview(json.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while parsing';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (preview) {
      onApply(preview);
      onClose();
    }
  };

  const sampleExample =
    'My Car Insurance policy #POL-89421 with ABC General Insurance was issued on 2026-01-10 and expires on 2027-01-10. Comprehensive coverage.';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Auto-fill with AI</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          Paste an email snippet, renewal notice, or document text. AI will identify the
          document title, category, reference number, and expiry date.
        </p>

        <div className="mt-3">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. My passport expires on 15 Oct 2031. Policy number is..."
            rows={4}
            className="w-full text-sm p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />

          <button
            type="button"
            onClick={() => setText(sampleExample)}
            className="mt-1 text-xs text-indigo-600 hover:underline font-medium"
          >
            Paste sample insurance notice
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {preview && (
          <div className="mt-4 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs space-y-1.5">
            <div className="font-semibold text-indigo-900 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              <span>Extracted Details Preview:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
              <div>
                <span className="font-medium text-slate-500">Title:</span> {preview.title}
              </div>
              <div>
                <span className="font-medium text-slate-500">Category:</span> {preview.category}
              </div>
              {preview.documentNumber && (
                <div>
                  <span className="font-medium text-slate-500">Number:</span>{' '}
                  {preview.documentNumber}
                </div>
              )}
              {preview.issueDate && (
                <div>
                  <span className="font-medium text-slate-500">Issue:</span> {preview.issueDate}
                </div>
              )}
              {preview.expiryDate && (
                <div>
                  <span className="font-medium text-slate-500">Expiry:</span> {preview.expiryDate}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>

          {!preview ? (
            <button
              type="button"
              onClick={handleExtract}
              disabled={isLoading || !text.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition disabled:opacity-50 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing text...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Extract Details</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply to Form</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
