'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BookOpen, Download } from 'lucide-react';

interface JudgmentOutlineProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  hasFullText?: boolean;
  pdfUrl?: string;
  pdfFileName?: string;
}

export default function JudgmentOutline({
  activeSection,
  onSelectSection,
  hasFullText,
  pdfUrl,
  pdfFileName,
}: JudgmentOutlineProps) {
  const sections = useMemo(
    () => [
      { id: 'catchwords', label: '1. Catchwords & Subjects' },
      { id: 'headnote', label: '2. Headnote & Digest' },
      { id: 'ratio', label: '3. Ratio Decidendi' },
      { id: 'issues', label: '4. Questions of Law' },
      { id: 'disposition', label: '5. Operative Holding' },
      { id: 'statutes', label: '6. Statutes & Sections' },
      { id: 'precedents', label: '7. Cases Referred' },
      ...(hasFullText ? [{ id: 'fulltext', label: '8. Full Judgment Text' }] : []),
    ],
    [hasFullText]
  );

  const [activeId, setActiveId] = useState<string>(activeSection || 'catchwords');
  const isManualScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeSection) {
      setActiveId(activeSection);
    }
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const topOffset = 140; // Pixels from top of viewport (below sticky header)
      let current = '';

      // Check if user is scrolled near the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;

      const validSections = sections.filter((s) => document.getElementById(s.id));

      if (isAtBottom && validSections.length > 0) {
        current = validSections[validSections.length - 1].id;
      } else {
        for (const sec of validSections) {
          const el = document.getElementById(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= topOffset) {
              current = sec.id;
            }
          }
        }
      }

      if (current) {
        setActiveId(current);
        onSelectSection?.(current);
      } else if (validSections.length > 0 && window.scrollY < 200) {
        setActiveId(validSections[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [sections, onSelectSection]);

  const handleClick = (id: string) => {
    setActiveId(id);
    onSelectSection?.(id);
    isManualScrolling.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 700);
  };

  return (
    <aside className="sticky top-20 w-64 pr-4 hidden xl:block text-xs">
      <div className="border-b border-gray-200 pb-2 mb-3">
        <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#007398]" />
          Document Outline
        </h4>
      </div>

      <nav className="space-y-1">
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => handleClick(sec.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-all duration-150 block text-[12px] truncate ${
                isActive
                  ? 'bg-[#007398]/10 text-[#007398] font-bold border-l-2 border-[#007398] pl-3'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium'
              }`}
            >
              {sec.label}
            </button>
          );
        })}
      </nav>

      {/* Direct Quick PDF Download from Outline */}
      {pdfUrl && (
        <div className="mt-5 pt-3 border-t border-gray-200">
          <a
            href={pdfUrl}
            download={pdfFileName || 'official_judgment.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-[11px] font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#E25822]" />
            <span className="truncate">Download Official PDF</span>
          </a>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
        <p className="text-[11px] text-gray-400 leading-tight">
          Juridica Digest headnotes follow the Supreme Court Reports (SCR) editorial standard.
        </p>
      </div>
    </aside>
  );
}
