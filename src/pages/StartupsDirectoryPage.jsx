import React, { useState } from 'react';
import { useApp, API_BASE } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import { Rocket, Search, Plus, ExternalLink, MapPin, CheckCircle2 } from 'lucide-react';

export default function StartupsDirectoryPage() {
  const { startups, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    description: '',
    industry: 'Enterprise SaaS',
    stage: 'Seed',
    founderName: '',
    city: 'Gurugram',
    website: '',
    demoLink: '',
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitStartup = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.founderName || !formData.consent) {
      showToast('Please fill required fields', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/startups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logo: formData.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
          status: 'pending' // Admin review required!
        })
      });
      if (res.ok) {
        setSubmitted(true);
        showToast('Startup submitted for directory review!', 'success');
      }
    } catch (err) {
      showToast('Failed to submit startup', 'error');
    }
  };

  const approvedStartups = (startups || []).filter((s) => s.status === 'approved');

  const filtered = approvedStartups.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === 'All' || s.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="Startup Directory — 7 Horse Ventures"
        description="Discover vetted startups, early-stage ventures, and scaleups across sectors and regions."
        canonicalUrl="/startups"
      />

      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono text-[#C5A46D]">
                Venture showcase
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
                Startup Directory
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                Discover emerging enterprises across enterprise software, clean mobility, supply chain, fintech, and consumer products.
              </p>
            </div>

            <button
              onClick={() => {
                setShowSubmitModal(true);
                setSubmitted(false);
              }}
              className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List your startup</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-[#E8E5DF] sticky top-[72px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search startups, sector, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:border-[#C5A46D] focus:outline-none bg-[#FAF7F2]"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-stone-500 uppercase">Stage:</span>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded bg-white text-stone-800"
              >
                <option value="All">All Stages</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Early Traction">Early Traction</option>
                <option value="Series A+">Series A+</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, idx) => (
                <ScrollReveal key={s.id} delay={Math.min(idx * 60, 360)}>
                  <div
                    className="bg-white rounded-2xl p-6 border border-[#E8E5DF] hover:border-[#C5A46D] transition-all duration-200 card-shadow-lift flex flex-col justify-between space-y-4 h-full"
                  >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={s.logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'}
                          alt={s.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E8E5DF]"
                        />
                        <div>
                          <h3 className="text-base font-bold text-stone-900 font-heading">{s.name}</h3>
                          <span className="text-[11px] text-stone-500 font-medium">{s.city}</span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF7F2] text-[#A9874D] border border-[#E8E5DF]">
                        {s.stage}
                      </span>
                    </div>

                    <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-medium rounded">
                      {s.industry}
                    </span>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {s.description}
                    </p>

                    <div className="text-[11px] text-stone-500">
                      Founder: <strong className="text-stone-800">{s.founderName}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    {s.website ? (
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-700 hover:text-black font-semibold flex items-center gap-1"
                      >
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span />
                    )}

                    {s.demoLink && (
                      <a
                        href={s.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A9874D] hover:underline font-bold"
                      >
                        Try Demo →
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF] text-xs text-stone-600 max-w-md mx-auto space-y-2">
              <Rocket className="w-8 h-8 text-[#A9874D] mx-auto" />
              <p className="font-bold text-stone-800">No approved startups matching filter.</p>
              <p>Be the first to list your company for ecosystem discovery.</p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Startup Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-[#C5A46D]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-base font-bold text-stone-900 font-heading">
                Submit Startup for Directory
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-stone-400 hover:text-black text-sm font-bold">
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF]">
                <CheckCircle2 className="w-10 h-10 text-[#C5A46D] mx-auto" />
                <h4 className="text-sm font-bold text-stone-900">Startup Submitted for Review</h4>
                <p className="text-xs text-stone-600">
                  Our ecosystem team will review the venture details and publish it to the directory.
                </p>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-[#101010] text-white text-xs font-bold rounded cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitStartup} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Startup Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Helix Robotics"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Founder / Submitter Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meera Kapoor"
                      value={formData.founderName}
                      onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Industry Sector</label>
                    <input
                      type="text"
                      placeholder="e.g. CleanTech, SaaS, Logistics"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Stage</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                    >
                      <option>Pre-Seed</option>
                      <option>Seed</option>
                      <option>Early Traction</option>
                      <option>Series A+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Venture Description *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe your product, market pain point, and core value..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Product Demo Link</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.demoLink}
                      onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="stp-consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                  />
                  <label htmlFor="stp-consent" className="text-[11px] text-stone-600">
                    I confirm that I am authorized to submit this startup and accept public display upon review.
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 border border-stone-300 rounded text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors"
                  >
                    Submit startup
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
