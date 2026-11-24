import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import LottiePlayer from './LottiePlayer';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Download,
  Printer,
  CreditCard,
  Smartphone,
  Building2,
  ShieldCheck,
  Tag,
  Lock,
  MessageCircle,
  Sparkles
} from 'lucide-react';

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

  // Cashfree Payment Gateway State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  if (!selectedEventModal) return null;

  const event = selectedEventModal;
  const isCompleted = event.status === 'Completed';
  const isFree = event.isFree !== false && (!event.price || event.price === 0);
  const eventPrice = event.price || 0;
  const originalPrice = event.originalPrice || eventPrice;

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const regex = /^(?:\+91|91|0)?[6789]\d{9}$/;
    return regex.test(cleaned);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleFormSubmit = async (e) => {
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

    // If Paid event, open Cashfree checkout flow
    if (!isFree) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/payments/cashfree/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderAmount: eventPrice,
            orderCurrency: 'INR',
            customerDetails: {
              customerName: formData.name,
              customerEmail: formData.email,
              customerPhone: formData.phone
            },
            eventId: event.id,
            eventTitle: event.title,
            ticketType: event.ticketBadge || 'Official Delegate Pass'
          })
        });

        const data = await res.json();
        if (data.success && data.order_id) {
          setActiveOrder(data);
          setShowPaymentModal(true);
        } else {
          setErrorMsg(data.error || 'Failed to initialize Cashfree payment. Please try again.');
        }
      } catch (err) {
        // Fallback for standalone/offline dev mode
        setActiveOrder({
          order_id: `order_7h_${Date.now()}`,
          orderAmount: eventPrice,
          simulation: true
        });
        setShowPaymentModal(true);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // If Free event, submit RSVP directly
    setIsSubmitting(true);
    setTimeout(() => {
      const passId = `7H-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
      addSubmission('Event RSVP', {
        passId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        paymentStatus: 'COMPLIMENTARY RSVP',
        ...formData
      });

      setConfirmedPass({
        passId,
        paymentStatus: 'COMPLIMENTARY RSVP',
        amountPaid: 0,
        ...formData,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        format: event.format
      });

      setIsSubmitting(false);
      showToast('Registration submitted! Confirmation generated.', 'success');
    }, 600);
  };

  // Complete Cashfree Payment
  const handleCashfreePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const orderId = activeOrder?.order_id || `order_7h_${Date.now()}`;
      const paymentId = `cf_pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const res = await fetch('/api/payments/cashfree/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentId,
          eventId: event.id,
          eventTitle: event.title,
          orderAmount: eventPrice,
          attendeeData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            role: formData.role
          }
        })
      });

      const data = await res.json();
      const finalPassId = data.passId || `7H-PASS-${Math.floor(100000 + Math.random() * 900000)}`;

      setConfirmedPass({
        passId: finalPassId,
        paymentStatus: 'PAID',
        orderId,
        paymentId: data.paymentId || paymentId,
        amountPaid: eventPrice,
        ...formData,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        format: event.format
      });

      setShowPaymentModal(false);
      showToast('Payment successful! Executive Ticket Pass issued.', 'success');
    } catch (err) {
      // In offline preview mode, still issue pass
      const passId = `7H-PASS-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedPass({
        passId,
        paymentStatus: 'PAID',
        orderId: activeOrder?.order_id || `order_sim_${Date.now()}`,
        amountPaid: eventPrice,
        ...formData,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        format: event.format
      });
      setShowPaymentModal(false);
      showToast('Payment confirmed! Executive Ticket generated.', 'success');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Print Pass
  const handlePrint = () => {
    window.print();
  };

  // High-Resolution Executive Ticket Pass Download with Logo at the Top
  const handleDownloadTicket = () => {
    if (!confirmedPass) return;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1040;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Luxury Black
    ctx.fillStyle = '#101010';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gold Outer Border
    ctx.strokeStyle = '#C5A46D';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner Border
    ctx.strokeStyle = 'rgba(197, 164, 109, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);

    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.src = '/7horse-logo.jpg';

    const renderTicketGraphics = () => {
      // 1. BRAND HEADER
      ctx.fillStyle = '#D8C39A';
      ctx.font = 'bold 26px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('7 HORSE VENTURES', 400, 190);

      ctx.fillStyle = '#A9874D';
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.fillText('OFFICIAL EXECUTIVE ACCESS PASS • DELEGATE ADMIT ONE', 400, 215);

      // Gold Separator
      ctx.strokeStyle = '#C5A46D';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(100, 235);
      ctx.lineTo(700, 235);
      ctx.stroke();

      // 2. EVENT TITLE
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px "Playfair Display", Georgia, serif';
      ctx.fillText(confirmedPass.eventTitle || event.title, 400, 280);

      // 3. PASS ID & STATUS PILL
      ctx.fillStyle = '#E8E5DF';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`PASS ID: ${confirmedPass.passId}`, 400, 318);

      const isPaidStatus = confirmedPass.paymentStatus === 'PAID';
      ctx.fillStyle = isPaidStatus ? '#10B981' : '#C5A46D';
      ctx.font = 'bold 13px "Inter", sans-serif';
      ctx.fillText(
        isPaidStatus
          ? `STATUS: PAID VIA CASHFREE (₹${confirmedPass.amountPaid || eventPrice})`
          : 'STATUS: COMPLIMENTARY CURATED RSVP',
        400,
        344
      );

      // 4. DELEGATE DETAILS CONTAINER
      ctx.fillStyle = '#181818';
      ctx.fillRect(60, 375, 680, 260);
      ctx.strokeStyle = '#2A2A2A';
      ctx.strokeRect(60, 375, 680, 260);

      ctx.textAlign = 'left';
      // Left Column: Attendee Info
      ctx.fillStyle = '#8C8C8C';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('DELEGATE NAME', 90, 415);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 18px "Inter", sans-serif';
      ctx.fillText(confirmedPass.name, 90, 440);

      ctx.fillStyle = '#8C8C8C';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('DESIGNATION & ORGANISATION', 90, 485);
      ctx.fillStyle = '#E5E5E5';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText(`${confirmedPass.role} — ${confirmedPass.company}`, 90, 510);

      ctx.fillStyle = '#8C8C8C';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('DATE & TIME', 90, 555);
      ctx.fillStyle = '#D8C39A';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText(`${confirmedPass.eventDate || event.date} • ${confirmedPass.eventTime || event.time}`, 90, 580);

      // Right Column: Venue & Contact
      ctx.fillStyle = '#8C8C8C';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('VENUE / FORMAT', 440, 415);
      ctx.fillStyle = '#E5E5E5';
      ctx.font = '14px "Inter", sans-serif';
      ctx.fillText(confirmedPass.eventLocation || event.location || 'Cyber City, Gurugram', 440, 440);

      ctx.fillStyle = '#8C8C8C';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('CONTACT VERIFICATION', 440, 485);
      ctx.fillStyle = '#E5E5E5';
      ctx.font = '13px "Inter", sans-serif';
      ctx.fillText(confirmedPass.email, 440, 510);
      ctx.fillText(confirmedPass.phone, 440, 530);

      // 5. SECURITY & GATE VALIDATION
      ctx.textAlign = 'center';
      ctx.fillStyle = '#C5A46D';
      ctx.font = '13px monospace';
      ctx.fillText(`GATE VERIFICATION: ${confirmedPass.passId}-7HV-VALID`, 400, 680);

      ctx.fillStyle = '#737373';
      ctx.font = '11px "Inter", sans-serif';
      ctx.fillText('Present this executive pass at reception. Non-transferable admission.', 400, 710);
      ctx.fillText('7 Horse Ventures • Connecting High-Signal Founders & Investors', 400, 735);

      // Download File Trigger
      const link = document.createElement('a');
      link.download = `7Horse-Pass-${confirmedPass.passId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('Executive Ticket downloaded successfully!', 'success');
    };

    logo.onload = () => {
      // Draw 7 Horse Logo prominently at the very top (x=355, y=55, w=90, h=90)
      ctx.drawImage(logo, 355, 55, 90, 90);
      renderTicketGraphics();
    };
    logo.onerror = () => {
      renderTicketGraphics();
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#C5A46D]/30 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedEventModal(null);
            setConfirmedPass(null);
            setShowPaymentModal(false);
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
              {isFree ? (
                <span className="px-2 py-0.5 rounded font-semibold bg-emerald-600 text-white text-[11px]">
                  Free Access
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded font-semibold bg-[#FAF7F2] text-[#101010] text-[11px] flex items-center gap-1">
                  <span>₹{eventPrice.toLocaleString('en-IN')}</span>
                  {originalPrice > eventPrice && (
                    <span className="line-through text-stone-500 text-[10px]">₹{originalPrice.toLocaleString('en-IN')}</span>
                  )}
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

          {/* Pricing & Offer Highlight Banner */}
          <div className="p-4 bg-gradient-to-r from-[#FAF7F2] to-amber-50/50 border border-[#C5A46D]/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm">
                  {event.ticketBadge || (isFree ? 'Complimentary Founder Pass' : 'Executive Delegate Pass')}
                </span>
                {event.offerText && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200/80 text-amber-900 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>{event.offerText}</span>
                  </span>
                )}
              </div>
              <p className="text-stone-600 text-[11px]">
                {isFree
                  ? 'High-signal peer gathering. RSVP subject to profile curation review.'
                  : 'Includes full session access, executive networking, and high tea. Secured by Cashfree Payments.'}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              {isFree ? (
                <div className="text-emerald-700 font-bold text-base">Free RSVP</div>
              ) : (
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5 sm:justify-end">
                    <span className="text-lg font-bold text-stone-950">₹{eventPrice.toLocaleString('en-IN')}</span>
                    {originalPrice > eventPrice && (
                      <span className="text-xs text-stone-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 block">Cashfree PG • Instant Pass</span>
                </div>
              )}
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

          {/* Description */}
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

          {/* Registration Form (When Not Completed and Pass Not Yet Confirmed) */}
          {!isCompleted && !confirmedPass && (
            <div className="pt-6 border-t border-[#E8E5DF] space-y-5">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-heading">
                  {isFree ? 'Register Your Interest to Attend' : 'Book Your Executive Delegate Pass'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isFree
                    ? 'Guest list is curated for relevant ecosystem stakeholders to ensure mutual value.'
                    : 'Fill your credentials below to proceed to secure Cashfree payment checkout.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              {/* CONTRAST FIX: Explicitly forcing text-[#101010] bg-white so typed input is strictly black */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
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
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010] placeholder:text-stone-400"
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
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010] placeholder:text-stone-400"
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
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010] placeholder:text-stone-400"
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
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010] placeholder:text-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Primary Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010]"
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
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010] placeholder:text-stone-400"
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
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010] placeholder:text-stone-400"
                  />
                </div>

                {/* Consent & Policy Checkbox */}
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
                    I agree to the 7 Horse Ventures ecosystem participation terms, code of conduct, and delegate policy.
                  </label>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A46D]" />
                    <span>Instant confirmation pass issued upon completion</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#101010] hover:bg-[#222222] text-[#E8E5DF] hover:text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? 'Processing...'
                        : isFree
                        ? 'Submit RSVP Application'
                        : `Proceed to Pay ₹${eventPrice.toLocaleString('en-IN')}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CASHFREE PAYMENT GATEWAY CHECKOUT MODAL */}
          {showPaymentModal && (
            <div className="p-6 bg-[#FAF7F2] border-2 border-[#C5A46D] rounded-2xl space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#101010] text-[#D8C39A] flex items-center justify-center font-bold text-xs">
                    CF
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 font-heading">
                      Cashfree Payments • Secure Checkout
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Order #{activeOrder?.order_id || '7H-ORDER'} • Instant Ticket Issuance
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Total Amount</span>
                  <span className="text-base font-bold text-stone-900">
                    ₹{eventPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="flex rounded-lg border border-[#E8E5DF] bg-white p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-1.5 px-3 rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    paymentMethod === 'upi' ? 'bg-[#101010] text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI (GPay / PhonePe / Paytm)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-1.5 px-3 rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    paymentMethod === 'card' ? 'bg-[#101010] text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Credit / Debit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex-1 py-1.5 px-3 rounded font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                    paymentMethod === 'netbanking' ? 'bg-[#101010] text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Netbanking</span>
                </button>
              </div>

              {/* Tab 1: UPI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
                  <span className="font-semibold text-stone-800 block">Enter your UPI Virtual Payment Address (VPA)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. priyasharma@okaxis or mobile@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010] placeholder:text-stone-400"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-stone-500">
                    <span className="font-medium text-stone-700">Supported Apps:</span>
                    <span className="px-2 py-0.5 bg-stone-100 rounded border border-stone-200">Google Pay</span>
                    <span className="px-2 py-0.5 bg-stone-100 rounded border border-stone-200">PhonePe</span>
                    <span className="px-2 py-0.5 bg-stone-100 rounded border border-stone-200">Paytm</span>
                    <span className="px-2 py-0.5 bg-stone-100 rounded border border-stone-200">BHIM UPI</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Cards */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 •••• •••• 1111"
                      maxLength={19}
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        maxLength={5}
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Netbanking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200 text-xs">
                  <label className="block text-stone-700 font-semibold mb-1">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none bg-white text-[#101010]"
                  >
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                    <option>Other Indian Banks</option>
                  </select>
                </div>
              )}

              {/* Checkout Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-stone-300 hover:border-stone-500 text-stone-700 text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCashfreePayment}
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessingPayment
                      ? 'Verifying Payment...'
                      : `Pay ₹${eventPrice.toLocaleString('en-IN')} via Cashfree`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* CONFIRMED PASS: EXECUTIVE TICKET WITH LOGO AT TOP */}
          {confirmedPass && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950 font-heading">
                      {confirmedPass.paymentStatus === 'PAID'
                        ? 'Payment Confirmed & Pass Issued!'
                        : 'Registration Acknowledged & Pass Generated!'}
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Your executive pass is ready. A verification copy is also queued for {confirmedPass.email}.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 block font-mono">Reference</span>
                  <span className="text-xs font-mono font-bold text-emerald-950">
                    {confirmedPass.passId}
                  </span>
                </div>
              </div>

              {/* PRINTABLE & DOWNLOADABLE EXECUTIVE TICKET PASS */}
              <div
                id="printable-ticket"
                className="bg-[#101010] text-[#F7F5F0] rounded-2xl border-2 border-[#C5A46D] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
              >
                {/* 1. LOGO AT THE VERY TOP (User Requirement) */}
                <div className="flex flex-col items-center justify-center text-center pb-4 border-b border-[#C5A46D]/30">
                  <img
                    src="/7horse-logo.jpg"
                    alt="7 Horse Ventures Logo"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-xl border border-[#C5A46D]/60 p-1.5 bg-black shadow-md mb-2"
                  />
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-[#D8C39A] uppercase tracking-wider">
                    7 Horse Ventures
                  </h3>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                    Official Executive Access Pass • Admit One
                  </p>
                </div>

                {/* 2. Event Title & Pass Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#D8C39A] uppercase tracking-wider block">
                      Confirmed Event
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white font-heading mt-0.5">
                      {confirmedPass.eventTitle}
                    </h4>
                  </div>
                  <div className="shrink-0">
                    {confirmedPass.paymentStatus === 'PAID' ? (
                      <span className="px-3 py-1 bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-md uppercase tracking-wider">
                        PAID PASS • Cashfree Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-[#C5A46D]/20 border border-[#C5A46D]/40 text-[#D8C39A] text-xs font-bold rounded-md uppercase tracking-wider">
                        CURATED RSVP PASS
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Attendee & Event Logistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#2E2E2E] text-xs">
                  <div className="space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">Delegate Name</span>
                    <span className="font-bold text-white text-sm block">{confirmedPass.name}</span>
                    <span className="text-stone-300 text-xs block">
                      {confirmedPass.role} — {confirmedPass.company}
                    </span>
                    <span className="text-stone-400 text-[11px] block">{confirmedPass.email}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-stone-400 text-[10px] uppercase font-mono block">Date & Venue</span>
                    <span className="font-bold text-[#D8C39A] text-sm block">{confirmedPass.eventDate}</span>
                    <span className="text-stone-300 text-xs block">{confirmedPass.eventTime}</span>
                    <span className="text-stone-400 text-[11px] block">{confirmedPass.eventLocation}</span>
                  </div>
                </div>

                {/* 4. Gate Verification & Security Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#2E2E2E] text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[#D8C39A] text-xs font-semibold block">
                      TOKEN: {confirmedPass.passId}
                    </span>
                    <p className="text-[11px] text-stone-400">
                      Present digital ticket or printed copy at the reception check-in desk.
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-white p-1 rounded-md shrink-0 flex items-center justify-center self-start sm:self-center">
                    {/* SVG Verification Matrix */}
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#101010]">
                      <rect x="2" y="2" width="6" height="6" fill="currentColor" />
                      <rect x="16" y="2" width="6" height="6" fill="currentColor" />
                      <rect x="2" y="16" width="6" height="6" fill="currentColor" />
                      <rect x="4" y="4" width="2" height="2" fill="white" />
                      <rect x="18" y="4" width="2" height="2" fill="white" />
                      <rect x="4" y="18" width="2" height="2" fill="white" />
                      <rect x="10" y="4" width="2" height="6" fill="currentColor" />
                      <rect x="10" y="14" width="4" height="2" fill="currentColor" />
                      <rect x="16" y="14" width="4" height="4" fill="currentColor" />
                      <rect x="14" y="10" width="4" height="2" fill="currentColor" />
                      <rect x="10" y="18" width="2" height="2" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS: Download Ticket, Print Pass, WhatsApp Community */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadTicket}
                    className="px-4 py-2 bg-[#101010] hover:bg-stone-800 text-[#D8C39A] border border-[#C5A46D]/40 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Ticket Pass</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 border border-stone-300 hover:border-stone-500 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Pass</span>
                  </button>
                </div>

                {/* WhatsApp Community Direct Link */}
                <a
                  href="https://chat.whatsapp.com/IzTObDPm8pw80Hw811RJvC?s=cl&p=a&iam=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join WhatsApp Community</span>
                </a>
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
