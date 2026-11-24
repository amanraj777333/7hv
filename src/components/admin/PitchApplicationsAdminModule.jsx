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
  DollarSign,
  Download,
  Upload,
  Trash2,
  Filter
} from 'lucide-react';
import AdminModal from './common/AdminModal';
import ConfirmModal from './common/ConfirmModal';
import ExcelImportModal from './common/ExcelImportModal';
import ExcelExportModal from './common/ExcelExportModal';
import BulkActionBar from './common/BulkActionBar';

export default function PitchApplicationsAdminModule() {
  const { pitchApplications, setPitchApplications, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [internalNote, setInternalNote] = useState('');

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [singleDeleteRecord, setSingleDeleteRecord] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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

  // Single Delete
  const handleConfirmSingleDelete = async () => {
    if (!singleDeleteRecord) return;
    try {
      const res = await fetch(`/api/pitch-applications/${singleDeleteRecord.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPitchApplications((prev) => prev.filter((a) => a.id !== singleDeleteRecord.id));
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteRecord.id));
        if (selectedApp?.id === singleDeleteRecord.id) setSelectedApp(null);
        showToast('Application archived', 'info');
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
          collection: 'pitch_applications',
          ids: selectedIds
        })
      });

      if (res.ok) {
        const result = await res.json();
        setPitchApplications((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
        showToast(`Archived ${result.deletedCount || selectedIds.length} pitch applications`, 'info');
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
    const pageIds = filteredApplications.map((item) => item.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
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

  const stages = ['All', 'Seed', 'Pre-Series A', 'Series A', 'Bootstrapped'];

  const exportColumns = [
    { key: 'id', label: 'Application ID' },
    { key: 'startupName', label: 'Startup Name' },
    { key: 'founderName', label: 'Founder Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'sector', label: 'Sector' },
    { key: 'stage', label: 'Stage' },
    { key: 'ask', label: 'Capital Ask' },
    { key: 'score', label: 'Evaluation Score' },
    { key: 'status', label: 'Pipeline Status' },
    { key: 'createdAt', label: 'Submission Date' }
  ];

  const isAllCurrentPageSelected =
    filteredApplications.length > 0 &&
    filteredApplications.every((item) => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">Pitch & Capital Connect Console</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#C5A46D]/15 text-[#D8C39A] border border-[#C5A46D]/30">
              Deal Flow Pipeline
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Confidential evaluation pipeline for startups applying for investor presentations, syndicates, and capital showcases.
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

      {/* Filter Tabs */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search startup, founder, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStageFilter(s);
                setSelectedIds([]);
              }}
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
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllCurrentPageSelected}
                    onChange={handleSelectAllCurrentPage}
                    className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Startup & Founder</th>
                <th className="py-3 px-4">Sector & Stage</th>
                <th className="py-3 px-4">Capital Ask</th>
                <th className="py-3 px-4">Traction / Revenue</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Pipeline Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-stone-500">
                    No pitch applications found.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const isSelected = selectedIds.includes(app.id);

                  return (
                    <tr
                      key={app.id}
                      className={`hover:bg-[#1a1a1a]/80 transition-colors ${
                        isSelected ? 'bg-[#C5A46D]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(app.id)}
                          className="accent-[#C5A46D] w-3.5 h-3.5 rounded cursor-pointer"
                        />
                      </td>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-stone-200 text-xs rounded transition-colors cursor-pointer"
                          >
                            Evaluate
                          </button>
                          <button
                            onClick={() => setSingleDeleteRecord(app)}
                            className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                            title="Archive application"
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

      {/* Application Evaluation Modal */}
      {selectedApp && (
        <AdminModal
          isOpen={true}
          onClose={() => setSelectedApp(null)}
          title={`Confidential Pitch Dossier: ${selectedApp.startupName}`}
          description={`Founder: ${selectedApp.founderName} • ${selectedApp.email} • ${selectedApp.phone}`}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setSingleDeleteRecord(selectedApp)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Archive Application</span>
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2a2a2a] text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
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

              <div className="pt-2 flex items-center gap-2">
                <span className="text-xs text-stone-400">Score (1-10):</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleUpdateStatus(selectedApp.id, selectedApp.status, num)}
                    className={`w-6 h-6 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      selectedApp.score === num
                        ? 'bg-amber-400 text-stone-900'
                        : 'bg-[#222222] text-stone-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3 pt-2">
              <div className="font-bold text-white text-xs">Curator Investment Notes</div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {(selectedApp.internalNotes || []).map((n, idx) => (
                  <div key={idx} className="bg-[#171717] p-2.5 rounded border border-[#262626] text-[11px]">
                    <div className="flex items-center justify-between text-stone-400 text-[10px] mb-1">
                      <span className="font-semibold text-[#C5A46D]">{n.author}</span>
                      <span>{new Date(n.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-200">{n.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Add evaluation note or syndicate feedback..."
                  className="flex-1 bg-[#1a1a1a] border border-[#2d2d2d] rounded px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
                />
                <button
                  onClick={() => handleAddNote(selectedApp.id)}
                  className="px-3 py-1.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold text-xs rounded cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Single Delete Confirm */}
      <ConfirmModal
        isOpen={Boolean(singleDeleteRecord)}
        onClose={() => setSingleDeleteRecord(null)}
        onConfirm={handleConfirmSingleDelete}
        title="Archive Pitch Application"
        message={`Are you sure you want to archive the pitch application for "${singleDeleteRecord?.startupName}"?`}
        confirmLabel="Archive Application"
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Bulk Delete Confirm */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Archive Selected Pitch Applications"
        message={`Are you sure you want to archive ${selectedIds.length} selected pitch applications?`}
        confirmLabel={`Archive ${selectedIds.length} Applications`}
        cancelLabel="Cancel"
        destructive={true}
      />

      {/* Import Modal */}
      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        collectionName="pitch_applications"
        collectionDisplayName="Pitch Applications"
        onImportComplete={(result) => {
          if (result?.imported) {
            setPitchApplications((prev) => [...result.imported, ...prev]);
          }
        }}
      />

      {/* Export Modal */}
      <ExcelExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        collectionName="pitch_applications"
        data={pitchApplications}
        selectedIds={selectedIds}
        availableColumns={exportColumns}
      />
    </div>
  );
}
