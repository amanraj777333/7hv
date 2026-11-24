import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import LottiePlayer from '../components/LottiePlayer';
import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe,
  Clock,
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const { addSubmission, showToast, settings } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    enquiryType: 'General Enquiries',
    message: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const enquiryCategories = [
    'General Enquiries',
    'Founder Participation',
    'Startup Applications',
    'Investor and Mentor Interest',
    'Corporate Partnerships',
    'Sponsorship Enquiries',
    'Institutional Collaborations'
  ];

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
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please provide a valid Indian mobile number.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your message.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please accept the consent terms.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addSubmission('Contact Desk Enquiry', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Enquiry received! We will respond within 24–48 hours.', 'success');
    }, 600);
  };

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="Contact Us — Direct Ecosystem Desks | 7 Horse Ventures"
        description="Get in touch with 7 Horse Ventures for founder participation, investor inquiries, collaborations, and community initiatives."
        canonicalUrl="/contact"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-14 sm:py-18 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-[#C5A46D]">
              Official communication desk
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Connect with the 7 Horse Ventures team
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Whether you are an entrepreneur looking to join a roundtable, an investor seeking emerging ventures, or an enterprise exploring strategic partnership, our regional team responds within 24 to 48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Layout: Left Details, Right Form */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Official Placeholders & Transparency */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#A9874D]">
                  Reach us directly
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
                  Ecosystem Presence & Desks
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  7 Horse Ventures operates across active startup corridors, partner hubs, and interactive virtual desks.
                </p>
              </div>

              {/* Verified Contact Details (Honest Placeholders) */}
              <div className="space-y-4">
                <div className="p-5 bg-white rounded-xl border border-[#E8E5DF] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#A9874D] flex items-center justify-center shrink-0 border border-[#E8E5DF]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-stone-500 block">
                      Official email
                    </span>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-sm font-semibold text-[#101010] hover:text-[#A9874D] transition-colors break-all"
                    >
                      {settings.contactEmail}
                    </a>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Response within 24–48 business hours
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-[#E8E5DF] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#A9874D] flex items-center justify-center shrink-0 border border-[#E8E5DF]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-stone-500 block">
                      Presence & reach
                    </span>
                    <span className="text-sm font-semibold text-[#101010] block">
                      In-Person Hubs & Online Forums
                    </span>
                    <span className="text-[11px] text-stone-500 block mt-0.5">
                      Roundtables and cohort gatherings hosted in curated partner spaces and interactive digital sessions.
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-white rounded-xl border border-[#E8E5DF] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#A9874D] flex items-center justify-center shrink-0 border border-[#E8E5DF]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-stone-500 block">
                      Desk hours
                    </span>
                    <span className="text-sm font-semibold text-[#101010] block">
                      Monday to Friday: 10:00 AM – 6:30 PM IST
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Integrity Pledge */}
              <div className="p-5 bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl text-xs text-stone-600 space-y-1.5">
                <span className="font-bold text-[#101010] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#A9874D]" />
                  <span>Privacy & Verification Guarantee</span>
                </span>
                <p className="leading-relaxed">
                  We do not publish false telephone numbers or fabricate office locations. Your enquiry is handled by an authorized ecosystem coordinator.
                </p>
              </div>
            </div>

            {/* Right Column: Functional Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E5DF] shadow-md">
                <div className="mb-6 space-y-1">
                  <h3 className="text-xl font-bold text-[#101010] font-heading">
                    Send an Official Message
                  </h3>
                  <p className="text-xs text-stone-500">
                    Select your enquiry department so your message is routed to the right team.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 bg-[#FAF7F2] border-2 border-[#C5A46D] rounded-xl text-center space-y-4 animate-fadeIn">
                    <div className="mx-auto flex justify-center">
                      <LottiePlayer preset="success" size={56} />
                    </div>
                    <h4 className="text-lg font-bold text-stone-900 font-heading">
                      Message Dispatched
                    </h4>
                    <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong>{formData.name}</strong>. Your enquiry regarding <em>{formData.enquiryType}</em> has been logged. Our coordinator will contact you at <strong>{formData.email}</strong>.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-[#A9874D] font-bold underline cursor-pointer btn-press"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                        {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sameer Kapoor"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Official / Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="sameer@org.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Mobile Number (India) *
                        </label>
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
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Organisation / Startup Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Veda Innovations"
                          value={formData.organization}
                          onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Enquiry Classification *
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                      >
                        {enquiryCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Your Message / Query *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Please describe how we can assist you or what collaboration you have in mind..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="contact-consent"
                        required
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                      />
                      <label htmlFor="contact-consent" className="text-[11px] text-stone-600 leading-normal">
                        I consent to 7 Horse Ventures processing my details to reply to this enquiry in accordance with the draft privacy terms.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Transmitting...' : 'Send message'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
