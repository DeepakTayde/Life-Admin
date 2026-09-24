'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/types/document';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/utils';
import {
  FileText,
  Car,
  Award,
  Plus,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface SamagraServiceBoxesProps {
  documents: DocumentItem[];
}

export function SamagraServiceBoxes({ documents }: SamagraServiceBoxesProps) {
  // Filter documents into the 3 Samagra Service Categories
  const identityDocs = documents.filter((d) => d.category === 'IDENTITY');
  const vehicleAssetDocs = documents.filter(
    (d) => d.category === 'VEHICLE' || d.category === 'INSURANCE'
  );
  const educationDocs = documents.filter(
    (d) =>
      d.category === 'CERTIFICATION' ||
      d.category === 'WARRANTY' ||
      d.category === 'SUBSCRIPTION' ||
      d.category === 'OTHER'
  );

  const serviceCategories = [
    {
      id: 'identity',
      title: 'Identity Documents',
      subtitle: 'Aadhaar, PAN Card, Voter ID, Passport',
      icon: FileText,
      docs: identityDocs,
      addCategory: 'IDENTITY',
      countLabel: `${identityDocs.length} Registered`,
      emptyHelp: 'Upload official citizen credentials like Passport, PAN, or Voter ID.',
    },
    {
      id: 'assets',
      title: 'Assets & Vehicles',
      subtitle: 'Driving Licence, RC, Insurance, Pollution (PUC)',
      icon: Car,
      docs: vehicleAssetDocs,
      addCategory: 'VEHICLE',
      countLabel: `${vehicleAssetDocs.length} Registered`,
      emptyHelp: 'Track vehicle registrations, road tax receipts, and auto insurance renewals.',
    },
    {
      id: 'education',
      title: 'Education & Certificates',
      subtitle: 'Degree Certificates, Birth Certificate, Domicile, Warranties',
      icon: Award,
      docs: educationDocs,
      addCategory: 'CERTIFICATION',
      countLabel: `${educationDocs.length} Registered`,
      emptyHelp: 'Keep academic credentials, warranties, and domicile records safe.',
    },
  ];

  return (
    <section aria-labelledby="samagra-services-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dcdcdc] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#ff9933] rounded-xs" />
            <h2
              id="samagra-services-heading"
              className="text-base sm:text-lg font-black text-[#0b3b60] uppercase tracking-wide"
            >
              Citizen Document Service Boxes (Samagra Standard)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Classified statutory vaults categorized under Department of Citizen Affairs guidelines
          </p>
        </div>

        <Link
          href="/documents/new"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0b3b60] hover:bg-[#154a75] rounded transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Document</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {serviceCategories.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="samagra-card rounded-lg overflow-hidden flex flex-col justify-between"
            >
              {/* Samagra Service Box Header Bar */}
              <div>
                <div className="samagra-card-header p-3 sm:px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[#ff9933]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm tracking-wide">
                        {service.title}
                      </h3>
                      <p className="text-[10px] text-slate-200 line-clamp-1">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/15 text-white">
                    {service.countLabel}
                  </span>
                </div>

                {/* Items List */}
                <div className="p-3 sm:p-4 space-y-3">
                  {service.docs.length === 0 ? (
                    <div className="p-4 rounded border border-dashed border-slate-300 text-center bg-slate-50/50 space-y-2">
                      <p className="text-xs text-slate-600 font-medium">
                        No documents registered yet
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {service.emptyHelp}
                      </p>
                      <Link
                        href={`/documents/new?category=${service.addCategory}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0b3b60] hover:text-[#ff9933] underline"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add first {service.title.split(' ')[0]}</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 space-y-2">
                      {service.docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="pt-2 first:pt-0 pb-1 flex items-start justify-between gap-2"
                        >
                          <div className="space-y-1 min-w-0">
                            <Link
                              href={`/documents/${doc.id}`}
                              className="font-bold text-xs text-slate-900 hover:text-[#0b3b60] transition flex items-center gap-1 truncate"
                              title={`View ${doc.title}`}
                            >
                              <span className="truncate">{doc.title}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                            </Link>

                            <div className="text-[11px] text-slate-500 font-mono">
                              ID / No:{' '}
                              <span className="font-semibold text-slate-700">
                                {doc.documentNumber || 'NOT-RECORDED'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-slate-500">
                              <span>
                                Issued:{' '}
                                <strong className="text-slate-700">
                                  {formatDate(doc.issueDate)}
                                </strong>
                              </span>
                              <span>•</span>
                              <span>
                                Expiry:{' '}
                                <strong className="text-slate-700">
                                  {formatDate(doc.expiryDate)}
                                </strong>
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex flex-col items-end gap-1">
                            <StatusBadge
                              status={doc.status || 'ACTIVE'}
                              daysUntilExpiry={doc.daysUntilExpiry}
                              showDays={false}
                            />
                            {doc.daysUntilExpiry !== null &&
                              doc.daysUntilExpiry !== undefined && (
                                <span className="text-[9px] font-mono text-slate-500">
                                  {doc.daysUntilExpiry < 0
                                    ? `${Math.abs(doc.daysUntilExpiry)}d ago`
                                    : `${doc.daysUntilExpiry}d left`}
                                </span>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Service Box Footer Action */}
              <div className="p-3 bg-slate-50 border-t border-[#dcdcdc] flex items-center justify-between text-xs">
                <Link
                  href="/documents"
                  className="font-semibold text-[#0b3b60] hover:text-[#154a75] flex items-center gap-1 text-[11px]"
                >
                  <span>View All in Vault</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Link
                  href={`/documents/new?category=${service.addCategory}`}
                  className="text-[11px] font-bold text-slate-700 hover:text-[#0b3b60] flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
