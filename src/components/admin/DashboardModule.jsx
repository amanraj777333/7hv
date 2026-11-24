import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Users,
  FileText,
  Mail,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function DashboardModule({ setActiveTab }) {
  const {
    events,
    registrations,
    academySessions,
    academyRegistrations,
    articles,
    subscribers,
    pitchApplications,
    partnerships,
    enquiries,
    founders,
    startups,
    opportunities,
    currentUser
  } = useApp();

  const activeSubscribers = subscribers.filter((s) => s.status === 'active');
  const pendingPitches = pitchApplications.filter((p) => p.status === 'new' || p.status === 'reviewing');
  const pendingFounders = founders.filter((f) => f.status === 'pending');
  const pendingStartups = startups.filter((s) => s.status === 'pending');
  const pendingOpportunities = opportunities.filter((o) => o.status === 'pending');
  const totalPendingReviews = pendingPitches.length + pendingFounders.length + pendingStartups.length + pendingOpportunities.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new');

  const upcomingEvents = events
    .filter((e) => e.status === 'Upcoming' || e.published !== false)
    .slice(0, 3);

  const recentRegistrations = [...registrations].reverse().slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#181818] via-[#1c1c1c] to-[#121212] border border-[#2d2d2d] rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30">
              Operations Center
            </span>
            <span className="text-xs text-stone-400">Delhi NCR Central Ecosystem</span>
          </div>
          <h2 className="text-2xl font-bold font-serif tracking-tight text-white">
            Welcome back, {currentUser?.name?.split(' ')[0] || 'Administrator'}
          </h2>
          <p className="text-sm text-[#E8E5DF]/70 mt-1 max-w-xl leading-relaxed">
            Manage events, attendee rosters, editorial articles, pitch deck evaluations, visual assets, and platform settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('visual_manager')}
            className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded bg-[#222222] hover:bg-[#2c2c2c] text-[#E8E5DF] border border-[#383838] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Visual Manager</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#C5A46D]" />
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-medium transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Manage Events</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3.5">
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 hover:border-[#C5A46D]/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Live Events</span>
            <Calendar className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{events.length}</div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400">Delhi NCR</span> cohorts
          </div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 hover:border-[#C5A46D]/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Registrations</span>
            <Users className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{registrations.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">Confirmed attendees</div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 hover:border-[#C5A46D]/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Subscribers</span>
            <Mail className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{activeSubscribers.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">7H Founder Brief</div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 hover:border-[#C5A46D]/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Pitch Decks</span>
            <TrendingUp className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{pitchApplications.length}</div>
          <div className="text-[11px] text-amber-400 mt-1">{pendingPitches.length} awaiting review</div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 hover:border-[#C5A46D]/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Articles & News</span>
            <FileText className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{articles.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">Insights published</div>
        </div>

        <div
          onClick={() => setActiveTab('academy_sessions')}
          className="bg-[#141414] border border-[#262626] rounded-lg p-4 hover:border-[#C5A46D]/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Academy</span>
            <GraduationCap className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{(academySessions || []).length}</div>
          <div className="text-[11px] text-stone-400 mt-1">{(academyRegistrations || []).length} masterclass attendees</div>
        </div>

        <div className="bg-[#141414] border border-[#262626] rounded-lg p-4 hover:border-[#C5A46D]/40 transition-colors">
          <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
            <span>Partnerships</span>
            <Briefcase className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-bold font-serif text-white mt-2">{partnerships.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Active corporate pipeline</div>
        </div>
      </div>

      {/* Action Required Banner if pending items exist */}
      {totalPendingReviews > 0 && (
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-semibold text-amber-100">
                Action Required: {totalPendingReviews} submissions pending review
              </div>
              <div className="text-xs text-amber-300/80 mt-0.5">
                {pendingPitches.length} pitch applications, {pendingFounders.length} founder directory submissions, {pendingStartups.length} startup profiles, {pendingOpportunities.length} opportunities.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pitches')}
              className="text-xs font-semibold px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30 rounded cursor-pointer transition-colors"
            >
              Review Pitches
            </button>
            <button
              onClick={() => setActiveTab('founders')}
              className="text-xs font-semibold px-3 py-1.5 bg-[#181818] hover:bg-[#222222] text-amber-200 border border-amber-800/50 rounded cursor-pointer transition-colors"
            >
              Review Directories
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Upcoming Cohorts & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upcoming Events */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-serif">Scheduled Cohorts & Events</h3>
              <p className="text-xs text-stone-400">Delhi NCR flagship networking series</p>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 rounded-lg bg-[#1a1a1a] border border-[#282828] flex items-start justify-between gap-3 hover:border-[#383838] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-[#C5A46D]/15 text-[#C5A46D]">
                      {evt.type || evt.category}
                    </span>
                    <span className="text-[11px] text-stone-400">{evt.city || 'Gurugram'}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white leading-snug">{evt.title}</h4>
                  <div className="text-xs text-stone-400 mt-1 flex items-center gap-3">
                    <span>{evt.date}</span>
                    <span>•</span>
                    <span>{evt.registeredCount || 0} registered</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    evt.status === 'Upcoming'
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                      : 'bg-stone-800 text-stone-300'
                  }`}
                >
                  {evt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Attendee Registrations */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white font-serif">Recent Registrations</h3>
              <p className="text-xs text-stone-400">Real-time attendee cohort check-in queue</p>
            </div>
            <button
              onClick={() => setActiveTab('registrations')}
              className="text-xs font-semibold text-[#C5A46D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentRegistrations.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">No registrations recorded yet.</div>
            ) : (
              recentRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="p-3 rounded-lg bg-[#1a1a1a] border border-[#282828] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>{reg.name}</span>
                      <span className="text-stone-500 font-normal">({reg.startupOrCompany || 'Independent'})</span>
                    </div>
                    <div className="text-stone-400 text-[11px] mt-0.5">{reg.eventTitle || 'Cohort Event'}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        reg.checkedIn
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/50 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      {reg.checkedIn ? 'Checked In' : 'Confirmed'}
                    </span>
                    <div className="text-[10px] text-stone-500 mt-1">{reg.city || 'Delhi NCR'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Matrix */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
          Quick Administrative Workflows
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('visual_manager')}
            className="p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#282828] hover:border-[#C5A46D]/40 rounded-lg text-left transition-all cursor-pointer"
          >
            <div className="font-semibold text-white flex items-center justify-between">
              <span>Visual Manager</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C5A46D]" />
            </div>
            <div className="text-stone-400 text-[11px] mt-1">Replace website images live without code</div>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className="p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#282828] hover:border-[#C5A46D]/40 rounded-lg text-left transition-all cursor-pointer"
          >
            <div className="font-semibold text-white flex items-center justify-between">
              <span>Publish Article</span>
              <FileText className="w-3.5 h-3.5 text-[#C5A46D]" />
            </div>
            <div className="text-stone-400 text-[11px] mt-1">Write insights, news, and founder stories</div>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className="p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#282828] hover:border-[#C5A46D]/40 rounded-lg text-left transition-all cursor-pointer"
          >
            <div className="font-semibold text-white flex items-center justify-between">
              <span>Founder Brief</span>
              <Mail className="w-3.5 h-3.5 text-[#C5A46D]" />
            </div>
            <div className="text-stone-400 text-[11px] mt-1">Dispatch email newsletter to {activeSubscribers.length} founders</div>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#282828] hover:border-[#C5A46D]/40 rounded-lg text-left transition-all cursor-pointer"
          >
            <div className="font-semibold text-white flex items-center justify-between">
              <span>Platform Settings</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A46D]" />
            </div>
            <div className="text-stone-400 text-[11px] mt-1">Update WhatsApp CTA, banner & SEO</div>
          </button>
        </div>
      </div>
    </div>
  );
}
