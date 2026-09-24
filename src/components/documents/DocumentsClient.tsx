'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DocumentCategory, DocumentItem, DocumentStatus, CATEGORY_LABELS } from '@/types/document';
import { DocumentTable } from '@/components/documents/DocumentTable';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { DeleteConfirmModal } from '@/components/documents/DeleteConfirmModal';
import {
  Search,
  Filter,
  PlusCircle,
  Files,
  ArrowUpDown,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';

interface DocumentsClientProps {
  initialDocuments: DocumentItem[];
}

export function DocumentsClient({ initialDocuments }: DocumentsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'ALL'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get('status') || 'ALL'
  );
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'expiryDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'
  );

  const [viewMode, setViewMode] = useState<'auto' | 'table' | 'cards'>('auto');

  // Delete modal state
  const [deleteModalDoc, setDeleteModalDoc] = useState<DocumentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync filters with router query params and fetch/filter documents
  const applyFilters = async (
    newSearch = searchTerm,
    newCategory = selectedCategory,
    newStatus = selectedStatus,
    newSortBy = sortBy,
    newSortOrder = sortOrder
  ) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newCategory !== 'ALL') params.set('category', newCategory);
    if (newStatus !== 'ALL') params.set('status', newStatus);
    if (newSortBy !== 'expiryDate') params.set('sortBy', newSortBy);
    if (newSortOrder !== 'asc') params.set('sortOrder', newSortOrder);

    startTransition(() => {
      const url = params.toString() ? `/documents?${params.toString()}` : '/documents';
      router.replace(url, { scroll: false });
    });

    try {
      const fetchParams = new URLSearchParams();
      if (newSearch) fetchParams.set('search', newSearch);
      if (newCategory !== 'ALL') fetchParams.set('category', newCategory);
      if (newStatus !== 'ALL') fetchParams.set('status', newStatus);
      fetchParams.set('sortBy', newSortBy);
      fetchParams.set('sortOrder', newSortOrder);

      const res = await fetch(`/api/documents?${fetchParams.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDocuments(json.data);
      }
    } catch (err) {
      console.error('Error filtering documents:', err);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    applyFilters(val, selectedCategory, selectedStatus, sortBy, sortOrder);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    applyFilters(searchTerm, val, selectedStatus, sortBy, sortOrder);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    applyFilters(searchTerm, selectedCategory, val, sortBy, sortOrder);
  };

  const handleSortChange = (field: string) => {
    const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
    applyFilters(searchTerm, selectedCategory, selectedStatus, field, newOrder);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSortBy('expiryDate');
    setSortOrder('asc');
    applyFilters('', 'ALL', 'ALL', 'expiryDate', 'asc');
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalDoc) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/documents/${deleteModalDoc.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to delete');
      }

      setDocuments((prev) => prev.filter((d) => d.id !== deleteModalDoc.id));
      setDeleteModalDoc(null);
      router.refresh();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Could not delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    searchTerm !== '' || selectedCategory !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal documents, insurance policies, and renewal dates
          </p>
        </div>

        <Link
          href="/documents/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-xs self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Document</span>
        </Link>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title or document number..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
              aria-label="Filter by category"
            >
              <option value="ALL">All Categories</option>
              <option value="IDENTITY">{CATEGORY_LABELS.IDENTITY}</option>
              <option value="INSURANCE">{CATEGORY_LABELS.INSURANCE}</option>
              <option value="VEHICLE">{CATEGORY_LABELS.VEHICLE}</option>
              <option value="CERTIFICATION">{CATEGORY_LABELS.CERTIFICATION}</option>
              <option value="WARRANTY">{CATEGORY_LABELS.WARRANTY}</option>
              <option value="SUBSCRIPTION">{CATEGORY_LABELS.SUBSCRIPTION}</option>
              <option value="OTHER">{CATEGORY_LABELS.OTHER}</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700"
              aria-label="Filter by status"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRING_SOON">Expiring Soon</option>
              <option value="EXPIRED">Expired</option>
              <option value="NO_EXPIRY">No Expiry</option>
            </select>
          </div>
        </div>

        {/* Secondary row: sorting and view toggle */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-600">Sort by:</span>
            <button
              onClick={() => handleSortChange('expiryDate')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                sortBy === 'expiryDate'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span>Expiry Date</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleSortChange('createdAt')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                sortBy === 'createdAt'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span>Recently Added</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>

            <button
              onClick={() => handleSortChange('title')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition ${
                sortBy === 'title'
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <span>Title (A-Z)</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-indigo-600 hover:underline font-medium ml-2"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>{documents.length} document{documents.length !== 1 ? 's' : ''} found</span>
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-0.5 ml-2">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1 rounded ${viewMode === 'table' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400'}`}
                title="Table view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1 rounded ${viewMode === 'cards' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400'}`}
                title="Card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document List */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Files className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No documents found</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'No documents matched your current search or filter criteria. Try clearing filters.'
              : 'You have not added any documents yet. Start tracking your passport, policies, and licences now.'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            {hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/documents/new"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Your First Document</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Responsive rendering: table on desktop, cards on mobile (or explicitly chosen view) */}
          <div className={viewMode === 'cards' ? 'hidden' : viewMode === 'table' ? 'block' : 'hidden md:block'}>
            <DocumentTable
              documents={documents}
              onDeleteClick={(doc) => setDeleteModalDoc(doc)}
            />
          </div>

          <div className={viewMode === 'table' ? 'hidden' : viewMode === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden'}>
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDeleteClick={(d) => setDeleteModalDoc(d)}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteModalDoc}
        documentTitle={deleteModalDoc?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalDoc(null)}
      />
    </div>
  );
}
