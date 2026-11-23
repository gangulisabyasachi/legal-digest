import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8FAFC]">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </div>
    </div>
  );
}
