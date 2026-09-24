'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, User, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || undefined, email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Registration failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-[#dcdcdc] shadow-xs overflow-hidden">
        {/* Government Portal Register Header */}
        <div className="bg-[#0b3b60] text-white p-5 border-b-2 border-[#ff9933] text-center space-y-1.5">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center mx-auto text-[#ff9933]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold tracking-wide uppercase">
            Citizen Registration
          </h1>
          <p className="text-xs text-slate-200">
            Create your National Document Registry Vault Account
          </p>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          {error && (
            <div className="p-3 rounded bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Citizen Full Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anu Sharma"
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-[#fcfdfd]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Address <span className="text-[#c62828]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anu@example.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-[#fcfdfd]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Password <span className="text-[#c62828]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-[#fcfdfd]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0b3b60] hover:bg-[#154a75] rounded transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Citizen Vault...</span>
                </>
              ) : (
                <span>Complete Citizen Registration</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already registered?{' '}
            <Link href="/login" className="text-[#0b3b60] font-bold hover:underline">
              Citizen Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
