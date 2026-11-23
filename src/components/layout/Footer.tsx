import React from 'react';
import Link from 'next/link';
import { Scale, BookOpen, Shield, Download, FileText, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FAF9F6] border-t border-[#E2E8F0] text-gray-600 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#00263E] flex items-center justify-center text-white">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#00263E] font-serif tracking-tight">
                JURIDICA DIGEST
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              An authoritative legal digest designed for judiciary, advocates, scholars, and law schools. Powered by high-precision legal AI synthesizing headnotes, ratios, and statutory citations.
            </p>
            <p className="text-[11px] text-gray-400">
              Styled with academic clarity inspired by ScienceDirect & SCC Online standards.
            </p>
          </div>

          {/* Legal Research */}
          <div>
            <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
              Case Law Digest
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/search?court=Supreme Court" className="hover:text-[#007398] transition-colors">
                  Supreme Court of India
                </Link>
              </li>
              <li>
                <Link href="/search?court=High Court of Delhi" className="hover:text-[#007398] transition-colors">
                  Delhi High Court Reports
                </Link>
              </li>
              <li>
                <Link href="/search?court=High Court of Bombay" className="hover:text-[#007398] transition-colors">
                  Bombay High Court Rulings
                </Link>
              </li>
              <li>
                <Link href="/search?catchword=CONSTITUTIONAL LAW" className="hover:text-[#007398] transition-colors">
                  Constitutional Bench Landmarks
                </Link>
              </li>
              <li>
                <Link href="/search?statute=Arbitration" className="hover:text-[#007398] transition-colors">
                  Commercial & Arbitration Digest
                </Link>
              </li>
            </ul>
          </div>

          {/* Research Tools */}
          <div>
            <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
              Scholarly Tools
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/workspace" className="hover:text-[#007398] transition-colors">
                  My Research Folders & Briefs
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#007398] transition-colors">
                  Advanced Statutory Search
                </Link>
              </li>
              <li>
                <Link href="/workspace" className="hover:text-[#007398] transition-colors">
                  Case Annotation Pad
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#007398] transition-colors">
                  Institutional / Chamber Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & AI Ingestion */}
          <div>
            <h4 className="font-semibold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
              Editorial Studio
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/upload" className="hover:text-[#007398] transition-colors flex items-center gap-1">
                  Upload Judgment PDF <ExternalLink className="w-3 h-3 text-gray-400" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#007398] transition-colors">
                  AI Headnote Pipeline Status
                </Link>
              </li>
              <li>
                <Link href="/admin/users" className="hover:text-[#007398] transition-colors">
                  User & Role Governance
                </Link>
              </li>
              <li>
                <span className="inline-block mt-2 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-medium rounded border border-green-200">
                  xAI Grok Engine: Active
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-[11px]">
          <p>© {new Date().getFullYear()} Juridica Digest. All rights reserved. Designed for legal precision.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-gray-600 cursor-pointer">Citation Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-600 cursor-pointer">Privacy Safeguards</span>
            <span className="hover:text-gray-600 cursor-pointer">SCC / Bluebook Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
