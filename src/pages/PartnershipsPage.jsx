import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import LottiePlayer from '../components/LottiePlayer';
import ScrollReveal from '../components/ScrollReveal';
import {
  Calendar,
  Users,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Handshake,
  MessageSquare,
  Globe
} from 'lucide-react';

export default function PartnershipsPage() {
  const { addSubmission, showToast, navigate } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    collaborationType: 'Organise an event together',
    cityOrFormat: 'In-Person / Flexible',
    message: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(?:\+91|91|0)?[6789]\d{9}$/.test(cleaned) || cleaned.length >= 8;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
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
    if (!formData.message.trim()) {
      setErrorMsg('Please share a brief note on what you would like to collaborate on.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please check the consent checkbox.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission('Collaboration Proposal', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Collaboration proposal received! We will be in touch shortly.', 'success');
    }, 500);
  };

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="Collaborate with Us — 7 Horse Ventures"
        description="Organise an event together, collaborate on an initiative, bring your community together, or share an idea with 7 Horse Ventures."
        canonicalUrl="/collaborate"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-14 sm:py-18 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-[#C5A46D]">
              Open collaboration & initiatives
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Let's build something together
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Whether you want to organise an event together, launch a collaborative initiative, bring your community together, or discuss a fresh idea, our door is always open.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#collaboration-form"
                className="px-5 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold rounded transition-colors cursor-pointer"
              >
                Share your idea
              </a>
              <button
                onClick={() => navigate('/events')}
                className="px-5 py-2.5 bg-transparent hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-700 rounded text-xs font-medium transition-colors cursor-pointer"
              >
                Explore events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Four Collaboration Pathways */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-3">
            <span className="text-xs font-mono text-[#A9874D]">
              How we work together
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Four Ways to Collaborate
            </h2>
            <p className="text-sm text-stone-600">
              We welcome founders, community organizers, creators, institutions, and organizations to partner with us across formats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                title: "Organise an event together",
                desc: "Co-host founder roundtables, pitch evenings, domain masterclasses, or networking sessions in your city or online."
              },
              {
                icon: Sparkles,
                title: "Collaborate on an initiative",
                desc: "Partner on focused founder programs, knowledge playbooks, sector teardowns, or ecosystem projects."
              },
              {
                icon: Users,
                title: "Bring your community together",
                desc: "Connect your community members with our network to share experiences, exchange insights, and open doors."
              },
              {
                icon: Lightbulb,
                title: "Discuss an idea or synergy",
                desc: "Have a unique concept, venue, or opportunity? Let's have an informal conversation to explore possibilities."
              }
            ].map((track, idx) => {
              const Icon = track.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 0.08}>
                  <div className="p-6 bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] space-y-3 flex flex-col justify-between card-shadow-lift hover-lift h-full">
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-[#101010] text-[#D8C39A] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#101010] font-heading">
                        {track.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {track.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collaboration Philosophy */}
      <section className="py-14 sm:py-16 bg-[#F7F5F0] border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-mono text-[#A9874D]">
                Our ethos
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
                Collaboration built on mutual respect and value
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                We believe the most enduring partnerships are founded on shared values, clear expectations, and real outcomes for participants.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "People & experiences first",
                  desc: "We prioritize thoughtful human interactions and practical peer takeaways over surface-level promotions."
                },
                {
                  title: "Zero unsolicited sales pitches",
                  desc: "Our rooms and forums are safe spaces for honest discussion, not aggressive sales environments."
                },
                {
                  title: "Flexible & open formats",
                  desc: "We support physical meetups, online forums, and hybrid sessions across cities and communities."
                },
                {
                  title: "Transparent & straightforward",
                  desc: "No complicated bureaucracy or opaque processes. Just direct communication between teams."
                }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-white rounded-xl border border-[#E8E5DF] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C5A46D] shrink-0" />
                    <h4 className="text-xs font-bold text-stone-900">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed pl-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simple Collaboration Form */}
      <section id="collaboration-form" className="py-14 sm:py-18 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-mono text-[#A9874D]">
              Direct channel
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
              Start a Conversation
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Tell us a little bit about yourself and what you would like to create together.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-[#FAF7F2] border border-[#C5A46D] rounded-2xl text-center space-y-4 shadow-sm animate-fadeIn">
              <div className="mx-auto flex justify-center">
                <LottiePlayer preset="success" size={56} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-heading">
                Thank You for Reaching Out
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                We've received your note, <strong>{formData.name}</strong>. Our team will review your proposal and get in touch to discuss next steps.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-[#101010] text-white text-xs font-medium rounded hover:bg-stone-800 transition-colors cursor-pointer btn-press"
                >
                  Send another message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E8E5DF] space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="priyanshu@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98100 XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Organisation / Community / Role (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Founder, Creator, Community Lead"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">How would you like to collaborate? *</label>
                  <select
                    value={formData.collaborationType}
                    onChange={(e) => setFormData({ ...formData, collaborationType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Organise an event together</option>
                    <option>Collaborate on an initiative</option>
                    <option>Bring your community together</option>
                    <option>Co-host a workshop or session</option>
                    <option>Discuss an idea or explore synergies</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Format / Location Preference</label>
                  <select
                    value={formData.cityOrFormat}
                    onChange={(e) => setFormData({ ...formData, cityOrFormat: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>In-Person (Specific City)</option>
                    <option>Online Session / Webinar</option>
                    <option>Hybrid Format</option>
                    <option>Open / Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tell us about what you have in mind *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share a short summary of the idea, audience, or initiative you would like to discuss..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="collab-consent"
                  required
                  checked={formData.consent}
                  onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                  className="mt-0.5 rounded text-[#C5A46D] focus:ring-[#C5A46D]"
                />
                <label htmlFor="collab-consent" className="text-[11px] text-stone-600 leading-normal">
                  I agree to be contacted by 7 Horse Ventures regarding this collaboration proposal.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold text-xs rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Collaboration Proposal'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
