import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import LottiePlayer from '../components/LottiePlayer';
import { Compass, Search, Plus, Mail, Calendar, MapPin, Tag, CheckCircle2 } from 'lucide-react';

export default function OpportunitiesPage() {
  const { opportunities, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const categories = [
    'All',
    'Cofounder Opportunities',
    'Hiring',
    'Pilot Customers',
    'Partnerships',
    'Mentorship',
    'Business Collaboration',
    'Professional Services',
    'Workspace Opportunities'
  ];

  const [formData, setFormData] = useState({
    title: '',
    category: 'Cofounder Opportunities',
    company: '',
    contactEmail: '',
    description: '',
    location: 'Gurugram (Hybrid)',
    expiryDate: '2026-06-30',
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitOpportunity = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.contactEmail || !formData.consent) {
      showToast('Please fill all required fields and consent', 'error');
      return;
    }

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'pending' // Admin review required!
        })
      });
      if (res.ok) {
        setSubmitted(true);
        showToast('Opportunity submitted for radar verification!', 'success');
      }
    } catch (err) {
      showToast('Failed to post opportunity', 'error');
    }
  };

  const approvedOpps = (opportunities || []).filter((o) => o.status === 'approved');

  const filtered = approvedOpps.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || opp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="Founder Opportunity Radar — 7 Horse Ventures"
        description="Browse co-founder openings, pilot customer calls, strategic alliances, and hiring requests within the 7 Horse Ventures ecosystem."
        canonicalUrl="/opportunities"
      />

      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="hidden sm:block shrink-0">
                <LottiePlayer preset="radar" size={72} />
              </div>
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-mono text-[#C5A46D]">
                  Collaborative marketplace
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
                  Founder Opportunity Radar
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                  A verified noticeboard for co-founder searches, early B2B pilot trials, strategic partnerships, and technical talent needs across ecosystems.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSubmitModal(true);
                setSubmitted(false);
              }}
              className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold rounded transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center btn-press shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post an opportunity</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-[#E8E5DF] sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:border-[#C5A46D] focus:outline-none bg-[#FAF7F2]"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-stone-500 uppercase">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium border border-stone-300 rounded bg-white text-stone-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-white rounded-2xl p-6 border border-[#E8E5DF] hover:border-[#C5A46D] transition-all shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#FAF7F2] text-[#A9874D] border border-[#E8E5DF]">
                        {opp.category}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        Valid until {opp.expiryDate}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-stone-900 font-heading leading-snug">
                      {opp.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="font-semibold text-stone-700">{opp.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#A9874D]" />
                        {opp.location}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-500">Verified by 7H Team</span>
                    <a
                      href={`mailto:${opp.contactEmail}?subject=Inquiry regarding 7H Opportunity: ${opp.title}`}
                      className="px-3 py-1.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-[#C5A46D]" />
                      <span>Contact Poster</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#E8E5DF] text-xs text-stone-600 max-w-md mx-auto space-y-2">
              <Compass className="w-8 h-8 text-[#A9874D] mx-auto" />
              <p className="font-bold text-stone-800">No active opportunities matching filter.</p>
              <p>Post your cofounder search or pilot call to connect with members.</p>
            </div>
          )}
        </div>
      </section>

      {/* Post Opportunity Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 border border-[#C5A46D]/40 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
              <h3 className="text-base font-bold text-stone-900 font-heading">
                Post an Opportunity to the Radar
              </h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-stone-400 hover:text-black text-sm font-bold">
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-3 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] animate-fadeIn">
                <div className="mx-auto flex justify-center">
                  <LottiePlayer preset="success" size={54} />
                </div>
                <h4 className="text-sm font-bold text-stone-900">Opportunity Logged for Curation</h4>
                <p className="text-xs text-stone-600">
                  Our team reviews all listings to prevent unsolicited recruitment spam before activating them on the radar.
                </p>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-[#101010] text-white text-xs font-bold rounded cursor-pointer btn-press"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitOpportunity} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Opportunity Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seeking Founding Growth Marketer for B2B FinTech"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                    >
                      <option>Cofounder Opportunities</option>
                      <option>Hiring</option>
                      <option>Pilot Customers</option>
                      <option>Partnerships</option>
                      <option>Mentorship</option>
                      <option>Business Collaboration</option>
                      <option>Workspace Opportunities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nexus Logix"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="founder@venture.in"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Location / Format</label>
                    <input
                      type="text"
                      placeholder="e.g. Gurugram (In-Person) or Remote"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Description & Requirements *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Clearly outline what you are looking for, what you offer (equity/salary/pilot terms), and preferred timeline..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="opp-consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                  />
                  <label htmlFor="opp-consent" className="text-[11px] text-stone-600">
                    I confirm this opportunity is genuine, professional, and compliant with community standards.
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
                    Post listing
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
