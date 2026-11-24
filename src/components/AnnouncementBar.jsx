import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, X } from 'lucide-react';

export default function AnnouncementBar() {
  const { websiteSettings, navigate } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const announcement = websiteSettings?.announcement || {
    active: true,
    text: '2026 Founder Cohorts & Showcases: Applications and registrations are now open.',
    link: '/events'
  };

  if (!announcement.active || dismissed) return null;

  return (
    <div className="bg-[#121212] text-[#E8E5DF] border-b border-[#242424] text-xs py-2 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#1c1c1c] text-[#D8C39A] border border-[#2a2a2a] shrink-0">
            Open Registrations
          </span>
          <span className="truncate text-stone-300">
            {announcement.text}
          </span>
          {announcement.link && (
            <button
              onClick={() => navigate(announcement.link)}
              className="hidden md:inline-flex items-center gap-1 text-[#C5A46D] hover:text-white font-medium transition-colors ml-1.5 cursor-pointer shrink-0"
            >
              <span>Explore events</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-stone-500 hover:text-stone-300 p-1 -mr-2 cursor-pointer transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
