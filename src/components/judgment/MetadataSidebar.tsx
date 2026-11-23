'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Bookmark, Copy, Users, Scale, FileText, Check, ExternalLink } from 'lucide-react';
import { IJudgment } from '@/lib/models/Judgment';

interface MetadataSidebarProps {
  judgment: IJudgment;
  onOpenBookmark: () => void;
  onOpenCitation: () => void;
  isBookmarked?: boolean;
}

export default function MetadataSidebar({ judgment, onOpenBookmark, onOpenCitation, isBookmarked }: MetadataSidebarProps) {
  return (
    <aside className="w-full lg:w-72 space-y-5 text-xs">
      {/* Action Buttons Box (ScienceDirect Style) */}
      <div className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm space-y-2.5">
        <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-2">
          Research Actions
        </h4>

        {/* Download PDF button (ScienceDirect signature orange/teal) */}
        {judgment.pdfUrl ? (
          <a
            href={judgment.pdfUrl}
            download={judgment.pdfFileName || `${judgment.caseTitle.slice(0, 20)}.pdf`}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E25822] hover:bg-[#c94918] text-white font-medium rounded transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF</span>
          </a>
        ) : (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-400 font-medium rounded cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>PDF Not Available</span>
          </button>
        )}

        {/* Bookmark / Save to Folder */}
        <button
          onClick={onOpenBookmark}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded font-medium border transition-colors ${
            isBookmarked
              ? 'bg-[#007398]/10 text-[#007398] border-[#007398]'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-[#007398]' : ''}`} />
          <span>{isBookmarked ? 'Saved to Brief' : 'Save to Research Folder'}</span>
        </button>

        {/* Export Citation */}
        <button
          onClick={onOpenCitation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded font-medium transition-colors"
        >
          <Copy className="w-3.5 h-3.5 text-gray-500" />
          <span>Copy / Export Citation</span>
        </button>
      </div>

      {/* Coram / Bench */}
      <div className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm">
        <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#007398]" />
          Bench / Coram
        </h4>
        <ul className="space-y-1.5">
          {judgment.bench?.map((judge, idx) => (
            <li key={idx}>
              <Link
                href={`/search?q=${encodeURIComponent(judge)}`}
                className="text-gray-700 hover:text-[#007398] hover:underline flex items-center justify-between group"
              >
                <span className="font-medium text-[12px]">{judge}</span>
                <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-[#007398]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Case Details Card */}
      <div className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm space-y-2">
        <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-[#007398]" />
          Registry Details
        </h4>
        <div className="space-y-1.5 text-[11px]">
          <div>
            <span className="text-gray-400 block">Case Number:</span>
            <span className="font-medium text-gray-800">{judgment.caseNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Date of Judgment:</span>
            <span className="font-medium text-gray-800">{judgment.dateOfJudgment}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Court:</span>
            <span className="font-medium text-gray-800">{judgment.court}</span>
          </div>
          <div>
            <span className="text-gray-400 block">Editorial Status:</span>
            <span className="inline-block mt-0.5 px-2 py-0.5 bg-green-100 text-green-800 rounded font-semibold uppercase text-[10px]">
              {judgment.status}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
