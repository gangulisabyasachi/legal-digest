'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IJudgment } from '@/lib/models/Judgment';
import { Scale, Search, Trash2, Eye, Edit, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function AdminJudgmentsPage() {
  const [judgments, setJudgments] = useState<IJudgment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchJudgments = () => {
    setLoading(true);
    fetch('/api/judgments?status=all')
      .then((res) => res.json())
      .then((data) => {
        if (data.judgments) setJudgments(data.judgments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJudgments();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete: "${title}"?`)) return;

    try {
      const res = await fetch(`/api/judgments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJudgments(judgments.filter((j) => j.id !== id));
      } else {
        alert('Failed to delete judgment');
      }
    } catch {
      alert('Error deleting judgment');
    }
  };

  const filtered = judgments.filter((j) => {
    const matchesSearch =
      j.caseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.citation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg sciencedirect-border shadow-sm">
        <div>
          <span className="text-xs uppercase font-bold text-[#007398] tracking-wider">Catalog Governance</span>
          <h1 className="text-2xl font-bold font-legal-serif text-gray-900 mt-1">Manage Judgments</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            View, edit, toggle publishing status, and manage judicial records
          </p>
        </div>

        <Link
          href="/admin/upload"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007398] hover:bg-[#005f7d] text-white text-xs font-semibold rounded transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload New Judgment</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg sciencedirect-border shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by case title, party or citation..."
            className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#007398]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">Status:</span>
          {['all', 'published', 'under_review', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded capitalize transition-colors ${
                statusFilter === s ? 'bg-[#00263E] text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-lg sciencedirect-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading catalog...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">No judgments match your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">Case Title & Citation</th>
                  <th className="px-5 py-3">Court</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 max-w-md">
                      <p className="font-semibold text-gray-900 font-legal-serif text-[13px]">{j.caseTitle}</p>
                      <p className="font-mono text-gray-500 text-[11px]">{j.citation}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{j.court}</td>
                    <td className="px-5 py-3 text-gray-600">{j.dateOfJudgment}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          j.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : j.status === 'under_review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right space-x-2">
                      <Link
                        href={`/admin/review/${j.id}`}
                        className="px-2.5 py-1 bg-[#007398] text-white rounded hover:bg-[#005f7d] font-medium text-[11px] inline-flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit Headnote</span>
                      </Link>
                      <Link
                        href={`/judgments/${j.id}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(j.id, j.caseTitle)}
                        className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-[11px] inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
