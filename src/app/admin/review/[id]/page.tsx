'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IJudgment } from '@/lib/models/Judgment';
import { ArrowLeft, CheckCircle, Save, FileText, Download, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ReviewJudgmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [judgment, setJudgment] = useState<IJudgment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [caseTitle, setCaseTitle] = useState('');
  const [citation, setCitation] = useState('');
  const [court, setCourt] = useState('');
  const [dateOfJudgment, setDateOfJudgment] = useState('');
  const [bench, setBench] = useState('');
  const [catchwords, setCatchwords] = useState('');
  const [headnote, setHeadnote] = useState('');
  const [ratioDecidendi, setRatioDecidendi] = useState('');
  const [holding, setHolding] = useState('');
  const [status, setStatus] = useState<'draft' | 'under_review' | 'published'>('under_review');
  const [isLandmark, setIsLandmark] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch(`/api/judgments/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.judgment) {
          const j: IJudgment = data.judgment;
          setJudgment(j);
          setCaseTitle(j.caseTitle || '');
          setCitation(j.citation || '');
          setCourt(j.court || '');
          setDateOfJudgment(j.dateOfJudgment || '');
          setBench(j.bench ? j.bench.join(', ') : '');
          setCatchwords(j.catchwords ? j.catchwords.join(', ') : '');
          setHeadnote(j.headnote || '');
          setRatioDecidendi(j.ratioDecidendi || '');
          setHolding(j.holding || '');
          setStatus(j.status || 'under_review');
          setIsLandmark(Boolean(j.isLandmark));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (newStatus?: 'draft' | 'under_review' | 'published') => {
    setSaving(true);
    setMsg(null);

    const targetStatus = newStatus || status;

    try {
      const parsedBench = bench.split(',').map((b) => b.trim()).filter(Boolean);
      const parsedCatchwords = catchwords.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);

      const res = await fetch(`/api/judgments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle,
          citation,
          court,
          dateOfJudgment,
          bench: parsedBench,
          catchwords: parsedCatchwords,
          headnote,
          ratioDecidendi,
          holding,
          status: targetStatus,
          isLandmark,
          pdfUrl: judgment?.pdfUrl,
          pdfFileName: judgment?.pdfFileName,
          fullText: judgment?.fullText,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update judgment');

      setStatus(targetStatus);
      setMsg({
        type: 'success',
        text: targetStatus === 'published' ? 'Judgment successfully published to live digest!' : 'Changes saved successfully!',
      });

      if (targetStatus === 'published') {
        setTimeout(() => {
          router.push(`/judgments/${id}`);
        }, 1200);
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Error updating judgment' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading judgment for review...</div>;
  }

  if (!judgment) {
    return <div className="p-12 text-center text-xs text-red-500">Judgment not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg sciencedirect-border shadow-sm">
        <div>
          <Link href="/admin" className="text-xs text-[#007398] hover:underline flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold font-legal-serif text-gray-900">
            Editorial Review & Verification Studio
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review and refine the AI-generated headnote side-by-side with the original judgment transcript
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('under_review')}
            className="px-3.5 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 text-xs font-medium rounded transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors shadow-sm flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve & Publish to Digest</span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Split Screen Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Side: Original Transcript / Extracted Text Viewer */}
        <div className="bg-white rounded-lg sciencedirect-border shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#007398]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                Original Judgment Source Document
              </h3>
            </div>
            {judgment.pdfUrl && (
              <a
                href={judgment.pdfUrl}
                target="_blank"
                className="text-[11px] text-[#007398] hover:underline flex items-center gap-1 font-medium"
              >
                <Download className="w-3 h-3" />
                Download PDF
              </a>
            )}
          </div>

          <div className="bg-[#FAF9F6] p-4 rounded border border-gray-200 h-[650px] overflow-y-auto text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed select-text">
            {judgment.fullText || 'No plain text extracted for this record.'}
          </div>
        </div>

        {/* Right Side: Editable AI Headnote & Ratio Form */}
        <div className="bg-white rounded-lg sciencedirect-border shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-[#007398]">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                AI-Synthesized Headnote (Editable)
              </h3>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              Status: {status}
            </span>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Case Title</label>
            <input
              type="text"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded font-serif font-bold text-sm focus:outline-none focus:border-[#007398]"
            />
          </div>

          {/* Citation & Court Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Law Reporter Citation</label>
              <input
                type="text"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono text-xs focus:outline-none focus:border-[#007398]"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Court</label>
              <input
                type="text"
                value={court}
                onChange={(e) => setCourt(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#007398]"
              />
            </div>
          </div>

          {/* Date & Bench */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Date of Decision</label>
              <input
                type="date"
                value={dateOfJudgment}
                onChange={(e) => setDateOfJudgment(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#007398]"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Coram / Bench (comma separated)</label>
              <input
                type="text"
                value={bench}
                onChange={(e) => setBench(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#007398]"
              />
            </div>
          </div>

          {/* Catchwords */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Catchwords / Legal Subjects (comma separated)
            </label>
            <input
              type="text"
              value={catchwords}
              onChange={(e) => setCatchwords(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-300 rounded uppercase font-semibold text-xs focus:outline-none focus:border-[#007398]"
            />
          </div>

          {/* Headnote Textarea */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Headnote / Abstract Summary (Scholarly Synthesis)
            </label>
            <textarea
              rows={5}
              value={headnote}
              onChange={(e) => setHeadnote(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded font-legal-serif text-xs leading-relaxed focus:outline-none focus:border-[#007398]"
            />
          </div>

          {/* Ratio Decidendi */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Ratio Decidendi (Point of Law Laid Down)
            </label>
            <textarea
              rows={3}
              value={ratioDecidendi}
              onChange={(e) => setRatioDecidendi(e.target.value)}
              className="w-full p-3 border border-blue-300 bg-blue-50/40 rounded font-legal-serif italic text-xs leading-relaxed focus:outline-none focus:border-[#007398]"
            />
          </div>

          {/* Holding */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Operative Holding / Disposition</label>
            <textarea
              rows={2}
              value={holding}
              onChange={(e) => setHolding(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#007398]"
            />
          </div>

          {/* Landmark checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isLandmark"
              checked={isLandmark}
              onChange={(e) => setIsLandmark(e.target.checked)}
              className="w-4 h-4 text-[#007398] rounded border-gray-300 focus:ring-[#007398]"
            />
            <label htmlFor="isLandmark" className="font-semibold text-gray-800">
              Mark as Landmark Precedent (Highlighted on Homepage & Citator)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
