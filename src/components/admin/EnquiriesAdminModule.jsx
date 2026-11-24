import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  Search,
  Mail,
  CheckCircle2,
  Trash2,
  Eye,
  X,
  Phone,
  MessageSquare,
  Download,
  Upload,
  Check
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';
import ExcelImportModal from './common/ExcelImportModal';
import ExcelExportModal from './common/ExcelExportModal';
import BulkActionBar from './common/BulkActionBar';

export default function EnquiriesAdminModule() {
  const { enquiries, setEnquiries, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [singleDeleteRecord, setSingleDeleteRecord] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminUser: currentUser?.name || 'Admin' })
      });
      if (res.ok) {
        const updated = await res.json();
        setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
        if (selectedEnquiry && selectedEnquiry.id === id) setSelectedEnquiry(updated);
        showToast(`Enquiry marked as ${status}`, 'info');
      }
    } catch (err) {
      showToast('Error updating enquiry', 'error');
    }
  };

  // Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteRecord) return;
    try {
      const res = await fetch(`/api/enquiries/${singleDeleteRecord.id}`, { method: 'DELETE' });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== singleDeleteRecord.id));
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteRecord.id));
        if (selectedEnquiry?.id === singleDeleteRecord.id) setSelectedEnquiry(null);
        showToast('Enquiry archived', 'info');
        setSingleDeleteRecord(null);
      }
    } catch (err) {
      showToast('Delete failed', 'error');
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
          collection: 'enquiries',
          ids: selectedIds
        })
      });

      if (res.ok) {
        const result = await res.json();
        setEnquiries((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
        showToast(`Archived ${result.deletedCount || selectedIds.length} enquiries`, 'info');
        setSelectedIds([]);
        setIsBulkDeleteModalOpen(false);
      }
    } catch (err) {
      showToast('Bulk delete failed', 'error');
    }
  };

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrentPage = () => {
    const pageIds = filteredEnquiries.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportColumns = [
    { key: 'id', label: 'Enquiry ID' },
    { key: 'name', label: 'Sender Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'category', label: 'Category' },
    { key: 'subject', label: 'Subject' },
    { key: 'message', label: 'Message' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Received At' }
  ];

  const isAllCurrentPageSelected =
    filteredEnquiries.length > 0 &&
    filteredEnquiries.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">Contact & Partnership Enquiries</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A46D]/15 text-[#D8C39A] border border-[#C5A46D]/30">
              Inbound Inbox
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Incoming communication from founders, corporate partners, sponsors, and media.
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
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sender, email, inquiry content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'new', 'contacted', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setSelectedIds([]);
              }}
              className={`px-3 py-1 rounded text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                statusFilter === s ? 'bg-[#C5A46D] text-[#101010]' : 'bg-[#1e1e1e] text-stone-300'
              }`}
            >
              {s}
            </button>
          ))}
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
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Subject & Excerpt</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No enquiries found.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => {
                  const isSelected = selectedIds.includes(enq.id);

                  return (
                    <tr
                      key={enq.id}
                      className={`hover:bg-[#1a1a1a]/80 transition-colors ${
                        isSelected ? 'bg-[#C5A46D]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(enq.id)}
                          className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">{enq.name}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{enq.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-200">{enq.subject || 'General Enquiry'}</div>
                        <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{enq.message}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222222] text-[#C5A46D] border border-[#333333]">
                          {enq.category || 'General'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            enq.status === 'resolved'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : enq.status === 'contacted'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                              : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                          }`}
                        >
                          {enq.status || 'new'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEnquiry(enq)}
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                            title="Inspect enquiry"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSingleDeleteRecord(enq)}
                            className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                            title="Archive enquiry"
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

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <AdminModal
          isOpen={true}
          onClose={() => setSelectedEnquiry(null)}
          title={`Enquiry: ${selectedEnquiry.subject || 'Direct Communication'}`}
          description={`From: ${selectedEnquiry.name} (${selectedEnquiry.email})`}
          size="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setSingleDeleteRecord(selectedEnquiry)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-stone-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                {selectedEnquiry.status !== 'resolved' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'resolved')}
                    className="px-4 py-1.5 rounded-lg bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold cursor-pointer"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-[#181818] p-3 rounded-lg border border-[#262626]">
              <div>
                <div className="text-stone-500 text-[10px] uppercase font-bold">Category</div>
                <div className="text-white font-semibold mt-0.5">{selectedEnquiry.category || 'General'}</div>
              </div>
              <div>
                <div className="text-stone-500 text-[10px] uppercase font-bold">Status</div>
                <div className="text-[#C5A46D] font-semibold mt-0.5 uppercase tracking-wider">{selectedEnquiry.status || 'new'}</div>
              </div>
            </div>

            <div>
              <div className="text-stone-400 font-bold uppercase text-[10px]">Message Content</div>
              <p className="mt-1 text-stone-200 leading-relaxed bg-[#191919] p-3 rounded-lg border border-[#282828] whitespace-pre-wrap">
                {selectedEnquiry.message}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className="text-stone-400 text-xs">Update Status:</span>
              {['new', 'contacted', 'resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(selectedEnquiry.id, st)}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    selectedEnquiry.status === st
                      ? 'bg-[#C5A46D] text-[#101010]'
                      : 'bg-[#222222] text-stone-300 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </AdminModal>
      )}

      {/* Single Delete Confirm */}
      <ConfirmModal
        isOpen={Boolean(singleDeleteRecord)}
        onClose={() => setSingleDeleteRecord(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Archive Enquiry"
        message={`Are you sure you want to archive the enquiry from "${singleDeleteRecord?.name}"?`}
        confirmLabel="Archive"
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Archive Selected Enquiries"
        message={`Are you sure you want to archive ${selectedIds.length} selected enquiries?`}
        confirmLabel={`Archive ${selectedIds.length} Enquiries`}
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        collectionName="enquiries"
        collectionDisplayName="Contact Enquiries"
        onImportComplete={(result) => {
          if (result?.imported) {
            setEnquiries((prev) => [...result.imported, ...prev]);
          }
        }}
      />

      {/* Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        collectionName="enquiries"
        data={enquiries}
        selectedIds={selectedIds}
        availableColumns={exportColumns}
      />
    </div>
  );
}
