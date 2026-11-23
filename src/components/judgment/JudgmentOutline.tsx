'use client';

import React from 'react';
import { BookOpen, Scale, FileText, CheckCircle, Bookmark, ExternalLink, Download } from 'lucide-react';

interface JudgmentOutlineProps {
  activeSection?: string;
  onSelectSection?: (sectionId: string) => void;
  hasFullText?: boolean;
  pdfUrl?: string;
  pdfFileName?: string;
}

export default function JudgmentOutline({
  activeSection = 'headnote',
  onSelectSection,
  hasFullText,
  pdfUrl,
  pdfFileName,
}: JudgmentOutlineProps) {
  const sections = [
    { id: 'catchwords', label: '1. Catchwords & Subjects' },
    { id: 'headnote', label: '2. Headnote & Digest' },
    { id: 'ratio', label: '3. Ratio Decidendi' },
    { id: 'issues', label: '4. Questions of Law' },
    { id: 'disposition', label: '5. Operative Holding' },
    { id: 'statutes', label: '6. Statutes & Sections' },
    { id: 'precedents', label: '7. Cases Referred' },
    ...(hasFullText ? [{ id: 'fulltext', label: '8. Full Judgment Text' }] : []),
  ];

  const handleClick = (id: string) => {
    onSelectSection?.(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => handleClick(sec.id)}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors block text-[12px] truncate ${
              activeSection === sec.id
                ? 'bg-[#007398]/10 text-[#007398] font-semibold border-l-2 border-[#007398]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {sec.label}
          </button>
        ))}
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
