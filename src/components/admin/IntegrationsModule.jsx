import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Save,
  CheckCircle2,
  Layers,
  Key,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function IntegrationsModule() {
  const { websiteSettings, setWebsiteSettings, showToast, currentUser } = useApp();

  const [integrations, setIntegrations] = useState(
    websiteSettings.integrations || {
      ga4: { active: true, id: 'G-7HORSE2026' },
      gsc: { active: true, verificationToken: 'gsc_auth_7horse_delhincr_verified' },
      metaPixel: { active: true, pixelId: '982348274928' },
      linkedinTag: { active: true, partnerId: '6392018' },
      whatsappApi: { active: true, phoneId: '911244900000' },
      razorpay: { active: false, keyId: 'rzp_live_configure_keys' },
      resendEmail: { active: true, senderDomain: 'brief.7horseventures.com' }
    }
  );

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...websiteSettings,
          integrations,
          adminUser: currentUser?.name || 'Admin'
        })
      });
      if (res.ok) {
        showToast('Integration keys updated', 'success');
      }
    } catch (err) {
      showToast('Error saving integrations', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Third-Party Ecosystem Integrations</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure analytics tracking IDs, pixels, email gateways, and payment infrastructure.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Integrations'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* GA4 */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C5A46D]" />
              <span>Google Analytics 4</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              Connected
            </span>
          </div>
          <div>
            <label className="text-stone-400 font-medium">Measurement ID</label>
            <input
              type="text"
              value={integrations.ga4?.id || ''}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  ga4: { ...integrations.ga4, id: e.target.value }
                })
              }
              className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono"
            />
          </div>
        </div>

        {/* LinkedIn Insight Tag */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C5A46D]" />
              <span>LinkedIn Insight Tag</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              Connected
            </span>
          </div>
          <div>
            <label className="text-stone-400 font-medium">Partner ID</label>
            <input
              type="text"
              value={integrations.linkedinTag?.partnerId || ''}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  linkedinTag: { ...integrations.linkedinTag, partnerId: e.target.value }
                })
              }
              className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono"
            />
          </div>
        </div>

        {/* WhatsApp Cloud */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C5A46D]" />
              <span>WhatsApp Cloud API</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              Ready
            </span>
          </div>
          <div>
            <label className="text-stone-400 font-medium">Verified Phone Number ID</label>
            <input
              type="text"
              value={integrations.whatsappApi?.phoneId || ''}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  whatsappApi: { ...integrations.whatsappApi, phoneId: e.target.value }
                })
              }
              className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono"
            />
          </div>
        </div>

        {/* Resend Email Domain */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C5A46D]" />
              <span>Resend / SMTP Gateway</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              Verified
            </span>
          </div>
          <div>
            <label className="text-stone-400 font-medium">Verified Sending Domain</label>
            <input
              type="text"
              value={integrations.resendEmail?.senderDomain || ''}
              onChange={(e) =>
                setIntegrations({
                  ...integrations,
                  resendEmail: { ...integrations.resendEmail, senderDomain: e.target.value }
                })
              }
              className="w-full mt-1 bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
