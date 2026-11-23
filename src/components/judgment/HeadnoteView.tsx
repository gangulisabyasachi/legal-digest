'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IJudgment } from '@/lib/models/Judgment';
import { Scale, ChevronRight, FileText, CheckCircle2, AlertCircle, Quote, ExternalLink, Bookmark, Download, Copy } from 'lucide-react';

interface HeadnoteViewProps {
  judgment: IJudgment;
  onOpenBookmark?: () => void;
  onOpenCitation?: () => void;
  isBookmarked?: boolean;
}

export default function HeadnoteView({ judgment, onOpenBookmark, onOpenCitation, isBookmarked }: HeadnoteViewProps) {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <article className="flex-1 max-w-4xl bg-white sciencedirect-border rounded-lg p-6 sm:p-8 shadow-sm">
      {/* 1. Scholarly Court Header */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
          <span className="flex items-center gap-1.5 text-[#00263E] font-semibold">
            <Scale className="w-4 h-4 text-[#007398]" />
            {judgment.court}
          </span>
          <span>{judgment.jurisdiction || 'Appellate Jurisdiction'}</span>
          <span>{new Date(judgment.dateOfJudgment).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        {/* Case Title in Academic Serif */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-legal-serif leading-tight mb-3">
          {judgment.caseTitle}
        </h1>

        {/* Citations & Landmark Badge */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          <span className="font-mono bg-gray-100 text-gray-800 px-2.5 py-1 rounded border border-gray-200 font-medium">
            Citation: {judgment.citation}
          </span>
          {judgment.caseNumber && (
            <span className="text-gray-500 font-medium">
              • {judgment.caseNumber}
            </span>
          )}
          {judgment.isLandmark && (
            <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded font-semibold text-[11px] border border-amber-300">
              Landmark Precedent
            </span>
          )}
        </div>

        {/* PROMINENT SCIENCEDIRECT ACTION TOOLBAR (Visible immediately at top of page) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-gray-100">
          {judgment.pdfUrl ? (
            <a
              href={judgment.pdfUrl}
              download={judgment.pdfFileName || `${judgment.caseTitle.slice(0, 30)}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E25822] hover:bg-[#c94918] text-white font-semibold text-xs rounded transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF</span>
            </a>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 font-medium text-xs rounded cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>PDF Not Available</span>
            </button>
          )}

          <button
            onClick={onOpenBookmark}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs rounded font-medium border transition-colors ${
              isBookmarked
                ? 'bg-[#007398]/10 text-[#007398] border-[#007398]'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-[#007398]' : ''}`} />
            <span>{isBookmarked ? 'Saved to Brief' : 'Save to Folder'}</span>
          </button>

          <button
            onClick={onOpenCitation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded text-xs font-medium transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-gray-500" />
            <span>Copy Citation</span>
          </button>

          {judgment.fullText && (
            <button
              onClick={() => {
                setShowFullText(true);
                document.getElementById('fulltext')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-gray-600" />
              <span>View Source Text</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Catchwords & Legal Subject Taxonomy */}
      <section id="catchwords" className="mb-8">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Catchwords / Legal Subjects
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {judgment.catchwords?.map((cw, i) => (
            <Link
              key={i}
              href={`/search?catchword=${encodeURIComponent(cw)}`}
              className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 bg-[#00263E]/5 text-[#00263E] hover:bg-[#007398] hover:text-white rounded transition-colors"
            >
              {cw}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Core Headnote Summary (ScienceDirect Abstract Style) */}
      <section id="headnote" className="mb-8 p-5 bg-[#FAF9F6] border-l-4 border-[#007398] rounded-r">
        <h2 className="text-xs font-bold text-[#00263E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#007398]" />
          Headnote & Legal Digest
        </h2>
        <div className="font-legal-serif text-[15px] text-gray-800 leading-relaxed space-y-3">
          {judgment.headnote.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* 4. Ratio Decidendi (Highlighted Callout) */}
      <section id="ratio" className="mb-8 p-5 bg-blue-50/60 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2 text-[#004F6E]">
          <Quote className="w-4 h-4" />
          <h2 className="text-xs font-bold uppercase tracking-wider">
            Ratio Decidendi (Point of Law Laid Down)
          </h2>
        </div>
        <p className="font-legal-serif text-sm sm:text-base text-gray-900 italic leading-relaxed pl-2">
          "{judgment.ratioDecidendi}"
        </p>
      </section>

      {/* 5. Questions of Law / Issues Framed */}
      {judgment.issues && judgment.issues.length > 0 && (
        <section id="issues" className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
            Legal Issues Framed & Considered
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-800 font-medium">
            {judgment.issues.map((issue, idx) => (
              <li key={idx} className="pl-1 leading-relaxed">
                <span className="font-sans text-gray-700">{issue}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 6. Operative Order / Holding */}
      <section id="disposition" className="mb-8">
        <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 pb-1 border-b border-gray-200">
          Operative Order & Disposition
        </h2>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-800 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{judgment.holding}</p>
        </div>
      </section>

      {/* 7. Statutes Cited Matrix */}
      {judgment.statutesCited && judgment.statutesCited.length > 0 && (
        <section id="statutes" className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
            Statutes, Codes & Constitutional Provisions Interpreted
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {judgment.statutesCited.map((st, i) => (
              <div key={i} className="p-3 bg-white rounded border border-gray-200 hover:border-[#007398] transition-colors">
                <p className="font-semibold text-xs text-gray-900 mb-1">{st.act}</p>
                <div className="flex flex-wrap gap-1">
                  {st.sections.map((sec, sIdx) => (
                    <Link
                      key={sIdx}
                      href={`/search?statute=${encodeURIComponent(sec)}`}
                      className="text-[11px] px-2 py-0.5 bg-gray-100 hover:bg-[#007398] hover:text-white rounded text-gray-700 transition-colors font-mono"
                    >
                      {sec}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Precedents & Cases Referred */}
      {judgment.casesReferred && judgment.casesReferred.length > 0 && (
        <section id="precedents" className="mb-8">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 pb-1 border-b border-gray-200">
            Precedents & Authorities Considered
          </h2>
          <div className="divide-y divide-gray-100 border border-gray-200 rounded">
            {judgment.casesReferred.map((cs, i) => (
              <div key={i} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50">
                <div>
                  <span className="font-serif font-semibold text-gray-900">{cs.caseName}</span>
                  {cs.citation && <span className="text-gray-500 font-mono text-[11px] ml-2">({cs.citation})</span>}
                </div>
                {cs.treatment && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      cs.treatment === 'Overruled'
                        ? 'bg-red-100 text-red-800'
                        : cs.treatment === 'Followed'
                        ? 'bg-green-100 text-green-800'
                        : cs.treatment === 'Distinguished'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {cs.treatment}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Full Text Toggle (if available) */}
      {judgment.fullText && (
        <section id="fulltext" className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Full Judgment Transcript
            </h2>
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-xs font-medium text-[#007398] hover:underline"
            >
              {showFullText ? 'Collapse Full Text' : 'Read Full Text'}
            </button>
          </div>

          {showFullText && (
            <div className="bg-[#FAF9F6] p-6 rounded border border-gray-200 text-xs sm:text-sm font-legal-serif text-gray-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
              {judgment.fullText}
            </div>
          )}
        </section>
      )}
    </article>
  );
}
