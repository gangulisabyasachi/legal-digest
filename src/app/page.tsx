'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Scale, BookOpen, Bookmark, Shield, ArrowRight, FileText, ChevronRight, Sparkles } from 'lucide-react';
import { IJudgment } from '@/lib/models/Judgment';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [judgments, setJudgments] = useState<IJudgment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
  }, []);

  useEffect(() => {
    fetch('/api/judgments?status=published&limit=5')
      .then((res) => res.json())
      .then((data) => {
        if (data.judgments) setJudgments(data.judgments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const subjects = [
    { name: 'Constitutional Law', count: '14,200', tag: 'CONSTITUTIONAL LAW' },
    { name: 'Criminal Procedure & Bail', count: '9,840', tag: 'CRIMINAL LAW' },
    { name: 'Commercial Arbitration', count: '5,310', tag: 'COMMERCIAL LAW' },
    { name: 'Corporate & IBC', count: '4,120', tag: 'COMPANIES ACT' },
    { name: 'Intellectual Property', count: '2,900', tag: 'INTELLECTUAL PROPERTY' },
    { name: 'Taxation & Customs', count: '3,800', tag: 'TAXATION' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. ScienceDirect Scholarly Hero with Big Academic Search */}
      <section className="bg-[#00263E] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#001B2E]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007398]/30 border border-[#007398] text-[#00A3D9] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Synthesized Legal Digest & Headnotes
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-legal-serif tracking-tight text-white leading-tight">
            Scholarly Case Law Digest & Legal Citator
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Search Supreme Court and High Court judgments with instant ratio decidendi, statutory cross-references, and verified legal headnotes.
          </p>

          {/* Academic Search Box */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mt-8">
            <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-lg shadow-2xl p-1.5 border border-gray-200">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-gray-400 absolute left-4" />
                <input
                  id="hero-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search citation (e.g. 2017 INSC 672), party name, statute, judge, or ratio..."
                  className="w-full pl-12 pr-16 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
                />
                <div className="absolute right-3 hidden sm:flex items-center text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded pointer-events-none">
                  {isMac ? '⌘K' : 'Ctrl+K'}
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 sm:mt-0 px-8 py-3 bg-[#007398] hover:bg-[#005f7d] text-white font-medium text-sm rounded transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Search Digest</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-300 mt-3">
              <span className="text-gray-400">Popular searches:</span>
              <Link href="/search?q=Article 21" className="hover:text-white underline">
                Article 21 Privacy
              </Link>
              <span>•</span>
              <Link href="/search?q=Section 41A" className="hover:text-white underline">
                Section 41A CrPC Arrest
              </Link>
              <span>•</span>
              <Link href="/search?q=Group of Companies" className="hover:text-white underline">
                Arbitration Group of Companies
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Key Stats Strip (ScienceDirect style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-lg sciencedirect-border shadow-md grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 py-4 px-6 text-center">
          <div>
            <p className="text-2xl font-bold text-[#00263E] font-serif">45,000+</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Reported Judgments</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#007398] font-serif">100%</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Ratio & Headnotes</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#E25822] font-serif">xAI Grok</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Doctrinal Engine</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800 font-serif">SCC Style</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Editorial Rigour</p>
          </div>
        </div>
      </section>

      {/* 3. Latest Reported Digests (ScienceDirect Article Card Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#00263E] font-legal-serif flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#007398]" />
              Latest Supreme Court & High Court Digests
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Recently digested judgments with synthesized ratios and catchwords
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-semibold text-[#007398] hover:underline flex items-center gap-1"
          >
            <span>Search Case Law</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading legal digest catalog...
          </div>
        ) : (
          <div className="space-y-4">
            {judgments.slice(0, 5).map((judgment) => (
              <div
                key={judgment.id}
                className="bg-white p-6 rounded-lg sciencedirect-border hover:border-[#007398] sciencedirect-box-shadow transition-all group"
              >
                {/* Court & Date Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
                  <span className="text-[#00263E] font-semibold flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-[#007398]" />
                    {judgment.court}
                  </span>
                  <span>{new Date(judgment.dateOfJudgment).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Case Title */}
                <Link href={`/judgments/${judgment.id}`}>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#007398] font-legal-serif transition-colors leading-snug">
                    {judgment.caseTitle}
                  </h3>
                </Link>

                {/* Citation */}
                <div className="flex items-center gap-2 mt-1 mb-3 text-xs">
                  <span className="font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                    {judgment.citation}
                  </span>
                  {judgment.isLandmark && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Landmark
                    </span>
                  )}
                </div>

                {/* Ratio Decidendi Snippet */}
                <p className="text-sm text-gray-700 font-legal-serif line-clamp-2 leading-relaxed bg-[#FAF9F6] p-3 rounded border-l-2 border-[#007398] mb-3">
                  <span className="font-bold text-[#00263E] not-italic font-sans text-xs uppercase tracking-wide mr-1">Ratio:</span>
                  "{judgment.ratioDecidendi}"
                </p>

                {/* Catchwords Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {judgment.catchwords?.slice(0, 4).map((cw, i) => (
                      <span
                        key={i}
                        className="text-[10px] uppercase font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                      >
                        {cw}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/judgments/${judgment.id}`}
                    className="text-[#007398] group-hover:underline font-semibold flex items-center gap-1 text-xs"
                  >
                    <span>Read Full Digest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Subject Taxonomy Grid (ScienceDirect Browse Topics) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-xl font-bold text-[#00263E] font-legal-serif">
            Browse by Legal Subject & Jurisdiction
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Explore authoritative headnotes categorized by subject matter
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subj) => (
            <Link
              key={subj.name}
              href={`/search?catchword=${encodeURIComponent(subj.tag)}`}
              className="p-4 bg-white rounded-lg sciencedirect-border hover:border-[#007398] transition-colors flex items-center justify-between group shadow-sm"
            >
              <div>
                <p className="font-semibold text-sm text-gray-900 group-hover:text-[#007398] transition-colors">
                  {subj.name}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">{subj.count} indexed authorities</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#007398] transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
