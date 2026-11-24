import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Building,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Check,
  X,
  ExternalLink,
  MapPin,
  Download,
  Upload,
  Edit2,
  Filter,
  Plus
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';
import ExcelImportModal from './common/ExcelImportModal';
import ExcelExportModal from './common/ExcelExportModal';
import BulkActionBar from './common/BulkActionBar';
import RecordDetailModal from './common/RecordDetailModal';

export default function DirectoriesAdminModule({ initialTab = 'founders' }) {
  const {
    founders,
    setFounders,
    startups,
    setStartups,
    opportunities,
    setOpportunities,
    showToast,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab); // 'founders' | 'startups' | 'opportunities'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'pending' | 'approved' | 'rejected'

  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [viewRecord, setViewRecord] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const [singleDeleteRecord, setSingleDeleteRecord] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New item form state
  const [newItemData, setNewItemData] = useState({
    name: '',
    title: '',
    company: '',
    role: '',
    industry: 'DeepTech',
    stage: 'Seed',
    city: 'Delhi NCR',
    bio: '',
    description: '',
    website: '',
    status: 'approved'
  });

  // Current items
  const currentItems =
    activeTab === 'founders'
      ? founders
      : activeTab === 'startups'
      ? startups
      : opportunities;

  const currentSetter =
    activeTab === 'founders'
      ? setFounders
      : activeTab === 'startups'
      ? setStartups
      : setOpportunities;

  const filteredItems = currentItems.filter((item) => {
    const titleOrName = item.name || item.title || item.company || '';
    const desc = item.bio || item.tagline || item.description || '';
    const matchesSearch =
      titleOrName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = currentItems.filter((i) => i.status === 'pending').length;

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCurrentPage = () => {
    const pageIds = filteredItems.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Status updates
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const endpoint =
        activeTab === 'founders'
          ? `/api/founders/${id}`
          : activeTab === 'startups'
          ? `/api/startups/${id}`
          : `/api/opportunities/${id}`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminUser: currentUser?.name || 'Admin' })
      });

      if (res.ok) {
        const updated = await res.json();
        currentSetter((prev) => prev.map((item) => (item.id === id ? updated : item)));
        showToast(`Record marked as ${newStatus}`, newStatus === 'approved' ? 'success' : 'info');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  // Bulk status update
  const handleBulkStatus = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch('/api/bulk/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: activeTab,
          ids: selectedIds,
          status: newStatus
        })
      });
      if (res.ok) {
        currentSetter((prev) =>
          prev.map((item) => (selectedIds.includes(item.id) ? { ...item, status: newStatus } : item))
        );
        showToast(`Updated ${selectedIds.length} records to ${newStatus}`, 'success');
        setSelectedIds([]);
      }
    } catch (err) {
      showToast('Bulk update failed', 'error');
    }
  };

  // Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteRecord) return;
    try {
      const endpoint =
        activeTab === 'founders'
          ? `/api/founders/${singleDeleteRecord.id}`
          : activeTab === 'startups'
          ? `/api/startups/${singleDeleteRecord.id}`
          : `/api/opportunities/${singleDeleteRecord.id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        currentSetter((prev) => prev.filter((item) => item.id !== singleDeleteRecord.id));
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteRecord.id));
        showToast('Record archived successfully', 'info');
        setSingleDeleteRecord(null);
      }
    } catch (err) {
      showToast('Delete operation failed', 'error');
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
          collection: activeTab,
          ids: selectedIds
        })
      });

      if (res.ok) {
        const result = await res.json();
        currentSetter((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
        showToast(`Archived ${result.deletedCount || selectedIds.length} records`, 'info');
        setSelectedIds([]);
        setIsBulkDeleteModalOpen(false);
      }
    } catch (err) {
      showToast('Bulk deletion failed', 'error');
    }
  };

  // Save edited record
  const handleSaveEditedRecord = async (updatedData) => {
    try {
      const endpoint =
        activeTab === 'founders'
          ? `/api/founders/${updatedData.id}`
          : activeTab === 'startups'
          ? `/api/startups/${updatedData.id}`
          : `/api/opportunities/${updatedData.id}`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const saved = await res.json();
        currentSetter((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
        showToast('Record changes saved successfully', 'success');
        setEditRecord(null);
      }
    } catch (err) {
      showToast('Error saving record', 'error');
    }
  };

  // Create new record
  const handleCreateRecord = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        activeTab === 'founders'
          ? '/api/founders'
          : activeTab === 'startups'
          ? '/api/startups'
          : '/api/opportunities';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItemData,
          createdAt: new Date().toISOString()
        })
      });

      if (res.ok) {
        const created = await res.json();
        currentSetter((prev) => [created, ...prev]);
        showToast(`New ${activeTab.slice(0, -1)} listing created!`, 'success');
        setIsCreateModalOpen(false);
        setNewItemData({
          name: '',
          title: '',
          company: '',
          role: '',
          industry: 'DeepTech',
          stage: 'Seed',
          city: 'Delhi NCR',
          bio: '',
          description: '',
          website: '',
          status: 'approved'
        });
      }
    } catch (err) {
      showToast('Failed to create record', 'error');
    }
  };

  // Import completion callback
  const handleImportComplete = (result) => {
    if (result && result.imported) {
      currentSetter((prev) => [...result.imported, ...prev]);
    }
  };

  // Configure fields for RecordDetailModal based on activeTab
  const getModalFields = () => {
    if (activeTab === 'founders') {
      return [
        { key: 'name', label: 'Founder Name', type: 'text', required: true },
        { key: 'company', label: 'Startup / Company', type: 'text' },
        { key: 'role', label: 'Role / Designation', type: 'text' },
        { key: 'industry', label: 'Industry Sector', type: 'text' },
        { key: 'city', label: 'City / Location', type: 'text' },
        { key: 'website', label: 'Website / Profile URL', type: 'text' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending Review' },
            { value: 'approved', label: 'Approved & Live' },
            { value: 'rejected', label: 'Rejected' }
          ]
        },
        { key: 'bio', label: 'Biography / Executive Summary', type: 'textarea' }
      ];
    } else if (activeTab === 'startups') {
      return [
        { key: 'name', label: 'Startup Name', type: 'text', required: true },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'stage', label: 'Funding Stage', type: 'text' },
        { key: 'industry', label: 'Sector / Focus Area', type: 'text' },
        { key: 'city', label: 'Headquarters City', type: 'text' },
        { key: 'website', label: 'Website URL', type: 'text' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending Review' },
            { value: 'approved', label: 'Approved & Live' },
            { value: 'rejected', label: 'Rejected' }
          ]
        },
        { key: 'description', label: 'Company Overview', type: 'textarea' }
      ];
    } else {
      return [
        { key: 'title', label: 'Opportunity Title', type: 'text', required: true },
        { key: 'company', label: 'Offering Organization', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'city', label: 'Location', type: 'text' },
        { key: 'deadline', label: 'Application Deadline', type: 'text' },
        { key: 'applyUrl', label: 'Application Link', type: 'text' },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'pending', label: 'Pending Review' },
            { value: 'approved', label: 'Approved & Live' },
            { value: 'rejected', label: 'Rejected' }
          ]
        },
        { key: 'description', label: 'Opportunity Details', type: 'textarea' }
      ];
    }
  };

  // Configure export columns based on activeTab
  const getExportColumns = () => {
    if (activeTab === 'founders') {
      return [
        { key: 'id', label: 'Record ID' },
        { key: 'name', label: 'Founder Name' },
        { key: 'company', label: 'Company' },
        { key: 'role', label: 'Role' },
        { key: 'industry', label: 'Industry' },
        { key: 'city', label: 'City' },
        { key: 'website', label: 'Website' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created At' }
      ];
    } else if (activeTab === 'startups') {
      return [
        { key: 'id', label: 'Record ID' },
        { key: 'name', label: 'Startup Name' },
        { key: 'tagline', label: 'Tagline' },
        { key: 'stage', label: 'Funding Stage' },
        { key: 'industry', label: 'Sector' },
        { key: 'city', label: 'City' },
        { key: 'website', label: 'Website' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created At' }
      ];
    } else {
      return [
        { key: 'id', label: 'Record ID' },
        { key: 'title', label: 'Title' },
        { key: 'company', label: 'Company' },
        { key: 'category', label: 'Category' },
        { key: 'city', label: 'Location' },
        { key: 'deadline', label: 'Deadline' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Created At' }
      ];
    }
  };

  const isAllCurrentPageSelected =
    filteredItems.length > 0 && filteredItems.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">Ecosystem Directories & Curation</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A46D]/15 text-[#D8C39A] border border-[#C5A46D]/30">
              Database Records
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Full record management for Delhi NCR founders, startups, and radar opportunities with Excel import/export and soft-deletion.
          </p>
        </div>

        {/* Action Buttons */}
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
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Directory Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
        <button
          onClick={() => {
            setActiveTab('founders');
            setStatusFilter('All');
            setSelectedIds([]);
          }}
          className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'founders' ? 'bg-[#C5A46D] text-[#101010]' : 'bg-[#181818] text-stone-300 hover:text-white'
          }`}
        >
          Founders ({founders.length})
          {founders.filter((f) => f.status === 'pending').length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-stone-900 rounded-full text-[10px]">
              {founders.filter((f) => f.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('startups');
            setStatusFilter('All');
            setSelectedIds([]);
          }}
          className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'startups' ? 'bg-[#C5A46D] text-[#101010]' : 'bg-[#181818] text-stone-300 hover:text-white'
          }`}
        >
          Startups ({startups.length})
          {startups.filter((s) => s.status === 'pending').length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-stone-900 rounded-full text-[10px]">
              {startups.filter((s) => s.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('opportunities');
            setStatusFilter('All');
            setSelectedIds([]);
          }}
          className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'opportunities'
              ? 'bg-[#C5A46D] text-[#101010]'
              : 'bg-[#181818] text-stone-300 hover:text-white'
          }`}
        >
          Opportunities Radar ({opportunities.length})
          {opportunities.filter((o) => o.status === 'pending').length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-stone-900 rounded-full text-[10px]">
              {opportunities.filter((o) => o.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded text-xs cursor-pointer ${
              statusFilter === 'All' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            All ({currentItems.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded text-xs cursor-pointer ${
              statusFilter === 'pending' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1 rounded text-xs cursor-pointer ${
              statusFilter === 'approved' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            Approved & Live
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1 rounded text-xs cursor-pointer ${
              statusFilter === 'rejected' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Items Table */}
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
                <th className="py-3 px-4">Profile / Entity</th>
                <th className="py-3 px-4">Industry / Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No directory records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const title = item.name || item.title;
                  const subtitle = item.company || item.tagline || item.organization || item.stage;
                  const image = item.avatar || item.logo || item.image;
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#1a1a1a]/80 transition-colors ${
                        isSelected ? 'bg-[#C5A46D]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {image && (
                            <img
                              src={image}
                              alt={title}
                              className="w-10 h-10 object-cover rounded-md border border-[#2c2c2c] shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-semibold text-white text-sm">{title}</div>
                            <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222222] text-[#C5A46D] border border-[#333333]">
                          {item.industry || item.sector || item.category || 'Venture'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-300">
                        {item.city || 'Delhi NCR'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.status === 'approved'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : item.status === 'rejected'
                              ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                              : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          }`}
                        >
                          {item.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewRecord(item)}
                            title="Inspect Details"
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditRecord(item)}
                            title="Edit Record"
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-[#C5A46D] cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {item.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'approved')}
                              title="Approve Listing"
                              className="p-1.5 rounded hover:bg-emerald-950/40 text-stone-400 hover:text-emerald-400 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'rejected')}
                              title="Reject Listing"
                              className="p-1.5 rounded hover:bg-amber-950/40 text-stone-400 hover:text-amber-400 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setSingleDeleteRecord(item)}
                            title="Delete Record"
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
        onApproveSelected={() => handleBulkStatus('approved')}
        onRejectSelected={() => handleBulkStatus('rejected')}
      />

      {/* View Record Detail Modal */}
      {viewRecord && (
        <RecordDetailModal
          isOpen={true}
          onClose={() => setViewRecord(null)}
          record={viewRecord}
          fields={getModalFields()}
          title={`Record Profile: ${viewRecord.name || viewRecord.title}`}
          description={`Registered details for ${activeTab.slice(0, -1)} entry in 7 Horse Ventures ecosystem.`}
          readOnly={true}
        />
      )}

      {/* Edit Record Modal */}
      {editRecord && (
        <RecordDetailModal
          isOpen={true}
          onClose={() => setEditRecord(null)}
          onSave={handleSaveEditedRecord}
          record={editRecord}
          fields={getModalFields()}
          title={`Edit ${activeTab.slice(0, -1)} Record`}
          description="Update details and synchronize database state."
          readOnly={false}
        />
      )}

      {/* Add New Record Modal */}
      {isCreateModalOpen && (
        <AdminModal
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          title={`Add New ${activeTab.slice(0, -1)} Record`}
          description="Insert a new verified entity directly into the 7 Horse Ventures database."
          size="lg"
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateRecord}
                className="px-4 py-1.5 rounded-lg bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold cursor-pointer"
              >
                Create Listing
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  {activeTab === 'opportunities' ? 'Opportunity Title *' : 'Entity Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={activeTab === 'opportunities' ? newItemData.title : newItemData.name}
                  onChange={(e) =>
                    setNewItemData({
                      ...newItemData,
                      [activeTab === 'opportunities' ? 'title' : 'name']: e.target.value
                    })
                  }
                  placeholder="e.g. Nexus AI"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={newItemData.company}
                  onChange={(e) => setNewItemData({ ...newItemData, company: e.target.value })}
                  placeholder="e.g. Nexus Technologies Ltd"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Industry / Category
                </label>
                <input
                  type="text"
                  value={newItemData.industry}
                  onChange={(e) => setNewItemData({ ...newItemData, industry: e.target.value })}
                  placeholder="e.g. AI / ClimateTech"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  City / Location
                </label>
                <input
                  type="text"
                  value={newItemData.city}
                  onChange={(e) => setNewItemData({ ...newItemData, city: e.target.value })}
                  placeholder="e.g. Delhi NCR / Gurugram"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Website / Profile URL
                </label>
                <input
                  type="text"
                  value={newItemData.website}
                  onChange={(e) => setNewItemData({ ...newItemData, website: e.target.value })}
                  placeholder="https://company.com"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                  Description / Bio
                </label>
                <textarea
                  rows={3}
                  value={newItemData.bio || newItemData.description}
                  onChange={(e) =>
                    setNewItemData({
                      ...newItemData,
                      bio: e.target.value,
                      description: e.target.value
                    })
                  }
                  placeholder="Summary of the entity or venture..."
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded-lg p-2.5 text-stone-100 focus:border-[#C5A46D] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Single Record Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(singleDeleteRecord)}
        onClose={() => setSingleDeleteRecord(null)}
        onConfirm={handleConfirmSingleDelete}
        title={`Archive ${activeTab.slice(0, -1)} Record`}
        message={`Are you sure you want to archive "${singleDeleteRecord?.name || singleDeleteRecord?.title}"? The record will be soft-deleted in the database and can be restored by an authorized administrator.`}
        confirmLabel="Archive Record"
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Bulk Delete Confirm Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Archive Selected Records"
        message={`Are you sure you want to archive ${selectedIds.length} selected records from ${activeTab}? They will be marked as soft-deleted in the database.`}
        confirmLabel={`Archive ${selectedIds.length} Records`}
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Excel & CSV Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        collectionName={activeTab}
        collectionDisplayName={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        onImportComplete={handleImportComplete}
      />

      {/* Excel & CSV Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        collectionName={activeTab}
        data={currentItems}
        selectedIds={selectedIds}
        availableColumns={getExportColumns()}
      />
    </div>
  );
}
