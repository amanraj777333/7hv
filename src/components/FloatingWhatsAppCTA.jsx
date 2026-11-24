import React from 'react';
import { OFFICIAL_WHATSAPP_LINK } from '../context/AppContext';

export default function FloatingWhatsAppCTA() {
  const handleOpen = () => {
    window.open(OFFICIAL_WHATSAPP_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Join WhatsApp Community"
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={handleOpen}
        className="group relative flex items-center h-12 rounded-full bg-[#25D366] text-black hover:bg-[#20ba5a] shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_14px_32px_rgba(37,211,102,0.6)] transition-all duration-300 ease-out cursor-pointer p-3 overflow-hidden select-none"
        title="Join Our Community on WhatsApp"
        aria-label="Join Our Community on WhatsApp"
      >
        {/* Recognizable WhatsApp Icon */}
        <div className="flex items-center justify-center shrink-0 w-6 h-6 text-black">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.97.578 3.86 1.672 5.484L2 22l4.64-1.625A9.99 9.99 0 0 0 12.031 22C17.562 22 22.062 17.5 22.062 12.031 22.062 6.5 17.562 2 12.031 2zm5.782 14.281c-.25.703-1.454 1.344-2 1.39-.5.047-1.125.063-3.234-.781-2.5-1-4.109-3.563-4.234-3.734-.125-.172-1-1.328-1-2.531 0-1.203.625-1.797.844-2.047.219-.25.484-.313.656-.313.172 0 .344 0 .5.016.172.015.39.062.593.547.203.484.703 1.703.766 1.828.062.125.11.266.015.438-.093.172-.14.28-.28.437-.14.156-.3.344-.423.469-.14.14-.28.297-.124.578.156.281.687 1.14 1.484 1.844 1.031.922 1.906 1.203 2.187 1.344.281.14.438.125.61-.078.171-.203.718-.844.906-1.14.187-.297.375-.25.625-.156.25.094 1.578.75 1.844.875.265.125.437.188.5.297.062.11.062.64-.188 1.344z"/>
          </svg>
        </div>

        {/* Expandable Label: Collapsed by default, expands smoothly on hover */}
        <span className="max-w-0 md:group-hover:max-w-xs transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap text-xs font-bold font-heading text-black pl-0 md:group-hover:pl-2.5 pr-0 md:group-hover:pr-1">
          Join Our Community
        </span>
      </button>
    </aside>
  );
}
