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
  X,
  Filter,
  Eye,
  Edit2,
  Upload,
  UserX,
  CreditCard
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';
import ExcelImportModal from './common/ExcelImportModal';
import ExcelExportModal from './common/ExcelExportModal';
import BulkActionBar from './common/BulkActionBar';
import RecordDetailModal from './common/RecordDetailModal';

export default function RegistrationsAdminModule() {
  const { registrations, setRegistrations, events, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Checked In' | 'Pending' | 'No Show' | 'Paid'

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [singleDeleteRecord, setSingleDeleteRecord] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Check-in toggle
  const handleToggleCheckin = async (id) => {
    try {
      const res = await fetch(`/api/registrations/${id}/checkin`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json();
        setRegistrations((prev) =>
          prev.map((reg) => (reg.id === id ? { ...reg, checkedIn: updated.checkedIn, noShow: false } : reg))
        );
        showToast(
          updated.checkedIn ? 'Attendee checked in (Triggered post-event journey)' : 'Check-in removed',
          updated.checkedIn ? 'success' : 'info'
        );
      }
    } catch (err) {
      showToast('Failed to update check-in', 'error');
    }
  };

  // No-Show toggle
  const handleToggleNoShow = async (id) => {
    try {
      const res = await fetch(`/api/registrations/${id}/no-show`, { method: 'PUT' });
      if (res.ok) {
        const updated = await res.json();
        setRegistrations((prev) =>
          prev.map((reg) => (reg.id === id ? { ...reg, noShow: updated.noShow, checkedIn: false } : reg))
        );
        showToast(
          updated.noShow ? 'Marked as No-Show (Triggered re-engagement journey)' : 'No-Show removed',
          updated.noShow ? 'info' : 'info'
        );
      }
    } catch (err) {
      showToast('Failed to update no-show status', 'error');
    }
  };

  // Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteRecord) return;
    try {
      const res = await fetch(`/api/registrations/${singleDeleteRecord.id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== singleDeleteRecord.id));
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteRecord.id));
        showToast('Registration archived successfully', 'info');
        setSingleDeleteRecord(null);
      }
    } catch (err) {
      showToast('Error deleting registration', 'error');
    }
  };

  // Bulk Delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch('/api/bulk/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'registrations',
          ids: selectedIds
        })
      });

      if (res.ok) {
        const result = await res.json();
        setRegistrations((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
        showToast(`Archived ${result.deletedCount || selectedIds.length} attendee registrations`, 'info');
        setSelectedIds([]);
        setIsBulkDeleteModalOpen(false);
      }
    } catch (err) {
      showToast('Bulk delete failed', 'error');
    }
  };

  // Save edited record
  const handleSaveEditedRecord = async (updatedData) => {
    try {
      const res = await fetch(`/api/registrations/${updatedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const saved = await res.json();
        setRegistrations((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
        showToast('Registration updated successfully', 'success');
        setEditRecord(null);
      } else {
        // Fallback update in state if PUT /api/registrations/:id doesn't exist
        setRegistrations((prev) => prev.map((r) => (r.id === updatedData.id ? updatedData : r)));
        showToast('Registration updated locally', 'success');
        setEditRecord(null);
      }
    } catch (err) {
      showToast('Error saving changes', 'error');
    }
  };

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrentPage = () => {
    const pageIds = filteredRegistrations.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.startupOrCompany?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEvent = selectedEventId === 'All' || reg.eventId === selectedEventId;

    let matchesStatus = true;
    if (statusFilter === 'Checked In') matchesStatus = Boolean(reg.checkedIn);
    else if (statusFilter === 'Pending') matchesStatus = !reg.checkedIn && !reg.noShow;
    else if (statusFilter === 'No Show') matchesStatus = Boolean(reg.noShow);
    else if (statusFilter === 'Paid') matchesStatus = reg.paymentStatus === 'PAID';

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const noShowCount = registrations.filter((r) => r.noShow).length;
  const paidCount = registrations.filter((r) => r.paymentStatus === 'PAID').length;

  const exportColumns = [
    { key: 'id', label: 'Registration ID' },
    { key: 'name', label: 'Attendee Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'startupOrCompany', label: 'Startup / Company' },
    { key: 'role', label: 'Role' },
    { key: 'city', label: 'City' },
    { key: 'eventId', label: 'Event ID' },
    { key: 'eventTitle', label: 'Event Name' },
    { key: 'ticketType', label: 'Pass Tier' },
    { key: 'paymentStatus', label: 'Payment Status' },
    { key: 'checkedIn', label: 'Checked In' },
    { key: 'noShow', label: 'No Show' },
    { key: 'registeredAt', label: 'Registration Timestamp' }
  ];

  const detailFields = [
    { key: 'name', label: 'Attendee Full Name', type: 'text', required: true },
    { key: 'email', label: 'Email Address', type: 'text', required: true },
    { key: 'phone', label: 'Phone Number', type: 'text' },
    { key: 'startupOrCompany', label: 'Startup / Company', type: 'text' },
    { key: 'role', label: 'Role / Designation', type: 'text' },
    { key: 'city', label: 'City', type: 'text' },
    { key: 'eventTitle', label: 'Registered Event', type: 'text' },
    { key: 'ticketType', label: 'Pass Type / Tier', type: 'text' },
    {
      key: 'paymentStatus',
      label: 'Payment Gateway Status',
      type: 'select',
      options: [
        { value: 'PAID', label: 'Paid (Cashfree Verified)' },
        { value: 'FREE', label: 'Complimentary / Free Pass' },
        { value: 'PENDING', label: 'Pending Payment' }
      ]
    },
    { key: 'linkedIn', label: 'LinkedIn Profile URL', type: 'text' },
    { key: 'notes', label: 'Internal Notes', type: 'textarea' }
  ];

  const isAllCurrentPageSelected =
    filteredRegistrations.length > 0 &&
    filteredRegistrations.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">Attendee Registrations & Check-In</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A46D]/15 text-[#D8C39A] border border-[#C5A46D]/30">
              Live Roster
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Total {registrations.length} registrations • {checkedInCount} checked in • {noShowCount} no-shows • {paidCount} paid passes
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] text-stone-300 border border-[#2e2e2e] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Import Excel</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-[#E8E5DF] border border-[#383838] text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Export Roster</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search attendee, email, company..."
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
            <option value="All">All Cohorts & Summits</option>
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
            <option value="All">All Statuses ({registrations.length})</option>
            <option value="Checked In">Checked In ({checkedInCount})</option>
            <option value="Pending">Pending Check-In</option>
            <option value="No Show">No-Shows ({noShowCount})</option>
            <option value="Paid">Cashfree Paid ({paidCount})</option>
          </select>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentPageSelected}
                    onChange={handleSelectAllCurrentPage}
                    className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Attendee Profile</th>
                <th className="py-3 px-4">Startup / Role</th>
                <th className="py-3 px-4">Registered Event</th>
                <th className="py-3 px-4">Pass Tier</th>
                <th className="py-3 px-4 text-center">Attendance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-500">
                    No attendee records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => {
                  const isSelected = selectedIds.includes(reg.id);

                  return (
                    <tr
                      key={reg.id}
                      className={`hover:bg-[#1a1a1a]/80 transition-colors ${
                        isSelected ? 'bg-[#C5A46D]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(reg.id)}
                          className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                      </td>
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
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                            reg.paymentStatus === 'PAID'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                              : 'bg-[#222222] text-[#D8C39A] border border-[#333333]'
                          }`}
                        >
                          {reg.ticketType || (reg.paymentStatus === 'PAID' ? 'Paid Pass' : 'Delegate Pass')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleCheckin(reg.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 ${
                              reg.checkedIn
                                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60'
                                : 'bg-[#1e1e1e] text-stone-400 border border-[#2e2e2e] hover:text-white'
                            }`}
                          >
                            <Check className="w-3 h-3" />
                            <span>{reg.checkedIn ? 'Checked In' : 'Check In'}</span>
                          </button>

                          <button
                            onClick={() => handleToggleNoShow(reg.id)}
                            className={`p-1 rounded text-[10px] transition-all cursor-pointer ${
                              reg.noShow
                                ? 'bg-red-950/70 text-red-300 border border-red-800/50'
                                : 'text-stone-500 hover:text-red-400 hover:bg-red-950/30'
                            }`}
                            title={reg.noShow ? 'Marked as No-Show' : 'Mark as No-Show'}
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewRecord(reg)}
                            title="Inspect Attendee"
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditRecord(reg)}
                            title="Edit Registration"
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-[#C5A46D] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSingleDeleteRecord(reg)}
                            title="Archive Registration"
                            className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onDeleteSelected={() => setIsBulkDeleteModalOpen(true)}
        onExportSelected={() => setIsExportModalOpen(true)}
      />

      {/* View Modal */}
      {viewRecord && (
        <RecordDetailModal
          isOpen={true}
          onClose={() => setViewRecord(null)}
          record={viewRecord}
          fields={detailFields}
          title={`Attendee Details: ${viewRecord.name}`}
          description={`Registered pass for ${viewRecord.eventTitle || '7H Cohort'}`}
          readOnly={true}
        />
      )}

      {/* Edit Modal */}
      {editRecord && (
        <RecordDetailModal
          isOpen={true}
          onClose={() => setEditRecord(null)}
          onSave={handleSaveEditedRecord}
          record={editRecord}
          fields={detailFields}
          title="Edit Attendee Registration"
          description="Update delegate credentials and registration record."
          readOnly={false}
        />
      )}

      {/* Single Delete Confirm */}
      <ConfirmModal
        isOpen={Boolean(singleDeleteRecord)}
        onClose={() => setSingleDeleteRecord(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Archive Attendee Registration"
        message={`Are you sure you want to archive the registration for ${singleDeleteRecord?.name}? This record will be soft-deleted in the database.`}
        confirmLabel="Archive Registration"
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Archive Selected Registrations"
        message={`Are you sure you want to archive ${selectedIds.length} selected attendee registrations? They will be soft-deleted in the database.`}
        confirmLabel={`Archive ${selectedIds.length} Registrations`}
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        collectionName="registrations"
        collectionDisplayName="Event Registrations"
        onImportComplete={(result) => {
          if (result?.imported) {
            setRegistrations((prev) => [...result.imported, ...prev]);
          }
        }}
      />

      {/* Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        collectionName="event_registrations"
        data={registrations}
        selectedIds={selectedIds}
        availableColumns={exportColumns}
      />
    </div>
  );
}
