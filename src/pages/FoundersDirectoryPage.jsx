import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import { Users, Search, Plus, ExternalLink, Globe, MapPin, Building, CheckCircle2 } from 'lucide-react';

export default function FoundersDirectoryPage() {
  const { founders, setFounders, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // New Founder Form
  const [formData, setFormData] = useState({
    name: '',
    profilePhoto: '',
    role: 'Founder & CEO',
    startup: '',
    industry: 'Enterprise Software & SaaS',
    city: 'Gurugram',
    bio: '',
    website: '',
    linkedin: '',
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startup || !formData.consent) {
      showToast('Please fill required fields and consent', 'error');
      return;
    }

    try {
      const res = await fetch('/api/founders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          profilePhoto: formData.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          status: 'pending' // Admin review required!
        })
      });
      if (res.ok) {
        setSubmitted(true);
        showToast('Founder profile submitted for ecosystem curation review!', 'success');
      }
    } catch (err) {
      showToast('Failed to submit profile', 'error');
    }
  };

  // Only approved founders are public (Part 8 requirement)
  const approvedFounders = (founders || []).filter((f) => f.status === 'approved');

  const filteredFounders = approvedFounders.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.startup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || f.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="Founder Directory — 7 Horse Ventures"
        description="Discover vetted founders and startup builders across Gurugram, Delhi, and Noida."
        canonicalUrl="/founders"
      />

      {/* Header (Compact py-12 sm:py-16) */}
      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono text-[#C5A46D]">
                Community roster
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
                Founder Directory
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                Discover active builders building products, technologies, and services across sectors and communities.
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
              <span>List your profile</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 bg-white border-b border-[#E8E5DF] sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by founder, startup, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:border-[#C5A46D] focus:outline-none bg-[#FAF7F2]"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-semibold text-stone-500 uppercase">Hub:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded bg-white text-stone-800"
              >
                <option value="All">All Locations</option>
                <option value="Gurugram">Gurugram</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Noida">Noida</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFounders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFounders.map((f, idx) => (
                <ScrollReveal key={f.id} delay={Math.min(idx * 60, 360)}>
                  <div
                    className="bg-white rounded-2xl p-6 border border-[#E8E5DF] hover:border-[#C5A46D] transition-all duration-200 card-shadow-lift flex flex-col justify-between space-y-4 h-full"
                  >
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <img
                        src={f.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={f.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E8E5DF] shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h3 className="text-base font-bold text-stone-900 font-heading">{f.name}</h3>
                        <p className="text-xs font-medium text-[#A9874D]">{f.role} at {f.startup}</p>
                        <div className="flex items-center gap-1 text-[11px] text-stone-500">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{f.city}</span>
                        </div>
                      </div>
                    </div>

                    <span className="inline-block px-2 py-0.5 bg-[#FAF7F2] text-[#A9874D] text-[10px] font-medium rounded border border-[#E8E5DF]">
                      {f.industry}
                    </span>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {f.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    {f.website ? (
                      <a
                        href={f.website}
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

                    {f.linkedin && (
                      <a
                        href={f.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#C5A46D] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF] text-xs text-stone-600 max-w-md mx-auto space-y-2">
              <Users className="w-8 h-8 text-[#A9874D] mx-auto" />
              <p className="font-bold text-stone-800">No approved founders matching filter.</p>
              <p>Be the first to list your profile for the next cohort edition.</p>
            </div>
          )}
        </div>
      </section>

      {/* Submit Founder Profile Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-[#C5A46D]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-base font-bold text-stone-900 font-heading">
                Submit Profile for Founder Directory
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-stone-400 hover:text-black text-sm font-bold">
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF]">
                <CheckCircle2 className="w-10 h-10 text-[#C5A46D] mx-auto" />
                <h4 className="text-sm font-bold text-stone-900">Profile Logged for Curation Review</h4>
                <p className="text-xs text-stone-600">
                  To safeguard high signal and prevent spam, all directory profiles are reviewed by our community team before publication.
                </p>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-[#101010] text-white text-xs font-bold rounded cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman Verma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="Founder & CEO"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Startup / Venture Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pulse AI"
                      value={formData.startup}
                      onChange={(e) => setFormData({ ...formData, startup: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">City Hub</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                    >
                      <option>Gurugram</option>
                      <option>New Delhi</option>
                      <option>Noida</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Short Founder Bio *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Briefly state your venture's core value proposition and mission..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
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
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="fnd-consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                  />
                  <label htmlFor="fnd-consent" className="text-[11px] text-stone-600">
                    I approve the public display of this information on the 7 Horse Ventures directory following admin review.
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
                    Submit for review
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
