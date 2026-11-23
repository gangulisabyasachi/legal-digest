'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, CheckCircle, AlertCircle, Trash2, X } from 'lucide-react';
import { IUser } from '@/lib/models/User';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor' | 'subscriber'>('subscriber');
  const [newOrg, setNewOrg] = useState('');
  const [newDesignation, setNewDesignation] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)));
        setMsg({ type: 'success', text: 'User role updated successfully' });
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error || 'Failed to update role' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error updating user' });
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: nextStatus }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: nextStatus as any } : u)));
        setMsg({ type: 'success', text: `User marked as ${nextStatus}` });
      } else {
        const data = await res.json();
        setMsg({ type: 'error', text: data.error || 'Failed to update status' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error updating user' });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
          organization: newOrg,
          designation: newDesignation,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUsers([...users, data.user]);
        setModalOpen(false);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        setMsg({ type: 'success', text: 'New user account provisioned successfully' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create user' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Error creating user' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg sciencedirect-border shadow-sm">
        <div>
          <span className="text-xs uppercase font-bold text-[#007398] tracking-wider">Access Governance</span>
          <h1 className="text-2xl font-bold font-legal-serif text-gray-900 mt-1">User Management & Permissions</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage roles (Superadmin, Legal Editor, Subscriber), review active chambers, and provision accounts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#007398] hover:bg-[#005f7d] text-white text-xs font-semibold rounded transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
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

      {/* Users Table */}
      <div className="bg-white rounded-lg sciencedirect-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading user catalog...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">User & Email</th>
                  <th className="px-5 py-3">Chamber / Organization</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900 text-[13px]">{u.name}</p>
                      <p className="text-gray-500 text-[11px]">{u.email}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      <p>{u.organization || 'Independent'}</p>
                      <p className="text-gray-400 text-[11px]">{u.designation || 'Advocate'}</p>
                    </td>
                    <td className="px-5 py-3">
                      <select
                        disabled={u.id === 'user_admin_01'}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded bg-white text-xs text-gray-800 font-medium focus:outline-none focus:border-[#007398]"
                      >
                        <option value="superadmin">Superadmin</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Legal Editor</option>
                        <option value="subscriber">Subscriber</option>
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.id !== 'user_admin_01' ? (
                        <button
                          onClick={() => handleStatusToggle(u.id, u.status)}
                          className={`px-2.5 py-1 text-[11px] rounded font-medium ${
                            u.status === 'active'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-[10px] italic">Root Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden text-xs">
            <div className="bg-[#00263E] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Provision New User Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Adv. Siddharth Mehta"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="siddharth@chamber.in"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded bg-white focus:outline-none focus:border-[#007398]"
                >
                  <option value="subscriber">Subscriber / Advocate (Research & Bookmarks)</option>
                  <option value="editor">Legal Editor (Upload & Review Judgments)</option>
                  <option value="admin">Administrator (Full Governance)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Chamber / Organization</label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  placeholder="e.g. Supreme Court Bar Association"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-[#007398]"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#007398] text-white rounded font-medium hover:bg-[#005f7d]"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
