'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Scale, Filter, BookOpen, Download, Bookmark, ArrowRight, X } from 'lucide-react';
import { IJudgment } from '@/lib/models/Judgment';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialCourt = searchParams.get('court') || '';
  const initialCatchword = searchParams.get('catchword') || '';
  const initialStatute = searchParams.get('statute') || '';

  const [query, setQuery] = useState(initialQ);
  const [selectedCourt, setSelectedCourt] = useState(initialCourt);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCatchword, setSelectedCatchword] = useState(initialCatchword);
  const [selectedStatute, setSelectedStatute] = useState(initialStatute);
  const [judgments, setJudgments] = useState<IJudgment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJudgments = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (selectedCourt) params.append('court', selectedCourt);
    if (selectedYear) params.append('year', selectedYear);
    if (selectedCatchword) params.append('catchword', selectedCatchword);
    if (selectedStatute) params.append('statute', selectedStatute);

    fetch(`/api/judgments?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.judgments) setJudgments(data.judgments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJudgments();
  }, [selectedCourt, selectedYear, selectedCatchword, selectedStatute]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJudgments();
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCourt('');
    setSelectedYear('');
    setSelectedCatchword('');
    setSelectedStatute('');
  };

  const courts = ['Supreme Court of India', 'High Court of Delhi', 'High Court of Bombay', 'High Court of Calcutta'];
  const years = ['2024', '2023', '2022', '2021', '2020', '2017', '2014'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white p-6 rounded-lg sciencedirect-border shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across judgments, citations, judges, acts, or points of law..."
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#007398] hover:bg-[#005f7d] text-white text-xs sm:text-sm font-medium rounded transition-colors"
          >
            Search
          </button>
        </form>

        {/* Active Filter Chips */}
        {(selectedCourt || selectedYear || selectedCatchword || selectedStatute) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-xs">
            <span className="text-gray-500 font-medium">Active filters:</span>
            {selectedCourt && (
              <span className="px-2 py-0.5 bg-[#007398]/10 text-[#007398] rounded flex items-center gap-1">
                Court: {selectedCourt}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCourt('')} />
              </span>
            )}
            {selectedYear && (
              <span className="px-2 py-0.5 bg-[#007398]/10 text-[#007398] rounded flex items-center gap-1">
                Year: {selectedYear}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedYear('')} />
              </span>
            )}
            {selectedCatchword && (
              <span className="px-2 py-0.5 bg-[#007398]/10 text-[#007398] rounded flex items-center gap-1">
                Topic: {selectedCatchword}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCatchword('')} />
              </span>
            )}
            {selectedStatute && (
              <span className="px-2 py-0.5 bg-[#007398]/10 text-[#007398] rounded flex items-center gap-1">
                Statute: {selectedStatute}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedStatute('')} />
              </span>
            )}
            <button onClick={clearFilters} className="text-xs text-red-600 hover:underline ml-2">
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Main Search Viewport with Left Filters */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Filter Rail (ScienceDirect Facet Sidebar) */}
        <aside className="w-full lg:w-64 space-y-6 text-xs flex-shrink-0">
          <div className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <span className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#007398]" />
                Filter Results
              </span>
              {(selectedCourt || selectedYear || selectedCatchword) && (
                <button onClick={clearFilters} className="text-[#007398] hover:underline text-[11px]">
                  Clear
                </button>
              )}
            </div>

            {/* Court Filter */}
            <div>
              <label className="font-medium text-gray-700 block mb-1.5">Court</label>
              <div className="space-y-1">
                {courts.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCourt(selectedCourt === c ? '' : c)}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors block text-[11px] ${
                      selectedCourt === c ? 'bg-[#007398] text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <label className="font-medium text-gray-700 block mb-1.5">Year of Decision</label>
              <div className="grid grid-cols-2 gap-1">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(selectedYear === y ? '' : y)}
                    className={`px-2 py-1 rounded text-center text-[11px] border transition-colors ${
                      selectedYear === y
                        ? 'bg-[#007398] text-white border-[#007398] font-semibold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Stream */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-200">
            <span>Found <strong>{judgments.length}</strong> legal authorities matching criteria</span>
            <span>Sorted by: Relevance & Date</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Searching case law database...</div>
          ) : judgments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg sciencedirect-border">
              <Scale className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-800 text-sm">No judgments found</p>
              <p className="text-xs text-gray-500 mt-1">Try relaxing your search terms or clearing active filters.</p>
            </div>
          ) : (
            judgments.map((judgment) => (
              <div
                key={judgment.id}
                className="bg-white p-5 rounded-lg sciencedirect-border hover:border-[#007398] transition-colors shadow-sm space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-wider">
                  <span className="font-semibold text-[#00263E]">{judgment.court}</span>
                  <span>{judgment.dateOfJudgment}</span>
                </div>

                <Link href={`/judgments/${judgment.id}`}>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 hover:text-[#007398] font-legal-serif transition-colors">
                    {judgment.caseTitle}
                  </h3>
                </Link>

                <p className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded inline-block border border-gray-200">
                  {judgment.citation}
                </p>

                {/* Headnote Preview */}
                <p className="text-xs text-gray-700 font-legal-serif line-clamp-3 leading-relaxed">
                  {judgment.headnote}
                </p>

                {/* Ratio Decidendi Snippet */}
                <div className="text-xs bg-[#FAF9F6] p-2.5 rounded border-l-2 border-[#007398] text-gray-800 italic font-legal-serif">
                  <span className="font-sans font-bold not-italic text-[10px] text-[#007398] uppercase block mb-0.5">Ratio:</span>
                  "{judgment.ratioDecidendi}"
                </div>

                {/* Bottom link and catchwords */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {judgment.catchwords?.slice(0, 3).map((cw, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {cw}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/judgments/${judgment.id}`}
                    className="text-[#007398] hover:underline font-semibold flex items-center gap-1 text-xs"
                  >
                    <span>View Judgment & Headnote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-gray-500">Loading search engine...</div>}>
      <SearchContent />
    </Suspense>
  );
}
