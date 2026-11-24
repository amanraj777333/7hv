import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  Calendar,
  Building,
  CheckCircle2,
  X,
  Upload,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';
import ExcelImportModal from './common/ExcelImportModal';
import ExcelExportModal from './common/ExcelExportModal';
import BulkActionBar from './common/BulkActionBar';
import RecordDetailModal from './common/RecordDetailModal';

export default function PartnershipsCrmModule() {
  const { partnerships, setPartnerships, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [singleDeleteRecord, setSingleDeleteRecord] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [form, setForm] = useState({
    organization: '',
    contactName: '',
    email: '',
    phone: '',
    tier: 'Ecosystem Partner',
    stage: 'New',
    dealValue: 'Non-Monetary',
    notes: 'Initial outreach via Delhi NCR ecosystem summit'
  });

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    if (!form.organization.trim()) {
      showToast('Organization name required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          updatedAt: new Date().toISOString(),
          adminUser: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        const created = await res.json();
        setPartnerships((prev) => [created, ...prev]);
        showToast('Partner lead added', 'success');
        setIsAddModalOpen(false);
        setForm({
          organization: '',
          contactName: '',
          email: '',
          phone: '',
          tier: 'Ecosystem Partner',
          stage: 'New',
          dealValue: 'Non-Monetary',
          notes: ''
        });
      }
    } catch (err) {
      showToast('Failed to add partnership', 'error');
    }
  };

  const handleUpdateStage = async (id, stage) => {
    try {
      const res = await fetch(`/api/partnerships/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage, adminUser: currentUser?.name || 'Admin' })
      });
      if (res.ok) {
        const updated = await res.json();
        setPartnerships((prev) => prev.map((p) => (p.id === id ? updated : p)));
        showToast(`Partnership advanced to ${stage}`, 'info');
      }
    } catch (err) {
      showToast('Error updating stage', 'error');
    }
  };

  // Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteRecord) return;
    try {
      const res = await fetch(`/api/partnerships/${singleDeleteRecord.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPartnerships((prev) => prev.filter((p) => p.id !== singleDeleteRecord.id));
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteRecord.id));
        showToast('Partnership record archived', 'info');
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
          collection: 'partnerships',
          ids: selectedIds
        })
      });

      if (res.ok) {
        const result = await res.json();
        setPartnerships((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
        showToast(`Archived ${result.deletedCount || selectedIds.length} partnership leads`, 'info');
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
      const res = await fetch(`/api/partnerships/${updatedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const saved = await res.json();
        setPartnerships((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
        showToast('Partnership lead updated', 'success');
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
    const pageIds = filteredPartners.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const filteredPartners = partnerships.filter((p) => {
    const matchesSearch =
      p.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'All' || p.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const stages = ['All', 'New', 'Discovery', 'Proposal', 'Negotiation', 'Partnered'];

  const exportColumns = [
    { key: 'id', label: 'Lead ID' },
    { key: 'organization', label: 'Organization' },
    { key: 'contactName', label: 'Contact Person' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'tier', label: 'Partnership Tier' },
    { key: 'stage', label: 'Pipeline Stage' },
    { key: 'dealValue', label: 'Deal Value' },
    { key: 'notes', label: 'Notes' },
    { key: 'createdAt', label: 'Created At' }
  ];

  const detailFields = [
    { key: 'organization', label: 'Organization / Brand', type: 'text', required: true },
    { key: 'contactName', label: 'Contact Person', type: 'text', required: true },
    { key: 'email', label: 'Email Address', type: 'text', required: true },
    { key: 'phone', label: 'Phone Number', type: 'text' },
    {
      key: 'tier',
      label: 'Partnership Tier',
      type: 'select',
      options: [
        { value: 'Ecosystem Partner', label: 'Ecosystem Partner' },
        { value: 'Title Sponsor', label: 'Title Sponsor' },
        { value: 'Venue Partner', label: 'Venue Partner' },
        { value: 'Capital Syndicate', label: 'Capital Syndicate' }
      ]
    },
    {
      key: 'stage',
      label: 'Pipeline Stage',
      type: 'select',
      options: [
        { value: 'New', label: 'New Lead' },
        { value: 'Discovery', label: 'Discovery Call' },
        { value: 'Proposal', label: 'Proposal Sent' },
        { value: 'Negotiation', label: 'Under Negotiation' },
        { value: 'Partnered', label: 'Partnered (Closed Won)' }
      ]
    },
    { key: 'dealValue', label: 'Deal Structure / Value', type: 'text' },
    { key: 'notes', label: 'Discussion & Alignment Notes', type: 'textarea' }
  ];

  const isAllCurrentPageSelected =
    filteredPartners.length > 0 &&
    filteredPartners.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">Partnerships & Corporate CRM</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A46D]/15 text-[#D8C39A] border border-[#C5A46D]/30">
              Pipeline Deals
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage corporate sponsorships, co-working alliances, VC syndicates, and ecosystem partners with stage progression and bulk operations.
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
            className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Partner Lead</span>
          </button>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#282828] pb-3">
        {stages.map((stg) => (
          <button
            key={stg}
            onClick={() => {
              setStageFilter(stg);
              setSelectedIds([]);
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              stageFilter === stg ? 'bg-[#C5A46D] text-[#101010]' : 'bg-[#181818] text-stone-300 hover:text-white'
            }`}
          >
            {stg} {stg !== 'All' && `(${partnerships.filter((p) => p.stage === stg).length})`}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search organization, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>
        <div className="text-xs text-stone-400">
          Showing {filteredPartners.length} of {partnerships.length} partner leads
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
                <th className="py-3 px-4">Organization & Contact</th>
                <th className="py-3 px-4">Partnership Tier</th>
                <th className="py-3 px-4">Deal Structure</th>
                <th className="py-3 px-4 text-center">Pipeline Stage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No partnership records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => {
                  const isSelected = selectedIds.includes(partner.id);

                  return (
                    <tr
                      key={partner.id}
                      className={`hover:bg-[#1a1a1a]/80 transition-colors ${
                        isSelected ? 'bg-[#C5A46D]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(partner.id)}
                          className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">{partner.organization}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {partner.contactName} ({partner.email})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222222] text-[#C5A46D] border border-[#333333]">
                          {partner.tier || 'Ecosystem Partner'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-300">
                        {partner.dealValue || 'Strategic Alliance'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={partner.stage}
                          onChange={(e) => handleUpdateStage(partner.id, e.target.value)}
                          className="bg-[#1e1e1e] border border-[#333333] rounded px-2.5 py-1 text-[11px] text-[#C5A46D] font-semibold focus:outline-none focus:border-[#C5A46D] cursor-pointer"
                        >
                          <option value="New">New</option>
                          <option value="Discovery">Discovery</option>
                          <option value="Proposal">Proposal</option>
                          <option value="Negotiation">Negotiation</option>
                          <option value="Partnered">Partnered</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewRecord(partner)}
                            title="View Details"
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditRecord(partner)}
                            title="Edit Lead"
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-[#C5A46D] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSingleDeleteRecord(partner)}
                            title="Archive Lead"
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

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onDeleteSelected={() => setIsBulkDeleteModalOpen(true)}
        onExportSelected={() => setIsExportModalOpen(true)}
      />

      {/* View Detail Modal */}
      {viewRecord && (
        <RecordDetailModal
          isOpen={true}
          onClose={() => setViewRecord(null)}
          record={viewRecord}
          fields={detailFields}
          title={`Partner Profile: ${viewRecord.organization}`}
          description="Detailed corporate alliance and sponsorship information."
          readOnly={true}
        />
      )}

      {/* Edit Detail Modal */}
      {editRecord && (
        <RecordDetailModal
          isOpen={true}
          onClose={() => setEditRecord(null)}
          onSave={handleSaveEditedRecord}
          record={editRecord}
          fields={detailFields}
          title="Edit Partnership Lead"
          description="Update lead credentials and pipeline progress."
          readOnly={false}
        />
      )}

      {/* Add Partner Modal */}
      {isAddModalOpen && (
        <AdminModal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Partnership Lead"
          description="Record a new strategic partner or sponsor in the CRM pipeline."
          size="md"
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
                onClick={handleCreatePartner}
                className="px-4 py-1.5 rounded-lg bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold cursor-pointer"
              >
                Save Partner Lead
              </button>
            </div>
          }
        >
          <form onSubmit={handleCreatePartner} className="space-y-3.5 text-xs">
            <div>
              <label className="text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                Organization / Brand *
              </label>
              <input
                type="text"
                required
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="e.g. AWS Cloud, WeWork India, Nexus Ventures"
                className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                  placeholder="e.g. Aditi Rao"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div>
                <label className="text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="aditi@partner.com"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                  Partnership Tier
                </label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                >
                  <option value="Ecosystem Partner">Ecosystem Partner</option>
                  <option value="Title Sponsor">Title Sponsor</option>
                  <option value="Venue Partner">Venue Partner</option>
                  <option value="Capital Syndicate">Capital Syndicate</option>
                </select>
              </div>
              <div>
                <label className="text-stone-300 font-bold uppercase tracking-wider text-[10px]">
                  Initial Stage
                </label>
                <select
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                >
                  <option value="New">New</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Partnered">Partnered</option>
                </select>
              </div>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Single Delete Confirm */}
      <ConfirmModal
        isOpen={Boolean(singleDeleteRecord)}
        onClose={() => setSingleDeleteRecord(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Archive Partnership Lead"
        message={`Are you sure you want to archive "${singleDeleteRecord?.organization}"? This record will be soft-deleted and can be restored.`}
        confirmLabel="Archive Lead"
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Archive Selected Leads"
        message={`Are you sure you want to archive ${selectedIds.length} selected partnership leads?`}
        confirmLabel={`Archive ${selectedIds.length} Leads`}
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        collectionName="partnerships"
        collectionDisplayName="Partnership Leads"
        onImportComplete={(result) => {
          if (result?.imported) {
            setPartnerships((prev) => [...result.imported, ...prev]);
          }
        }}
      />

      {/* Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        collectionName="partnerships"
        data={partnerships}
        selectedIds={selectedIds}
        availableColumns={exportColumns}
      />
    </div>
  );
}
