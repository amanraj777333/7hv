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
  X
} from 'lucide-react';

export default function PartnershipsCrmModule() {
  const { partnerships, setPartnerships, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const filteredPartners = partnerships.filter((p) => {
    const matchesSearch =
      p.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.contactName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'All' || p.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const stages = ['All', 'New', 'Discovery', 'Proposal', 'Negotiation', 'Partnered'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Partnerships & Corporate CRM</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage corporate sponsorships, co-working alliances, VC syndicates, and government ecosystem partnerships.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Partner Lead</span>
        </button>
      </div>

      {/* Stage Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#282828] pb-3">
        {stages.map((stg) => (
          <button
            key={stg}
            onClick={() => setStageFilter(stg)}
            className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              stageFilter === stg ? 'bg-[#C5A46D] text-[#101010]' : 'bg-[#181818] text-stone-300 hover:text-white'
            }`}
          >
            {stg} {stg !== 'All' && `(${partnerships.filter((p) => p.stage === stg).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Organization & Contact</th>
                <th className="py-3 px-4">Partnership Tier</th>
                <th className="py-3 px-4">Deal Structure</th>
                <th className="py-3 px-4 text-center">Pipeline Stage</th>
                <th className="py-3 px-4 text-right">Advance Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No partnership records found in this stage.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
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
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          partner.stage === 'Partnered'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : partner.stage === 'Negotiation'
                            ? 'bg-[#C5A46D]/20 text-[#C5A46D] border border-[#C5A46D]/40'
                            : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {partner.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={partner.stage}
                        onChange={(e) => handleUpdateStage(partner.id, e.target.value)}
                        className="bg-[#1e1e1e] border border-[#333333] rounded px-2 py-1 text-[11px] text-stone-200 focus:outline-none focus:border-[#C5A46D]"
                      >
                        <option value="New">New</option>
                        <option value="Discovery">Discovery</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Partnered">Partnered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Partner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-lg p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <h3 className="text-base font-bold text-white font-serif">Add Partnership Lead</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePartner} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 font-medium">Organization / Brand *</label>
                <input
                  type="text"
                  required
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="e.g. AWS Cloud, WeWork India, Nexus Ventures"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-medium">Contact Person</label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    placeholder="Name"
                    className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@org.com"
                    className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-medium">Tier</label>
                  <select
                    value={form.tier}
                    onChange={(e) => setForm({ ...form, tier: e.target.value })}
                    className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  >
                    <option value="Ecosystem Partner">Ecosystem Partner</option>
                    <option value="Title Sponsor">Title Sponsor</option>
                    <option value="Venue Partner">Venue Partner</option>
                    <option value="Capital Syndicate">Capital Syndicate</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-300 font-medium">Stage</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Partnered">Partnered</option>
                  </select>
                </div>
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
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
