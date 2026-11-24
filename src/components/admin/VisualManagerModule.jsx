import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Image, Upload, RotateCcw, Check, RefreshCw, Eye, Save, ExternalLink } from 'lucide-react';

export default function VisualManagerModule() {
  const { mediaMappings, updateMediaMapping, revertMediaMapping, uploadMediaFile, showToast } = useApp();

  const [activeFilterPage, setActiveFilterPage] = useState('All');
  const [editingKey, setEditingKey] = useState(null);
  const [tempUrl, setTempUrl] = useState('');
  const [tempAlt, setTempAlt] = useState('');
  const [tempPosition, setTempPosition] = useState('center');
  const [tempFit, setTempFit] = useState('cover');
  const [isUploading, setIsUploading] = useState(false);

  const mappingsList = Object.values(mediaMappings || {});

  const pages = ['All', 'Home', 'About Us', 'Events', 'Founder Connect', 'Pitch & Capital Connect', 'Partnerships', 'Community', 'Blog & Insights', 'Newsletter'];

  const filteredMappings = mappingsList.filter((m) => {
    if (activeFilterPage === 'All') return true;
    return m.page === activeFilterPage;
  });

  const startEditing = (mapping) => {
    setEditingKey(mapping.key);
    setTempUrl(mapping.url);
    setTempAlt(mapping.alt || '');
    setTempPosition(mapping.position || 'center');
    setTempFit(mapping.fit || 'cover');
  };

  const handleSave = async (key) => {
    await updateMediaMapping(key, {
      url: tempUrl,
      alt: tempAlt,
      position: tempPosition,
      fit: tempFit
    });
    setEditingKey(null);
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const mediaItem = await uploadMediaFile(file, {
        category: 'Website Visual Asset',
        alt: tempAlt || file.name
      });
      setTempUrl(mediaItem.url);
      showToast('Image uploaded and set as active candidate. Click Save to persist.', 'info');
    } catch (err) {
      showToast('Upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-stone-900">
            Website Media & Visual Management
          </h2>
          <p className="text-xs text-stone-500">
            Replace any public website photograph live across sections without modifying code. Changes persist instantly in database.
          </p>
        </div>

        {/* Page Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setActiveFilterPage(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                activeFilterPage === p
                  ? 'bg-[#101010] text-[#D8C39A] shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-[#E8E5DF]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Assets Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMappings.map((mapping) => {
          const isCurrentEditing = editingKey === mapping.key;
          const previewUrl = isCurrentEditing ? tempUrl : mapping.url;

          return (
            <div
              key={mapping.key}
              className="bg-white rounded-2xl border border-[#E8E5DF] overflow-hidden shadow-xs hover:border-[#C5A46D]/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Info */}
                <div className="p-4 border-b border-[#F2EFE9] flex items-center justify-between bg-[#FAF7F2]">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#A9874D] block">
                      {mapping.page} • {mapping.section}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 font-heading">
                      {mapping.role}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 rounded font-mono text-[9px] bg-stone-200 text-stone-700">
                    {mapping.key}
                  </span>
                </div>

                {/* Image Preview Container */}
                <div className="relative aspect-[16/9] bg-stone-950 overflow-hidden group">
                  <img
                    src={previewUrl}
                    alt={isCurrentEditing ? tempAlt : mapping.alt}
                    style={{
                      objectPosition: isCurrentEditing ? tempPosition : mapping.position || 'center',
                      objectFit: isCurrentEditing ? tempFit : mapping.fit || 'cover'
                    }}
                    className="w-full h-full"
                  />
                  
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-white font-mono">
                    {isCurrentEditing ? `${tempPosition} • ${tempFit}` : `${mapping.position || 'center'} • ${mapping.fit || 'cover'}`}
                  </div>

                  {isCurrentEditing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                      <div className="bg-white/95 p-3 rounded-xl text-center space-y-1 shadow-lg">
                        <span className="text-xs font-bold text-stone-900 block">Previewing New Visual</span>
                        <p className="text-[10px] text-stone-500">Configure positioning and click "Save Changes" below.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Configuration Controls */}
                <div className="p-4 space-y-3">
                  {isCurrentEditing ? (
                    <div className="space-y-3 text-xs bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E5DF]">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Image URL or Local Upload</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder="https://... or /uploads/..."
                            className="flex-1 px-2.5 py-1.5 text-xs border border-stone-300 rounded bg-white"
                          />
                          <label className="px-3 py-1.5 bg-[#101010] text-white text-xs font-semibold rounded cursor-pointer hover:bg-stone-800 flex items-center gap-1 shrink-0">
                            <Upload className="w-3.5 h-3.5 text-[#C5A46D]" />
                            <span>{isUploading ? '...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/svg+xml"
                              onChange={(e) => handleFileUpload(e, mapping.key)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">Image Position</label>
                          <select
                            value={tempPosition}
                            onChange={(e) => setTempPosition(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-stone-300 rounded bg-white"
                          >
                            <option value="center">Center</option>
                            <option value="top">Top</option>
                            <option value="bottom">Bottom</option>
                            <option value="left">Left</option>
                            <option value="right">Right</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">Display Fit Mode</label>
                          <select
                            value={tempFit}
                            onChange={(e) => setTempFit(e.target.value)}
                            className="w-full px-2 py-1.5 text-xs border border-stone-300 rounded bg-white"
                          >
                            <option value="cover">Cover (Fill Frame)</option>
                            <option value="contain">Contain (Full Aspect)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Alt Text / Accessibility</label>
                        <input
                          type="text"
                          value={tempAlt}
                          onChange={(e) => setTempAlt(e.target.value)}
                          placeholder="Meaningful description of photograph..."
                          className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-600 space-y-1">
                      <p className="line-clamp-1">
                        <strong>Alt Text:</strong> {mapping.alt || 'Default visual description'}
                      </p>
                      <p className="text-[11px] text-stone-400 font-mono break-all">
                        {mapping.url}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
                {isCurrentEditing ? (
                  <>
                    <button
                      onClick={() => setEditingKey(null)}
                      className="px-3 py-1.5 border border-stone-300 rounded text-xs text-stone-600 hover:text-black cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(mapping.key)}
                      className="px-4 py-1.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5 text-[#C5A46D]" />
                      <span>Save Changes</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(mapping)}
                        className="px-3.5 py-1.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-semibold rounded cursor-pointer transition-colors"
                      >
                        Replace Image
                      </button>

                      {mapping.history && mapping.history.length > 0 && (
                        <button
                          onClick={() => revertMediaMapping(mapping.key)}
                          className="px-2.5 py-1.5 border border-stone-300 hover:border-stone-500 text-stone-700 text-xs rounded cursor-pointer transition-colors flex items-center gap-1"
                          title="Revert to previously used photograph"
                        >
                          <RotateCcw className="w-3 h-3 text-[#A9874D]" />
                          <span>Revert</span>
                        </button>
                      )}
                    </div>

                    <a
                      href={mapping.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-stone-400 hover:text-stone-700 font-medium flex items-center gap-1"
                    >
                      <span>Open full</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
