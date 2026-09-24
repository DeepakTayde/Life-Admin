import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t-2 border-[#ff9933] bg-[#07263e] text-slate-300 text-xs mt-auto">
      {/* Upper Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-700/80">
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-white flex items-center justify-center p-0.5">
                <ShieldCheck className="w-4 h-4 text-[#0b3b60]" />
              </div>
              <span className="font-bold text-white text-sm tracking-wide">
                LIFE ADMIN CITIZEN PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
              National citizen document registry, statutory warranty, and licence expiry tracker.
              Designed in strict compliance with Guidelines for Indian Government Websites (GIGW)
              and WCAG 2.1 AA accessibility guidelines.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#ff9933]">
              Citizen Policies
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>
                <Link href="#main-content" className="hover:text-white transition">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link href="#main-content" className="hover:text-white transition">
                  Hyperlinking Policy
                </Link>
              </li>
              <li>
                <Link href="#main-content" className="hover:text-white transition">
                  Privacy Policy &amp; Data Rights
                </Link>
              </li>
              <li>
                <Link href="#main-content" className="hover:text-white transition">
                  Terms of Digital Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-[#ff9933]">
              National Helplines
            </h4>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>Toll-Free Helpline: <strong className="text-white font-mono">1800-11-2026</strong></p>
              <p>Email: <strong className="text-white font-mono">support.lifeadmin@gov.in</strong></p>
              <p className="text-[10px] text-slate-500 mt-2">
                Operational: Mon–Sat, 09:00 to 18:00 IST
              </p>
            </div>
          </div>
        </div>

        {/* Lower Footer: Attribution & Socials */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span>© 2026 Life Admin Portal. All rights reserved.</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              Built with <Heart className="w-3 h-3 text-[#c62828] fill-[#c62828]" /> by{' '}
              <strong className="text-white font-semibold">Anu</strong>
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title="GitHub Profile"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#ff9933] transition-colors"
              title="LinkedIn Profile"
            >
              <svg
                className="w-4 h-4 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
