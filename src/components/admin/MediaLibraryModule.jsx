import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, Trash2, Copy, Search, ExternalLink, Image as ImageIcon, Check } from 'lucide-react';

export default function MediaLibraryModule() {
  const { mediaLibrary, uploadMediaFile, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Events', 'Office & Meetings', 'Pitch & Capital', 'Corporate', 'General'];

  const filteredMedia = (mediaLibrary || []).filter((m) => {
    const matchesSearch =
      m.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.alt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadMediaFile(file, {
        category: selectedCategory === 'All' ? 'General' : selectedCategory,
        title: file.name
      });
    } catch (err) {
      showToast('Media upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = (url, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      showToast('Media URL copied to clipboard', 'info');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-stone-900">
            Central Media Library
          </h2>
          <p className="text-xs text-stone-500">
            Upload, preview, and reuse persistent image assets across events, articles, and pages. Supported: JPG, PNG, WEBP, SVG.
          </p>
        </div>

        <label className="px-4 py-2 bg-[#101010] hover:bg-[#252525] text-white text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto">
          <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
          <span>{isUploading ? 'Uploading...' : 'Upload New Media'}</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-xl border border-[#E8E5DF]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded bg-[#FAF7F2] focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto self-start sm:self-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#101010] text-[#D8C39A] font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-[#E8E5DF] overflow-hidden shadow-xs hover:border-[#C5A46D] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[4/3] bg-stone-900 overflow-hidden">
                  <img src={m.url} alt={m.alt || m.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] text-white font-mono">
                    {m.size || 'Web Asset'}
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-stone-900 truncate font-heading">{m.title || m.filename}</h4>
                  <p className="text-[10px] text-stone-500 font-mono truncate">{m.filename}</p>
                </div>
              </div>

              <div className="p-3 pt-0 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => copyUrl(m.url, m.id)}
                  className="text-xs font-semibold text-stone-700 hover:text-black flex items-center gap-1 cursor-pointer"
                  title="Copy direct URL to clipboard"
                >
                  {copiedId === m.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#A9874D]" />
                      <span className="text-[11px]">Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-400 hover:text-stone-800 p-1"
                  title="View full image"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF] text-xs text-stone-500 space-y-2 max-w-sm mx-auto">
          <ImageIcon className="w-8 h-8 text-[#A9874D] mx-auto" />
          <p className="font-bold text-stone-800">No media assets found</p>
          <p>Upload your first photograph using the button above.</p>
        </div>
      )}
    </div>
  );
}
