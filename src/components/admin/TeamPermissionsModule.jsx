import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Mail,
  Lock,
  Clock,
  Layers,
  Check,
  X,
  Search,
  Filter
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';

const AVAILABLE_MODULES = [
  { id: 'events', label: 'Events Manager', category: 'Events' },
  { id: 'registrations', label: 'Attendee Roster', category: 'Events' },
  { id: 'academy_sessions', label: 'Academy Sessions', category: 'Academy' },
  { id: 'founders_dir', label: 'Founders Directory', category: 'Directory' },
  { id: 'startups_dir', label: 'Startups Directory', category: 'Directory' },
  { id: 'opportunities', label: 'Opportunity Board', category: 'Directory' },
  { id: 'resources', label: 'Resource Library', category: 'Directory' },
  { id: 'articles', label: 'Blog & Insights', category: 'Publishing' },
  { id: 'news', label: 'Startup News', category: 'Publishing' },
  { id: 'founder_stories', label: 'Founder Stories', category: 'Publishing' },
  { id: 'newsletter', label: 'Newsletter Campaigns', category: 'Publishing' },
  { id: 'subscribers', label: 'Subscribers List', category: 'Publishing' },
  { id: 'crm_email_studio', label: 'CRM Email Studio', category: 'Marketing' },
  { id: 'pitch_applications', label: 'Pitch Applications', category: 'Pipeline' },
  { id: 'partnerships_crm', label: 'Partnership CRM', category: 'Pipeline' },
  { id: 'enquiries', label: 'Contact Enquiries', category: 'Pipeline' },
  { id: 'visual_manager', label: 'Website Content & Images', category: 'Website' },
  { id: 'media_library', label: 'Media Library', category: 'Website' },
  { id: 'team_permissions', label: 'Team & Permissions', category: 'Governance' },
  { id: 'database_admin', label: 'Database & Backups', category: 'Governance' },
  { id: 'integrations', label: 'Integrations & API Keys', category: 'Governance' }
];

const PERMISSION_ACTIONS = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'import', label: 'Import' },
  { id: 'export', label: 'Export' },
  { id: 'approve', label: 'Approve' },
  { id: 'publish', label: 'Publish' },
  { id: 'settings', label: 'Settings' }
];

const ROLES_LIST = [
  'Super Admin',
  'Events Manager',
  'Community Manager',
  'Marketing Manager',
  'Partnerships Manager',
  'Content Editor',
  'Curator & Reviewer',
  'Ecosystem Analyst'
];

