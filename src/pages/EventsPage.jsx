import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import EventCard from '../components/EventCard';
import ScrollReveal from '../components/ScrollReveal';
import { Calendar, MapPin, Handshake, Globe, Video, ArrowRight, Sparkles } from 'lucide-react';

export default function EventsPage() {
  const { events, navigate } = useApp();

  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedOrganizer, setSelectedOrganizer] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatusTab, setSelectedStatusTab] = useState('Upcoming');

  // Extract dynamic unique locations from all events
  const uniqueCities = useMemo(() => {
    const set = new Set();
    (events || []).forEach((e) => {
      if (e.city) set.add(e.city);
    });
    return ['All', ...Array.from(set)];
  }, [events]);

  const filteredEvents = (events || []).filter((evt) => {
    if (!evt.published) return false;

    if (selectedStatusTab === 'Upcoming') {
      if (evt.status === 'Completed' || evt.status === 'Archived') return false;
    } else if (selectedStatusTab === 'Past') {
      if (evt.status !== 'Completed' && evt.status !== 'Archived') return false;
    }

    if (selectedFormat !== 'All') {
      const evtFormat = evt.format || (evt.city?.toLowerCase() === 'online' ? 'Online' : 'In-Person');
      if (evtFormat !== selectedFormat) return false;
    }

    if (selectedOrganizer !== 'All') {
      const orgType = evt.organizerType || '7 Horse Ventures';
      if (orgType !== selectedOrganizer) return false;
    }

    if (selectedCity !== 'All' && evt.city !== selectedCity) {
      return false;
    }

    return true;
  });

  const hasFiltersActive = selectedFormat !== 'All' || selectedOrganizer !== 'All' || selectedCity !== 'All';

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="Events & Roundtables — 7 Horse Ventures"
        description="Explore upcoming founder roundtables, pitch showcases, masterclasses, and collaborative community events across cities and online."
        canonicalUrl="/events"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-[#C5A46D]">
              Gatherings & experiences
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Founder roundtables, pitch showcases, and knowledge clinics
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              High-signal gatherings designed for founders, operators, and investors. We host closed-door roundtables, structured pitch showcases, and interactive online sessions with zero sales pitches.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-4 bg-white border-b border-[#E8E5DF] sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#F7F5F0] rounded-lg border border-[#E8E5DF] self-start">
              <button
                onClick={() => setSelectedStatusTab('Upcoming')}
                className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-all duration-200 btn-press ${
                  selectedStatusTab === 'Upcoming'
                    ? 'bg-[#101010] text-white shadow-xs'
                    : 'text-stone-600 hover:text-[#101010]'
                }`}
              >
                Upcoming Experiences
              </button>
              <button
                onClick={() => setSelectedStatusTab('Past')}
                className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition-all duration-200 btn-press ${
                  selectedStatusTab === 'Past'
                    ? 'bg-[#101010] text-white shadow-xs'
                    : 'text-stone-600 hover:text-[#101010]'
                }`}
              >
                Past & Concluded
              </button>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Format Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-stone-500 uppercase text-[10px]">Format:</span>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="px-2.5 py-1 text-xs font-medium border border-stone-300 rounded bg-white text-stone-800 focus:outline-none focus:border-[#C5A46D]"
                >
                  <option value="All">All Formats</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Organizer Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-stone-500 uppercase text-[10px]">Host:</span>
                <select
                  value={selectedOrganizer}
                  onChange={(e) => setSelectedOrganizer(e.target.value)}
                  className="px-2.5 py-1 text-xs font-medium border border-stone-300 rounded bg-white text-stone-800 focus:outline-none focus:border-[#C5A46D]"
                >
                  <option value="All">All Hosts</option>
                  <option value="7 Horse Ventures">7 Horse Ventures</option>
                  <option value="Collaborative">In Collaboration</option>
                  <option value="Partner / Community">Partner & Community</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-stone-500 uppercase text-[10px]">Location:</span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-2.5 py-1 text-xs font-medium border border-stone-300 rounded bg-white text-stone-800 focus:outline-none focus:border-[#C5A46D]"
                >
                  {uniqueCities.map((city) => (
                    <option key={city} value={city}>
                      {city === 'All' ? 'All Locations' : city}
                    </option>
                  ))}
                </select>
              </div>

              {hasFiltersActive && (
                <button
                  onClick={() => {
                    setSelectedFormat('All');
                    setSelectedOrganizer('All');
                    setSelectedCity('All');
                  }}
                  className="text-xs text-[#A9874D] hover:underline font-semibold cursor-pointer ml-1"
                >
                  Reset
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Collaboration Callout Banner */}
          <div className="bg-[#FAF7F2] border border-[#E8E5DF] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#101010] text-[#D8C39A] flex items-center justify-center shrink-0">
                <Handshake className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 font-heading">
                  Want to host or co-organize an event with us?
                </h4>
                <p className="text-[11px] text-stone-600">
                  We collaborate with organizers, founders, companies, and communities to run in-person, online, and hybrid gatherings.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/collaborate')}
              className="px-4 py-2 bg-[#101010] hover:bg-stone-800 text-white text-xs font-semibold rounded transition-colors cursor-pointer self-start sm:self-center shrink-0 flex items-center gap-1.5"
            >
              <span>Collaborate with us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt, idx) => (
                <ScrollReveal key={evt.id} delay={Math.min(idx * 70, 350)}>
                  <EventCard event={evt} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center max-w-lg mx-auto bg-white rounded-2xl border border-[#E8E5DF] p-8 space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C5A46D]/40 text-[#A9874D] flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-[#101010]">
                No events currently match these filters.
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Try resetting your filters or join our community to receive priority invitations when new cohorts and roundtables are scheduled.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedFormat('All');
                    setSelectedOrganizer('All');
                    setSelectedCity('All');
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold rounded transition-colors cursor-pointer"
                >
                  Join community
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
