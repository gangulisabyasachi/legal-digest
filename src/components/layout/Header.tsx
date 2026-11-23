'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bookmark, Folder, Shield, LogOut, User, Scale, BookOpen, ChevronDown } from 'lucide-react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  designation?: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
      .catch(() => setUser(null));
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const isAdminOrEditor = user && (user.role === 'admin' || user.role === 'superadmin' || user.role === 'editor');

  return (
    <header className="sticky top-0 z-50 bg-[#00263E] text-white border-b border-[#001B2E] shadow-sm">
      {/* Top utility bar (ScienceDirect signature style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded bg-[#007398] flex items-center justify-center text-white shadow-inner group-hover:bg-[#008dbb] transition-colors">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-serif">
                  JURIDICA <span className="text-xs px-1.5 py-0.5 bg-[#007398] text-white font-sans rounded font-semibold uppercase tracking-wider">Digest</span>
                </span>
                <span className="text-[10px] text-gray-300 tracking-wider uppercase font-medium">
                  Scholarly Legal Reporter & Case Citator
                </span>
              </div>
            </Link>

            {/* Quick Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-white/20 text-sm">
              <Link
                href="/search"
                className={`px-3 py-1.5 rounded text-gray-200 hover:text-white hover:bg-white/10 transition-colors ${
                  pathname === '/search' ? 'bg-white/10 text-white font-medium' : ''
                }`}
              >
                Browse Judgments
              </Link>
              <Link
                href="/search?court=Supreme Court"
                className="px-3 py-1.5 rounded text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                Supreme Court
              </Link>
              <Link
                href="/search?court=High Court"
                className="px-3 py-1.5 rounded text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                High Courts
              </Link>
              <Link
                href="/workspace"
                className={`px-3 py-1.5 rounded flex items-center gap-1 text-gray-200 hover:text-white hover:bg-white/10 transition-colors ${
                  pathname === '/workspace' ? 'bg-white/10 text-white font-medium' : ''
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-[#00A3D9]" />
                My Workspace
              </Link>
            </nav>
          </div>

          {/* Quick Search in Navbar (if not on home) */}
          {pathname !== '/' && (
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search citation, judge, statute, ratio..."
                  className="w-full bg-[#001B2E] text-white text-xs rounded pl-8 pr-3 py-1.5 border border-white/20 focus:outline-none focus:border-[#007398] placeholder-gray-400"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>
            </form>
          )}

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {isAdminOrEditor && (
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#E25822] text-white rounded hover:bg-[#c94918] transition-colors shadow-sm"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Studio
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-white rounded bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-[#007398] flex items-center justify-center font-bold text-[10px]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate font-medium">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-gray-300" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded shadow-xl border border-gray-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
                      <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-gray-500 text-[11px] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#007398]/10 text-[#007398] rounded">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/workspace"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#007398]" />
                      Saved Judgments & Folders
                    </Link>

                    {isAdminOrEditor && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#E25822]" />
                        Admin Dashboard & Upload
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-white hover:text-white/80 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?register=true"
                  className="px-3 py-1.5 bg-[#007398] hover:bg-[#008dbb] text-white font-medium rounded transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
