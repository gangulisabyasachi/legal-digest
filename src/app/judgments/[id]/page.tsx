'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import JudgmentOutline from '@/components/judgment/JudgmentOutline';
import HeadnoteView from '@/components/judgment/HeadnoteView';
import MetadataSidebar from '@/components/judgment/MetadataSidebar';
import BookmarkModal from '@/components/judgment/BookmarkModal';
import CitationExportModal from '@/components/judgment/CitationExportModal';
import JudgmentNotFound from '@/components/judgment/JudgmentNotFound';
import { IJudgment } from '@/lib/models/Judgment';
import { Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JudgmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [judgment, setJudgment] = useState<IJudgment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkModalOpen, setBookmarkModalOpen] = useState(false);
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/judgments/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Judgment not found');
        return res.json();
      })
      .then((data) => {
        if (data.judgment) setJudgment(data.judgment);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Check if bookmarked
    fetch('/api/bookmarks')
      .then((res) => res.json())
      .then((data) => {
        if (data.bookmarks) {
          const found = data.bookmarks.some((b: any) => b.judgmentId === id);
          setIsBookmarked(found);
        }
      })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">
        Retrieving judgment record & legal headnote...
      </div>
    );
  }

  if (error || !judgment) {
    return <JudgmentNotFound judgmentId={id} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Bar */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
        <Link href="/" className="hover:text-[#007398]">Home</Link>
        <span>/</span>
        <Link href="/search" className="hover:text-[#007398]">Judgments</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium truncate max-w-sm">{judgment.caseTitle}</span>
      </nav>

      {/* 3-Column ScienceDirect Academic Reading View */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Sticky Outline */}
        <JudgmentOutline
          hasFullText={Boolean(judgment.fullText)}
          pdfUrl={judgment.pdfUrl}
          pdfFileName={judgment.pdfFileName}
        />

        {/* Center Column: Scholarly Legal Headnote Reading Pane */}
        <HeadnoteView
          judgment={judgment}
          onOpenBookmark={() => setBookmarkModalOpen(true)}
          onOpenCitation={() => setCitationModalOpen(true)}
          isBookmarked={isBookmarked}
        />

        {/* Right Column: Metadata & Tools Sidebar */}
        <MetadataSidebar
          judgment={judgment}
          onOpenBookmark={() => setBookmarkModalOpen(true)}
          onOpenCitation={() => setCitationModalOpen(true)}
          isBookmarked={isBookmarked}
        />
      </div>

      {/* Modals */}
      <BookmarkModal
        judgmentId={judgment.id}
        caseTitle={judgment.caseTitle}
        isOpen={bookmarkModalOpen}
        onClose={() => setBookmarkModalOpen(false)}
        onSaved={() => setIsBookmarked(true)}
      />

      <CitationExportModal
        judgment={judgment}
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
      />
    </div>
  );
}
