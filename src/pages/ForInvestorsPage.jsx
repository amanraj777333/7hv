import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  Eye,
  FileCheck2,
  Building
} from 'lucide-react';

export default function ForInvestorsPage() {
  const { addSubmission, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    organization: '',
    investmentRole: 'Angel Investor / Syndicate Member',
    areasOfInterest: 'Fintech & Enterprise SaaS',
    preferredStage: 'Seed / Pre-Series A',
    linkedin: '',
    city: 'Open / Flexible',
    message: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+91|91|0)?[6789]\d{9}$/.test(cleaned);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!validateEmail(formData.workEmail)) {
      setErrorMsg('Please enter a valid work email.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please enter a valid Indian mobile number.');
      return;
    }
    if (!formData.organization.trim()) {
      setErrorMsg('Please specify your firm, syndicate, or background.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please review and check the independent investor acknowledgement.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission('Investor Expression of Interest', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Investor expression logged. Our ecosystem team will reach out.', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="For Investors — Discover Emerging Founders & High-Signal Deal-Flow"
        description="Discover Businesses. Engage With Founders. Be Part of the Ecosystem. Join private presentation forums and curated founder roundtables."
        canonicalUrl="/for-investors"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-14 sm:py-18 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-[#C5A46D]">
              Capital & advisory network
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Direct deal-flow and closed-door access to vetted founders
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              We curate unvarnished founder roundtables and early-stage showcases for active angel syndicates, micro-VCs, and family offices—with zero presentation fees or paid listings.
            </p>
          </div>
        </div>
      </section>

      {/* Mandatory Regulatory & Deal-Flow Disclaimer */}
      <section className="py-5 bg-[#181818] border-b border-[#242424] text-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 bg-[#101010] border border-[#C5A46D]/30 rounded-xl flex items-start gap-3.5 text-xs">
            <ShieldCheck className="w-5 h-5 text-[#C5A46D] shrink-0 mt-0.5" />
            <div className="space-y-1 text-stone-300">
              <span className="font-semibold text-white font-heading block">
                Independent Due Diligence & Non-Advisory Notice:
              </span>
              <p className="leading-relaxed">
                7 Horse Ventures does not provide investment recommendations, endorsements, or financial advisory services. We do not guarantee deal flow, business outcomes, or that participating startups have been vetted to an institutional investment standard. All evaluation, due diligence, and capital allocations remain strictly independent between investors and companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Investors Participate */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-3">
            <span className="text-xs font-mono text-[#A9874D]">
              Engagement models
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              How Investors Participate
            </h2>
            <p className="text-sm text-stone-600">
              High-signal touchpoints designed for active investors who value deep context over superficial pitch decks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Curated Networking Experiences",
                desc: "Attend private, closed-door dinners and roundtables with fellow accredited investors, syndicate leads, and venture partners."
              },
              {
                title: "Discover Emerging Startups",
                desc: "Gain early visibility into determined founders building in software, consumer products, deeptech, and industrial supply chains."
              },
              {
                title: "Interact Directly with Builders",
                desc: "Engage in unhurried, candid conversations that allow you to assess founder grit, velocity, and authentic domain conviction."
              },
              {
                title: "Participate in Startup Discussions",
                desc: "Join thematic panel roundtables covering macro venture trends, capital allocation, and governance frameworks in India."
              },
              {
                title: "Share Knowledge & Mentorship",
                desc: "Provide tactical feedback on unit economics, hiring, and market distribution to high-potential early-stage companies."
              },
              {
                title: "Explore Independent Opportunities",
                desc: "Conduct independent conversations and follow-ups with presenting startups with zero intermediary commission or fees."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] space-y-2">
                <div className="w-8 h-8 rounded bg-[#101010] text-[#D8C39A] text-xs font-mono font-bold flex items-center justify-center">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-[#101010] font-heading">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investor Interest Form */}
      <section className="py-16 lg:py-20 bg-[#F7F5F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-mono text-[#A9874D]">
              Accredited network
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Express Investor Interest
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Register your mandate to receive private invitations to upcoming 7H Pitch & Capital Connect showcases.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-white border-2 border-[#C5A46D] rounded-2xl text-center space-y-4 shadow-lg animate-fadeIn">
              <div className="mx-auto flex justify-center">
                <LottiePlayer preset="success" size={56} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-heading">
                Investor Profile Logged
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. We have registered your areas of interest. Our venture relations desk will contact you with private guest invitations for upcoming showcase cohorts.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9874D] font-bold underline cursor-pointer btn-press"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E5DF] shadow-md space-y-5">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sanjay Chawla"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sanjay@venturecapital.in"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (India) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98100 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Organisation / Syndicate *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bluecrest Capital / Angel Syndicate"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Investment Role</label>
                  <select
                    value={formData.investmentRole}
                    onChange={(e) => setFormData({ ...formData, investmentRole: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Angel Investor / Syndicate Member</option>
                    <option>Syndicate Lead / Fund Manager</option>
                    <option>Institutional VC Partner / Associate</option>
                    <option>Family Office Principal</option>
                    <option>Corporate Venture Capital Lead</option>
                    <option>Operator / Ecosystem Mentor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Stage</label>
                  <select
                    value={formData.preferredStage}
                    onChange={(e) => setFormData({ ...formData, preferredStage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Idea / Pre-Seed</option>
                    <option>Seed / Early Traction</option>
                    <option>Pre-Series A / Growth</option>
                    <option>Series A and Beyond</option>
                    <option>Stage Agnostic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">City Hub</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Gurugram</option>
                    <option>New Delhi</option>
                    <option>Noida</option>
                    <option>Bangalore / Mumbai (Travelling)</option>
                    <option>International / Overseas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Areas of Interest / Sector Focus</label>
                <input
                  type="text"
                  placeholder="e.g. B2B Enterprise SaaS, AI workflows, D2C health, Supply chain infra..."
                  value={formData.areasOfInterest}
                  onChange={(e) => setFormData({ ...formData, areasOfInterest: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Message or Specific Mandate Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Share details on your check size, investment horizon, or how you would like to engage with emerging founders..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fi-consent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                />
                <label htmlFor="fi-consent" className="text-[11px] text-stone-600 leading-normal">
                  I understand that 7 Horse Ventures provides an ecosystem connection platform and does not offer investment recommendations or guarantee deal flow. I evaluate all opportunities independently.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting details...' : 'Express investor interest'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
              </button>
            </form>
          )}

        </div>
      </section>
    </div>
  );
}
