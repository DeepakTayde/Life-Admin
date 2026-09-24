import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Lock,
  Search,
  CheckCircle2,
  FileText,
  Car,
  Award,
  Building,
} from 'lucide-react';

export default async function HomePage() {
  const user = await getSessionUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="py-6 sm:py-12 space-y-12 sm:space-y-16">
      {/* Official Government Portal Hero section */}
      <section className="bg-white rounded-lg border border-[#dcdcdc] p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0b3b60]/10 border border-[#0b3b60]/20 text-[#0b3b60] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff9933]" />
            <span>National Citizen Document Registry • GIGW 3.0</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0b3b60] tracking-tight leading-tight">
            Centralized Citizen Document Vault &amp; Statutory Expiry Tracker
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Secure digital storage for identity credentials (Passport, PAN, Voter ID), vehicle assets
            (RC, Insurance, Driving Licence, PUC), and certifications. Automated 30-day statutory expiry
            advisories ensure complete legal compliance.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0b3b60] hover:bg-[#154a75] rounded transition shadow-sm"
            >
              <span>Register Citizen Account</span>
              <ArrowRight className="w-4 h-4 text-[#ff9933]" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold text-[#0b3b60] bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition"
            >
              Sign In to Citizen Vault
            </Link>
          </div>
        </div>
      </section>

      {/* Samagra Service Box Pattern Showcase */}
      <section className="space-y-4">
        <div className="border-b border-[#dcdcdc] pb-2">
          <h2 className="text-sm sm:text-base font-black text-[#0b3b60] uppercase tracking-wide">
            Statutory Document Classification Standard
          </h2>
          <p className="text-xs text-slate-500">
            Categorized citizen services following Ministry of Citizen Services &amp; Digital Governance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Box 1 */}
          <div className="samagra-card rounded-lg overflow-hidden">
            <div className="samagra-card-header p-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ff9933]" />
              <h3 className="font-bold text-xs">Identity Documents</h3>
            </div>
            <div className="p-4 space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Aadhaar, PAN Card, Voter ID, Passport
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                National identity numbers with issue date recording and international travel validity checks (6-month rule).
              </p>
            </div>
          </div>

          {/* Box 2 */}
          <div className="samagra-card rounded-lg overflow-hidden">
            <div className="samagra-card-header p-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-[#ff9933]" />
              <h3 className="font-bold text-xs">Assets &amp; Vehicles</h3>
            </div>
            <div className="p-4 space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Driving Licence, RC, Vehicle Insurance, PUC
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Track mandatory Motor Vehicles Act statutory expirations, roadworthiness, and insurance grace periods.
              </p>
            </div>
          </div>

          {/* Box 3 */}
          <div className="samagra-card rounded-lg overflow-hidden">
            <div className="samagra-card-header p-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#ff9933]" />
              <h3 className="font-bold text-xs">Education &amp; Certificates</h3>
            </div>
            <div className="p-4 space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">
                Degree Certificates, Birth Certificate, Domicile
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Permanent academic records, birth records, warranties, and subscription validity registries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-lg border border-[#dcdcdc] p-5 space-y-2">
          <div className="w-8 h-8 rounded bg-[#0b3b60]/10 text-[#0b3b60] flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Automated Expiry Warnings</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Centralized 30-day renewal warnings and clear color-coded statuses so you never miss a
            critical deadline.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#dcdcdc] p-5 space-y-2">
          <div className="w-8 h-8 rounded bg-[#ff9933]/15 text-[#b45309] flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">GIGW 3.0 Government Standard</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Built following Guidelines for Indian Government Websites with screen reader accessibility,
            font sizing, and contrast support.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-[#dcdcdc] p-5 space-y-2">
          <div className="w-8 h-8 rounded bg-[#2e7d32]/10 text-[#2e7d32] flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Cryptographic User Isolation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Each citizen’s records are strictly isolated. No cross-account data leakage is possible under
            verified server-side security checks.
          </p>
        </div>
      </section>
    </div>
  );
}
