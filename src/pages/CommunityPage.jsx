import React, { useState } from 'react';
import { useApp, OFFICIAL_WHATSAPP_LINK } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import {
  Users,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Sparkles,
  BookOpen,
  Calendar,
  Lock
} from 'lucide-react';

export default function CommunityPage() {
  const { addSubmission, showToast, settings, events, setSelectedEventModal } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Founder / Co-Founder',
    city: 'Gurugram',
    organization: '',
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
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please enter a valid Indian mobile number.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please accept the community participation guidelines.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission('Community Membership Application', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Welcome to the 7 Horse Ventures community!', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="Community — Private Peer Network for Founders & Operators | 7 Horse Ventures"
        description="Join 7 Horse Ventures community: founders, students, domain professionals, and investors collaborating across innovation hubs and online circles."
        canonicalUrl="/community"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-14 sm:py-18 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-[#C5A46D]">
              Collective growth
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              The private peer network for India's emerging builders and operators
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              We connect active entrepreneurs, seasoned domain practitioners, and strategic investors through curated peer cohorts, practical problem-solving clinics, and direct collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Community Segments */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-3">
            <span className="text-xs font-mono text-[#A9874D]">
              Sub-communities
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Tailored Ecosystem Circles
            </h2>
            <p className="text-sm text-stone-600">
              We maintain five distinct interaction circles so every member connects with relevant peers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Founder Community",
                who: "Early & Growth Stage Builders",
                desc: "An intimate circle of active startup founders exchanging raw playbooks on sales, hiring, vendor management, and product traction."
              },
              {
                title: "Student & Aspiring Founder Community",
                who: "Next-Gen Innovators",
                desc: "A dedicated launchpad for ambitious university students and first-time builders to learn foundational venture principles and find co-founders."
              },
              {
                title: "Business & Professional Community",
                who: "Domain Specialists & SME Leaders",
                desc: "Chartered accountants, legal counsels, fractional CTOs, HR directors, and traditional business owners bridging expertise with high-growth startups."
              },
              {
                title: "Investor & Mentor Community",
                who: "Capital Allocators & Operators",
                desc: "Angel investors, syndicate leads, and senior tech executives providing strategic mentorship and evaluating emerging regional ventures."
              },
              {
                title: "Corporate & Technology Community",
                who: "Enterprise & Platform Enablers",
                desc: "Leaders from cloud providers, fintech platforms, and coworking chains providing startup credits, infrastructure, and pilot avenues."
              }
            ].map((c, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] space-y-2 card-shadow-lift hover-lift h-full">
                  <span className="text-[11px] font-mono text-[#A9874D] block">
                    {c.who}
                  </span>
                  <h3 className="text-base font-semibold text-[#101010] font-heading">{c.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community Benefits & Guidelines */}
      <section className="py-16 sm:py-20 bg-[#F7F5F0] border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left: Community Benefits */}
            <div className="space-y-6">
              <span className="text-xs font-mono text-[#A9874D]">
                Member value
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
                Community Benefits
              </h2>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9874D] shrink-0 mt-0.5" />
                  <span>Priority access to RSVP for closed-door founder roundtables and mixers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9874D] shrink-0 mt-0.5" />
                  <span>Direct introductions to aligned peers for collaborative pilots and co-working.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9874D] shrink-0 mt-0.5" />
                  <span>Access to masterclasses led by verified legal, finance, and product experts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9874D] shrink-0 mt-0.5" />
                  <span>Quarterly recaps of funding activity and regional venture developments.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A9874D] shrink-0 mt-0.5" />
                  <span>Opportunities to present at private 7H Pitch & Capital Connect showcases.</span>
                </li>
              </ul>
            </div>

            {/* Right: Participation Guidelines */}
            <div className="p-8 bg-white rounded-2xl border border-[#E8E5DF] space-y-4">
              <span className="text-xs font-mono text-[#101010]">
                Code of conduct
              </span>
              <h3 className="text-xl font-semibold text-[#101010] font-heading">
                Participation Guidelines
              </h3>
              <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <p>
                  <strong>1. Zero Unsolicited Pitching:</strong> Our community is a haven for mutual learning and genuine relationship-building. Unsolicited sales pitching or spamming members is strictly prohibited.
                </p>
                <p>
                  <strong>2. Respect & Inclusion:</strong> Treat every fellow member with professionalism and courtesy, irrespective of venture stage, experience, or background.
                </p>
                <p>
                  <strong>3. Confidentiality (Chatham House Rule):</strong> Insights and vulnerabilities shared during private roundtables must not be broadcast or attributed without explicit permission.
                </p>
                <p>
                  <strong>4. Give Before You Ask:</strong> The most respected members are those who contribute feedback, introductions, and encouragement to fellow builders.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WhatsApp Community Connection (Prompt Requirement) */}
      <section className="py-12 bg-[#181818] text-[#E8E5DF] border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-[#101010] border border-[#2b2b2b] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#25D366]/15 text-[#25D366] shrink-0">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  WhatsApp Community Announcement Channel
                </h3>
                <p className="text-xs text-stone-400 max-w-xl mt-1 leading-relaxed">
                  Join our official broadcast circle for verified event notifications and cohort announcements.
                </p>
                <span className="text-[11px] text-stone-500 block mt-1">
                  * Note: Official group link is managed and updated securely via the admin configuration.
                </span>
              </div>
            </div>

            <a
              href={OFFICIAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-semibold rounded transition-colors flex items-center gap-2 cursor-pointer shrink-0 btn-press"
            >
              <span>Join Our WhatsApp Community</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Community Membership Registration Form */}
      <section className="py-16 lg:py-20 bg-[#FFFFFF]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-mono text-[#A9874D]">
              Onboarding
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Register for Community Membership
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Tell us about yourself to join our community directory and receive tailored regional cohort alerts.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#FAF7F2] border-2 border-[#C5A46D] rounded-2xl text-center space-y-4 shadow-lg">
              <LottiePlayer preset="success" size={64} className="mx-auto" />
              <h3 className="text-xl font-bold text-stone-900 font-heading">
                Welcome to 7 Horse Ventures
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. We have registered your profile. You will receive an official email confirmation with details on our upcoming community sessions.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9874D] font-bold underline cursor-pointer btn-press"
              >
                Submit another registration
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#FAF7F2] p-8 sm:p-10 rounded-2xl border border-[#E8E5DF] space-y-5">
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
                    placeholder="Kavita Nair"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="kavita@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile (India) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98110 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. Terra Logic / Delhi University"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Community Track</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Founder / Co-Founder</option>
                    <option>Student / Aspiring Builder</option>
                    <option>Business Professional / Domain Expert</option>
                    <option>Angel Investor / Syndicate Member</option>
                    <option>Corporate Partner / Tech Leader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Location / Hub Preference</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Gurugram</option>
                    <option>New Delhi</option>
                    <option>Noida</option>
                    <option>Bengaluru</option>
                    <option>Mumbai</option>
                    <option>Hyderabad / Pune</option>
                    <option>Online / Remote Member</option>
                    <option>Other City</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  How can you best contribute to or benefit from the community?
                </label>
                <textarea
                  rows={2}
                  placeholder="Share a short note on what you bring to the table and what you are hoping to learn..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="comm-consent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                />
                <label htmlFor="comm-consent" className="text-[11px] text-stone-600 leading-normal">
                  I agree to adhere to the 7 Horse Ventures community guidelines, maintain professional courtesy, and respect fellow builders.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting details...' : 'Join 7 Horse community'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
              </button>
            </form>
          )}

        </div>
      </section>
    </div>
  );
}
