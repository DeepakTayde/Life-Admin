'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both registered email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Invalid citizen credentials');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('deepaktayde@example.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
      <div className="max-w-md w-full bg-white rounded-lg border border-[#dcdcdc] shadow-xs overflow-hidden">
        {/* Government Portal Login Header */}
        <div className="bg-[#0b3b60] text-white p-5 border-b-2 border-[#ff9933] text-center space-y-1.5">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center mx-auto text-[#ff9933]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold tracking-wide uppercase">
            Citizen Authentication
          </h1>
          <p className="text-xs text-slate-200">
            National Document Registry &amp; Expiry Tracker Portal
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
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Registered Citizen Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="deepaktayde@example.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-[#0b3b60] bg-[#fcfdfd]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Access Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Authenticate &amp; Access Vault</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center space-y-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs text-[#0b3b60] font-bold hover:underline"
            >
              Fill Demo Credentials (deepaktayde@example.com)
            </button>

            <p className="text-xs text-slate-500">
              New Citizen?{' '}
              <Link href="/register" className="text-[#0b3b60] font-bold hover:underline">
                Register New Citizen Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
