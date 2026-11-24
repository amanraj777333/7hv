import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Filter,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function AcademyPage() {
  const { academySessions, navigate, theme } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'

  const isDark = theme === 'dark';

  const categories = ['All', 'Masterclass', 'Workshop', 'Expert Session', 'Online Learning'];

  const upcomingList = (academySessions || []).filter((s) => s.status === 'upcoming');
  const pastList = (academySessions || []).filter((s) => s.status === 'completed' || s.status === 'archived');

  const currentList = activeTab === 'upcoming' ? upcomingList : pastList;

  const filteredSessions = currentList.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-[#101010] text-[#F7F5F0]' : 'bg-[#F7F5F0] text-[#101010]'}`}>
      <SEO
        title="Academy — Founder Masterclasses, Workshops & Clinics | 7 Horse Ventures"
        description="Practical educational and knowledge-sharing sessions for founders, aspiring entrepreneurs, students, professionals, and business owners."
        canonicalUrl="/academy"
      />

      {/* Hero Header */}
      <section className={`py-14 sm:py-20 border-b transition-colors duration-200 ${
        isDark ? 'bg-[#141414] border-[#242424]' : 'bg-white border-[#E8E5DF]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border bg-[#C5A46D]/10 border-[#C5A46D]/30 text-[#C5A46D]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>7 Horse Ventures Academy</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Practical Masterclasses & Operational Clinics
            </h1>
            
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
              High-signal knowledge sharing for founders, aspiring entrepreneurs, university builders, domain specialists, and business owners. No recycled corporate slides—just vetted playbooks on cap tables, customer discovery, legal governance, and venture mechanics.
            </p>

            {/* Quick Action Navigation */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#sessions-browser"
                className="px-5 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded cursor-pointer transition-colors btn-press"
              >
                Explore Available Sessions
              </a>
              <button
                onClick={() => navigate('/collaborate')}
                className={`px-5 py-2.5 text-xs font-medium rounded border cursor-pointer transition-colors btn-press ${
                  isDark ? 'border-stone-700 text-stone-300 hover:text-white hover:bg-white/5' : 'border-stone-300 text-stone-700 hover:text-black hover:bg-stone-100'
                }`}
              >
                Propose a Topic or Collaboration
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions Browser Navigation */}
      <section id="sessions-browser" className={`py-6 border-b sticky top-[72px] z-30 shadow-xs transition-colors duration-200 ${
        isDark ? 'bg-[#141414]/95 border-[#242424] backdrop-blur-md' : 'bg-white/95 border-[#E8E5DF] backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Tab Switcher: Upcoming vs Past */}
            <div className="flex items-center gap-1 p-1 rounded-lg border bg-stone-500/10 border-stone-500/20">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-[#C5A46D] text-black shadow-xs'
                    : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-black'
                }`}
              >
                Upcoming Sessions ({upcomingList.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'past'
                    ? 'bg-[#C5A46D] text-black shadow-xs'
                    : isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600 hover:text-black'
                }`}
              >
                Past Archives ({pastList.length})
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors btn-press ${
                    selectedCategory === cat
                      ? 'bg-[#101010] text-[#D8C39A] font-semibold border border-[#C5A46D]/40'
                      : isDark
                        ? 'bg-[#1C1C1C] text-stone-300 hover:bg-[#252525] border border-[#2A2A2A]'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Main Sessions Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session, idx) => {
                const isOnline = session.format === 'Online';
                const isHybrid = session.format === 'Hybrid';

                return (
                  <ScrollReveal key={session.id} delay={idx * 0.06}>
                    <article
                      onClick={() => navigate(`/academy/${session.slug || session.id}`)}
                      className={`rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between h-full card-shadow-lift hover-lift ${
                        isDark ? 'bg-[#161616] border-[#262626] hover:border-stone-600' : 'bg-white border-[#E8E5DF] hover:border-stone-400'
                      }`}
                    >
                      <div>
                        {/* Cover Image & Badges */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
                          <img
                            src={session.coverImage || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80'}
                            alt={session.title}
                            className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/80 text-[#D8C39A] backdrop-blur-xs border border-white/10">
                              {session.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-xs border ${
                              isOnline
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/20'
                                : isHybrid
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/20'
                                  : 'bg-blue-950/80 text-blue-300 border-blue-500/20'
                            }`}>
                              {session.format}
                            </span>
                          </div>

                          {session.targetAudience && (
                            <span className="absolute bottom-3 left-3 bg-black/85 text-stone-300 px-2 py-0.5 rounded text-[10px] font-mono border border-white/10">
                              {session.targetAudience}
                            </span>
                          )}
                        </div>

                        {/* Content Body */}
                        <div className="p-6 space-y-3">
                          {/* Date & Time */}
                          <div className="flex items-center gap-2 text-[11px] font-mono text-[#C5A46D]">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{session.displayDate || new Date(session.dateTime).toLocaleDateString()}</span>
                          </div>

                          <h3 className="text-base font-semibold font-heading line-clamp-2 leading-snug group-hover:text-[#C5A46D] transition-colors">
                            {session.title}
                          </h3>

                          <p className={`text-xs line-clamp-3 leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                            {session.shortDescription}
                          </p>

                          {/* Speaker Profile Preview */}
                          {session.speaker && (
                            <div className="pt-2 flex items-center gap-3 border-t border-stone-500/15">
                              <img
                                src={session.speaker.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                                alt={session.speaker.name}
                                className="w-8 h-8 rounded-full object-cover border border-stone-500/20"
                              />
                              <div>
                                <span className="text-xs font-semibold block font-heading">
                                  {session.speaker.name}
                                </span>
                                <span className={`text-[11px] block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                                  {session.speaker.role} • {session.speaker.organization}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer CTA & Capacity */}
                      <div className={`p-6 pt-3 border-t flex items-center justify-between text-xs ${
                        isDark ? 'border-stone-800 text-stone-400' : 'border-stone-100 text-stone-600'
                      }`}>
                        <span className="text-[11px] font-mono">
                          {session.status === 'upcoming'
                            ? `${session.registeredCount || 0} / ${session.capacity || 50} Registered`
                            : 'Archived Workshop'}
                        </span>
                        
                        <span className="font-semibold text-[#C5A46D] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>{session.status === 'upcoming' ? 'Register Session' : 'View Playbook'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className={`p-12 text-center max-w-md mx-auto rounded-2xl border space-y-3 ${
              isDark ? 'bg-[#161616] border-[#2A2A2A]' : 'bg-white border-[#E8E5DF]'
            }`}>
              <BookOpen className="w-8 h-8 text-[#C5A46D] mx-auto" />
              <h3 className="text-base font-bold font-heading">No sessions in this track</h3>
              <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                Check back shortly or explore other categories in our schedule.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-1.5 bg-[#C5A46D] text-black text-xs font-semibold rounded cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Bottom Educational Callout */}
      <section className={`py-14 sm:py-18 border-t transition-colors duration-200 ${
        isDark ? 'bg-[#141414] border-[#242424]' : 'bg-white border-[#E8E5DF]'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="text-xs font-mono text-[#C5A46D]">
            Knowledge Sharing & Peer Mentorship
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold font-heading">
            Want to lead an expert masterclass or propose a curriculum?
          </h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
            We partner with experienced operators, chartered accountants, legal counsels, and seasoned entrepreneurs to deliver uncompromised value to India's builder community.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/collaborate')}
              className="px-6 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded cursor-pointer transition-colors btn-press"
            >
              Collaborate on an Academy Session
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
