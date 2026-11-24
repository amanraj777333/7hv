import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import {
  Rocket,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
  Target
} from 'lucide-react';

export default function ForFoundersPage() {
  const { addSubmission, showToast } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: 'Enterprise Software & SaaS',
    stage: 'Early Traction / Seed',
    city: 'Gurugram',
    url: '',
    reason: '',
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
    if (!validateEmail(formData.email)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please provide a valid Indian mobile number (e.g. +91 98111 XXXXX).');
      return;
    }
    if (!formData.companyName.trim()) {
      setErrorMsg('Please enter your startup or company name.');
      return;
    }
    if (!formData.reason.trim()) {
      setErrorMsg('Please state your primary reason for joining.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please accept the founder member terms and consent checkbox.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission('Founder Registration', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Founder profile enrolled successfully! Welcome to 7 Horse Ventures.', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="For Founders — Build Your Business With a Stronger Network"
        description="Connect with other founders, participate in curated networking roundtables, discover business opportunities, and explore capital showcases."
        canonicalUrl="/for-founders"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-14 sm:py-18 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-[#C5A46D]">
              Founder empowerment
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Build your business with peer accountability, not vanity networking
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Direct access to vetted founders navigating the same unit economics, accredited angel syndicates, and enterprise pilot partners across innovation hubs and online sessions.
            </p>
          </div>
        </div>
      </section>

      {/* 7 Core Benefits Grid */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-2">
            <span className="text-xs font-mono text-[#A9874D]">
              Ecosystem advantages
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Why Founders Join 7 Horse Ventures
            </h2>
            <p className="text-sm text-stone-600">
              Concrete utility designed specifically around the realities of building an Indian enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Connect with Other Founders",
                desc: "Engage with fellow builders navigating the exact same growth hurdles in hiring, sales cycles, and local logistics."
              },
              {
                title: "Participate in Networking Events",
                desc: "Gain priority invitations to closed-door roundtables and thematic dinners hosted in Gurugram, Delhi, and Noida."
              },
              {
                title: "Discover Business Opportunities",
                desc: "Direct access to enterprise pilot programs, vendor partnerships, and co-marketing channels within our network."
              },
              {
                title: "Share Your Startup Journey",
                desc: "Contribute insights to peer founders, build credibility, and gain high-signal visibility across the community."
              },
              {
                title: "Learn From Experienced Professionals",
                desc: "Receive actionable guidance on corporate legal structures, ESOPs, tax compliance, and finance from seasoned practitioners."
              },
              {
                title: "Participate in Selected Pitch Opportunities",
                desc: "Apply to showcase your company in our private 7H Pitch & Capital Connect forums before active angel syndicates."
              }
            ].map((b, idx) => (
              <div key={idx} className="p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] space-y-2">
                <div className="w-8 h-8 rounded bg-[#101010] text-[#D8C39A] text-xs font-mono font-bold flex items-center justify-center">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-[#101010] font-heading">{b.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Registration Form Section */}
      <section className="py-16 lg:py-20 bg-[#F7F5F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-mono text-[#A9874D]">
              Member enrollment
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Join as a Founder
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Complete your founder profile to receive ecosystem access, event invitations, and peer introductions.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-white border-2 border-[#C5A46D] rounded-2xl text-center space-y-4 shadow-lg animate-fadeIn">
              <div className="mx-auto flex justify-center">
                <LottiePlayer preset="success" size={56} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-heading">
                Founder Application Received
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Welcome, <strong>{formData.fullName}</strong>. Your profile for <strong>{formData.companyName}</strong> has been saved. We will review your submission and email your onboarding details.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9874D] font-bold underline cursor-pointer btn-press"
              >
                Submit another response
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
                    placeholder="Aditi Sen"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Work / Primary Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="aditi@venture.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (India) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98111 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Startup / Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Omnia AI"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Industry Sector</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Enterprise Software & SaaS</option>
                    <option>Fintech & Financial Infrastructure</option>
                    <option>D2C, Retail & Consumer Tech</option>
                    <option>HealthTech & Life Sciences</option>
                    <option>Logistics, Mobility & Supply Chain</option>
                    <option>Agritech & Rural Commerce</option>
                    <option>Hardware, IoT & Manufacturing</option>
                    <option>Other / Multi-Sector</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Business Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Idea / Validating Prototype</option>
                    <option>Pre-revenue / MVP Launched</option>
                    <option>Early Traction / Seed</option>
                    <option>Growth / Pre-Series A</option>
                    <option>Series A and Beyond</option>
                    <option>Profitable SME / Established Business</option>
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
                    <option>Greater Noida / Faridabad</option>
                    <option>Other Indian City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Website or LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Main Reason for Joining 7 Horse Ventures *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us what you hope to gain and how you would like to participate in founder roundtables..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ff-consent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                />
                <label htmlFor="ff-consent" className="text-[11px] text-stone-600 leading-normal">
                  I consent to 7 Horse Ventures securely holding my details to coordinate founder community invitations, communications, and relevant ecosystem connections.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Enrolling profile...' : 'Join as a founder'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
              </button>
            </form>
          )}

        </div>
      </section>
    </div>
  );
}
