'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  FolderArchive,
  ClockAlert,
  UploadCloud,
  ShieldCheck,
  HelpCircle,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Info,
  Phone,
  Mail,
} from 'lucide-react';

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { href: user ? '/dashboard' : '/', label: 'Home', icon: Home },
    { href: '/documents', label: 'Document Vault', icon: FolderArchive },
    { href: '/documents?status=EXPIRING_SOON', label: 'Expiry Tracker', icon: ClockAlert },
    { href: '/documents/new', label: 'Upload Center', icon: UploadCloud },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' || path === '/') {
      return pathname === '/dashboard' || pathname === '/';
    }
    if (path.includes('status=EXPIRING_SOON')) {
      return false; // Handled dynamically or when user clicks
    }
    if (path === '/documents') {
      return pathname === '/documents';
    }
    if (path === '/documents/new') {
      return pathname === '/documents/new';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      <nav className="bg-[#0b3b60] border-b-2 border-[#ff9933] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 font-medium text-xs sm:text-sm">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-3 transition relative ${active
                        ? 'bg-[#154a75] text-[#ff9933] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#ff9933]'
                        : 'text-slate-100 hover:bg-[#154a75] hover:text-white'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* e-KYC Verification Action */}
              <button
                type="button"
                onClick={() => setKycModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-3 text-slate-100 hover:bg-[#154a75] hover:text-white transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>e-KYC Status</span>
                <span className="text-[10px] bg-emerald-600/80 text-white font-semibold px-1.5 py-0.2 rounded ml-1">
                  Active
                </span>
              </button>

              {/* Help & Contact */}
              <button
                type="button"
                onClick={() => setHelpModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-3 text-slate-100 hover:bg-[#154a75] hover:text-white transition"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span>Help / Contact</span>
              </button>
            </div>

            {/* Right side quick action badge */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-mono text-[11px]">
                Citizen Portal Ver. 2.4
              </span>
              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="ml-3 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:text-white hover:bg-rose-900/60 rounded border border-rose-800/60 transition"
                  title="Citizen Sign Out"
                >
                  Sign Out
                </button>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center justify-between w-full">
              <span className="font-bold text-sm tracking-wide text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff9933]" />
                Life Admin Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-white hover:bg-[#154a75] rounded focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#07263e] border-t border-slate-700 px-4 py-3 space-y-1 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-[#0b3b60] hover:text-[#ff9933] rounded"
                >
                  <Icon className="w-4 h-4 text-[#ff9933]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setKycModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-[#0b3b60] rounded"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>e-KYC Status (Active)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setHelpModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-200 hover:bg-[#0b3b60] rounded"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>Help / Contact</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-950/60 rounded"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        )}
      </nav>

      {/* e-KYC Verification Modal */}
      {kycModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-[#dcdcdc] max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-[#0b3b60] text-white p-4 flex items-center justify-between border-b-2 border-[#ff9933]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Citizen e-KYC Verification Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setKycModalOpen(false)}
                className="text-slate-300 hover:text-white p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#2e7d32] text-sm">Citizen Identity Verified</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Your digital citizen vault is verified under GIGW Document Safety Guidelines.
                  </p>
                </div>
              </div>

              <div className="space-y-2 border border-slate-200 rounded p-3 bg-slate-50">
                <div className="flex justify-between">
                  <span className="text-slate-500">Citizen ID:</span>
                  <span className="font-mono font-bold text-slate-900">IND-849204</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification Authority:</span>
                  <span className="font-medium text-slate-900">National Document Registry</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="font-bold text-[#2e7d32]">Level 3 (Full Access)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Email:</span>
                  <span className="font-mono text-slate-800">{user?.email || 'deepakTayde@example.com'}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                All records stored in this vault are encrypted and user-scoped. Unauthorized third-party inspection is prevented by automated cryptographic isolation.
              </p>

              <button
                type="button"
                onClick={() => setKycModalOpen(false)}
                className="w-full py-2 bg-[#0b3b60] hover:bg-[#154a75] text-white font-bold rounded transition text-xs"
              >
                Close Verification Dialog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help / Contact Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg border border-[#dcdcdc] max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-[#0b3b60] text-white p-4 flex items-center justify-between border-b-2 border-[#ff9933]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#ff9933]" />
                <h3 className="font-bold text-sm">Citizen Helpdesk &amp; Guidelines</h3>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="text-slate-300 hover:text-white p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#0b3b60] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">National Citizen Toll-Free Helpline</strong>
                    <span className="font-mono text-slate-600">1800-11-2026 (Mon-Sat, 9:00 AM - 6:00 PM IST)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#0b3b60] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Official Support Email</strong>
                    <span className="font-mono text-slate-600">support.lifeadmin@gov.in</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#0b3b60] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">GIGW 3.0 Compliance</strong>
                    <span className="text-slate-600 text-[11px]">
                      This portal strictly adheres to Guidelines for Indian Government Websites (GIGW) and WCAG 2.1 AA accessibility standards.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setHelpModalOpen(false)}
                  className="w-full py-2 bg-[#0b3b60] hover:bg-[#154a75] text-white font-bold rounded transition text-xs"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
