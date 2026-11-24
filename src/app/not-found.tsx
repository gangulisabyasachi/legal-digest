'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Scale, Home, Folder, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl w-full bg-white rounded-xl sciencedirect-border shadow-sm p-8 sm:p-12 text-center space-y-6">
        {/* Top Editorial Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007398]/10 border border-[#007398]/30 text-[#007398] text-xs font-semibold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5 text-[#007398]" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* 404 Large Display */}
        <div className="space-y-2">
          <div className="text-6xl sm:text-7xl font-bold font-serif text-[#00263E] tracking-tight">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-legal-serif">
            This Page Could Not Be Found
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            The legal authorities, portal section, or document you are trying to access does not exist in the Juridica Digest registry.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case law, citations, or statutes..."
              className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-[#007398] focus:bg-white transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1.5 bg-[#007398] hover:bg-[#005f7d] text-white text-xs font-medium rounded transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Action Link Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007398] hover:bg-[#005f7d] text-white font-medium text-xs rounded transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs rounded transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#007398]" />
            <span>Digest Search</span>
          </Link>
          <Link
            href="/workspace"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-xs rounded transition-colors"
          >
            <Folder className="w-3.5 h-3.5 text-[#00A3D9]" />
            <span>My Workspace</span>
          </Link>
        </div>

        {/* Scholarly Footer Note */}
        <div className="pt-6 border-t border-gray-100 text-[11px] text-gray-400">
          Juridica Scholarly Case Reporter & Legal Citator • Supreme Court Reports (SCR) Standards
        </div>
      </div>
    </div>
  );
}
