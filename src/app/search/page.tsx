'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Scale,
  Filter,
  ArrowRight,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { IJudgment } from '@/lib/models/Judgment';

function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const delta = 1;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== undefined) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ =
    searchParams.get('q') ||
    searchParams.get('catchword') ||
    searchParams.get('statute') ||
    '';
  const initialCourt = searchParams.get('court') || '';
  const initialCatchword = searchParams.get('catchword') || '';
  const initialStatute = searchParams.get('statute') || '';

  const [query, setQuery] = useState(initialQ);
  const [selectedCourt, setSelectedCourt] = useState(initialCourt);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCatchword, setSelectedCatchword] = useState(initialCatchword);
  const [selectedStatute, setSelectedStatute] = useState(initialStatute);
  const [judgments, setJudgments] = useState<IJudgment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent));
  }, []);

  const fetchJudgments = (customQuery?: string) => {
    const qToSearch = (customQuery !== undefined ? customQuery : query).trim();
    if (qToSearch.length < 3) {
      setJudgments([]);
      setLoading(false);
      setSearchError('Please enter at least 3 characters in the search box to search something.');
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    setSearchError(null);
    const params = new URLSearchParams();
    params.append('q', qToSearch);
    if (selectedCourt) params.append('court', selectedCourt);
    if (selectedYear) params.append('year', selectedYear);
    if (selectedCatchword) params.append('catchword', selectedCatchword);
    if (selectedStatute) params.append('statute', selectedStatute);

    fetch(`/api/judgments?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.judgments) {
          setJudgments(data.judgments);
          setCurrentPage(1);
        } else {
          setJudgments([]);
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        console.error(err);
        setJudgments([]);
        setCurrentPage(1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (initialQ.trim().length >= 3) {
      fetchJudgments(initialQ);
    } else {
      setJudgments([]);
      setLoading(false);
    }
  }, [initialQ]);

  useEffect(() => {
    if (query.trim().length >= 3) {
      fetchJudgments();
    }
  }, [selectedCourt, selectedYear, selectedCatchword, selectedStatute]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 3) {
      setSearchError('Please enter at least 3 characters in the search box to search something.');
      setJudgments([]);
      setLoading(false);
      setCurrentPage(1);
      return;
    }
    setSearchError(null);
    fetchJudgments();
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedCourt('');
    setSelectedYear('');
    setSelectedCatchword('');
    setSelectedStatute('');
    setJudgments([]);
    setSearchError(null);
    setCurrentPage(1);
  };

  const courts = ['Supreme Court of India', 'High Court of Delhi', 'High Court of Bombay', 'High Court of Calcutta'];
  const years = ['2024', '2023', '2022', '2021', '2020', '2017', '2014'];

  const isQueryTooShort = query.trim().length < 3;

  const totalPages = Math.max(1, Math.ceil(judgments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJudgments = judgments.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    const resultsTop = document.getElementById('results-top');
    if (resultsTop) {
      const yOffset = -90;
      const y = resultsTop.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white p-6 rounded-lg sciencedirect-border shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              id="search-page-input"
              type="text"
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                if (val.trim().length === 0) {
                  setJudgments([]);
                  setSearchError(null);
                  setCurrentPage(1);
                } else if (val.trim().length >= 3 && searchError) {
                  setSearchError(null);
                }
              }}
              placeholder="Search across judgments, citations, judges, acts, or points of law..."
              className="w-full pl-9 pr-14 py-2.5 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
            />
            <div className="absolute right-3 top-2.5 hidden sm:flex items-center text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded pointer-events-none">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#007398] hover:bg-[#005f7d] text-white text-xs sm:text-sm font-medium rounded transition-colors"
          >
            Search
          </button>
        </form>

        <p className="mt-2 text-xs text-gray-500 font-medium">
          Please enter at least 3 characters in the search box to search something.
        </p>

        {searchError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

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
          {isQueryTooShort ? (
            <div className="p-12 text-center bg-white rounded-lg sciencedirect-border shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#007398]/10 text-[#007398] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 font-legal-serif">
                Please enter at least 3 characters in the search box to search something.
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                To view case law, citations, statutes, or ratios, please enter at least 3 characters in the search box above.
              </p>
            </div>
          ) : (
            <>
              {/* Results Count & Sorting Header */}
              <div
                id="results-top"
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500 pb-2 border-b border-gray-200"
              >
                <span>
                  Found <strong className="text-gray-800">{judgments.length}</strong> legal authorities matching &quot;{query.trim()}&quot;
                  {judgments.length > itemsPerPage && (
                    <span className="ml-1 text-gray-400 font-normal">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </span>
                <span className="text-[11px]">Sorted by: Relevance & Date</span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#007398] border-t-transparent rounded-full animate-spin" />
                  <span>Searching case law database...</span>
                </div>
              ) : judgments.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-lg sciencedirect-border">
                  <Scale className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-semibold text-gray-800 text-sm">No judgments found</p>
                  <p className="text-xs text-gray-500 mt-1">Try relaxing your search terms or clearing active filters.</p>
                </div>
              ) : (
                <>
                  {/* Paginated Cards */}
                  <div className="space-y-4">
                    {paginatedJudgments.map((judgment) => (
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
                          &quot;{judgment.ratioDecidendi}&quot;
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
                    ))}
                  </div>

                  {/* Beautiful Elsevier/ScienceDirect Style Pagination Bar */}
                  {judgments.length > 0 && (
                    <div className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                      {/* Left: Range and Per-Page Control */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span>
                          Showing <strong className="text-gray-900 font-semibold">{startIndex + 1}</strong>–
                          <strong className="text-gray-900 font-semibold">
                            {Math.min(startIndex + itemsPerPage, judgments.length)}
                          </strong>{' '}
                          of <strong className="text-gray-900 font-semibold">{judgments.length}</strong> authorities
                        </span>

                        <span className="hidden md:inline text-gray-300">|</span>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-gray-500">Per page:</span>
                          {[5, 10, 20].map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                setItemsPerPage(size);
                                setCurrentPage(1);
                              }}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                                itemsPerPage === size
                                  ? 'bg-[#007398] text-white border-[#007398] font-semibold'
                                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right: Page Navigation Buttons */}
                      {totalPages > 1 && (
                        <nav className="flex items-center gap-1 text-xs" aria-label="Search pagination">
                          {/* First Page */}
                          <button
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title="First Page"
                            aria-label="First page"
                          >
                            <ChevronsLeft className="w-4 h-4" />
                          </button>

                          {/* Previous Page */}
                          <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-2.5 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium"
                            aria-label="Previous page"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-xs">Prev</span>
                          </button>

                          {/* Page Numbers */}
                          <div className="flex items-center gap-1 mx-1">
                            {getPaginationRange(currentPage, totalPages).map((p, idx) =>
                              typeof p === 'number' ? (
                                <button
                                  key={idx}
                                  onClick={() => goToPage(p)}
                                  aria-current={currentPage === p ? 'page' : undefined}
                                  className={`w-8 h-8 rounded text-xs font-semibold border transition-all ${
                                    currentPage === p
                                      ? 'bg-[#007398] text-white border-[#007398] shadow-xs'
                                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#007398] hover:text-[#007398]'
                                  }`}
                                >
                                  {p}
                                </button>
                              ) : (
                                <span key={idx} className="w-6 text-center text-gray-400 select-none text-xs">
                                  ...
                                </span>
                              )
                            )}
                          </div>

                          {/* Next Page */}
                          <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-2.5 py-1.5 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 font-medium"
                            aria-label="Next page"
                          >
                            <span className="hidden sm:inline text-xs">Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Last Page */}
                          <button
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            title="Last Page"
                            aria-label="Last page"
                          >
                            <ChevronsRight className="w-4 h-4" />
                          </button>
                        </nav>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
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
