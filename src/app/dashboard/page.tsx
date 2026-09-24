import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { dashboardService } from '@/services/dashboard.service';
import { documentService } from '@/services/document.service';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';
import { UrgentTicker } from '@/components/dashboard/UrgentTicker';
import { SamagraServiceBoxes } from '@/components/dashboard/SamagraServiceBoxes';
import {
  Files,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Plus,
  ArrowRight,
  Shield,
  FileCheck,
  Building,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const [summary, allDocuments] = await Promise.all([
    dashboardService.getDashboardSummary(user.id),
    documentService.getDocuments(user.id),
  ]);

  const displayName = user.name || user.email.split('@')[0];

  return (
    <div className="space-y-6">
      {/* High-priority Ticker / Marquee Alert Banner */}
      <UrgentTicker
        renewals={summary.upcomingRenewals}
        expiringSoonCount={summary.expiringSoonCount}
        expiredCount={summary.expiredCount}
      />

      {/* Official Government Citizen Welcome & Quick Actions Bar */}
      <div className="bg-white rounded-lg border border-[#dcdcdc] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]" />
            <span className="text-[11px] font-bold text-[#0b3b60] uppercase tracking-wider">
              National Citizen Document Registry
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Citizen Dashboard: {displayName}
          </h1>
          <p className="text-xs text-slate-600">
            Citizen ID: <strong className="font-mono text-slate-800">IND-849204</strong> •
            Active Session: <strong className="text-[#2e7d32]">Authenticated</strong> • Standard:{' '}
            <strong className="text-slate-800">GIGW 3.0 Compliant</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/documents/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold text-white bg-[#0b3b60] hover:bg-[#154a75] transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
          >
            <span>Open Document Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid (Samagra Government Standard) */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Document Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Documents"
            value={summary.totalCount}
            subtitle="Registered in Citizen Vault"
            icon={Files}
            variant="default"
          />

          <StatCard
            title="Active / Valid"
            value={summary.activeCount}
            subtitle="Safe (> 30 days validity remaining)"
            icon={CheckCircle2}
            variant="success"
          />

          <StatCard
            title="Expiring in 30 Days"
            value={summary.expiringSoonCount}
            subtitle="Pending Renewal Attention"
            icon={AlertTriangle}
            variant="warning"
          />

          <StatCard
            title="Expired / Action Needed"
            value={summary.expiredCount}
            subtitle="Statutory Renewal Overdue"
            icon={AlertOctagon}
            variant="danger"
          />
        </div>
      </section>

      {/* Signature Samagra Service Boxes Pattern (Identity, Assets/Vehicles, Education) */}
      <SamagraServiceBoxes documents={allDocuments} />

      {/* Main Content Area: Upcoming Renewals Schedule + Official Citizen Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingRenewals renewals={summary.upcomingRenewals} />
        </div>

        {/* Side panel: Official Citizen Statutory Advisory */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-[#dcdcdc] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#0b3b60] font-bold text-xs uppercase tracking-wide border-b border-slate-100 pb-2">
              <Shield className="w-4 h-4 text-[#ff9933]" />
              <h3>Statutory Renewal Guidelines</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4">
              <li>
                <strong className="text-slate-800">Passport Validity:</strong> Most international
                immigration checkpoints require at least 6 months validity from date of travel.
              </li>
              <li>
                <strong className="text-slate-800">Motor Vehicles Act (RC/Insurance):</strong> Operating
                a vehicle with expired third-party insurance incurs statutory penalties under Section
                196 of the Motor Vehicles Act.
              </li>
              <li>
                <strong className="text-slate-800">Driving Licence:</strong> Applications submitted within
                grace periods avoid the mandatory re-assessment driving test.
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Helpline: 1800-11-2026</span>
              <Link
                href="/documents"
                className="font-bold text-[#0b3b60] hover:text-[#154a75] flex items-center gap-1 text-[11px]"
              >
                <span>Filter Vault</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Department Seal / Notice Box */}
          <div className="bg-[#0b3b60]/5 border border-[#0b3b60]/20 rounded-lg p-4 text-xs text-slate-700 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#0b3b60]">
              <Building className="w-4 h-4 text-[#0b3b60]" />
              <span>Digital Vault Protection</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every document record in this vault is cryptographically associated with your citizen
              identifier. Downloaded summaries are verifiable through digital signatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
