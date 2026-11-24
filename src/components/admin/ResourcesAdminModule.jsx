import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  Edit2,
  ExternalLink,
  Shield,
  X
} from 'lucide-react';

export default function ResourcesAdminModule() {
  const { resources, setResources, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Venture Playbooks',
    description: '',
    downloadUrl: '',
    fileSize: '1.2 MB',
    accessLevel: 'Public',
    downloads: 0
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      const res = await fetch('/api/resources', {
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
        setResources((prev) => [created, ...prev]);
        showToast('Resource added to library', 'success');
        setIsModalOpen(false);
      }
    } catch (err) {
      showToast('Error saving resource', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete resource "${title}"?`)) return;
    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResources((prev) => prev.filter((r) => r.id !== id));
        showToast('Resource deleted', 'info');
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const filteredResources = resources.filter((r) => {
    return (
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Founder Resource Library</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Curated pitch deck templates, cap table models, founder guides, and fundraising playbooks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Resource</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Resource Document</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Access Level</th>
                <th className="py-3 px-4 text-center">Downloads</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-500">
                    No resources available.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white text-sm">{res.title}</div>
                      <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{res.description}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222222] text-[#C5A46D] border border-[#333333]">
                        {res.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-stone-300 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-[#C5A46D]" />
                        <span>{res.accessLevel}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-white">
                      {res.downloads || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(res.id, res.title)}
                        className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                        title="Delete"
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

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-lg p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3 mb-4">
              <h3 className="text-base font-bold text-white font-serif">Add Resource Document</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-300 font-medium">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 7H Seed Round Financial Model & Cap Table"
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div>
                <label className="text-stone-300 font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                >
                  <option value="Fundraising Playbooks">Fundraising Playbooks</option>
                  <option value="Financial & Cap Table Models">Financial & Cap Table Models</option>
                  <option value="Legal & Governance Kits">Legal & Governance Kits</option>
                  <option value="Pitch Deck Teardowns">Pitch Deck Teardowns</option>
                </select>
              </div>
              <div>
                <label className="text-stone-300 font-medium">Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Summary of what this document provides..."
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div>
                <label className="text-stone-300 font-medium">Download / Resource URL</label>
                <input
                  type="url"
                  value={form.downloadUrl}
                  onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#222222] text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold cursor-pointer"
                >
                  Upload Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
