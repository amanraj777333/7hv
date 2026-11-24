import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  Mail,
  Building,
  MapPin,
  Calendar,
  Check,
  Filter
} from 'lucide-react';

export default function RegistrationsAdminModule() {
  const { registrations, setRegistrations, events, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleToggleCheckin = async (id) => {
    try {
      const res = await fetch(`/api/registrations/${id}/checkin`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json();
        setRegistrations((prev) =>
          prev.map((reg) => (reg.id === id ? { ...reg, checkedIn: updated.checkedIn } : reg))
        );
        showToast(
          updated.checkedIn ? 'Attendee checked in' : 'Check-in status removed',
          updated.checkedIn ? 'success' : 'info'
        );
      }
    } catch (err) {
      showToast('Failed to toggle check-in', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete registration record for ${name}?`)) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        showToast('Registration deleted', 'info');
      }
    } catch (err) {
      showToast('Error deleting registration', 'error');
    }
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      showToast('No registrations to export', 'info');
      return;
    }

    const headers = [
      'Registration ID',
      'Name',
      'Email',
      'Phone',
      'Startup / Company',
      'Role',
      'Stage',
      'City',
      'LinkedIn',
      'Event ID',
      'Event Title',
      'Checked In',
      'Registered At'
    ];

    const rows = filteredRegistrations.map((r) => [
      r.id,
      `"${r.name || ''}"`,
      r.email || '',
      r.phone || '',
      `"${r.startupOrCompany || ''}"`,
      r.role || '',
      r.stage || '',
      r.city || '',
      r.linkedIn || '',
      r.eventId || '',
      `"${r.eventTitle || ''}"`,
      r.checkedIn ? 'Yes' : 'No',
      r.timestamp || r.createdAt || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `7H_Registrations_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredRegistrations.length} registrations to CSV`, 'success');
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.startupOrCompany?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent = selectedEventId === 'All' || reg.eventId === selectedEventId;

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Checked In'
        ? reg.checkedIn === true
        : reg.checkedIn !== true;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const checkedInCount = registrations.filter((r) => r.checkedIn).length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Attendee Registrations & Check-In</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Total {registrations.length} registrations • {checkedInCount} checked in
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#222222] hover:bg-[#2c2c2c] text-[#E8E5DF] border border-[#383838] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-[#C5A46D]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search attendee, email, startup..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="bg-[#1b1b1b] border border-[#2e2e2e] rounded px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-[#C5A46D]"
          >
            <option value="All">All Events & Cohorts</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1b1b1b] border border-[#2e2e2e] rounded px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-[#C5A46D]"
          >
            <option value="All">All Check-In Statuses</option>
            <option value="Checked In">Checked In</option>
            <option value="Pending">Pending Check-In</option>
          </select>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Attendee Profile</th>
                <th className="py-3 px-4">Startup / Role</th>
                <th className="py-3 px-4">Registered Event</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No attendee records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-white text-sm">{reg.name}</div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>{reg.email}</span>
                          {reg.phone && <span>• {reg.phone}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-200">{reg.startupOrCompany || 'Independent'}</div>
                      <div className="text-[11px] text-[#C5A46D]">{reg.role || 'Founder'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-stone-200 line-clamp-1">{reg.eventTitle || 'Cohort Gathering'}</div>
                      <div className="text-[10px] text-stone-500 font-mono">{reg.eventId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-stone-300">{reg.city || 'Delhi NCR'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleCheckin(reg.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                          reg.checkedIn
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60'
                            : 'bg-amber-950/50 text-amber-300 border border-amber-800/40 hover:bg-amber-900/40'
                        }`}
                      >
                        {reg.checkedIn ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Checked In</span>
                          </>
                        ) : (
                          <span>Pending Check-in</span>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(reg.id, reg.name)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                        title="Delete registration"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
