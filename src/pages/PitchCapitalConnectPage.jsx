import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Lock,
  ArrowRight,
  Eye,
  FileText,
  UserCheck,
  Briefcase
} from 'lucide-react';

export default function PitchCapitalConnectPage() {
  const { addSubmission, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('startup'); // 'startup' | 'investor' | 'guest'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Startup Form
  const [startupForm, setStartupForm] = useState({
    founderName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    sector: 'Fintech / Payments',
    stage: 'Seed / Pre-Series A',
    arrTraction: '',
    pitchDeckUrl: '',
    problemSolution: '',
    targetRaise: '',
    consent: false
  });

  // 2. Investor Form
  const [investorForm, setInvestorForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: 'Angel Investor',
    checkSize: '₹10L – ₹25L',
    sectors: '',
    linkedin: '',
    consent: false
  });

  // 3. Guest Form
  const [guestForm, setGuestForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: 'Ecosystem Observer',
    intent: '',
    consent: false
  });

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+91|91|0)?[6789]\d{9}$/.test(cleaned);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleStartupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!startupForm.founderName.trim()) {
      setErrorMsg('Please enter founder name.');
      return;
    }
    if (!validateEmail(startupForm.email)) {
      setErrorMsg('Please enter a valid work email.');
      return;
    }
    if (!validatePhone(startupForm.phone)) {
      setErrorMsg('Please provide a valid Indian mobile number.');
      return;
    }
    if (!startupForm.companyName.trim()) {
      setErrorMsg('Please enter company name.');
      return;
    }
    if (!startupForm.consent) {
      setErrorMsg('Please acknowledge the pitch screening & transparency terms.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addSubmission('Pitch Connect — Startup Application', startupForm);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Startup application logged securely! Our screening committee will review.', 'success');
    }, 600);
  };

  const handleInvestorSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!investorForm.name.trim() || !validateEmail(investorForm.email) || !validatePhone(investorForm.phone)) {
      setErrorMsg('Please complete all required contact fields with valid details.');
      return;
    }
    if (!investorForm.consent) {
      setErrorMsg('Please accept the accredited investor acknowledgement.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addSubmission('Pitch Connect — Investor Registration', investorForm);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Investor registration received. We will connect with credentials.', 'success');
    }, 600);
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!guestForm.name.trim() || !validateEmail(guestForm.email) || !validatePhone(guestForm.phone)) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    if (!guestForm.consent) {
      setErrorMsg('Please accept the attendance terms.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addSubmission('Pitch Connect — Guest Pass Request', guestForm);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Guest pass request submitted.', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="7H Pitch & Capital Connect — Transparent Startup Presentation Forum"
        description="A private presentation forum connecting pre-screened seed startups with angel syndicates and seed funds. Zero pay-to-pitch fees."
        canonicalUrl="/pitch-capital-connect"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-14 sm:py-18 border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1D1D1D] border border-[#2c2c2c] text-xs text-[#D8C39A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
              <span>Private capital & founder showcase</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Curated startup pitch showcases with zero pay-to-play fees
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Selected early-stage companies present structured 7-minute showcases directly to accredited angel syndicates and micro-VCs. No presentation fees, no vanity awards—just direct operator feedback and breakout discussions.
            </p>
          </div>
        </div>
      </section>

      {/* Critical Transparency & Ethics Notice (Strict Prompt Mandate) */}
      <section className="py-8 bg-[#181818] text-[#E8E5DF] border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 bg-[#101010] border border-[#C5A46D]/30 rounded-2xl flex flex-col md:flex-row items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#C5A46D]/15 text-[#D8C39A] shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 text-xs text-stone-300">
              <span className="font-semibold text-white text-sm font-heading block">
                Ethical Capital Transparency & Participant Safeguards
              </span>
              <p className="leading-relaxed">
                • <strong>No Guaranteed Selection:</strong> Application submission or prior event attendance does not guarantee selection for pitch showcases.
              </p>
              <p className="leading-relaxed">
                • <strong>No Pay-to-Pitch:</strong> We do not charge presenting startups pitch fees. Payment is never a criterion for selection.
              </p>
              <p className="leading-relaxed">
                • <strong>Independent Investment Decisions:</strong> 7 Horse Ventures is an ecosystem convener, not an investment fund, broker, or financial advisor. Pitch participation does not guarantee funding, commitments, or introductions. All investment decisions are made independently by qualified investors.
              </p>
              <p className="leading-relaxed">
                • <strong>Confidentiality First:</strong> Uploaded pitch decks and non-public revenue figures are strictly protected and never displayed in public galleries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Stage Pitch Process */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-mono text-[#A9874D]">
              Objective selection architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              How Startup Participation Works
            </h2>
            <p className="text-sm text-stone-600">
              Our four-step evaluation ensures that presenting founders receive high-quality attention from aligned investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Application & Submission",
                desc: "Founders submit company profile, core problem/solution, traction indicators, and a confidential pitch deck link."
              },
              {
                step: "02",
                title: "Ecosystem Screening",
                desc: "Our screening panel reviews applications for unit economics, market size, product readiness, and team conviction."
              },
              {
                step: "03",
                title: "Selection & Pitch Prep",
                desc: "8 selected startups receive pitch preparation feedback, agenda scheduling, and presentation rehearsal notes."
              },
              {
                step: "04",
                title: "Showcase & Direct Breakout",
                desc: "Present 7-minute pitch + 5-minute Q&A to accredited angels, followed by private 1-on-1 breakout conversations."
              }
            ].map((p) => (
              <div key={p.step} className="p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] space-y-2">
                <span className="text-xs font-mono font-bold text-[#A9874D]">STEP {p.step}</span>
                <h3 className="text-base font-bold text-[#101010] font-heading">{p.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Track Participation Forms */}
      <section className="py-16 lg:py-20 bg-[#F7F5F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-8">
            <span className="text-xs font-mono text-[#A9874D]">
              Participation portals
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Choose Your Participation Track
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Select your role below to submit the relevant details to our curation desk.
            </p>
          </div>

          {/* Track Selector Tabs */}
          <div className="flex p-1.5 bg-white rounded-xl border border-[#E8E5DF] mb-8 max-w-lg mx-auto shadow-xs">
            <button
              onClick={() => {
                setActiveTab('startup');
                setSubmitted(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'startup'
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Apply as a Startup
            </button>
            <button
              onClick={() => {
                setActiveTab('investor');
                setSubmitted(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'investor'
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Register as Investor / Mentor
            </button>
            <button
              onClick={() => {
                setActiveTab('guest');
                setSubmitted(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'guest'
                  ? 'bg-[#101010] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Attend as Guest
            </button>
          </div>

          {/* Submission Feedback Message with Lottie Celebration */}
          {submitted ? (
            <div className="p-8 bg-white border-2 border-[#C5A46D] rounded-2xl text-center space-y-4 shadow-sm animate-fadeIn">
              <div className="mx-auto flex justify-center">
                <LottiePlayer preset="success" size={56} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-heading">
                {activeTab === 'startup' && 'Startup Pitch Application Submitted'}
                {activeTab === 'investor' && 'Investor Accreditation Logged'}
                {activeTab === 'guest' && 'Guest Attendance Registered'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you for submitting your details. Our review committee will verify information and respond within 3–4 business days with next steps.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#A9874D] font-bold underline cursor-pointer btn-press"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E5DF] shadow-md">
              {errorMsg && (
                <div className="p-3 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              {/* TRACK 1: STARTUP FORM */}
              {activeTab === 'startup' && (
                <form onSubmit={handleStartupSubmit} className="space-y-5">
                  <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8E5DF] text-xs text-stone-600 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#A9874D] shrink-0" />
                    <span>Your deck and financial metrics will remain strictly confidential and will not be displayed publicly.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Founder / Submitter Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Rohan Varma"
                        value={startupForm.founderName}
                        onChange={(e) => setStartupForm({ ...startupForm, founderName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Official / Founder Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="rohan@startuphq.in"
                        value={startupForm.email}
                        onChange={(e) => setStartupForm({ ...startupForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number (India) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 99990 XXXXX"
                        value={startupForm.phone}
                        onChange={(e) => setStartupForm({ ...startupForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Startup Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex HealthTech"
                        value={startupForm.companyName}
                        onChange={(e) => setStartupForm({ ...startupForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Industry Sector</label>
                      <select
                        value={startupForm.sector}
                        onChange={(e) => setStartupForm({ ...startupForm, sector: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                      >
                        <option>Fintech / Payments</option>
                        <option>Enterprise SaaS / AI</option>
                        <option>D2C / Consumer Brands</option>
                        <option>HealthTech & Diagnostics</option>
                        <option>Supply Chain & Logistics</option>
                        <option>CleanTech & Energy</option>
                        <option>DeepTech & Hardware</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Current Funding Stage</label>
                      <select
                        value={startupForm.stage}
                        onChange={(e) => setStartupForm({ ...startupForm, stage: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                      >
                        <option>Bootstrapped / Profitable</option>
                        <option>Pre-seed / Angel Funded</option>
                        <option>Seed / Pre-Series A</option>
                        <option>Series A Ready</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Pitch Deck URL (Google Drive / DocSend / Notion) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/... or DocSend link (view access)"
                      value={startupForm.pitchDeckUrl}
                      onChange={(e) => setStartupForm({ ...startupForm, pitchDeckUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Problem & Solution Summary (2–3 sentences)</label>
                    <textarea
                      rows={2}
                      placeholder="Explain the specific market pain point and how your product addresses it uniquely..."
                      value={startupForm.problemSolution}
                      onChange={(e) => setStartupForm({ ...startupForm, problemSolution: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="startup-consent"
                      required
                      checked={startupForm.consent}
                      onChange={(e) => setStartupForm({ ...startupForm, consent: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                    />
                    <label htmlFor="startup-consent" className="text-[11px] text-stone-600 leading-normal">
                      I understand that submitting an application does not guarantee selection, and presenting does not guarantee funding. Investment decisions remain strictly independent between participating investors and founders.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Verifying submission...' : 'Submit pitch application'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                  </button>
                </form>
              )}

              {/* TRACK 2: INVESTOR FORM */}
              {activeTab === 'investor' && (
                <form onSubmit={handleInvestorSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Amit Singhania"
                        value={investorForm.name}
                        onChange={(e) => setInvestorForm({ ...investorForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="amit@capital.in"
                        value={investorForm.email}
                        onChange={(e) => setInvestorForm({ ...investorForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98100 XXXXX"
                        value={investorForm.phone}
                        onChange={(e) => setInvestorForm({ ...investorForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Organisation / Syndicate</label>
                      <input
                        type="text"
                        placeholder="e.g. Angel Syndicate / Family Office / VC"
                        value={investorForm.organization}
                        onChange={(e) => setInvestorForm({ ...investorForm, organization: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Role</label>
                      <select
                        value={investorForm.role}
                        onChange={(e) => setInvestorForm({ ...investorForm, role: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                      >
                        <option>Individual Angel Investor</option>
                        <option>Syndicate Lead / Manager</option>
                        <option>Venture Capital Partner / Associate</option>
                        <option>Family Office Investment Officer</option>
                        <option>Seasoned Operator & Mentor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Typical Sweet Spot Check Size</label>
                      <select
                        value={investorForm.checkSize}
                        onChange={(e) => setInvestorForm({ ...investorForm, checkSize: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                      >
                        <option>₹5L – ₹10L</option>
                        <option>₹10L – ₹25L</option>
                        <option>₹25L – ₹50L</option>
                        <option>₹50L – ₹1 Crore+</option>
                        <option>Mentor / Advisory only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={investorForm.linkedin}
                      onChange={(e) => setInvestorForm({ ...investorForm, linkedin: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="inv-consent"
                      required
                      checked={investorForm.consent}
                      onChange={(e) => setInvestorForm({ ...investorForm, consent: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                    />
                    <label htmlFor="inv-consent" className="text-[11px] text-stone-600 leading-normal">
                      I confirm that I evaluate investments independently and understand that 7 Horse Ventures does not provide investment recommendations, warranties, or vetting to an investment standard.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Processing...' : 'Register as investor / mentor'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                  </button>
                </form>
              )}

              {/* TRACK 3: GUEST FORM */}
              {activeTab === 'guest' && (
                <form onSubmit={handleGuestSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Deepika Gupta"
                        value={guestForm.name}
                        onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="deepika@organisation.org"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile (India) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 97110 XXXXX"
                        value={guestForm.phone}
                        onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Organisation / Background</label>
                      <input
                        type="text"
                        placeholder="e.g. University / Policy / Corporate"
                        value={guestForm.organization}
                        onChange={(e) => setGuestForm({ ...guestForm, organization: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Reason for Attending</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Ecosystem research, corporate exploration, partnership discussion..."
                      value={guestForm.intent}
                      onChange={(e) => setGuestForm({ ...guestForm, intent: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="guest-consent"
                      required
                      checked={guestForm.consent}
                      onChange={(e) => setGuestForm({ ...guestForm, consent: e.target.checked })}
                      className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                    />
                    <label htmlFor="guest-consent" className="text-[11px] text-stone-600 leading-normal">
                      I agree to abide by the event observer protocol and non-disclosure expectations regarding presenting startups.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Submitting...' : 'Request guest pass'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                  </button>
                </form>
              )}

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
