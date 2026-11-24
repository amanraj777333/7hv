import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Globe,
  Save,
  CheckCircle2,
  Share2,
  FileCode,
  ExternalLink
} from 'lucide-react';

export default function SeoSettingsModule() {
  const { websiteSettings, setWebsiteSettings, showToast, currentUser } = useApp();

  const [selectedPage, setSelectedPage] = useState('home');
  const [saving, setSaving] = useState(false);

  // Default SEO profiles
  const [seoConfig, setSeoConfig] = useState(
    websiteSettings.seoConfig || {
      home: {
        title: '7 Horse Ventures — Connect. Build. Grow. Scale.',
        description:
          "Delhi NCR's connected ecosystem for founders, entrepreneurs, investors, and corporate innovators.",
        keywords: 'startup ecosystem Delhi NCR, Gurugram founders, venture networking, pitch capital connect',
        canonicalUrl: 'https://7horseventures.com/',
        ogImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
      },
      events: {
        title: 'Founder Cohorts & Flagship Events | 7 Horse Ventures',
        description: 'Curated in-person founder roundtables, closed investor dinners, and pitch showcases across Delhi NCR.',
        keywords: 'startup events Gurugram, Delhi investor meetups, Noida founder networking',
        canonicalUrl: 'https://7horseventures.com/events',
        ogImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'
      },
      insights: {
        title: 'Venture Insights & Strategic Playbooks | 7 Horse Ventures',
        description: 'Editorial perspectives on scaling, cross-border capital, and early-stage execution in India.',
        keywords: 'venture capital India, startup playbooks, Delhi NCR founder insights',
        canonicalUrl: 'https://7horseventures.com/insights',
        ogImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80'
      }
    }
  );

  const currentPageData = seoConfig[selectedPage] || seoConfig.home;

  const handleFieldChange = (field, val) => {
    setSeoConfig((prev) => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [field]: val
      }
    }));
  };

  const handleSaveSeo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...websiteSettings,
          seoConfig,
          adminUser: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        showToast('SEO settings saved successfully', 'success');
      }
    } catch (err) {
      showToast('Error saving SEO settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">SEO & Social Meta Configuration</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Optimize titles, meta tags, OpenGraph social sharing previews, and canonical URLs.
          </p>
        </div>
        <button
          onClick={handleSaveSeo}
          disabled={saving}
          className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Meta Settings'}</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 border-b border-[#282828] pb-3">
        {[
          { key: 'home', label: 'Homepage' },
          { key: 'events', label: 'Events (/events)' },
          { key: 'insights', label: 'Insights (/insights)' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedPage(tab.key)}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedPage === tab.key ? 'bg-[#C5A46D] text-[#101010]' : 'bg-[#181818] text-stone-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor & Live SERP Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-[#C5A46D]" />
            <span>Search Engine Metadata</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Meta Title *</label>
              <input
                type="text"
                value={currentPageData.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
              <div className="text-[10px] text-stone-500 text-right">
                {(currentPageData.title || '').length} / 60 characters
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Meta Description *</label>
              <textarea
                rows="3"
                value={currentPageData.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
              <div className="text-[10px] text-stone-500 text-right">
                {(currentPageData.description || '').length} / 160 characters
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Target Keywords (comma-separated)</label>
              <input
                type="text"
                value={currentPageData.keywords || ''}
                onChange={(e) => handleFieldChange('keywords', e.target.value)}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Canonical URL</label>
              <input
                type="url"
                value={currentPageData.canonicalUrl || ''}
                onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Social OG Share Image URL</label>
              <input
                type="url"
                value={currentPageData.ogImage || ''}
                onChange={(e) => handleFieldChange('ogImage', e.target.value)}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Right: Real-time SERP & Social Preview */}
        <div className="space-y-4">
          {/* Google SERP Preview */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Google SERP Preview</span>
            </h3>
            <div className="bg-[#1d1d1d] p-4 rounded-lg border border-[#2a2a2a] space-y-1">
              <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1.5">
                <span>{currentPageData.canonicalUrl || 'https://7horseventures.com'}</span>
              </div>
              <div className="text-base font-medium text-blue-400 hover:underline cursor-pointer line-clamp-1">
                {currentPageData.title || '7 Horse Ventures'}
              </div>
              <div className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                {currentPageData.description || 'Delhi NCR venture ecosystem.'}
              </div>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>LinkedIn & Social Share Preview</span>
            </h3>
            <div className="bg-[#1d1d1d] rounded-lg border border-[#2a2a2a] overflow-hidden">
              {currentPageData.ogImage && (
                <img
                  src={currentPageData.ogImage}
                  alt="OG Preview"
                  className="w-full h-36 object-cover border-b border-[#2a2a2a]"
                />
              )}
              <div className="p-3">
                <div className="text-[10px] text-[#C5A46D] uppercase font-bold tracking-wider">7horseventures.com</div>
                <div className="text-sm font-semibold text-white mt-0.5 line-clamp-1">{currentPageData.title}</div>
                <div className="text-xs text-stone-400 line-clamp-2 mt-1">{currentPageData.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
