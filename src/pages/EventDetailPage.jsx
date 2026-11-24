import React from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function EventDetailPage({ eventId }) {
  const { events, navigate, setSelectedEventModal } = useApp();

  const event = events.find((e) => e.id === eventId || e.slug === eventId);

  if (!event) {
    return (
      <div className="bg-[#F7F5F0] text-[#101010] min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-[#E8E5DF]">
          <h2 className="text-xl font-bold font-heading">Event Not Found</h2>
          <p className="text-xs text-stone-600">The requested event could not be found or has concluded.</p>
          <button
            onClick={() => navigate('/events')}
            className="px-4 py-2 bg-[#101010] text-white text-xs font-bold rounded"
          >
            Back to Events Directory
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = event.status === 'Completed';

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen py-12 sm:py-16">
      <SEO
        title={`${event.title} — 7 Horse Ventures`}
        description={event.description}
        ogImage={event.image}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <button
            onClick={() => navigate('/events')}
            className="text-xs font-semibold text-stone-600 hover:text-[#101010] inline-flex items-center gap-1.5 cursor-pointer"
          >
            ← Back to All Events
          </button>
        </div>

        {/* Event Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#101010] text-[#D8C39A]">
              {event.category}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAF7F2] text-[#A9874D] border border-[#E8E5DF]">
              {event.city}
            </span>
            <span className="text-xs font-medium text-stone-500 font-mono">
              Status: {event.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#101010] font-heading leading-tight">
            {event.title}
          </h1>
        </div>

        {/* Quick Info Grid */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white rounded-xl border border-[#E8E5DF] text-xs">
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
                <span className="text-stone-500 block font-medium">Venue</span>
                <span className="font-semibold text-stone-900 leading-tight">{event.location}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Media Cover */}
        {event.image && (
          <ScrollReveal delay={100}>
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E8E5DF] img-zoom-hover">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            </div>
          </ScrollReveal>
        )}

        {/* Description & Curation Note */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E5DF] space-y-4">
          <h2 className="text-lg font-bold text-[#101010] font-heading">
            About This Cohort Experience
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
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
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E5DF] space-y-4">
            <h2 className="text-lg font-bold text-[#101010] font-heading">
              Structured Agenda & Program
            </h2>
            <div className="divide-y divide-[#E8E5DF] border border-[#E8E5DF] rounded-xl overflow-hidden">
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

        {/* Action Bar */}
        <div className="p-6 bg-[#101010] text-white rounded-2xl border border-[#2a2a2a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold font-heading">
              {isCompleted ? 'This event has concluded' : 'Ready to attend this cohort?'}
            </h3>
            <p className="text-xs text-stone-400">
              {isCompleted
                ? 'Join our community to receive updates when our next date is announced.'
                : 'Prior registration and profile screening required to maintain high signal.'}
            </p>
          </div>

          {!isCompleted ? (
            <button
              onClick={() => setSelectedEventModal(event)}
              className="px-5 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Register interest now
            </button>
          ) : (
            <button
              onClick={() => navigate('/community')}
              className="px-5 py-2.5 border border-stone-600 text-white text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Join community
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
