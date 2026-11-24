import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  X,
  Star
} from 'lucide-react';

export default function ArticlesAdminModule({ defaultType = 'blog' }) {
  const { articles, setArticles, showToast, currentUser } = useApp();

  const [activeTabType, setActiveTabType] = useState(defaultType); // 'blog' | 'news' | 'founder_story'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const defaultForm = {
    title: '',
    slug: '',
    type: activeTabType,
    category: 'Venture & Growth',
    summary: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: currentUser?.name || '7 Horse Ventures Editorial',
      role: 'Founding Partner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: '5 min read',
    published: true,
    featured: false,
    tags: ['Delhi NCR', 'Startups']
  };

  const [formData, setFormData] = useState(defaultForm);

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({ ...defaultForm, type: activeTabType });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art) => {
    setEditingArticle(art);
    setFormData({
      ...defaultForm,
      ...art,
      author: art.author || defaultForm.author,
      tags: art.tags || ['Delhi NCR']
    });
    setIsModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const payload = {
      ...formData,
      slug,
      adminUser: currentUser?.name || 'Admin'
    };

    try {
      if (editingArticle) {
        const res = await fetch(`/api/articles/${editingArticle.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setArticles((prev) => prev.map((a) => (a.id === editingArticle.id ? updated : a)));
          showToast('Article updated', 'success');
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setArticles((prev) => [created, ...prev]);
          showToast('Article published', 'success');
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      showToast('Error saving article', 'error');
    }
  };

  const handleTogglePublish = async (art) => {
    try {
      const nextPublished = !art.published;
      const res = await fetch(`/api/articles/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished, adminUser: currentUser?.name || 'Admin' })
      });
      if (res.ok) {
        const updated = await res.json();
        setArticles((prev) => prev.map((a) => (a.id === art.id ? updated : a)));
        showToast(`Article ${nextPublished ? 'published' : 'drafted'}`, 'info');
      }
    } catch (err) {
      showToast('Failed to toggle publication', 'error');
    }
  };

  const handleToggleFeatured = async (art) => {
    try {
      const nextFeatured = !art.featured;
      const res = await fetch(`/api/articles/${art.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured, adminUser: currentUser?.name || 'Admin' })
      });
      if (res.ok) {
        const updated = await res.json();
        setArticles((prev) => prev.map((a) => (a.id === art.id ? updated : a)));
        showToast(`Featured status updated`, 'info');
      }
    } catch (err) {
      showToast('Failed to update featured', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast('Article deleted', 'info');
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesType = art.type === activeTabType;
    const matchesSearch =
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Publishing & Editorial Suite</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage Insights & Articles, Delhi NCR Startup News, and in-depth Founder Interviews.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
        <button
          onClick={() => setActiveTabType('blog')}
          className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTabType === 'blog'
              ? 'bg-[#C5A46D] text-[#101010]'
              : 'bg-[#181818] text-stone-300 hover:text-white'
          }`}
        >
          Blog & Articles ({articles.filter((a) => a.type === 'blog').length})
        </button>
        <button
          onClick={() => setActiveTabType('news')}
          className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTabType === 'news'
              ? 'bg-[#C5A46D] text-[#101010]'
              : 'bg-[#181818] text-stone-300 hover:text-white'
          }`}
        >
          Startup News ({articles.filter((a) => a.type === 'news').length})
        </button>
        <button
          onClick={() => setActiveTabType('founder_story')}
          className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            activeTabType === 'founder_story'
              ? 'bg-[#C5A46D] text-[#101010]'
              : 'bg-[#181818] text-stone-300 hover:text-white'
          }`}
        >
          Founder Stories ({articles.filter((a) => a.type === 'founder_story').length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`Search ${activeTabType.replace('_', ' ')} entries...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>
        <div className="text-xs text-stone-400">
          Showing {filteredArticles.length} entries
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-500">
                    No entries found for this category.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-12 h-10 object-cover rounded border border-[#2c2c2c] shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-white text-sm line-clamp-1 flex items-center gap-1.5">
                            <span>{art.title}</span>
                            {art.featured && (
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono mt-0.5">/{art.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#222222] text-[#C5A46D] border border-[#333333]">
                        {art.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{art.author?.name || 'Editorial'}</div>
                      <div className="text-[10px] text-stone-500">{art.readTime || '5 min'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-300">
                      {art.publishedAt}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          art.published
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {art.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleFeatured(art)}
                          title={art.featured ? 'Remove Featured' : 'Mark as Featured'}
                          className={`p-1.5 rounded hover:bg-[#252525] cursor-pointer ${
                            art.featured ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(art)}
                          title={art.published ? 'Unpublish' : 'Publish'}
                          className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                        >
                          {art.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          title="Edit Entry"
                          className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-[#C5A46D] cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          title="Delete Entry"
                          className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-[#262626] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  {editingArticle ? 'Edit Editorial Entry' : 'Create New Editorial Entry'}
                </h3>
                <p className="text-xs text-stone-400">Publish content across 7 Horse Ventures ecosystem channels</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white hover:bg-[#222222] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="Article or Story Headline"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Publishing Channel</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  >
                    <option value="blog">Blog & Articles (/insights)</option>
                    <option value="news">Startup News (/news)</option>
                    <option value="founder_story">Founder Stories (/founder-stories)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. Venture & Growth, Funding, Founder Journey"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Summary / Excerpt</label>
                  <textarea
                    rows="2"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="Brief 2-line preview shown on cards and in search results..."
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Full Content (Markdown or Text)</label>
                  <textarea
                    rows="7"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono text-[11px]"
                    placeholder="Write article content..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Author Name</label>
                  <input
                    type="text"
                    value={formData.author.name}
                    onChange={(e) => setFormData({ ...formData, author: { ...formData.author, name: e.target.value } })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. 6 min read"
                  />
                </div>
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
                  {editingArticle ? 'Save Changes' : 'Publish Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
