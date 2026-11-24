import React, { useState, useEffect } from 'react';
import { X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { OFFICIAL_WHATSAPP_LINK } from '../context/AppContext';

export default function WhatsAppJoinModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if previously dismissed or joined in this browser session/storage
    const isDismissed = localStorage.getItem('7h_whatsapp_popup_dismissed');
    if (isDismissed) return;

    // Delay showing the popup by 5 seconds to avoid interrupting immediate landing
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    // Remember dismissal so visitors are not repeatedly interrupted
    try {
      localStorage.setItem('7h_whatsapp_popup_dismissed', 'true');
    } catch {}
  };

  const handleJoin = () => {
    // Remember dismissal
    try {
      localStorage.setItem('7h_whatsapp_popup_dismissed', 'true');
    } catch {}
    setIsOpen(false);
    window.open(OFFICIAL_WHATSAPP_LINK, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-popup-title"
    >
      <div className="relative w-full max-w-md bg-[#161616] border border-[#2A2A2A] rounded-2xl p-6 sm:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.8)] text-white transform transition-all animate-scaleUp">
        
        {/* Visible Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* WhatsApp Brand Emblem */}
        <div className="w-14 h-14 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center mb-5 text-[#25D366]">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.97.578 3.86 1.672 5.484L2 22l4.64-1.625A9.99 9.99 0 0 0 12.031 22C17.562 22 22.062 17.5 22.062 12.031 22.062 6.5 17.562 2 12.031 2zm5.782 14.281c-.25.703-1.454 1.344-2 1.39-.5.047-1.125.063-3.234-.781-2.5-1-4.109-3.563-4.234-3.734-.125-.172-1-1.328-1-2.531 0-1.203.625-1.797.844-2.047.219-.25.484-.313.656-.313.172 0 .344 0 .5.016.172.015.39.062.593.547.203.484.703 1.703.766 1.828.062.125.11.266.015.438-.093.172-.14.28-.28.437-.14.156-.3.344-.423.469-.14.14-.28.297-.124.578.156.281.687 1.14 1.484 1.844 1.031.922 1.906 1.203 2.187 1.344.281.14.438.125.61-.078.171-.203.718-.844.906-1.14.187-.297.375-.25.625-.156.25.094 1.578.75 1.844.875.265.125.437.188.5.297.062.11.062.64-.188 1.344z"/>
          </svg>
        </div>

        {/* Heading */}
        <h2 id="whatsapp-popup-title" className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight mb-2.5">
          Stay Connected With Our Community!
        </h2>

        {/* Description */}
        <p className="text-sm text-stone-300 leading-relaxed mb-6 font-normal">
          Join our WhatsApp community to stay updated on upcoming events, exciting opportunities and community activities.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Primary CTA */}
          <button
            onClick={handleJoin}
            className="w-full sm:flex-1 py-3 px-5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-semibold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-lg shadow-[#25D366]/20 group"
          >
            <span>Join WhatsApp Community</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Secondary Action */}
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto py-3 px-5 text-stone-400 hover:text-white text-sm font-medium rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>

        {/* Safe Badge */}
        <p className="text-[11px] text-stone-500 mt-4 text-center">
          Official invitation link • Free community access • No spam
        </p>

      </div>
    </div>
  );
}
