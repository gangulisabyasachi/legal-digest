'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Folder, Plus, Check, X, AlertCircle } from 'lucide-react';

interface BookmarkModalProps {
  judgmentId: string;
  caseTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

interface IFolder {
  id: string;
  name: string;
  count?: number;
  color?: string;
}

export default function BookmarkModal({ judgmentId, caseTitle, isOpen, onClose, onSaved }: BookmarkModalProps) {
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch user folders
      fetch('/api/folders')
        .then((res) => res.json())
        .then((data) => {
          if (data.folders) setFolders(data.folders);
        })
        .catch(() => {});

      // Fetch existing bookmark data if any
      fetch('/api/bookmarks')
        .then((res) => res.json())
        .then((data) => {
          if (data.bookmarks) {
            const existing = data.bookmarks.find((b: any) => b.judgmentId === judgmentId);
            if (existing) {
              setSelectedFolderId(existing.folderId || '');
              setNotes(existing.personalNotes || '');
              setTags(existing.tags ? existing.tags.join(', ') : '');
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen, judgmentId]);

  if (!isOpen) return null;

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
        setFolders([...folders, data.folder]);
        setSelectedFolderId(data.folder.id);
        setNewFolderName('');
        setShowCreateFolder(false);
      } else {
        setErrorMsg(data.error || 'Failed to create folder');
      }
    } catch {
      setErrorMsg('Error creating folder');
    }
  };

  const handleSaveBookmark = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const parsedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judgmentId,
          folderId: selectedFolderId || null,
          personalNotes: notes,
          tags: parsedTags,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Saved to your research brief!');
        setTimeout(() => {
          setSuccessMsg('');
          onSaved?.();
          onClose();
        }, 900);
      } else {
        setErrorMsg(data.error || 'Please log in to save judgments');
      }
    } catch {
      setErrorMsg('Failed to save bookmark');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#00263E] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-[#00A3D9]" />
            <h3 className="font-semibold text-sm">Save to Research Workspace</h3>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Judgment</span>
            <p className="font-serif font-semibold text-gray-900 text-sm mt-0.5 line-clamp-2">
              {caseTitle}
            </p>
          </div>

          {/* Select Folder */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-gray-700 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-[#007398]" />
                Select Research Folder / Brief
              </label>
              <button
                type="button"
                onClick={() => setShowCreateFolder(!showCreateFolder)}
                className="text-[#007398] hover:underline flex items-center gap-1 text-[11px] font-medium"
              >
                <Plus className="w-3 h-3" />
                New Folder
              </button>
            </div>

            {showCreateFolder && (
              <form onSubmit={handleCreateFolder} className="flex gap-2 mb-2 p-2 bg-gray-50 rounded border border-gray-200">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Criminal Bail Petitions 2024"
                  className="flex-1 px-2.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#007398] text-white rounded text-xs hover:bg-[#005f7d] transition-colors"
                >
                  Create
                </button>
              </form>
            )}

            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:border-[#007398]"
            >
              <option value="">📁 General Bookmarks (Uncategorized)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  📁 {f.name} {f.count ? `(${f.count} cases)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Personal Case Notes */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Personal Lawyer Notes & Key Paragraphs
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Para 14 strictly lays down proportionality test. Useful for challenging executive remand..."
              className="w-full p-2.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#007398]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. bail, art-21, proportionality, trial-court"
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-[#007398]"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-red-600 bg-red-50 p-2 rounded border border-red-200">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-1.5 text-green-700 bg-green-50 p-2 rounded border border-green-200">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSaveBookmark}
            className="px-4 py-1.5 bg-[#007398] hover:bg-[#005f7d] text-white font-medium rounded transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save to Folder'}
          </button>
        </div>
      </div>
    </div>
  );
}
