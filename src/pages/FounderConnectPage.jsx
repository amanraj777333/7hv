import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import {
  Users,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';

export default function FounderConnectPage() {
  const { addSubmission, showToast, getImage } = useApp();
  const overviewImg = getImage(
    'founder_connect.overview.image',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    'Founders engaged at 7H Founder Connect'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startupName: '',
    stage: 'Early Traction / Seed',
    industry: 'Enterprise Software / SaaS',
    city: 'Gurugram',
    linkedin: '',
    mainChallenge: '',
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

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please provide a valid Indian mobile number (e.g. +91 98765 43210).');
      return;
    }
    if (!formData.startupName.trim()) {
      setErrorMsg('Please enter your startup or company name.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please acknowledge the cohort participation consent terms.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission('Founder Connect Application', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Founder Connect application received! We will be in touch shortly.', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="7H Founder Connect — High-Signal Founder & Business Networking"
        description="Good Conversations. Meaningful Connections. New Possibilities. Join closed-door networking roundtables for founders across Gurugram, Delhi, and Noida."
        canonicalUrl="/founder-connect"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-14 sm:py-18 border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1D1D1D] border border-[#2c2c2c] text-xs text-[#D8C39A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
              <span>Flagship peer networking forum</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Closed-door founder roundtables with zero sales pitches
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              An intimate room limited to 30 to 50 verified builders across Gurugram, Delhi, and Noida. We screen every attendee and structure discussions around customer distribution, unit economics, and hiring mechanics.
            </p>
          </div>
        </div>
      </section>

      {/* Overview & What to Expect */}
      <section className="py-14 sm:py-18 border-b border-[#E8E5DF] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-12">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono text-[#A9874D]">
                Format architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
                Structured to Cut Through the Noise
              </h2>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                Most networking events fail because they leave interaction to chance. Founders stand awkwardly with drinks in hand or endure unsolicited sales pitches from random agencies.
              </p>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                7H Founder Connect eliminates this entirely. We pre-screen attendees, limit group sizes to 30-50 verified builders, and introduce structured roundtables centered around specific operational topics such as distribution, hiring, and revenue mechanics.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E8E5DF]">
                <img
                  src={overviewImg.url}
                  alt={overviewImg.alt}
                  style={{ objectPosition: overviewImg.position, objectFit: overviewImg.fit }}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>

          {/* What to Expect Grid */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#101010] font-heading">
              What to Expect at Each Gathering
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Founder Introductions",
                  desc: "Clear, stage-aligned introductions without vanity titles. Understand immediately what each peer is building, their traction, and where they need help."
                },
                {
                  title: "Structured Networking",
                  desc: "Facilitated small-group breakout circles with specific discussion prompts, preventing awkward silences and ensuring everyone speaks."
                },
                {
                  title: "Business Conversations",
                  desc: "Candid discussions on real metrics, vendor negotiations, regulatory hurdles, and practical lessons from the operational trenches."
                },
                {
                  title: "Knowledge-Sharing Sessions",
                  desc: "Brief 15-minute tactical case studies presented by experienced operators on what worked, what failed, and key takeaways."
                },
                {
                  title: "Expert Discussions",
                  desc: "Direct access to select domain specialists in corporate law, tax compliance, growth marketing, and fractional CFO advisory."
                },
                {
                  title: "Collaboration Opportunities",
                  desc: "Direct pairing of complementary founders for pilot partnerships, co-marketing experiments, and customer introductions."
                }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] space-y-2">
                  <div className="w-8 h-8 rounded bg-[#101010] text-[#D8C39A] text-xs font-mono font-bold flex items-center justify-center">
                    0{i + 1}
                  </div>
                  <h4 className="text-base font-bold text-[#101010] font-heading">
                    {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Visual Event Journey (Prompt Requirement) */}
      <section className="py-16 sm:py-20 bg-[#101010] text-white border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-mono text-[#C5A46D]">
              Attendee lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold font-heading">
              The 7H Founder Connect Event Journey
            </h2>
            <p className="text-sm text-stone-400">
              A continuous path from initial registration to lasting peer accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "01", name: "Registration", desc: "Submit profile & specific challenge for cohort curation." },
              { step: "02", name: "Introductions", desc: "Private briefing & targeted peer matchings before arrival." },
              { step: "03", name: "Discussions", desc: "Moderated thematic roundtables & deep operational dives." },
              { step: "04", name: "Networking", desc: "Unstructured reception with peer founders & invited experts." },
              { step: "05", name: "Community", desc: "Ongoing peer group access, recap notes, & cross-city invites." }
            ].map((st) => (
              <div key={st.step} className="p-5 bg-[#181818] border border-[#242424] rounded-xl text-center space-y-2">
                <span className="text-xs font-mono font-medium text-[#C5A46D]">Step {st.step}</span>
                <h4 className="text-sm font-semibold text-white font-heading">{st.name}</h4>
                <p className="text-xs text-stone-400">{st.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Who Should Attend Section */}
      <section className="py-14 sm:py-18 bg-[#F7F5F0] border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-10 space-y-3">
            <span className="text-xs font-mono text-[#A9874D]">
              Cohort composition
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Who Should Attend?
            </h2>
            <p className="text-sm text-stone-600">
              Each session brings together an intentional balance of builders across seven profiles:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Startup Founders (Seed to Series A)",
              "Bootstrapped Entrepreneurs",
              "SME Business Owners & Manufacturers",
              "Aspiring Founders with Prototype/Idea",
              "Select University Student Builders",
              "Corporate Innovation Leaders",
              "Vetted Professional Service Providers"
            ].map((role, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-[#E8E5DF] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#A9874D] shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-stone-800 leading-snug">
                  {role}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dedicated Interactive Registration Form */}
      <section id="register" className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-mono text-[#A9874D]">
              Priority application
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Register Your Interest for the Next Cohort
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Applications are reviewed on a rolling basis. Selected founders will receive an official calendar invitation and venue pass.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#FAF7F2] border-2 border-[#C5A46D] rounded-2xl text-center space-y-4 animate-fadeIn">
              <div className="mx-auto flex justify-center">
                <LottiePlayer preset="success" size={56} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-heading">
                Application Received Successfully
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.name}</strong>. Our cohort curation team will review your venture details and confirm attendance availability for the upcoming session via email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9874D] font-bold underline cursor-pointer btn-press"
              >
                Submit another application
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
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary / Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number (India) *
                  </label>
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
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Startup / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zenith Mobility"
                    value={formData.startupName}
                    onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Venture Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Idea / Prototype</option>
                    <option>Pre-revenue / MVP Built</option>
                    <option>Early Traction / Seed</option>
                    <option>Growth / Series A+</option>
                    <option>Profitable SME / Established Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preferred Hub
                  </label>
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
                    <option>Online Session</option>
                    <option>Flexible / Any Location</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  LinkedIn Profile or Company Website
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  What is your biggest operational focus or bottleneck right now?
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Hiring high-quality engineering talent in Gurugram, enterprise sales cycles, finding early distribution partners..."
                  value={formData.mainChallenge}
                  onChange={(e) => setFormData({ ...formData, mainChallenge: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fc-consent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                />
                <label htmlFor="fc-consent" className="text-[11px] text-stone-600 leading-normal">
                  I consent to 7 Horse Ventures reviewing my application for cohort suitability and contacting me regarding event details. I acknowledge that registration does not guarantee entry without written confirmation.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Submitting details...' : 'Register your interest'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                </button>
              </div>
            </form>
          )}

        </div>
      </section>
    </div>
  );
}
