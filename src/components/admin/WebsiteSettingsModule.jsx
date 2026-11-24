import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function WebsiteSettingsModule() {
  const { websiteSettings, setWebsiteSettings, showToast, currentUser } = useApp();

  const [form, setForm] = useState(websiteSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          adminUser: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setWebsiteSettings(updated);
        showToast('Platform settings saved successfully', 'success');
      }
    } catch (err) {
      showToast('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSectionToggle = (key) => {
    setForm((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: !prev.sectionVisibility?.[key]
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Platform & Website Configuration</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure global brand identity, announcement ribbon, WhatsApp community group, and section visibility.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Brand Details */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#C5A46D]" />
            <span>Brand Identity & Contact Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Brand Name</label>
              <input
                type="text"
                value={form.brandName || '7 Horse Ventures'}
                onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Official Tagline</label>
              <input
                type="text"
                value={form.tagline || 'Connect. Build. Grow. Scale.'}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Official Contact Email</label>
              <input
                type="email"
                value={form.contactEmail || 'connect@7horseventures.com'}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Support Phone</label>
              <input
                type="text"
                value={form.contactPhone || '+91 124 490 XXXX'}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-stone-300 font-medium">WhatsApp Community Group Link</label>
              <input
                type="url"
                value={form.whatsappCommunityPlaceholder || ''}
                onChange={(e) => setForm({ ...form, whatsappCommunityPlaceholder: e.target.value })}
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono text-[11px]"
                placeholder="https://chat.whatsapp.com/..."
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar Settings */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A46D]" />
              <span>Announcement Ribbon</span>
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.announcement?.active ?? true}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, active: e.target.checked }
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A46D]"></div>
            </label>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Announcement Message</label>
              <input
                type="text"
                value={form.announcement?.text || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, text: e.target.value }
                  })
                }
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-stone-300 font-medium">Target Link URL</label>
              <input
                type="text"
                value={form.announcement?.link || '/events'}
                onChange={(e) =>
                  setForm({
                    ...form,
                    announcement: { ...form.announcement, link: e.target.value }
                  })
                }
                className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Homepage Section Visibility Toggles */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C5A46D]" />
            <span>Homepage Section Visibility Toggles</span>
          </h3>
          <p className="text-xs text-stone-400">
            Control which structural modules appear on the public homepage without code modification.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              { key: 'hero', label: 'Hero Showcase' },
              { key: 'intro', label: 'Introductory Thesis' },
              { key: 'audience', label: 'Audience Segments' },
              { key: 'ecosystem', label: 'Ecosystem Pillars' },
              { key: 'flagship', label: 'Flagship Programs' },
              { key: 'differentiators', label: 'Value Differentiators' },
              { key: 'partnerships', label: 'Corporate Alliances' },
              { key: 'vision', label: 'Ecosystem Vision' },
              { key: 'cta', label: 'Membership Call to Action' }
            ].map((section) => {
              const isVisible = form.sectionVisibility?.[section.key] !== false;
              return (
                <div
                  key={section.key}
                  onClick={() => handleSectionToggle(section.key)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isVisible
                      ? 'bg-[#181818] border-[#C5A46D]/40 text-white'
                      : 'bg-[#141414] border-[#252525] text-stone-500'
                  }`}
                >
                  <span className="font-medium">{section.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isVisible ? 'bg-emerald-950/70 text-emerald-400' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