export default function TeamPermissionsModule() {
  const { teamUsers, setTeamUsers, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const [resetAccessUser, setResetAccessUser] = useState(null);
  const [newPasscode, setNewPasscode] = useState('');

  // Form state for invite/edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Events Manager',
    status: 'active',
    passcode: '7horse2026',
    assignedModules: ['events', 'registrations'],
    permissions: {}
  });

  const isSuperAdmin = currentUser?.role === 'Super Admin' || currentUser?.assignedModules?.includes('*');

  // Preset module assignments when changing role in form
  const handleRoleChange = (role) => {
    let presetModules = [];
    if (role === 'Super Admin') {
      presetModules = ['*'];
    } else if (role === 'Events Manager') {
      presetModules = ['events', 'registrations', 'academy_sessions'];
    } else if (role === 'Community Manager') {
      presetModules = ['founders_dir', 'startups_dir', 'opportunities', 'resources'];
    } else if (role === 'Marketing Manager') {
      presetModules = ['articles', 'news', 'founder_stories', 'newsletter', 'subscribers', 'crm_email_studio'];
    } else if (role === 'Partnerships Manager') {
      presetModules = ['partnerships_crm', 'enquiries', 'pitch_applications'];
    } else if (role === 'Content Editor') {
      presetModules = ['articles', 'news', 'founder_stories', 'visual_manager'];
    } else {
      presetModules = ['founders_dir', 'startups_dir', 'enquiries'];
    }

    const defaultPerms = {};
    presetModules.forEach((mod) => {
      defaultPerms[mod] = {
        view: true,
        create: true,
        edit: true,
        delete: role === 'Super Admin',
        import: true,
        export: true,
        approve: ['Super Admin', 'Events Manager', 'Community Manager'].includes(role),
        publish: ['Super Admin', 'Marketing Manager'].includes(role),
        settings: role === 'Super Admin'
      };
    });

    setFormData((prev) => ({
      ...prev,
      role,
      assignedModules: presetModules,
      permissions: defaultPerms
    }));
  };

  const openInviteModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Events Manager',
      status: 'active',
      passcode: '7horse' + Math.floor(1000 + Math.random() * 9000),
      assignedModules: ['events', 'registrations', 'academy_sessions'],
      permissions: {
        events: { view: true, create: true, edit: true, delete: false, import: true, export: true, approve: true, publish: false, settings: false },
        registrations: { view: true, create: true, edit: true, delete: false, import: true, export: true, approve: true, publish: false, settings: false },
        academy_sessions: { view: true, create: true, edit: true, delete: false, import: true, export: true, approve: true, publish: false, settings: false }
      }
    });
    setIsInviteModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || 'active',
      passcode: '',
      assignedModules: user.assignedModules || [],
      permissions: user.permissions || {}
    });
  };

  const toggleModuleAssignment = (moduleId) => {
    setFormData((prev) => {
      const isAssigned = prev.assignedModules.includes(moduleId);
      const updatedModules = isAssigned
        ? prev.assignedModules.filter((m) => m !== moduleId)
        : [...prev.assignedModules, moduleId];

      const updatedPerms = { ...prev.permissions };
      if (isAssigned) {
        delete updatedPerms[moduleId];
      } else {
        updatedPerms[moduleId] = {
          view: true,
          create: true,
          edit: true,
          delete: false,
          import: true,
          export: true,
          approve: false,
          publish: false,
          settings: false
        };
      }

      return {
        ...prev,
        assignedModules: updatedModules,
        permissions: updatedPerms
      };
    });
  };

  const togglePermission = (moduleId, actionId) => {
    setFormData((prev) => {
      const currentModPerms = prev.permissions[moduleId] || {
        view: true,
        create: false,
        edit: false,
        delete: false,
        import: false,
        export: false,
        approve: false,
        publish: false,
        settings: false
      };

      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [moduleId]: {
            ...currentModPerms,
            [actionId]: !currentModPerms[actionId]
          }
        }
      };
    });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            assignedModules: formData.assignedModules,
            permissions: formData.permissions
          })
        });

        if (res.ok) {
          const updated = await res.json();
          setTeamUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
          showToast(`Team member "${updated.name}" updated successfully`, 'success');
          setEditingUser(null);
        } else {
          const err = await res.json();
          showToast(err.error || 'Failed to update team member', 'error');
        }
      } else {
        // Invite new user
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            passcode: formData.passcode || '7horse2026',
            assignedModules: formData.assignedModules,
            permissions: formData.permissions,
            avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=200&q=80`
          })
        });

        if (res.ok) {
          const created = await res.json();
          setTeamUsers((prev) => [created, ...prev]);
          showToast(`Invitation created for ${created.name} (${created.role})`, 'success');
          setIsInviteModalOpen(false);
        } else {
          const err = await res.json();
          showToast(err.error || 'Failed to create team member', 'error');
        }
      }
    } catch (err) {
      showToast('Server communication error', 'error');
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/users/${user.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setTeamUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        showToast(`Account for ${user.name} is now ${nextStatus}`, 'info');
      }
    } catch (err) {
      showToast('Status update failed', 'error');
    }
  };

  const handleResetAccessSubmit = async (e) => {
    e.preventDefault();
    if (!newPasscode.trim()) {
      showToast('New passcode required', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/users/${resetAccessUser.id}/reset-access`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPasscode })
      });
      if (res.ok) {
        showToast(`Credentials successfully reset for ${resetAccessUser.name}`, 'success');
        setResetAccessUser(null);
        setNewPasscode('');
      } else {
        showToast('Failed to reset access credentials', 'error');
      }
    } catch (err) {
      showToast('Network error during reset', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    try {
      const res = await fetch(`/api/users/${deleteConfirmUser.id}`, { method: 'DELETE' });
      if (res.ok) {
        setTeamUsers((prev) => prev.filter((u) => u.id !== deleteConfirmUser.id));
        showToast(`Access revoked for ${deleteConfirmUser.name}`, 'info');
        setDeleteConfirmUser(null);
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to revoke access', 'error');
      }
    } catch (err) {
      showToast('Delete request failed', 'error');
    }
  };

  // Filtered users
  const filteredUsers = teamUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' ? true : user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">Team Management & Custom Module RBAC</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A46D]/15 text-[#D8C39A] border border-[#C5A46D]/30">
              Enterprise Access Control
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Super Administrator can invite team members, assign modular access, and enforce granular action permissions (View, Edit, Delete, Import, Export, Approve, Publish).
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={openInviteModal}
            className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-[#1b1b1b] border border-[#2e2e2e] rounded px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-[#C5A46D]"
          >
            <option value="All">All Governance Roles ({teamUsers.length})</option>
            {ROLES_LIST.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Team Member Profile</th>
                <th className="py-3 px-4">Role & Privilege</th>
                <th className="py-3 px-4">Assigned Modules</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isWildcard = user.role === 'Super Admin' || user.assignedModules?.includes('*');
                  const assignedCount = isWildcard ? 'All Modules (*)' : `${(user.assignedModules || []).length} Modules`;

                  return (
                    <tr key={user.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#333333] shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {user.id === currentUser?.id && (
                                <span className="text-[9px] px-1.5 py-0.2 bg-[#C5A46D]/20 text-[#D8C39A] rounded font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            user.role === 'Super Admin'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50'
                              : 'bg-[#222222] text-[#C5A46D] border border-[#333333]'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-stone-500" />
                          <span className="text-stone-300 font-mono text-[11px]">{assignedCount}</span>
                        </div>
                        {!isWildcard && user.assignedModules && user.assignedModules.length > 0 && (
                          <div className="text-[10px] text-stone-500 truncate max-w-xs mt-0.5">
                            {user.assignedModules.join(', ')}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-500" />
                          <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Active Today'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => isSuperAdmin && user.id !== 'usr-admin' && handleToggleStatus(user)}
                          disabled={!isSuperAdmin || user.id === 'usr-admin'}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            user.status === 'inactive'
                              ? 'bg-red-950/60 text-red-400 border border-red-800/40 hover:bg-red-900/60'
                              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60'
                          }`}
                        >
                          {user.status || 'Active'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isSuperAdmin && (
                            <>
                              <button
                                onClick={() => openEditModal(user)}
                                title="Edit Permissions"
                                className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setResetAccessUser(user);
                                  setNewPasscode('7horse' + Math.floor(1000 + Math.random() * 9000));
                                }}
                                title="Reset Passcode"
                                className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-[#C5A46D] cursor-pointer"
                              >
                                <Key className="w-3.5 h-3.5" />
                              </button>
                              {user.id !== 'usr-admin' && (
                                <button
                                  onClick={() => setDeleteConfirmUser(user)}
                                  title="Revoke Access"
                                  className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite or Edit Team Member Modal */}
      {(isInviteModalOpen || editingUser) && (
        <AdminModal
          isOpen={true}
          onClose={() => {
            setIsInviteModalOpen(false);
            setEditingUser(null);
          }}
          title={editingUser ? `Configure Access: ${editingUser.name}` : 'Invite New Team Member'}
          description="Assign modular governance roles and configure granular read/write/approve permissions."
          size="xl"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="px-5 py-2 rounded-lg bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold cursor-pointer"
              >
                {editingUser ? 'Save Permissions' : 'Send Invitation & Passcode'}
              </button>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vikram@7horseventures.com"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Governance Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#C5A46D] outline-none"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#C5A46D] outline-none"
                >
                  <option value="active">Active (Access Granted)</option>
                  <option value="inactive">Inactive (Suspended)</option>
                </select>
              </div>

              {!editingUser && (
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                    Initial Security Passcode
                  </label>
                  <input
                    type="text"
                    value={formData.passcode}
                    onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                    className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-xs font-mono text-[#D8C39A] focus:border-[#C5A46D] outline-none"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Provide this passcode securely to the team member for their first console sign-in.
                  </p>
                </div>
              )}
            </div>

            {/* Custom Module Assignment */}
            <div className="border-t border-[#262626] pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Custom Module Assignment & Permission Matrix
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Assign specific platform modules. Non-assigned modules are completely hidden and blocked by backend API.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = AVAILABLE_MODULES.map((m) => m.id);
                      const allPerms = {};
                      allIds.forEach((id) => {
                        allPerms[id] = {
                          view: true,
                          create: true,
                          edit: true,
                          delete: true,
                          import: true,
                          export: true,
                          approve: true,
                          publish: true,
                          settings: true
                        };
                      });
                      setFormData((prev) => ({
                        ...prev,
                        assignedModules: allIds,
                        permissions: allPerms
                      }));
                    }}
                    className="text-[10px] text-[#C5A46D] hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-stone-600">•</span>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, assignedModules: [], permissions: {} }))}
                    className="text-[10px] text-stone-400 hover:text-white cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {formData.role === 'Super Admin' || formData.assignedModules.includes('*') ? (
                <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#C5A46D] shrink-0" />
                  <div>
                    <span className="font-bold">Super Admin Wildcard Access Active:</span> This account has unrestricted access to all 24 platform modules, backend collections, and system settings.
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {AVAILABLE_MODULES.map((mod) => {
                    const isAssigned = formData.assignedModules.includes(mod.id);
                    const perms = formData.permissions[mod.id] || {};

                    return (
                      <div
                        key={mod.id}
                        className={`p-3 rounded-lg border transition-all ${
                          isAssigned
                            ? 'bg-[#181818] border-[#383838]'
                            : 'bg-[#121212] border-[#222222] opacity-75'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={() => toggleModuleAssignment(mod.id)}
                              className="accent-[#C5A46D] w-4 h-4 rounded cursor-pointer"
                            />
                            <span className="font-semibold text-xs text-white">{mod.label}</span>
                            <span className="text-[10px] text-stone-500 font-mono">({mod.category})</span>
                          </label>

                          <span className={`text-[10px] font-mono ${isAssigned ? 'text-emerald-400' : 'text-stone-500'}`}>
                            {isAssigned ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>

                        {/* Granular Permission Checkboxes */}
                        {isAssigned && (
                          <div className="mt-3 pt-2.5 border-t border-[#262626] grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-[10px]">
                            {PERMISSION_ACTIONS.map((action) => {
                              const isChecked = Boolean(perms[action.id]);
                              return (
                                <button
                                  key={action.id}
                                  type="button"
                                  onClick={() => togglePermission(mod.id, action.id)}
                                  className={`px-1.5 py-1 rounded text-center font-mono uppercase tracking-wider transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-[#C5A46D]/20 text-[#D8C39A] border border-[#C5A46D]/50 font-bold'
                                      : 'bg-[#111111] text-stone-500 border border-[#222222] hover:text-stone-300'
                                  }`}
                                >
                                  {action.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </AdminModal>
      )}

      {/* Reset Passcode Modal */}
      {resetAccessUser && (
        <AdminModal
          isOpen={true}
          onClose={() => setResetAccessUser(null)}
          title={`Reset Access Passcode: ${resetAccessUser.name}`}
          description="Generate a new security passcode for this team member."
          size="sm"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResetAccessUser(null)}
                className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetAccessSubmit}
                className="px-4 py-1.5 rounded-lg bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold cursor-pointer"
              >
                Save Passcode
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            <p className="text-xs text-stone-300">
              Enter the new passcode for <strong className="text-white">{resetAccessUser.name}</strong> ({resetAccessUser.email}):
            </p>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="e.g. 7horse9876"
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-[#D8C39A] focus:border-[#C5A46D] outline-none"
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete / Revoke Access Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmUser)}
        onClose={() => setDeleteConfirmUser(null)}
        onConfirm={handleDeleteUser}
        title="Revoke Administrative Access"
        message={`Are you sure you want to revoke console access for ${deleteConfirmUser?.name} (${deleteConfirmUser?.email})? This team member will be immediately logged out and unable to access any administrative endpoints.`}
        confirmLabel="Revoke Access"
        cancelLabel="Keep Active"
        destructive={true}
      />
    </div>
  );
}
