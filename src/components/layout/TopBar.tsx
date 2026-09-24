'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Volume2, Globe } from 'lucide-react';

export function TopBar() {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1: A-, 0: A, 1: A+

  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeLevel === -1) {
      root.style.fontSize = '92%';
    } else if (fontSizeLevel === 1) {
      root.style.fontSize = '108%';
    } else {
      root.style.fontSize = '100%';
    }
  }, [fontSizeLevel]);

  return (
    <div className="bg-[#07263e] text-slate-200 border-b border-[#0b3b60] text-[11px] font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government of India Indicator */}
        <div className="flex items-center gap-2">
          {/* Indian Tricolor Mini Strip */}
          <div className="flex h-3.5 w-5 rounded-xs overflow-hidden shadow-2xs border border-white/20" title="Government of India">
            <div className="w-full bg-[#ff9933] h-1/3" />
            <div className="w-full bg-white h-1/3 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#000080]" />
            </div>
            <div className="w-full bg-[#138808] h-1/3" />
          </div>
          <span className="tracking-wide uppercase font-semibold text-slate-300">
            Government of India
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            National Citizen Document Portal
          </span>
        </div>

        {/* Right: Accessibility Controls (GIGW Compliant) */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Skip to Main Content */}
          <a
            href="#main-content"
            className="hover:text-white underline decoration-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            Skip to Main Content
          </a>

          <div className="h-3 w-px bg-slate-700 hidden xs:block" />

          {/* Screen Reader Access link */}
          <Link
            href="#main-content"
            className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white"
            title="Screen Reader Access"
          >
            <Volume2 className="w-3 h-3 text-amber-400" />
            <span>Screen Reader</span>
          </Link>

          <div className="h-3 w-px bg-slate-700 hidden md:block" />

          {/* Font Size Changers: A- | A | A+ */}
          <div className="flex items-center gap-1 bg-[#0b3b60] px-1.5 py-0.5 rounded border border-white/10" aria-label="Font size adjustments">
            <button
              type="button"
              onClick={() => setFontSizeLevel(-1)}
              className={`px-1.5 py-0.5 rounded hover:bg-[#154a75] transition ${fontSizeLevel === -1 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
              title="Decrease Font Size (A-)"
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel(0)}
              className={`px-1.5 py-0.5 rounded hover:bg-[#154a75] transition ${fontSizeLevel === 0 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
              title="Standard Font Size (A)"
              aria-label="Standard Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSizeLevel(1)}
              className={`px-1.5 py-0.5 rounded hover:bg-[#154a75] transition ${fontSizeLevel === 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}
              title="Increase Font Size (A+)"
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          <div className="h-3 w-px bg-slate-700" />

          {/* Language Indicator */}
          <div className="flex items-center gap-1.5 text-slate-300 bg-[#0b3b60] px-2 py-0.5 rounded border border-white/10" title="Portal Language">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold text-white">English</span>
          </div>
        </div>
      </div>
    </div>
  );
}
