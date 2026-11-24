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
  MessageSquare
} from 'lucide-react';

export default function EnquiriesAdminModule() {
  const { enquiries, setEnquiries, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

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

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.message?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Contact & Partnership Enquiries</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Incoming communication from founders, corporate partners, sponsors, and media.
          </p>
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
              onClick={() => setStatusFilter(s)}
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
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No enquiries recorded.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{enq.name}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{enq.email}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="text-white font-medium line-clamp-1">{enq.subject || 'Platform Inquiry'}</div>
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
                            ? 'bg-[#C5A46D]/20 text-[#C5A46D] border border-[#C5A46D]/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {enq.status || 'New'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        className="px-3 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-stone-200 text-xs rounded transition-colors cursor-pointer"
                      >
                        View & Reply
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A46D]">
                  {selectedEnquiry.category || 'Enquiry Dossier'}
                </span>
                <h3 className="text-lg font-bold text-white font-serif mt-0.5">{selectedEnquiry.name}</h3>
                <div className="text-xs text-stone-400 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#C5A46D]" /> {selectedEnquiry.email}
                  </span>
                  {selectedEnquiry.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#C5A46D]" /> {selectedEnquiry.phone}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-300">
              {selectedEnquiry.subject && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-stone-500">Subject</div>
                  <div className="text-sm font-semibold text-white mt-0.5">{selectedEnquiry.subject}</div>
                </div>
              )}
              <div>
                <div className="text-[10px] font-bold uppercase text-stone-500">Message Body</div>
                <div className="mt-1 p-3 bg-[#191919] border border-[#262626] rounded text-stone-200 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                <span className="text-stone-400">Update Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'contacted')}
                    className="px-3 py-1 rounded bg-[#222222] hover:bg-[#2c2c2c] text-[#C5A46D] font-medium cursor-pointer"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, 'resolved')}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
