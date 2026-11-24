import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Plus,
  UserCheck,
  X,
  Upload,
  Filter
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';
import ExcelImportModal from './common/ExcelImportModal';
import ExcelExportModal from './common/ExcelExportModal';
import BulkActionBar from './common/BulkActionBar';

export default function SubscribersAdminModule() {
  const { subscribers, setSubscribers, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('Delhi NCR');
  const [singleDeleteRecord, setSingleDeleteRecord] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteRecord) return;
    try {
      const res = await fetch(`/api/subscribers/${singleDeleteRecord.id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== singleDeleteRecord.id));
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteRecord.id));
        showToast('Subscriber archived', 'info');
        setSingleDeleteRecord(null);
      }
    } catch (err) {
      showToast('Error removing subscriber', 'error');
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
          collection: 'subscribers',
          ids: selectedIds
        })
      });

      if (res.ok) {
        const result = await res.json();
        setSubscribers((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
        showToast(`Archived ${result.deletedCount || selectedIds.length} subscribers`, 'info');
        setSelectedIds([]);
        setIsBulkDeleteModalOpen(false);
      }
    } catch (err) {
      showToast('Bulk delete failed', 'error');
    }
  };

  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      showToast('Valid email required', 'error');
      return;
    }
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          city: newCity,
          status: 'active',
          subscribedAt: new Date().toISOString()
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.subscriber) {
          setSubscribers((prev) => [data.subscriber, ...prev]);
        }
        showToast('Subscriber added successfully', 'success');
        setNewEmail('');
        setIsAddModalOpen(false);
      }
    } catch (err) {
      showToast('Failed to add subscriber', 'error');
    }
  };

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrentPage = () => {
    const pageIds = filteredSubscribers.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportColumns = [
    { key: 'id', label: 'Subscriber ID' },
    { key: 'email', label: 'Email Address' },
    { key: 'city', label: 'City / Region' },
    { key: 'status', label: 'Subscription Status' },
    { key: 'subscribedAt', label: 'Subscribed Date' }
  ];

  const isAllCurrentPageSelected =
    filteredSubscribers.length > 0 &&
    filteredSubscribers.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">7H Founder Brief Audience</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A46D]/15 text-[#D8C39A] border border-[#C5A46D]/30">
              Publishing Opt-Ins
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Total {subscribers.length} subscribers • {subscribers.filter((s) => s.status === 'active').length} active opt-ins
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
            className="px-3 py-1.5 bg-[#1b1b1b] hover:bg-[#252525] text-stone-300 border border-[#2e2e2e] text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscriber</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStatusFilter('All');
              setSelectedIds([]);
            }}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'All' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            All ({subscribers.length})
          </button>
          <button
            onClick={() => {
              setStatusFilter('active');
              setSelectedIds([]);
            }}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'active' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            Active ({subscribers.filter((s) => s.status === 'active').length})
          </button>
          <button
            onClick={() => {
              setStatusFilter('unsubscribed');
              setSelectedIds([]);
            }}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'unsubscribed'
                ? 'bg-[#C5A46D] text-[#101010] font-semibold'
                : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            Unsubscribed ({subscribers.filter((s) => s.status === 'unsubscribed').length})
          </button>
        </div>
      </div>

      {/* Table */}
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
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Subscribed Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No subscribers found matching filters.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id);

                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-[#1a1a1a]/80 transition-colors ${
                        isSelected ? 'bg-[#C5A46D]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(sub.id)}
                          className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white">{sub.email}</td>
                      <td className="py-3.5 px-4 text-stone-400">{sub.city || 'Delhi NCR'}</td>
                      <td className="py-3.5 px-4 text-stone-400">
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            sub.status === 'active'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSingleDeleteRecord(sub)}
                          className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <AdminModal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Subscriber"
          description="Add an audience member to the 7H Founder Brief publication list."
          size="sm"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddManual}
                className="px-4 py-1.5 rounded-lg bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold cursor-pointer"
              >
                Confirm Subscriber
              </button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="founder@venture.in"
                className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>
            <div>
              <label className="text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                City / Hub
              </label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Delhi NCR"
                className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Single Delete Confirm */}
      <ConfirmModal
        isOpen={Boolean(singleDeleteRecord)}
        onClose={() => setSingleDeleteRecord(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Remove Subscriber"
        message={`Are you sure you want to remove ${singleDeleteRecord?.email} from the subscriber database?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Remove Selected Subscribers"
        message={`Are you sure you want to remove ${selectedIds.length} subscribers from the database?`}
        confirmLabel={`Remove ${selectedIds.length} Subscribers`}
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        collectionName="subscribers"
        collectionDisplayName="Subscribers"
        onImportComplete={(result) => {
          if (result?.imported) {
            setSubscribers((prev) => [...result.imported, ...prev]);
          }
        }}
      />

      {/* Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        collectionName="subscribers"
        data={subscribers}
        selectedIds={selectedIds}
        availableColumns={exportColumns}
      />
    </div>
  );
}
