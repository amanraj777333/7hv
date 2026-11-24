import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Share2,
  Lock,
  ArrowLeft
} from 'lucide-react';

export default function AcademyDetailPage({ sessionId }) {
  const { academySessions, registerAcademy, navigate, showToast, theme } = useApp();

  const isDark = theme === 'dark';

  // Find session by id or slug
  const session = (academySessions || []).find((s) => s.id === sessionId || s.slug === sessionId);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    role: 'Founder / Co-Founder',
    questionsForSpeaker: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!session) {
    return (
      <div className={`min-h-[70vh] flex items-center justify-center py-16 px-4 ${
        isDark ? 'bg-[#101010] text-[#F7F5F0]' : 'bg-[#F7F5F0] text-[#101010]'
      }`}>
        <div className={`text-center space-y-4 max-w-md p-8 rounded-2xl border ${
          isDark ? 'bg-[#161616] border-[#2A2A2A]' : 'bg-white border-[#E8E5DF]'
        }`}>
          <BookOpen className="w-10 h-10 text-[#C5A46D] mx-auto" />
          <h2 className="text-xl font-bold font-heading">Academy Session Not Found</h2>
          <p className="text-xs text-stone-500">
            The requested session could not be located or has been archived.
          </p>
          <button
            onClick={() => navigate('/academy')}
            className="px-5 py-2.5 bg-[#C5A46D] text-black text-xs font-semibold rounded cursor-pointer btn-press"
          >
            Back to Academy Schedule
          </button>
        </div>
      </div>
    );
  }

  const isOnline = session.format === 'Online';
  const isHybrid = session.format === 'Hybrid';

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+91|91|0)?[6789]\d{9}$/.test(cleaned) || cleaned.length >= 8;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
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
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);

    const res = await registerAcademy({
      sessionId: session.id,
      sessionTitle: session.title,
      ...formData
    });

    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || 'Registration failed. Please try again.');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Session link copied to clipboard', 'info');
    }
  };

  return (
    <div className={`min-h-screen py-10 sm:py-16 transition-colors duration-200 ${
      isDark ? 'bg-[#101010] text-[#F7F5F0]' : 'bg-[#F7F5F0] text-[#101010]'
    }`}>
      <SEO
        title={`${session.title} — 7 Horse Academy`}
        description={session.shortDescription}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link & Share */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/academy')}
            className={`text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Academy Masterclasses</span>
          </button>

          <button
            onClick={handleShare}
            className={`p-2 border rounded text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
              isDark ? 'border-stone-800 text-stone-300 hover:text-white hover:bg-white/5' : 'border-stone-300 text-stone-700 hover:text-black hover:bg-stone-100'
            }`}
            title="Share session"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Session</span>
          </button>
        </div>

        {/* Main Grid: Details (Left) + Registration Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column (Session Description, Curriculum, Speaker) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header Block */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-[#C5A46D] text-black">
                  {session.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${
                  isOnline
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/20'
                    : isHybrid
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/20'
                      : 'bg-blue-950/80 text-blue-300 border-blue-500/20'
                }`}>
                  {session.format} Format
                </span>
                {session.targetAudience && (
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono border ${
                    isDark ? 'bg-stone-900 text-stone-300 border-stone-800' : 'bg-stone-200/60 text-stone-700 border-stone-300'
                  }`}>
                    {session.targetAudience}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-heading leading-tight">
                {session.title}
              </h1>

              <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                {session.shortDescription}
              </p>
            </div>

            {/* Quick Metadata Card */}
            <div className={`p-5 rounded-2xl border grid grid-cols-1 sm:grid-cols-3 gap-4 ${
              isDark ? 'bg-[#161616] border-[#262626]' : 'bg-white border-[#E8E5DF]'
            }`}>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#C5A46D]/15 text-[#C5A46D] shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-stone-500 block">Date & Time</span>
                  <span className="text-xs font-semibold block">{session.displayDate || new Date(session.dateTime).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#C5A46D]/15 text-[#C5A46D] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-stone-500 block">Duration</span>
                  <span className="text-xs font-semibold block">{session.duration || '2 Hours'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#C5A46D]/15 text-[#C5A46D] shrink-0">
                  {isOnline ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-[11px] font-mono text-stone-500 block">Location / Platform</span>
                  <span className="text-xs font-semibold block line-clamp-1">{session.locationOrLink}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {session.coverImage && (
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-stone-500/20 shadow-xs">
                <img
                  src={session.coverImage}
                  alt={session.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Curriculum & In-Depth Overview */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
              isDark ? 'bg-[#161616] border-[#262626]' : 'bg-white border-[#E8E5DF]'
            }`}>
              <h2 className="text-lg font-bold font-heading">
                Session Curriculum & Overview
              </h2>
              <div className={`text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-line ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}>
                {session.fullDescription}
              </div>
            </div>

            {/* Key Takeaways */}
            {session.keyTakeaways && session.keyTakeaways.length > 0 && (
              <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#161616] border-[#262626]' : 'bg-white border-[#E8E5DF]'
              }`}>
                <h3 className="text-base font-bold font-heading">
                  What You Will Take Away
                </h3>
                <ul className="space-y-2.5">
                  {session.keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                      <span className={isDark ? 'text-stone-300' : 'text-stone-700'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Speaker / Mentor Profile */}
            {session.speaker && (
              <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#161616] border-[#262626]' : 'bg-white border-[#E8E5DF]'
              }`}>
                <span className="text-xs font-mono text-[#C5A46D] block">
                  Faculty & Mentor Profile
                </span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={session.speaker.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={session.speaker.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#C5A46D]"
                  />
                  <div>
                    <h4 className="text-base font-bold font-heading">{session.speaker.name}</h4>
                    <span className="text-xs text-[#C5A46D] font-medium block">
                      {session.speaker.role} • {session.speaker.organization}
                    </span>
                    <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      {session.speaker.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Registration Card (Sticky on desktop) */}
          <div className="lg:col-span-5 sticky top-[100px]">
            <div className={`p-6 sm:p-8 rounded-2xl border shadow-xl space-y-6 ${
              isDark ? 'bg-[#161616] border-[#262626]' : 'bg-white border-[#E8E5DF]'
            }`}>
              
              <div>
                <span className="text-xs font-mono text-[#C5A46D] block">
                  Session Pass
                </span>
                <h3 className="text-xl font-bold font-heading mt-1">
                  Reserve Your Seat
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {session.status === 'upcoming'
                    ? `Limited capacity (${session.capacity || 50} seats). Pre-screening applied.`
                    : 'This session is completed. Register below to receive playbooks & future cohort alerts.'}
                </p>
              </div>

              {submitted ? (
                <div className={`p-6 rounded-xl border text-center space-y-4 ${
                  isDark ? 'bg-[#1A1A1A] border-[#C5A46D]/40' : 'bg-[#FAF7F2] border-[#C5A46D]'
                }`}>
                  <LottiePlayer preset="success" size={64} className="mx-auto" />
                  <h4 className="text-lg font-bold font-heading">Registration Confirmed</h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
                    Thank you, <strong>{formData.fullName}</strong>. Your seat for <em>"{session.title}"</em> has been reserved. You will receive an email and calendar invitation with session links.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-[#C5A46D] underline font-semibold cursor-pointer btn-press"
                  >
                    Register another participant
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs rounded-md">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                        isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="radhika@venture.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                        isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Mobile (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98100 XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                        isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Organization / Venture Name</label>
                    <input
                      type="text"
                      placeholder="e.g. HyperLogix or Delhi University"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                        isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Your Track / Profile</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                        isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                      }`}
                    >
                      <option>Founder / Co-Founder</option>
                      <option>Aspiring Entrepreneur / Student</option>
                      <option>Domain Professional / SME Owner</option>
                      <option>Angel Investor / Syndicate Member</option>
                      <option>Operator / Product Lead</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Questions for Faculty <span className="text-stone-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific scenario or query you want addressed during the session?"
                      value={formData.questionsForSpeaker}
                      onChange={(e) => setFormData({ ...formData, questionsForSpeaker: e.target.value })}
                      className={`w-full px-3 py-2 text-xs rounded border transition-colors focus:border-[#C5A46D] focus:outline-none ${
                        isDark ? 'bg-[#1C1C1C] border-[#333333] text-white' : 'bg-[#FAF7F2] border-[#D5D1C8] text-[#101010]'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 btn-press"
                  >
                    <span>{isSubmitting ? 'Confirming Registration...' : 'Confirm Session Registration'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className={`text-[11px] text-center ${isDark ? 'text-stone-500' : 'text-stone-500'}`}>
                    Confirmed registrations receive direct calendar invites and reminder links.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
