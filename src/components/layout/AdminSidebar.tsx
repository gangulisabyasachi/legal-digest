'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Upload, FileText, Users, Settings, Scale, ArrowLeft } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/upload', label: 'Upload PDF & AI Ingest', icon: Upload, highlight: true },
    { href: '/admin/judgments', label: 'Manage Judgments', icon: FileText },
    { href: '/admin/users', label: 'User Governance', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#001B2E] text-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        <div className="px-3 py-2 border-b border-white/10">
          <span className="text-[10px] font-bold tracking-wider text-[#00A3D9] uppercase block">
            Editorial Studio
          </span>
          <h2 className="text-sm font-semibold text-white">Legal Digest Admin</h2>
        </div>

        <nav className="space-y-1 text-xs">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#007398] text-white font-semibold'
                    : link.highlight
                    ? 'text-amber-300 hover:bg-white/10 font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4 space-y-3 text-xs">
        <div className="px-3 py-2 bg-white/5 rounded border border-white/10">
          <p className="text-[10px] uppercase font-bold text-gray-400">AI Model Active</p>
          <p className="text-white font-mono text-[11px] mt-0.5">xAI Grok (grok-2-latest)</p>
          <span className="inline-block mt-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-semibold">
            Ready for Ingestion
          </span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Portal</span>
        </Link>
      </div>
    </aside>
  );
}
