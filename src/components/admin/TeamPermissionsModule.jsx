import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Shield,
  Key,
  Trash2,
  Edit2,
  CheckCircle2,
  X
} from 'lucide-react';

export default function TeamPermissionsModule() {
  const { teamUsers, setTeamUsers, showToast, currentUser } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Editor',
    passcode: '7horse2026',
    status: 'active'
  });

  const rolesList = [
    'Super Admin',
    'Admin',
    'Editor',
    'Event Manager',
    'Community Moderator',
    'Curator',
    'Reviewer',
    'Analyst'
  ];

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      showToast('Name and email required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
          adminUser: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        const created = await res.json();
        setTeamUsers((prev) => [created, ...prev]);
        showToast(`Team member added with role ${created.role}`, 'success');
        setIsAddModalOpen(false);
      }
    } catch (err) {
      showToast('Failed to add team member', 'error');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Revoke access for ${name}?`)) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTeamUsers((prev) => prev.filter((u) => u.id !== id));
        showToast('Access revoked', 'info');
      }
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Team & Role-Based Permissions (RBAC)</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage administrative credentials and role assignments across 8 governance tiers.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Team Member</th>
                <th className="py-3 px-4">Role Tier</th>
                <th className="py-3 px-4">Passcode Hash</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {teamUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#333333]"
                      />
                      <div>
                        <div className="font-semibold text-white text-sm">{user.name}</div>
                        <div className="text-[11px] text-stone-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#222222] text-[#C5A46D] border border-[#333333]">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                    ••••••••••••
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {user.id !== 'usr-admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                        title="Revoke access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <h3 className="text-base font-bold text-white font-serif">Invite Team Member</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div>
                <label className="text-stone-300 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="vikram@7horseventures.com"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div>
                <label className="text-stone-300 font-medium">Role Assignment</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                >
                  {rolesList.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-stone-300 font-medium">Initial Passcode</label>
                <input
                  type="text"
                  value={form.passcode}
                  onChange={(e) => setForm({ ...form, passcode: e.target.value })}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#222222] text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold cursor-pointer"
                >
                  Confirm Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
