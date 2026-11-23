'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Folder, Plus, Trash2, FileText, Download, Scale, ArrowRight, Tag } from 'lucide-react';
import { IJudgment } from '@/lib/models/Judgment';

interface BookmarkWithDetails {
  id: string;
  judgmentId: string;
  folderId?: string;
  folderName: string;
  folderColor: string;
  personalNotes?: string;
  tags?: string[];
  createdAt: string;
  judgment?: IJudgment;
}

interface IFolder {
  id: string;
  name: string;
  count: number;
  color?: string;
  description?: string;
}

export default function WorkspacePage() {
  const [bookmarks, setBookmarks] = useState<BookmarkWithDetails[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const fetchWorkspace = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/bookmarks').then((r) => r.json()),
      fetch('/api/folders').then((r) => r.json()),
    ])
      .then(([bmData, fData]) => {
        if (bmData.bookmarks) setBookmarks(bmData.bookmarks);
        if (fData.folders) setFolders(fData.folders);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.folder) {
        setFolders([...folders, { ...data.folder, count: 0 }]);
        setNewFolderName('');
        setShowNewFolder(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async (judgmentId: string) => {
    if (!confirm('Remove this judgment from your saved research?')) return;
    try {
      const res = await fetch(`/api/bookmarks?judgmentId=${judgmentId}`, { method: 'DELETE' });
      if (res.ok) {
        setBookmarks(bookmarks.filter((b) => b.judgmentId !== judgmentId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookmarks =
    selectedFolderId === 'all'
      ? bookmarks
      : bookmarks.filter((b) => b.folderId === selectedFolderId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-lg sciencedirect-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#007398] tracking-wider">
            Personal Research Workspace
          </span>
          <h1 className="text-2xl font-bold font-legal-serif text-gray-900 mt-1">
            My Legal Briefs & Saved Authorities
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize case law by client matters, attach private lawyer notes, and export authorities for court hearings.
          </p>
        </div>

        <button
          onClick={() => setShowNewFolder(!showNewFolder)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007398] hover:bg-[#005f7d] text-white text-xs font-semibold rounded transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Research Brief / Folder</span>
        </button>
      </div>

      {showNewFolder && (
        <form onSubmit={handleCreateFolder} className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm flex gap-3 text-xs">
          <input
            type="text"
            required
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name (e.g. Criminal Appeal - Supreme Court / Section 9 Arbitration)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#007398] hover:bg-[#005f7d] text-white font-medium rounded transition-colors"
          >
            Create Folder
          </button>
          <button
            type="button"
            onClick={() => setShowNewFolder(false)}
            className="px-3 py-2 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Rail: Folders List */}
        <aside className="w-full lg:w-64 space-y-4 text-xs flex-shrink-0">
          <div className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm space-y-2">
            <h3 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] pb-2 border-b border-gray-200 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-[#007398]" />
              Research Briefs
            </h3>

            <nav className="space-y-1">
              <button
                onClick={() => setSelectedFolderId('all')}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                  selectedFolderId === 'all'
                    ? 'bg-[#007398] text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>📁 All Saved Judgments</span>
                <span className="text-[11px] px-1.5 py-0.2 bg-black/10 rounded">{bookmarks.length}</span>
              </button>

              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFolderId(f.id)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                    selectedFolderId === f.id
                      ? 'bg-[#007398] text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">📁 {f.name}</span>
                  <span className="text-[11px] px-1.5 py-0.2 bg-black/10 rounded">{f.count}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Right Stream: Saved Judgments with Notes & Tags */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-200">
            <span>
              Showing <strong>{filteredBookmarks.length}</strong> saved authorities in{' '}
              <strong>
                {selectedFolderId === 'all'
                  ? 'All Folders'
                  : folders.find((f) => f.id === selectedFolderId)?.name || 'Folder'}
              </strong>
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">Loading your saved research...</div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-lg sciencedirect-border space-y-3">
              <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-800 text-sm">No judgments saved in this brief yet</p>
              <p className="text-xs text-gray-500">
                Browse judgments and click "Save to Research Folder" on any headnote or detail page.
              </p>
              <Link
                href="/search"
                className="inline-block px-4 py-2 bg-[#007398] text-white text-xs font-semibold rounded hover:bg-[#005f7d]"
              >
                Browse Case Law Digest
              </Link>
            </div>
          ) : (
            filteredBookmarks.map((bm) => {
              const j = bm.judgment;
              if (!j) return null;
              return (
                <div
                  key={bm.id}
                  className="bg-white p-5 rounded-lg sciencedirect-border hover:border-[#007398] transition-colors shadow-sm space-y-3 text-xs"
                >
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
                    <span className="font-semibold text-[#00263E] flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-[#007398]" />
                      {j.court}
                    </span>
                    <span className="px-2 py-0.5 bg-[#007398]/10 text-[#007398] rounded font-medium">
                      📁 {bm.folderName}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/judgments/${j.id}`}>
                    <h3 className="text-base font-bold text-gray-900 hover:text-[#007398] font-legal-serif transition-colors">
                      {j.caseTitle}
                    </h3>
                  </Link>
                  <p className="font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded inline-block border border-gray-200">
                    {j.citation}
                  </p>

                  {/* Lawyer Personal Notes (The core SCC Online briefcase feature) */}
                  {bm.personalNotes && (
                    <div className="p-3 bg-amber-50/70 border-l-3 border-amber-500 rounded-r text-gray-800 text-xs leading-relaxed">
                      <span className="font-bold text-amber-900 uppercase tracking-wide block text-[10px] mb-0.5">
                        My Case Notes / Annotation:
                      </span>
                      {bm.personalNotes}
                    </div>
                  )}

                  {/* Tags */}
                  {bm.tags && bm.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center">
                      <Tag className="w-3 h-3 text-gray-400 mr-1" />
                      {bm.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Ratio Decidendi */}
                  <p className="text-gray-700 font-legal-serif italic line-clamp-2 bg-[#FAF9F6] p-2.5 rounded border border-gray-100">
                    "{j.ratioDecidendi}"
                  </p>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <Link
                      href={`/judgments/${j.id}`}
                      className="text-[#007398] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Open Headnote & Digest</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {j.pdfUrl && (
                        <a
                          href={j.pdfUrl}
                          download
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      )}
                      <button
                        onClick={() => handleRemoveBookmark(j.id)}
                        className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
