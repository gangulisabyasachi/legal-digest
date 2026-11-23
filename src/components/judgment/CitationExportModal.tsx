'use client';

import React, { useState } from 'react';
import { Copy, Check, X, FileText } from 'lucide-react';
import { IJudgment } from '@/lib/models/Judgment';

interface CitationExportModalProps {
  judgment: IJudgment;
  isOpen: boolean;
  onClose: () => void;
}

export default function CitationExportModal({ judgment, isOpen, onClose }: CitationExportModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const year = judgment.dateOfJudgment.split('-')[0] || new Date().getFullYear();

  const citationFormats = [
    {
      label: 'Standard Indian Legal Citation',
      code: `${judgment.caseTitle}, ${judgment.citation}`,
      key: 'standard',
    },
    {
      label: 'Neutral Citation (Supreme Court of India)',
      code: judgment.citation.includes('INSC') 
        ? judgment.citation.split('|').find(c => c.includes('INSC'))?.trim() || `${year} INSC 101`
        : `${year} INSC 101`,
      key: 'neutral',
    },
    {
      label: 'Bluebook (21st Edition)',
      code: `${judgment.caseTitle}, ${judgment.citation.split('|')[0].trim()} (${judgment.court.includes('Supreme Court') ? 'India' : 'Delhi H.C.'} ${year}).`,
      key: 'bluebook',
    },
    {
      label: 'BibTeX Format (Academic / LaTeX)',
      code: `@jurisdiction{${judgment.id},
  title = {${judgment.caseTitle}},
  court = {${judgment.court}},
  year = {${year}},
  citation = {${judgment.citation}}
}`,
      key: 'bibtex',
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(key);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#00263E] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#00A3D9]" />
            <h3 className="font-semibold text-sm">Export Legal Citation</h3>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs text-gray-500">
            Copy the standardized citation below for use in petitions, written submissions, or academic articles.
          </p>

          <div className="space-y-3">
            {citationFormats.map((fmt) => (
              <div key={fmt.key} className="border border-gray-200 rounded p-3 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wider">
                    {fmt.label}
                  </span>
                  <button
                    onClick={() => handleCopy(fmt.code, fmt.key)}
                    className="flex items-center gap-1 text-[11px] text-[#007398] hover:text-[#005f7d] font-medium"
                  >
                    {copiedFormat === fmt.key ? (
                      <>
                        <Check className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono text-gray-800 bg-white p-2 rounded border border-gray-200 overflow-x-auto whitespace-pre-wrap select-all">
                  {fmt.code}
                </pre>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-medium rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
