'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, Scale, Shield, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AdminUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setCheckingAuth(false));
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.PDF')) {
        setFile(droppedFile);
      } else {
        setErrorMsg('Please upload a PDF document.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');

    try {
      setCurrentStep('1/3: Reading entire judgment PDF and extracting transcript...');
      const formData = new FormData();
      formData.append('pdf', file);

      setCurrentStep('2/3: Identifying Bench, Court, Parties, Statutes & Synthesizing Ratio Decidendi...');
      const res = await fetch('/api/admin/ingest', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Ingestion failed');
      }

      setCurrentStep('3/3: Document extracted & saved to MongoDB Atlas! Redirecting to Editorial Review Studio...');
      setTimeout(() => {
        router.push(`/admin/review/${data.judgmentId}`);
      }, 700);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process judgment PDF');
      setUploading(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-xs uppercase font-bold text-[#007398] tracking-wider">
          AI Ingestion Pipeline
        </span>
        <h1 className="text-2xl font-bold font-legal-serif text-gray-900 mt-1">
          Upload & Auto-Summarize Judgment PDF
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Upload any official judgment PDF from Supreme Court or High Courts. The backend AI model reads the entire document, identifies the parties, court, judges, date, case number, statutes, and synthesizes a doctrinal headnote and ratio decidendi.
        </p>
      </div>

      {/* Auth Status Banner */}
      {!checkingAuth && (!user || (user.role !== 'admin' && user.role !== 'superadmin' && user.role !== 'editor')) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Admin privileges required to upload. Please sign in with an Admin/Editor account.</span>
          </div>
          <Link
            href="/login"
            className="px-3 py-1.5 bg-[#00263E] text-white rounded font-medium hover:bg-black transition-colors flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In as Admin
          </Link>
        </div>
      )}

      {/* Upload Zone */}
      <div className="bg-white p-8 rounded-lg sciencedirect-border shadow-sm space-y-6">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            dragActive
              ? 'border-[#007398] bg-[#007398]/5'
              : 'border-gray-300 hover:border-[#007398] bg-gray-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#00263E]/5 text-[#007398] flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {file ? file.name : 'Click to upload or drag & drop judgment PDF'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Reads the full document: Supreme Court, High Courts, Tribunals, and certified orders
              </p>
            </div>
            {file && (
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                Selected: {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
        </div>

        {/* Processing State */}
        {uploading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#007398] font-semibold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{currentStep}</span>
            </div>
            <p className="text-gray-600 pl-6 text-[11px]">
              Extracting legal issues, ratio decidendi, and statutory citations across the full PDF transcript.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
          <div className="text-gray-400 text-[11px]">
            Engine: <span className="text-[#007398] font-medium">Deep Legal NLP & xAI Grok Ingestion</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={uploading}
              onClick={() => setFile(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={!file || uploading}
              onClick={handleUploadAndProcess}
              className="px-6 py-2.5 bg-[#007398] hover:bg-[#005f7d] text-white font-medium rounded transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{uploading ? 'Analyzing Document...' : 'Generate AI Headnote'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-[#FAF9F6] rounded-lg border border-gray-200 text-xs space-y-2">
        <h4 className="font-semibold text-gray-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5 text-[#007398]" />
          Editorial Quality Assurance (SCC Online Standard)
        </h4>
        <p className="text-gray-600 leading-relaxed">
          The engine analyzes the full PDF text to accurately capture the <strong>Petitioner</strong>, <strong>Respondent</strong>, <strong>Bench</strong>, <strong>Court</strong>, <strong>Date</strong>, <strong>Statutory Provisions</strong>, and <strong>Ratio Decidendi</strong>. Once extracted, you can review, edit, and publish the headnote directly in the Editorial Review Studio.
        </p>
      </div>
    </div>
  );
}
