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
  X
} from 'lucide-react';

export default function SubscribersAdminModule() {
  const { subscribers, setSubscribers, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newCity, setNewCity] = useState('Gurugram');

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Remove subscriber ${email}?`)) return;
    try {
      const res = await fetch(`/api/subscribers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        showToast('Subscriber removed', 'info');
      }
    } catch (err) {
      showToast('Error removing subscriber', 'error');
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

  const handleExportCSV = () => {
    if (filteredSubscribers.length === 0) {
      showToast('No subscribers to export', 'info');
      return;
    }

    const headers = ['ID', 'Email', 'City', 'Status', 'Date Subscribed'];
    const rows = filteredSubscribers.map((s) => [
      s.id,
      s.email,
      s.city || 'Delhi NCR',
      s.status,
      s.subscribedAt || ''
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `7H_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredSubscribers.length} subscribers`, 'success');
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">7H Founder Brief Audience</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Total {subscribers.length} subscribers • {subscribers.filter((s) => s.status === 'active').length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscriber</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-[#222222] hover:bg-[#2c2c2c] text-[#E8E5DF] border border-[#383838] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C5A46D]" />
            <span>Export CSV</span>
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
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'All' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'active' ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('unsubscribed')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
              statusFilter === 'unsubscribed'
                ? 'bg-[#C5A46D] text-[#101010] font-semibold'
                : 'bg-[#1e1e1e] text-stone-300'
            }`}
          >
            Unsubscribed
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
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
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No subscribers found matching filters.
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
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
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id, sub.email)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                        title="Delete subscriber"
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <h3 className="text-base font-bold text-white font-serif">Add Subscriber Manually</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddManual} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="founder@company.com"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div>
                <label className="text-stone-300 font-medium">City</label>
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                >
                  <option value="Gurugram">Gurugram</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Noida">Noida</option>
                  <option value="Other">Other / Pan-India</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#222222] text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold cursor-pointer"
                >
                  Add to Audience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
