import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { dashboardService } from '@/services/dashboard.service';
import { StatCard } from '@/components/dashboard/StatCard';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';
import {
  Files,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const summary = await dashboardService.getDashboardSummary(user.id);
  const displayName = user.name || user.email.split('@')[0];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-700/60 text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Document &amp; Renewal Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            {summary.expiringSoonCount > 0
              ? `You have ${summary.expiringSoonCount} document${summary.expiringSoonCount > 1 ? 's' : ''} requiring renewal attention within the next 30 days.`
              : 'All your tracked documents and renewals are currently up to date.'}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2 md:pt-0">
          <Link
            href="/documents/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-900 text-xs sm:text-sm font-bold hover:bg-indigo-50 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Add Document</span>
          </Link>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-700/60 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition"
          >
            <span>All Documents</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Document Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Documents"
            value={summary.totalCount}
            subtitle="All active & tracked files"
            icon={Files}
            variant="default"
          />

          <StatCard
            title="Expiring Soon"
            value={summary.expiringSoonCount}
            subtitle="Renew within 30 days"
            icon={AlertTriangle}
            variant="warning"
          />

          <StatCard
            title="Expired"
            value={summary.expiredCount}
            subtitle="Immediate action needed"
            icon={AlertOctagon}
            variant="danger"
          />

          <StatCard
            title="Active"
            value={summary.activeCount}
            subtitle="Safe (> 30 days left)"
            icon={CheckCircle2}
            variant="success"
          />
        </div>
      </section>

      {/* Main Content Area: Upcoming Renewals + Quick Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingRenewals renewals={summary.upcomingRenewals} />
        </div>

        {/* Side panel: Categories & Quick Tips */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h3>Renewal Recommendations</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-4">
              <li>
                <strong className="text-slate-800">Passport:</strong> Many countries require at
                least 6 months validity from date of travel.
              </li>
              <li>
                <strong className="text-slate-800">Vehicle Insurance:</strong> Renew at least 2
                weeks early to protect your No Claim Bonus (NCB).
              </li>
              <li>
                <strong className="text-slate-800">Driving Licence:</strong> Renew before expiry to
                avoid re-taking driving proficiency tests.
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/documents"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between"
              >
                <span>Filter by Category &amp; Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
