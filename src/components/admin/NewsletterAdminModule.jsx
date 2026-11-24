import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Send,
  Plus,
  Users,
  CheckCircle2,
  Calendar,
  Eye,
  X,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function NewsletterAdminModule() {
  const { newsletters, setNewsletters, subscribers, showToast, currentUser } = useApp();

  const activeSubscribers = subscribers.filter((s) => s.status === 'active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewNewsletter, setPreviewNewsletter] = useState(null);

  const [form, setForm] = useState({
    subject: '',
    previewText: '',
    editionNumber: newsletters.length + 1,
    scheduledDate: 'Immediate',
    content: ''
  });

  const handleOpenCreate = () => {
    setForm({
      subject: `7H Founder Brief #${newsletters.length + 1}: Delhi NCR Capital Shifts & Scaling Playbooks`,
      previewText: 'Key insights from our latest Gurugram founder cohort, seed capital moves, and ecosystem opportunities.',
      editionNumber: newsletters.length + 1,
      scheduledDate: 'Immediate',
      content: `Welcome to the 7H Founder Brief.\n\nHere are this week's essential highlights for founders and operators across Gurugram, Delhi, and Noida:\n\n1. Ecosystem Spotlight: 40 founders convened at Cyber City for structured peer roundtables on cross-border SaaS expansion.\n2. Capital Moves: Seed and Series A velocity across Delhi NCR remains resilient in B2B tech and climate hardware.\n3. Upcoming Cohort: Applications for the August Founder Connect are now open.\n\nUntil next week,\nThe 7 Horse Ventures Editorial Team`
    });
    setIsModalOpen(true);
  };

  const handleSendCampaign = async (id, subject) => {
    if (!window.confirm(`Dispatch "${subject}" to ${activeSubscribers.length} active subscribers?`)) return;

    try {
      const res = await fetch(`/api/newsletters/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminUser: currentUser?.name || 'Admin' })
      });
      if (res.ok) {
        const data = await res.json();
        setNewsletters((prev) =>
          prev.map((nl) => (nl.id === id ? { ...nl, status: 'sent', recipientsCount: data.sentCount } : nl))
        );
        showToast(`Newsletter sent to ${data.sentCount} subscribers!`, 'success');
      }
    } catch (err) {
      showToast('Failed to dispatch newsletter', 'error');
    }
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    if (!form.subject.trim()) {
      showToast('Subject line is required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status: 'draft',
          openRate: '0%',
          clickRate: '0%',
          recipientsCount: activeSubscribers.length,
          adminUser: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        const created = await res.json();
        setNewsletters((prev) => [created, ...prev]);
        showToast('Campaign drafted successfully', 'success');
        setIsModalOpen(false);
      }
    } catch (err) {
      showToast('Error saving campaign', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">7H Founder Brief & Newsletters</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Curate and broadcast weekly venture briefings to {activeSubscribers.length} verified founders and investors.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Compose Campaign</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl">
          <div className="text-xs text-stone-400">Audience Reach</div>
          <div className="text-2xl font-bold text-white font-serif mt-1">{activeSubscribers.length}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Active weekly subscribers</div>
        </div>
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl">
          <div className="text-xs text-stone-400">Total Editions Broadcast</div>
          <div className="text-2xl font-bold text-white font-serif mt-1">
            {newsletters.filter((n) => n.status === 'sent').length}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Delhi NCR ecosystem briefs</div>
        </div>
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-xl">
          <div className="text-xs text-stone-400">Avg. Engagement</div>
          <div className="text-2xl font-bold text-white font-serif mt-1">54.2%</div>
          <div className="text-[11px] text-[#C5A46D] mt-0.5">Verified founder open rate</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Subject & Preview</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Stats</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {newsletters.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No newsletter campaigns recorded yet.
                  </td>
                </tr>
              ) : (
                newsletters.map((nl) => (
                  <tr key={nl.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-white text-sm line-clamp-1">{nl.subject}</div>
                      <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{nl.previewText}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{nl.recipientsCount || activeSubscribers.length}</div>
                      <div className="text-[10px] text-stone-500">Subscribers</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-emerald-400 font-semibold">{nl.openRate || '52%'} Open</div>
                      <div className="text-[10px] text-stone-400">{nl.clickRate || '18%'} Clicks</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          nl.status === 'sent'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {nl.status === 'sent' ? 'Dispatched' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewNewsletter(nl)}
                          className="px-2.5 py-1 rounded bg-[#222222] hover:bg-[#2c2c2c] text-stone-300 text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#C5A46D]" />
                          <span>Preview</span>
                        </button>
                        {nl.status !== 'sent' && (
                          <button
                            onClick={() => handleSendCampaign(nl.id, nl.subject)}
                            className="px-2.5 py-1 rounded bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Now</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compose Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-[#262626] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">Compose 7H Founder Brief</h3>
                <p className="text-xs text-stone-400">Broadcast to {activeSubscribers.length} subscribers</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white hover:bg-[#222222] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Campaign Subject *</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Preview Text / Snippet</label>
                <input
                  type="text"
                  value={form.previewText}
                  onChange={(e) => setForm({ ...form, previewText: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-300 font-medium">Brief Content</label>
                <textarea
                  rows="8"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 border-t border-[#262626] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#222222] hover:bg-[#2c2c2c] text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold cursor-pointer"
                >
                  Save as Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-[#333333] rounded-xl w-full max-w-xl max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A46D]">
                  7H Founder Brief • Preview
                </span>
                <h3 className="text-lg font-bold text-white font-serif mt-1">{previewNewsletter.subject}</h3>
              </div>
              <button
                onClick={() => setPreviewNewsletter(null)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 overflow-y-auto space-y-4 text-xs text-stone-300 leading-relaxed whitespace-pre-line">
              {previewNewsletter.content || previewNewsletter.previewText}
            </div>
            <div className="pt-4 border-t border-[#2a2a2a] flex justify-end">
              <button
                onClick={() => setPreviewNewsletter(null)}
                className="px-4 py-1.5 bg-[#262626] text-stone-200 text-xs rounded hover:bg-[#333333] cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
