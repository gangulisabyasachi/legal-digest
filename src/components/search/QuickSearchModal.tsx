'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Scale, ArrowRight, X, Sparkles, FileText, ExternalLink, CornerDownLeft } from 'lucide-react';
import { IJudgment } from '@/lib/models/Judgment';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMac?: boolean;
}

export default function QuickSearchModal({ isOpen, onClose, isMac = false }: QuickSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IJudgment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Debounced search when query >= 3 characters
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/judgments?q=${encodeURIComponent(trimmed)}&limit=6`)
        .then((res) => res.json())
        .then((data) => {
          if (data.judgments) {
            setResults(data.judgments);
          } else {
            setResults([]);
          }
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation within modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/judgments/${results[selectedIndex].id}`);
        onClose();
      } else if (query.trim().length >= 3) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    }
  };

  const handleSelectQuickTopic = (topic: string) => {
    router.push(`/search?q=${encodeURIComponent(topic)}`);
    onClose();
  };

  if (!isOpen) return null;

  const quickTopics = [
    'Supreme Court of India',
    'High Court of Delhi',
    'Article 21 Privacy',
    'Section 41A CrPC Arrest',
    'Commercial Arbitration',
    'Constitutional Law',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-gray-200 px-4 py-3 bg-[#FAF9F6]">
          <Search className="w-5 h-5 text-[#007398] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search judgments, citations, judges, statutes (min 3 characters)..."
            className="w-full bg-transparent text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono text-gray-500 bg-gray-100 border border-gray-300 rounded shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {query.trim().length === 0 ? (
            <div className="space-y-4 py-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#007398]" />
                Suggested Legal Topics & Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {quickTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuickTopic(topic)}
                    className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-[#007398] hover:text-white border border-gray-200 rounded-md text-gray-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>{topic}</span>
                    <ArrowRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 pt-3 border-t border-gray-100">
                Tip: Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-[10px]">{isMac ? '⌘K' : 'Ctrl+K'}</kbd> anytime to open this search palette.
              </p>
            </div>
          ) : query.trim().length < 3 ? (
            <div className="py-8 text-center text-xs text-gray-500 space-y-2">
              <Scale className="w-6 h-6 text-gray-400 mx-auto" />
              <p className="font-medium text-gray-700">
                Please enter at least 3 characters in the search box to search something.
              </p>
              <p className="text-[11px] text-gray-400">
                Type {3 - query.trim().length} more character{3 - query.trim().length === 1 ? '' : 's'} to retrieve matching authorities.
              </p>
            </div>
          ) : loading ? (
            <div className="py-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[#007398] border-t-transparent rounded-full animate-spin" />
              <span>Searching legal authorities...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 space-y-2">
              <p className="font-semibold text-gray-700 text-sm">No judgments found matching &quot;{query}&quot;</p>
              <p className="text-[11px] text-gray-400">
                Try searching by citation (e.g. 2017 INSC 672), party name, judge, or section.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-400 pb-1 px-1">
                <span>Matching Legal Authorities ({results.length})</span>
                <span>Press ↵ to open</span>
              </div>
              {results.map((j, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <div
                    key={j.id}
                    onClick={() => {
                      router.push(`/judgments/${j.id}`);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#007398]/10 border-[#007398] shadow-xs'
                        : 'bg-white border-gray-150 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                      <span className="font-medium text-[#00263E] truncate">{j.court}</span>
                      <span>{j.dateOfJudgment}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 font-legal-serif line-clamp-1">
                        {j.caseTitle}
                      </h4>
                      <CornerDownLeft className="w-3.5 h-3.5 text-[#007398] opacity-70 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                        {j.citation}
                      </span>
                      {j.ratioDecidendi && (
                        <p className="text-[11px] text-gray-500 italic truncate flex-1 font-legal-serif">
                          Ratio: &quot;{j.ratioDecidendi}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↵</kbd>
              Select
            </span>
          </div>

          {query.trim().length >= 3 && (
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                onClose();
              }}
              className="text-[#007398] hover:underline font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>View full search results</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
