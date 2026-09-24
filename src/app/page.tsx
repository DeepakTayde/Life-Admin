import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Lock,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="py-8 sm:py-16 space-y-16 sm:space-y-24">
      {/* Hero section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Real-World Life Admin Management</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Never miss an important{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            document renewal
          </span>{' '}
          again.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Passports, car insurance, driver licences, warranties, and certificates in one place.
          Get instant visibility on what is active, expiring soon, or already expired.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-2xs"
          >
            Sign in to Account
          </Link>
        </div>
      </section>

      {/* Product preview card */}
      <section className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-slate-400 ml-2">life-admin-dashboard</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
            Interactive Overview
          </span>
        </div>

        {/* Mock stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <p className="text-xs font-medium text-slate-500">Total Documents</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Passport, Insurance, Licences</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70">
            <p className="text-xs font-medium text-amber-800">Expiring Soon</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">3</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Action needed in &le; 30 days</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/70">
            <p className="text-xs font-medium text-rose-800">Expired</p>
            <p className="text-2xl font-bold text-rose-700 mt-1">1</p>
            <p className="text-[11px] text-rose-600 mt-0.5">Vehicle pollution check</p>
          </div>
        </div>

        {/* Mock renewals */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Upcoming Renewals
          </p>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
            <div className="p-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900">Car Insurance</span>
                <span className="text-slate-400 ml-2">#POL-89104</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-600">20 Oct 2026</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Expiring Soon
                </span>
              </div>
            </div>
            <div className="p-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-slate-900">Passport</span>
                <span className="text-slate-400 ml-2">#Z891230</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-600">12 Oct 2026</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Automatic Expiry Tracking</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Centralized 30-day renewal warnings and clear color-coded statuses so you never miss a
            critical deadline.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Add with AI</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Paste messy renewal emails or text notes. The AI extraction parser extracts title, dates,
            and policy numbers instantly.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Private & User Scoped</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Each user’s documents are isolated and strictly authorized. User A cannot view, modify,
            or delete User B’s records.
          </p>
        </div>
      </section>
    </div>
  );
}
