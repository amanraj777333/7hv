import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  MapPin,
  Video,
  Users,
  Check,
  X,
  ExternalLink,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

export default function AcademyAdminModule() {
  const {
    academySessions,
    setAcademySessions,
    academyRegistrations,
    setAcademyRegistrations,
    showToast,
    currentUser,
    authToken,
    refreshAllData
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('sessions'); // 'sessions' | 'registrations'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingSession, setEditingSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSessionForRegs, setSelectedSessionForRegs] = useState('All');

  const defaultSessionForm = {
    title: '',
    slug: '',
    category: 'Masterclass',
    targetAudience: 'Founders & Co-Founders',
    format: 'Online',
    locationOrLink: 'Live Virtual Classroom (Link issued upon confirmed registration)',
    dateTime: '2026-05-10T16:00:00.000Z',
    displayDate: 'Sunday, May 10, 2026 • 4:00 PM - 6:00 PM IST',
    duration: '2 Hours',
    status: 'upcoming',
    shortDescription: '',
    fullDescription: '',
    capacity: 50,
    registeredCount: 0,
    speaker: {
      name: '7 Horse Academy Faculty',
      role: 'Venture Mentor',
      organization: '7 Horse Ventures Academy',
      bio: 'Senior operational mentor providing hands-on venture playbooks.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    },
    keyTakeaways: [
      'Core architectural framework for venture scale',
      'Tactical teardown of common founder pitfalls'
    ],
    coverImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'
  };

  const [formData, setFormData] = useState(defaultSessionForm);

  const handleOpenAdd = () => {
    setEditingSession(null);
    setFormData(defaultSessionForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (session) => {
    setEditingSession(session);
    setFormData({
      ...defaultSessionForm,
      ...session,
      speaker: { ...defaultSessionForm.speaker, ...(session.speaker || {}) },
      keyTakeaways: session.keyTakeaways || defaultSessionForm.keyTakeaways
    });
    setIsModalOpen(true);
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      capacity: Number(formData.capacity) || 50
    };

    const headers = { 'Content-Type': 'application/json' };
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    try {
      if (editingSession) {
        const res = await fetch(`/api/academy-sessions/${editingSession.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setAcademySessions((prev) => prev.map((s) => (s.id === editingSession.id ? updated : s)));
          showToast('Academy session updated successfully', 'success');
          setIsModalOpen(false);
        } else {
          showToast('Failed to update session', 'error');
        }
      } else {
        const res = await fetch('/api/academy-sessions', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setAcademySessions((prev) => [created, ...prev]);
          showToast('Academy session published successfully', 'success');
          setIsModalOpen(false);
        } else {
          showToast('Failed to create session', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Connection error while saving session', 'error');
    }
  };

  const handleDeleteSession = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete session: "${title}"?`)) return;

    const headers = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    try {
      const res = await fetch(`/api/academy-sessions/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setAcademySessions((prev) => prev.filter((s) => s.id !== id));
        showToast('Session deleted', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete session', 'error');
    }
  };

  const handleDeleteRegistration = async (id, name) => {
    if (!window.confirm(`Cancel registration for ${name}?`)) return;

    const headers = {};
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    try {
      const res = await fetch(`/api/academy-registrations/${id}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        setAcademyRegistrations((prev) => prev.filter((r) => r.id !== id));
        showToast('Registration removed', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportRegistrationsCsv = () => {
    const list = academyRegistrations || [];
    if (list.length === 0) {
      showToast('No registrations to export', 'info');
      return;
    }
    const headers = ['ID', 'Session ID', 'Session Title', 'Full Name', 'Email', 'Phone', 'Organization', 'Role', 'Registered At'];
    const rows = list.map((r) => [
      r.id,
      r.sessionId,
      `"${r.sessionTitle || ''}"`,
      `"${r.fullName || ''}"`,
      r.email,
      r.phone,
      `"${r.organization || ''}"`,
      `"${r.role || ''}"`,
      r.registeredAt
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `academy-registrations-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported attendee CSV', 'success');
  };

  const filteredSessions = (academySessions || []).filter((s) => {
    const matchesSearch = s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.speaker?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || s.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const filteredRegistrations = (academyRegistrations || []).filter((r) => {
    const matchesSearch = r.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sessionTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSession = selectedSessionForRegs === 'All' || r.sessionId === selectedSessionForRegs;
    return matchesSearch && matchesSession;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#242424]">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#C5A46D]" />
            <span>Academy & Masterclasses</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage educational sessions, workshops, speaker profiles, and attendee registrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeSubTab === 'sessions' ? (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Session</span>
            </button>
          ) : (
            <button
              onClick={exportRegistrationsCsv}
              className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-stone-700 text-stone-200 text-xs font-medium rounded flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-[#C5A46D]" />
              <span>Export Attendee CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs: Sessions vs Registrations */}
      <div className="flex items-center gap-2 border-b border-[#242424]">
        <button
          onClick={() => setActiveSubTab('sessions')}
          className={`pb-3 px-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'sessions'
              ? 'border-[#C5A46D] text-[#C5A46D]'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          Curated Sessions ({(academySessions || []).length})
        </button>
        <button
          onClick={() => setActiveSubTab('registrations')}
          className={`pb-3 px-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
            activeSubTab === 'registrations'
              ? 'border-[#C5A46D] text-[#C5A46D]'
              : 'border-transparent text-stone-400 hover:text-white'
          }`}
        >
          Attendee Registrations ({(academyRegistrations || []).length})
        </button>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeSubTab === 'sessions' ? 'Search sessions or speakers...' : 'Search attendees, emails...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#181818] border border-[#2e2e2e] rounded text-xs text-white placeholder-stone-500 focus:border-[#C5A46D] outline-none"
          />
        </div>

        {activeSubTab === 'sessions' ? (
          <div className="flex items-center gap-2 self-start sm:self-center">
            {['All', 'Masterclass', 'Workshop', 'Expert Session', 'Online Learning'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#C5A46D] text-black font-semibold'
                    : 'bg-[#181818] text-stone-400 hover:text-white border border-[#2a2a2a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <select
            value={selectedSessionForRegs}
            onChange={(e) => setSelectedSessionForRegs(e.target.value)}
            className="px-3 py-1.5 bg-[#181818] border border-[#2e2e2e] rounded text-xs text-stone-200 focus:border-[#C5A46D] outline-none"
          >
            <option value="All">All Sessions</option>
            {(academySessions || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* VIEW 1: SESSIONS LIST */}
      {activeSubTab === 'sessions' && (
        <div className="bg-[#141414] border border-[#242424] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C1C] text-stone-400 font-mono border-b border-[#242424]">
                <tr>
                  <th className="p-3">Session Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Date / Schedule</th>
                  <th className="p-3">Speaker / Faculty</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {filteredSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#181818] transition-colors">
                    <td className="p-3 font-semibold text-white max-w-xs">
                      <span className="block truncate">{s.title}</span>
                      <span className="text-[10px] text-stone-500 font-mono block">ID: {s.id}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30">
                        {s.category}
                      </span>
                    </td>
                    <td className="p-3 text-stone-300">
                      {s.format}
                    </td>
                    <td className="p-3 text-stone-300 font-mono text-[11px]">
                      {s.displayDate || new Date(s.dateTime).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-stone-300">
                      <span className="block font-medium">{s.speaker?.name || '7H Faculty'}</span>
                      <span className="text-[10px] text-stone-500 block">{s.speaker?.role}</span>
                    </td>
                    <td className="p-3 font-mono text-stone-300">
                      {s.registeredCount || 0} / {s.capacity || 50}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                        s.status === 'upcoming'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20'
                          : 'bg-stone-800 text-stone-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded hover:bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
                        title="Edit session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(s.id, s.title)}
                        className="p-1.5 rounded hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 cursor-pointer"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: REGISTRATIONS LIST */}
      {activeSubTab === 'registrations' && (
        <div className="bg-[#141414] border border-[#242424] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C1C] text-stone-400 font-mono border-b border-[#242424]">
                <tr>
                  <th className="p-3">Attendee Name</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">Session</th>
                  <th className="p-3">Organization / Role</th>
                  <th className="p-3">Questions for Faculty</th>
                  <th className="p-3">Registered At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((r) => (
                    <tr key={r.id} className="hover:bg-[#181818] transition-colors">
                      <td className="p-3 font-semibold text-white">
                        {r.fullName}
                      </td>
                      <td className="p-3 text-stone-300 font-mono text-[11px]">
                        <span className="block">{r.email}</span>
                        <span className="text-stone-500 block">{r.phone}</span>
                      </td>
                      <td className="p-3 text-stone-300 max-w-xs">
                        <span className="block truncate font-medium">{r.sessionTitle}</span>
                        <span className="text-[10px] text-stone-500 font-mono">{r.sessionId}</span>
                      </td>
                      <td className="p-3 text-stone-300">
                        <span className="block">{r.organization || 'Independent'}</span>
                        <span className="text-[10px] text-[#C5A46D]">{r.role}</span>
                      </td>
                      <td className="p-3 text-stone-400 max-w-xs truncate" title={r.questionsForSpeaker}>
                        {r.questionsForSpeaker || '—'}
                      </td>
                      <td className="p-3 text-stone-400 font-mono text-[10px]">
                        {new Date(r.registeredAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRegistration(r.id, r.fullName)}
                          className="p-1.5 rounded hover:bg-rose-950/40 text-stone-400 hover:text-rose-400 cursor-pointer"
                          title="Remove registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-stone-500">
                      No matching registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT SESSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#141414] border border-[#282828] rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="text-lg font-bold text-white font-heading">
                {editingSession ? 'Edit Academy Session' : 'Create New Academy Session'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Session Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Category Track *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  >
                    <option>Masterclass</option>
                    <option>Workshop</option>
                    <option>Expert Session</option>
                    <option>Online Learning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Format *</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  >
                    <option>Online</option>
                    <option>In-Person</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Display Schedule Text</label>
                  <input
                    type="text"
                    value={formData.displayDate}
                    onChange={(e) => setFormData({ ...formData, displayDate: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Capacity (Max Seats)</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Speaker Name</label>
                  <input
                    type="text"
                    value={formData.speaker?.name || ''}
                    onChange={(e) => setFormData({ ...formData, speaker: { ...formData.speaker, name: e.target.value } })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Speaker Role & Org</label>
                  <input
                    type="text"
                    value={formData.speaker?.role || ''}
                    onChange={(e) => setFormData({ ...formData, speaker: { ...formData.speaker, role: e.target.value } })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed / Archive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Location / Join Link Information</label>
                  <input
                    type="text"
                    value={formData.locationOrLink}
                    onChange={(e) => setFormData({ ...formData, locationOrLink: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Short Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Full Curriculum & Overview</label>
                  <textarea
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-white focus:border-[#C5A46D] outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#242424] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-700 text-stone-300 rounded hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-black font-semibold rounded cursor-pointer"
                >
                  {editingSession ? 'Save Changes' : 'Publish Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
