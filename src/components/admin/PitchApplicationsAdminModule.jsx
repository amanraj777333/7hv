import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Search,
  ExternalLink,
  Star,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  X,
  MessageSquare,
  DollarSign
} from 'lucide-react';

export default function PitchApplicationsAdminModule() {
  const { pitchApplications, setPitchApplications, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [internalNote, setInternalNote] = useState('');

  const handleUpdateStatus = async (id, status, score) => {
    try {
      const payload = {
        status,
        ...(score !== undefined ? { score } : {}),
        adminUser: currentUser?.name || 'Admin'
      };
      const res = await fetch(`/api/pitch-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        setPitchApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp(updated);
        }
        showToast(`Application marked as ${status}`, 'info');
      }
    } catch (err) {
      showToast('Error updating application', 'error');
    }
  };

  const handleAddNote = async (id) => {
    if (!internalNote.trim()) return;
    const currentNotes = selectedApp.internalNotes || [];
    const newNotes = [
      ...currentNotes,
      {
        author: currentUser?.name || 'Curator',
        text: internalNote.trim(),
        date: new Date().toISOString()
      }
    ];

    try {
      const res = await fetch(`/api/pitch-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internalNotes: newNotes,
          adminUser: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setPitchApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
        setSelectedApp(updated);
        setInternalNote('');
        showToast('Internal note saved', 'success');
      }
    } catch (err) {
      showToast('Failed to save note', 'error');
    }
  };

  const filteredApplications = pitchApplications.filter((app) => {
    const matchesSearch =
      app.startupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.founderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.sector?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'All' || app.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Pitch & Capital Connect Console</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Confidential evaluation pipeline for startups applying for investor presentations and capital showcases.
          </p>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-3.5">
          <div className="text-stone-400 text-xs">Total Applications</div>
          <div className="text-2xl font-bold font-serif text-white mt-1">{pitchApplications.length}</div>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-3.5">
          <div className="text-stone-400 text-xs">Awaiting Evaluation</div>
          <div className="text-2xl font-bold font-serif text-amber-400 mt-1">
            {pitchApplications.filter((a) => a.status === 'new' || a.status === 'reviewing').length}
          </div>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-3.5">
          <div className="text-stone-400 text-xs">Shortlisted for Demo</div>
          <div className="text-2xl font-bold font-serif text-emerald-400 mt-1">
            {pitchApplications.filter((a) => a.status === 'shortlisted').length}
          </div>
        </div>
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-3.5">
          <div className="text-stone-400 text-xs">Invited to Capital Cohort</div>
          <div className="text-2xl font-bold font-serif text-[#C5A46D] mt-1">
            {pitchApplications.filter((a) => a.status === 'invited').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search startup, founder, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400">Stage:</span>
          {['All', 'Pre-Seed', 'Seed', 'Pre-Series A'].map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                stageFilter === s ? 'bg-[#C5A46D] text-[#101010] font-semibold' : 'bg-[#1e1e1e] text-stone-300'
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
                <th className="py-3 px-4">Startup & Founder</th>
                <th className="py-3 px-4">Sector & Stage</th>
                <th className="py-3 px-4">Capital Ask</th>
                <th className="py-3 px-4">Traction / Revenue</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-500">
                    No pitch applications found.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{app.startupName}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {app.founderName} ({app.city || 'Delhi NCR'})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[#C5A46D] font-medium">{app.sector}</div>
                      <div className="text-[10px] text-stone-500">{app.stage}</div>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">{app.ask || '₹2 Cr – ₹4 Cr'}</td>
                    <td className="py-3.5 px-4 text-stone-300">{app.revenue || '₹15L MRR'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{app.score || '—'}/10</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'shortlisted'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : app.status === 'invited'
                            ? 'bg-[#C5A46D]/20 text-[#C5A46D] border border-[#C5A46D]/40'
                            : app.status === 'rejected'
                            ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-stone-200 text-xs rounded transition-colors cursor-pointer"
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Evaluation Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A46D]">
                  Confidential Pitch Dossier
                </span>
                <h3 className="text-xl font-bold text-white font-serif mt-0.5">{selectedApp.startupName}</h3>
                <div className="text-xs text-stone-400">
                  Founder: {selectedApp.founderName} • {selectedApp.email} • {selectedApp.phone}
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#181818] p-3 rounded-lg border border-[#262626]">
                <div>
                  <div className="text-stone-500 text-[10px] uppercase font-bold">Stage</div>
                  <div className="text-white font-semibold mt-0.5">{selectedApp.stage}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px] uppercase font-bold">Sector</div>
                  <div className="text-[#C5A46D] font-semibold mt-0.5">{selectedApp.sector}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px] uppercase font-bold">Capital Ask</div>
                  <div className="text-white font-semibold mt-0.5">{selectedApp.ask}</div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px] uppercase font-bold">Current Score</div>
                  <div className="text-amber-400 font-bold mt-0.5">{selectedApp.score || 0}/10</div>
                </div>
              </div>

              {selectedApp.elevatorPitch && (
                <div>
                  <div className="text-stone-400 font-bold uppercase text-[10px]">Elevator Pitch</div>
                  <p className="mt-1 text-stone-200 leading-relaxed bg-[#191919] p-3 rounded border border-[#282828]">
                    {selectedApp.elevatorPitch}
                  </p>
                </div>
              )}

              {selectedApp.deckUrl && (
                <div>
                  <div className="text-stone-400 font-bold uppercase text-[10px]">Pitch Deck</div>
                  <a
                    href={selectedApp.deckUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C5A46D] hover:underline"
                  >
                    <span>View Confidential Deck</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Status & Score Controls */}
              <div className="bg-[#181818] p-4 rounded-lg border border-[#2a2a2a] space-y-3">
                <div className="font-bold text-white text-xs">Curator Scoring & Pipeline Stage</div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: 'Reviewing', val: 'reviewing' },
                    { label: 'Shortlisted', val: 'shortlisted' },
                    { label: 'Invited to Pitch', val: 'invited' },
                    { label: 'Pass / Reject', val: 'rejected' }
                  ].map((s) => (
                    <button
                      key={s.val}
                      onClick={() => handleUpdateStatus(selectedApp.id, s.val)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        selectedApp.status === s.val
                          ? 'bg-[#C5A46D] text-[#101010]'
                          : 'bg-[#242424] text-stone-300 hover:bg-[#303030]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-stone-400 text-xs">Curator Score (1-10):</span>
                  {[5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.status, num)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-all cursor-pointer ${
                        selectedApp.score === num
                          ? 'bg-amber-400 text-black'
                          : 'bg-[#222222] text-stone-300 hover:bg-[#2c2c2c]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes Thread */}
              <div className="space-y-2">
                <div className="font-bold text-white text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#C5A46D]" />
                  <span>Internal Curator Notes ({selectedApp.internalNotes?.length || 0})</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedApp.internalNotes?.map((n, idx) => (
                    <div key={idx} className="bg-[#1a1a1a] p-2.5 rounded border border-[#2a2a2a] text-[11px]">
                      <div className="flex justify-between text-stone-500 text-[10px]">
                        <span className="text-stone-400 font-semibold">{n.author}</span>
                        <span>{new Date(n.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-stone-300 mt-1">{n.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add internal curator observation..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="flex-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-200 text-xs focus:border-[#C5A46D] outline-none"
                  />
                  <button
                    onClick={() => handleAddNote(selectedApp.id)}
                    className="px-3 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-[#C5A46D] text-xs font-semibold rounded cursor-pointer"
                  >
                    Post Note
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#262626] flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-[#222222] hover:bg-[#2a2a2a] text-stone-300 rounded text-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
