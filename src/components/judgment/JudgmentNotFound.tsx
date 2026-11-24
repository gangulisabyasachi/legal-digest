'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scale, Search, ArrowLeft, Sparkles } from 'lucide-react';

interface JudgmentNotFoundProps {
  judgmentId?: string;
}

export default function JudgmentNotFound({ judgmentId }: JudgmentNotFoundProps) {
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

  const landmarkJudgments = [
    { title: 'Cox and Kings Ltd. v. SAP India Pvt. Ltd.', citation: '2023 INSC 1051', tag: 'Arbitration' },
    { title: 'Justice K.S. Puttaswamy v. Union of India', citation: '2017 INSC 672', tag: 'Article 21 Privacy' },
    { title: 'Arnesh Kumar v. State of Bihar', citation: '2014 INSC 504', tag: 'Section 41A CrPC' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb Bar */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
        <Link href="/" className="hover:text-[#007398]">Home</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-[#007398]">Judgments</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-sm">Authority Record Not Found</span>
      </nav>

      <div className="bg-white rounded-xl sciencedirect-border shadow-sm overflow-hidden">
        {/* Top Header Strip */}
        <div className="bg-[#00263E] text-white p-6 sm:p-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#007398]/30 border border-[#007398] text-[#00A3D9] text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>404 • Legal Authority Record Missing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-legal-serif text-white leading-tight">
            Judgment Record Not Found
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1 font-light">
            {judgmentId
              ? `The judgment record identifier "${judgmentId}" does not match any indexed authority in the repository.`
              : 'The requested case law record could not be retrieved from the repository.'}
          </p>
        </div>

        {/* Diagnostic & Research Pane */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Search by Alternative Citation, Party Name, or Statute
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter citation (e.g. 2017 INSC 672), party name, judge, or section..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-[#007398] hover:bg-[#005f7d] text-white text-xs sm:text-sm font-medium rounded transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Academic Reasons Box */}
          <div className="bg-[#FAF9F6] p-4 rounded-lg border-l-4 border-[#007398] text-xs space-y-2">
            <span className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] block">
              Editorial Notice & Common Reasons:
            </span>
            <ul className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed">
              <li>The citation format may vary across reporting law journals (SCR vs. SCC vs. AIR).</li>
              <li>The judgment may currently be undergoing AI doctrinal ratio synthesis or editorial review in the Admin Studio.</li>
              <li>The record may have been consolidated or re-indexed under an updated neutral citation.</li>
            </ul>
          </div>

          {/* Landmark Recommendations */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#007398]" />
              Explore Indexed Landmark Precedents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {landmarkJudgments.map((lj, idx) => (
                <Link
                  key={idx}
                  href={`/search?q=${encodeURIComponent(lj.citation)}`}
                  className="p-3 bg-gray-50 hover:bg-[#007398]/5 rounded border border-gray-200 hover:border-[#007398] transition-colors group text-left"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007398] block mb-1">
                    {lj.tag}
                  </span>
                  <p className="font-legal-serif text-xs font-bold text-gray-900 group-hover:text-[#007398] line-clamp-1">
                    {lj.title}
                  </p>
                  <p className="text-[11px] font-mono text-gray-500 mt-1">{lj.citation}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007398] hover:bg-[#005f7d] text-white rounded text-xs font-medium transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Back to Digest Search</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Digest Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
