'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IJudgment } from '@/lib/models/Judgment';
import { Upload, Scale, FileText, Users, CheckCircle, Clock, ArrowRight, Shield } from 'lucide-react';

export default function AdminDashboardPage() {
  const [judgments, setJudgments] = useState<IJudgment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/judgments?status=all')
      .then((res) => res.json())
      .then((data) => {
        if (data.judgments) setJudgments(data.judgments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalCount = judgments.length;
  const publishedCount = judgments.filter((j) => j.status === 'published').length;
  const reviewCount = judgments.filter((j) => j.status === 'under_review').length;
  const landmarkCount = judgments.filter((j) => j.isLandmark).length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-lg sciencedirect-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-[#007398] tracking-wider">
            Editorial Bureau & Curation
          </span>
          <h1 className="text-2xl font-bold font-legal-serif text-gray-900 mt-1">
            Legal Digest Administration
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Ingest judgment PDFs, review AI-synthesized headnotes, and manage judicial reporters.
          </p>
        </div>

        <Link
          href="/admin/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E25822] hover:bg-[#c94918] text-white text-xs font-semibold rounded transition-colors shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Judgment PDF</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg sciencedirect-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Total Catalog</span>
            <FileText className="w-4 h-4 text-[#007398]" />
          </div>
          <p className="text-2xl font-bold text-[#00263E] font-serif mt-2">{totalCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Ingested judgments</p>
        </div>

        <div className="bg-white p-5 rounded-lg sciencedirect-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Published Live</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-serif mt-2">{publishedCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Searchable by researchers</p>
        </div>

        <div className="bg-white p-5 rounded-lg sciencedirect-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 font-serif mt-2">{reviewCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Awaiting editorial sign-off</p>
        </div>

        <div className="bg-white p-5 rounded-lg sciencedirect-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
            <span>Landmark Precedents</span>
            <Scale className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700 font-serif mt-2">{landmarkCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Constitution bench authorities</p>
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="bg-white rounded-lg sciencedirect-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Judgments Ingestion & Review Queue</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Review AI-generated headnotes side-by-side with original text before live publication
            </p>
          </div>
          <Link href="/admin/judgments" className="text-xs text-[#007398] hover:underline font-medium">
            View All Catalog →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading catalog...</div>
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
                {judgments.slice(0, 8).map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900 font-legal-serif text-[13px]">{j.caseTitle}</p>
                      <span className="font-mono text-gray-500 text-[11px]">{j.citation}</span>
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
                        className="px-2.5 py-1 bg-[#007398] text-white rounded hover:bg-[#005f7d] font-medium text-[11px] inline-block"
                      >
                        Review / Edit
                      </Link>
                      <Link
                        href={`/judgments/${j.id}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium text-[11px] inline-block"
                      >
                        Public View
                      </Link>
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
