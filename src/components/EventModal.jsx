import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LottiePlayer from './LottiePlayer';
import { X, Calendar, Clock, MapPin, Users, CheckCircle2, ShieldAlert, ArrowRight, Download, Printer } from 'lucide-react';

export default function EventModal() {
  const { selectedEventModal, setSelectedEventModal, addSubmission, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: 'Founder / Co-Founder',
    linkedin: '',
    intent: '',
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedEventModal) return null;

  const event = selectedEventModal;
  const isCompleted = event.status === 'Completed';

  const validatePhone = (phone) => {
    // Accepts Indian mobile formats (+91 XXXXXXXXXX, 0XXXXXXXXXX, 10-digits starting with 6,7,8,9)
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const regex = /^(?:\+91|91|0)?[6789]\d{9}$/;
    return regex.test(cleaned);
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
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setErrorMsg('Please provide a valid Indian mobile number (10 digits starting with 6-9, or +91).');
      return;
    }
    if (!formData.company.trim()) {
      setErrorMsg('Please enter your startup or organisation name.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please accept the event participation terms and consent checkbox.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const passId = `7H-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
      const submission = addSubmission('Event RSVP', {
        passId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        ...formData
      });

      setConfirmedPass({
        passId,
        ...formData,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location
      });

      setIsSubmitting(false);
      showToast('Registration submitted! Confirmation generated.', 'success');
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#C5A46D]/30 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedEventModal(null);
            setConfirmedPass(null);
          }}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-stone-800 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Media */}
        <div className="relative aspect-[21/9] w-full bg-stone-900 overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded font-medium bg-[#C5A46D] text-[#101010]">
                {event.format || (event.city?.toLowerCase() === 'online' ? 'Online' : 'In-Person')}
              </span>
              <span className="text-stone-300 font-medium">{event.city}</span>
              {event.organizerType === 'Collaborative' && (
                <span className="px-2 py-0.5 rounded font-medium bg-white/20 text-white text-[11px]">
                  Co-hosted {event.partnerName ? `with ${event.partnerName}` : ''}
                </span>
              )}
              {event.organizerType === 'Partner / Community' && (
                <span className="px-2 py-0.5 rounded font-medium bg-white/20 text-white text-[11px]">
                  Community Host: {event.partnerName || 'Partner'}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold font-heading leading-tight drop-shadow-sm">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* Quick Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#F7F5F0] rounded-xl border border-[#E8E5DF] text-xs">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block font-medium">Date</span>
                <span className="font-semibold text-stone-900">{event.date}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block font-medium">Time</span>
                <span className="font-semibold text-stone-900">{event.time}</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
              <div>
                <span className="text-stone-500 block font-medium">Venue / Format</span>
                <span className="font-semibold text-stone-900 leading-tight">
                  {event.format === 'Online' ? 'Online Session' : event.location}
                </span>
              </div>
            </div>
          </div>

          {/* Online Details Callout */}
          {event.onlineDetails && (
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-blue-950">
                <span>Virtual Meeting Details</span>
              </span>
              <p className="text-blue-800 leading-relaxed font-normal">
                {event.onlineDetails}
              </p>
            </div>
          )}

          {/* Description & Curation Note */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-900 font-heading">
              About this experience
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {event.description}
            </p>
            {event.curationNote && (
              <div className="p-3 bg-[#FAF7F2] border-l-2 border-[#C5A46D] rounded text-xs text-stone-700">
                <span className="font-semibold text-stone-900">Attendance Policy: </span>
                {event.curationNote}
              </div>
            )}
          </div>

          {/* Structured Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-stone-900 font-heading">
                Structured program & flow
              </h3>
              <div className="divide-y divide-[#E8E5DF] border border-[#E8E5DF] rounded-xl overflow-hidden bg-white">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#A9874D] sm:w-44 shrink-0">
                      {item.time}
                    </span>
                    <span className="text-stone-800 font-medium flex-1">
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registration Section or Confirmed Pass */}
          {!isCompleted && !confirmedPass && (
            <div className="pt-6 border-t border-[#E8E5DF] space-y-5">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-heading">
                  Register Your Interest to Attend
                </h3>
                <p className="text-xs text-stone-500">
                  Guest list is curated for relevant ecosystem stakeholders to ensure mutual value.
                </p>
              </div>

              {event.registrationLink && (
                <div className="p-4 bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 font-heading">Official Partner Portal</h4>
                    <p className="text-[11px] text-stone-600">You can also register directly on the host / partner portal.</p>
                  </div>
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#101010] hover:bg-stone-800 text-white text-xs font-semibold rounded shrink-0 flex items-center gap-1.5 self-start sm:self-center"
                  >
                    <span>Register on Partner Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Work / Primary Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="priya@startup.in"
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
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Startup / Company / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nexus Logix"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Primary Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white"
                    >
                      <option>Founder / Co-Founder</option>
                      <option>Angel Investor / Syndicate Member</option>
                      <option>Venture Capital Professional</option>
                      <option>Domain Expert / Advisory Professional</option>
                      <option>Corporate Innovation Lead</option>
                      <option>Student / Aspiring Entrepreneur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      LinkedIn Profile (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    What is your main objective for attending this session?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Exploring partnerships with founders, seeking peer advice on early traction..."
                    value={formData.intent}
                    onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                {/* Consent & Transparency Checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="event-consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                  />
                  <label htmlFor="event-consent" className="text-[11px] text-stone-600 leading-normal">
                    I understand that 7 Horse Ventures curates attendance cohorts to maintain high signal. Registration does not constitute guaranteed event entry until confirmed via email. I accept the event participation guidelines and privacy terms.
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#101010] hover:bg-[#222222] text-[#E8E5DF] hover:text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Registering...' : 'Submit application'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Confirmed Pass Display with Lottie Celebration */}
          {confirmedPass && (
            <div className="p-6 bg-[#FAF7F2] border border-[#C5A46D] rounded-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-4">
                <div className="flex items-center gap-3">
                  <LottiePlayer preset="success" size={46} className="shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 font-heading">
                      Registration acknowledged
                    </h4>
                    <p className="text-xs text-stone-500">
                      Your interest has been logged with the curation committee.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-mono">RSVP reference</span>
                  <span className="text-xs font-mono font-medium text-[#A9874D]">
                    {confirmedPass.passId}
                  </span>
                </div>
              </div>

              {/* Digital Card Preview */}
              <div className="bg-[#101010] text-white p-5 rounded-xl border border-[#242424] space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-[#D8C39A] block">
                      7 Horse Ventures • Official RSVP
                    </span>
                    <h5 className="text-base font-semibold text-white font-heading mt-0.5">
                      {confirmedPass.eventTitle}
                    </h5>
                  </div>
                  <span className="text-xs font-medium text-[#101010] bg-[#C5A46D] px-2.5 py-0.5 rounded">
                    {confirmedPass.city || 'Confirmed Attendee'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-stone-800 text-stone-300">
                  <div>
                    <span className="text-stone-500 block text-[10px]">Attendee</span>
                    <span className="font-medium text-white">{confirmedPass.name}</span>
                    <span className="text-stone-400 text-[10px] block">{confirmedPass.role} — {confirmedPass.company}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">Date & Venue</span>
                    <span className="font-medium text-white">{confirmedPass.eventDate}</span>
                    <span className="text-stone-400 text-[10px] block line-clamp-1">{confirmedPass.eventLocation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-stone-500">
                  A formal invitation with final calendar invite and venue entry gate will be delivered to <strong>{confirmedPass.email}</strong>.
                </p>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 border border-stone-300 hover:border-stone-500 text-stone-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print pass</span>
                </button>
              </div>
            </div>
          )}

          {/* Archived Event Summary */}
          {isCompleted && (
            <div className="p-4 bg-stone-100 border border-stone-200 rounded-xl text-center space-y-2">
              <span className="text-xs font-medium text-stone-600 block">
                Event concluded
              </span>
              <p className="text-xs text-stone-600">
                This cohort gathering has successfully concluded. Key findings and takeaways were shared with attending delegates. Join our community to receive updates regarding our upcoming editions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
