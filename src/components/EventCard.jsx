import React from 'react';
import { Calendar, Clock, MapPin, Users, ArrowUpRight, Globe, Video, Handshake } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EventCard({ event }) {
  const { setSelectedEventModal } = useApp();

  const isCompleted = event.status === 'Completed';
  const format = event.format || (event.city?.toLowerCase() === 'online' ? 'Online' : 'In-Person');
  const organizerType = event.organizerType || '7 Horse Ventures';

  const handleAction = () => {
    setSelectedEventModal(event);
  };

  return (
    <article className="group bg-white rounded-xl overflow-hidden border border-[#E8E5DF] hover:border-stone-400 transition-all duration-200 flex flex-col h-full shadow-xs hover-lift">
      {/* Event Header Image & Top Overlays */}
      <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover object-center brightness-95 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        
        {/* Top Badges: Format & Type */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {/* Format Badge with Frosted Glass */}
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#D8C39A] border border-white/15 rounded flex items-center gap-1 shadow-xs">
            {format === 'Online' && <Globe className="w-3 h-3 text-[#C5A46D]" />}
            {format === 'Hybrid' && <Video className="w-3 h-3 text-[#C5A46D]" />}
            {format === 'In-Person' && <MapPin className="w-3 h-3 text-[#C5A46D]" />}
            <span>{format}</span>
          </span>

          {/* Organizer / Collaboration Badge */}
          {organizerType === 'Collaborative' && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-[#C5A46D]/90 text-[#101010] rounded flex items-center gap-1">
              <Handshake className="w-3 h-3" />
              <span>Co-hosted</span>
            </span>
          )}
          {organizerType === 'Partner / Community' && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-stone-200 text-[#101010] rounded">
              Community
            </span>
          )}
        </div>

        {/* Location & Pricing Badge on Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {event.isFree ? (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-600/90 text-white rounded shadow-xs">
              Free
            </span>
          ) : event.price ? (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#101010]/85 backdrop-blur-md text-[#D8C39A] border border-[#C5A46D]/60 rounded shadow-xs">
              ₹{event.price.toLocaleString('en-IN')}
            </span>
          ) : null}
          <span className="px-2 py-0.5 text-[10px] font-medium bg-white/90 text-[#101010] rounded">
            {event.city}
          </span>
        </div>

        {/* Status Pill & Capacity */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
              isCompleted
                ? 'bg-stone-700/80 text-stone-300'
                : 'bg-[#C5A46D] text-[#101010]'
            }`}
          >
            {event.status}
          </span>

          <span className="text-[11px] font-medium text-white/80 drop-shadow-sm flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#D8C39A]" />
            <span>{event.capacity}</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Organizer Credit (If Collaborative or Partner) */}
          {(event.partnerName || organizerType !== '7 Horse Ventures') && (
            <div className="text-[11px] font-medium text-[#A9874D] flex items-center gap-1.5">
              <span>
                {organizerType === 'Collaborative'
                  ? `In collaboration with ${event.partnerName || 'Partner Community'}`
                  : organizerType === 'Partner / Community'
                  ? `Hosted by ${event.partnerName || 'Community Host'}`
                  : '7 Horse Ventures Initiative'}
              </span>
            </div>
          )}

          {/* Date & Time */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-500 font-medium">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Calendar className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{event.time}</span>
            </div>
          </div>

          {/* Offer Highlight Pill */}
          {event.offerText && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200/90 rounded text-[11px] font-semibold text-amber-900">
              <span className="text-amber-600">⚡</span>
              <span>{event.offerText}</span>
            </div>
          )}

          <h3 className="text-base font-semibold text-[#101010] leading-snug group-hover:text-[#A9874D] transition-colors font-heading">
            {event.title}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
            {event.description}
          </p>

          {/* Venue / Online Details */}
          <div className="flex items-start gap-1.5 text-xs text-stone-500 pt-1">
            {format === 'Online' ? (
              <>
                <Globe className="w-3.5 h-3.5 text-[#C5A46D] shrink-0 mt-0.5" />
                <span className="line-clamp-1">Online session • Link provided upon RSVP</span>
              </>
            ) : format === 'Hybrid' ? (
              <>
                <Video className="w-3.5 h-3.5 text-[#C5A46D] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{event.location} • Online stream available</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-[#C5A46D] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{event.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              {event.isFree ? (
                <span className="text-xs font-bold text-emerald-700">Free Access</span>
              ) : event.price ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-stone-900">₹{event.price.toLocaleString('en-IN')}</span>
                  {event.originalPrice > event.price && (
                    <span className="text-[11px] line-through text-stone-400">₹{event.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              ) : null}
            </div>
            <button
              onClick={handleAction}
              className="text-[11px] font-medium text-stone-500 hover:text-[#C5A46D] transition-colors cursor-pointer flex items-center gap-0.5 text-left"
            >
              <span>View details</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {!isCompleted && (
            <button
              onClick={handleAction}
              className="px-4 py-2 bg-[#101010] hover:bg-[#252525] text-white text-xs font-semibold rounded transition-all cursor-pointer btn-press"
            >
              {event.isFree ? 'RSVP Free' : 'Book Pass'}
            </button>
          )}
          {isCompleted && (
            <span className="text-[11px] font-medium text-stone-400">
              Archived Recap
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
