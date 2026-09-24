'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, LogOut, CheckCircle } from 'lucide-react';

interface HeaderProps {
  user?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="bg-white border-b border-[#dcdcdc] py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Department Emblem & Portal Identity */}
        <div className="flex items-center gap-3.5 sm:gap-5">
          {/* National Emblem of India Vector Graphic */}
          <Link
            href={user ? '/dashboard' : '/'}
            className="flex-shrink-0 group"
            title="National Citizen Document Registry"
          >
            <div className="w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center p-1 border border-slate-200 rounded-md bg-slate-50 group-hover:border-[#0b3b60] transition">
              <svg
                viewBox="0 0 100 120"
                className="w-full h-full fill-[#0b3b60]"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="State Emblem of India"
              >
                {/* Ashoka Lion Capital Motif */}
                <path d="M50 8 C43 8 38 13 38 20 C38 23 39 26 41 28 C35 30 30 35 30 42 C30 46 32 50 35 52 C32 54 30 58 30 62 C30 69 36 74 43 75 L43 80 C36 81 30 83 25 86 C22 88 20 91 20 94 L80 94 C80 91 78 88 75 86 C70 83 64 81 57 80 L57 75 C64 74 70 69 70 62 C70 58 68 54 65 52 C68 50 70 46 70 42 C70 35 65 30 59 28 C61 26 62 23 62 20 C62 13 57 8 50 8 Z" />
                {/* Central Lion Features */}
                <circle cx="50" cy="22" r="3" fill="#ff9933" />
                <path d="M47 34 L53 34 L50 40 Z" fill="#ff9933" />
                {/* Ashoka Chakra Base Motif */}
                <circle cx="50" cy="87" r="5" fill="#ff9933" />
                <rect x="25" y="96" width="50" height="4" rx="2" fill="#0b3b60" />
                <rect x="20" y="103" width="60" height="5" rx="1.5" fill="#0b3b60" />
                {/* Satyameva Jayate Banner base */}
                <path d="M22 112 L78 112 L75 116 L25 116 Z" fill="#ff9933" />
              </svg>
            </div>
          </Link>

          {/* Portal Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#0b3b60] tracking-tight">
                LIFE ADMIN
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#ff9933]/15 text-[#b45309] border border-[#ff9933]/40 rounded">
                GIGW 3.0 Verified
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-semibold text-slate-800">
              Citizen Document &amp; Expiry Management System
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              National Document Registry • Department of Citizen Services &amp; Digital Governance
            </p>
          </div>
        </div>

        {/* Right: Citizen Authentication Badge */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-[#f4f6f9] border border-[#dcdcdc] rounded-lg p-2 sm:px-3.5 sm:py-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#0b3b60] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#2e7d32] border-2 border-white"
                  title="Verified Citizen Session Active"
                />
              </div>

              <div className="text-left text-xs leading-tight">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900 truncate max-w-[120px] sm:max-w-[150px]">
                    {user.name || user.email.split('@')[0]}
                  </span>
                  <CheckCircle className="w-3 h-3 text-[#2e7d32]" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Citizen ID: <strong className="text-slate-700">IND-849204</strong>
                </div>
              </div>

              <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block" />

              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#c62828] hover:text-[#991b1b] bg-white border border-[#dcdcdc] px-2.5 py-1 rounded transition"
                title="Sign out from Citizen Portal"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-[#0b3b60] border border-[#0b3b60] rounded hover:bg-[#0b3b60] hover:text-white transition"
              >
                Citizen Login
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0b3b60] rounded hover:bg-[#154a75] transition shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
