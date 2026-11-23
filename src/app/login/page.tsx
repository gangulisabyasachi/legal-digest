'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Scale, Lock, Mail, Shield, AlertCircle, Check } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegisterParam = searchParams.get('register') === 'true';

  const [isRegister, setIsRegister] = useState(isRegisterParam);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            password,
            organization,
            role: 'subscriber',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
      }

      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.error || 'Authentication failed');
      }

      if (loginData.user.role === 'admin' || loginData.user.role === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/workspace');
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-lg sciencedirect-border shadow-lg">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded bg-[#00263E] text-white flex items-center justify-center mx-auto shadow-sm">
            <Scale className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-legal-serif text-[#00263E]">
            {isRegister ? 'Register for Juridica Digest' : 'Sign in to Juridica Digest'}
          </h2>
          <p className="text-xs text-gray-500">
            Access your research briefs, bookmarks, and case law headnotes
          </p>
        </div>

        {!isRegister && (
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs space-y-1.5">
            <p className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider">Quick Demo Logins:</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@legaldigest.org')}
                className="px-2 py-1 bg-[#00263E] text-white rounded text-[10px] hover:bg-black transition-colors"
              >
                Superadmin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('editor@legaldigest.org')}
                className="px-2 py-1 bg-[#007398] text-white rounded text-[10px] hover:bg-[#005f7d] transition-colors"
              >
                Legal Editor
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('lawyer@chamber.in')}
                className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-[10px] hover:bg-gray-300 transition-colors"
              >
                Subscriber / Advocate
              </button>
            </div>
            <p className="text-[10px] text-gray-400">Default demo password: Password123!</p>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Advocate / Scholar Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Chamber / Organization</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Bar Association of Delhi / Law Firm"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="advocate@chamber.in"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 p-2.5 rounded bg-red-50 border border-red-200 text-red-600">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#007398] hover:bg-[#005f7d] text-white font-medium rounded transition-colors shadow-sm disabled:opacity-50 text-sm"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-xs">
          {isRegister ? (
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-[#007398] font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              New to Juridica Digest?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-[#007398] font-semibold hover:underline"
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Loading login portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
