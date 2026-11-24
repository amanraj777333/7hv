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
  MapPin
} from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'pending' | 'approved'
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Status updates for any collection
  const handleUpdateStatus = async (collection, id, newStatus) => {
    try {
      const endpoint =
        collection === 'founders'
          ? `/api/founders/${id}`
          : collection === 'startups'
          ? `/api/startups/${id}`
          : `/api/opportunities/${id}`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminUser: currentUser?.name || 'Admin' })
      });

      if (res.ok) {
        const updated = await res.json();
        if (collection === 'founders') {
          setFounders((prev) => prev.map((f) => (f.id === id ? updated : f)));
        } else if (collection === 'startups') {
          setStartups((prev) => prev.map((s) => (s.id === id ? updated : s)));
        } else {
          setOpportunities((prev) => prev.map((o) => (o.id === id ? updated : o)));
        }
        showToast(`Listing marked as ${newStatus}`, newStatus === 'approved' ? 'success' : 'info');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (collection, id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const endpoint =
        collection === 'founders'
          ? `/api/founders/${id}`
          : collection === 'startups'
          ? `/api/startups/${id}`
          : `/api/opportunities/${id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        if (collection === 'founders') setFounders((prev) => prev.filter((f) => f.id !== id));
        else if (collection === 'startups') setStartups((prev) => prev.filter((s) => s.id !== id));
        else setOpportunities((prev) => prev.filter((o) => o.id !== id));
        showToast('Record deleted', 'info');
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  // Get active items array
  const currentItems =
    activeTab === 'founders'
      ? founders
      : activeTab === 'startups'
      ? startups
      : opportunities;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Ecosystem Directories & Curation</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Review community submissions and curate the verified Delhi NCR founder, startup, and opportunity directories.
          </p>
        </div>
      </div>

      {/* Directory Category Tabs */}
      <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
        <button
          onClick={() => {
            setActiveTab('founders');
            setStatusFilter('All');
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
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
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
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No directory records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const title = item.name || item.title;
                  const subtitle = item.company || item.tagline || item.organization || item.stage;
                  const image = item.avatar || item.logo || item.image;

                  return (
                    <tr key={item.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
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
                            onClick={() => setSelectedDetail(item)}
                            title="Inspect Details"
                            className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {item.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(activeTab, item.id, 'approved')}
                              title="Approve Listing"
                              className="p-1.5 rounded hover:bg-emerald-950/40 text-stone-400 hover:text-emerald-400 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {item.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(activeTab, item.id, 'rejected')}
                              title="Reject Listing"
                              className="p-1.5 rounded hover:bg-amber-950/40 text-stone-400 hover:text-amber-400 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(activeTab, item.id, title)}
                            title="Delete"
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

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A46D]">
                  Directory Submission Review
                </span>
                <h3 className="text-lg font-bold text-white font-serif mt-1">
                  {selectedDetail.name || selectedDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300">
              {selectedDetail.bio && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-500">Bio</div>
                  <div className="mt-1 leading-relaxed">{selectedDetail.bio}</div>
                </div>
              )}
              {selectedDetail.description && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-500">Description</div>
                  <div className="mt-1 leading-relaxed">{selectedDetail.description}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-500">Location</div>
                  <div className="mt-0.5 text-white">{selectedDetail.city || 'Delhi NCR'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-500">Status</div>
                  <div className="mt-0.5 text-white capitalize">{selectedDetail.status || 'Pending'}</div>
                </div>
              </div>
              {selectedDetail.website && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-500">Website</div>
                  <a
                    href={selectedDetail.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C5A46D] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>{selectedDetail.website}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-5 border-t border-[#262626] mt-4">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-3 py-1.5 rounded bg-[#222222] text-stone-300 cursor-pointer"
              >
                Close
              </button>
              {selectedDetail.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleUpdateStatus(activeTab, selectedDetail.id, 'approved');
                    setSelectedDetail(null);
                  }}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer"
                >
                  Approve & Make Live
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
