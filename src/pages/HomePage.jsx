import React, { useEffect, useRef } from 'react';
import { useApp, OFFICIAL_WHATSAPP_LINK } from '../context/AppContext';
import SEO from '../components/SEO';
import { WHO_WE_BRING_TOGETHER, FIVE_PILLARS, DIFFERENTIATORS } from '../data/initialData';
import { gsap } from 'gsap';
import { AnimatedConstellation, AnimatedGoldDivider } from '../components/SvgAnimations';
import ScrollReveal from '../components/ScrollReveal';
import {
  ArrowRight,
  CheckCircle2,
  Rocket,
  TrendingUp,
  Zap,
  GraduationCap,
  Briefcase,
  Building2,
  Calendar,
  Compass,
  ArrowUpRight,
  BookOpen,
  MessageCircle
} from 'lucide-react';

export default function HomePage() {
  const { navigate, events, setSelectedEventModal, getImage, websiteSettings, articles } = useApp();
  const heroRef = useRef(null);

  // GSAP Entrance Animation (gsap-web skill: ctx.revert() on unmount, prefers-reduced-motion check)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-hero-badge',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.gsap-hero-title',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.12, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.gsap-hero-desc',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.gsap-hero-cta',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.38, ease: 'power2.out', stagger: 0.08 }
      );
      gsap.fromTo(
        '.gsap-hero-stat',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out', stagger: 0.08 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const iconMap = {
    Rocket: Rocket,
    TrendingUp: TrendingUp,
    Zap: Zap,
    GraduationCap: GraduationCap,
    Briefcase: Briefcase,
    Building2: Building2
  };

  // Section visibility toggles from CMS
  const visibility = websiteSettings.sectionVisibility || {};

  // Dynamic Image Mapping
  const heroImg = getImage(
    'home.hero.background',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    'Founders and investors engaged in strategic discussion at 7 Horse Ventures'
  );

  const introImg = getImage(
    'home.introduction.image',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    'Founders in deep collaborative session'
  );

  const founderConnectImg = getImage(
    'home.founder_connect.image',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    '7H Founder Connect in action'
  );

  const pitchConnectImg = getImage(
    'home.pitch_connect.image',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    'Startup presenting at 7H Pitch & Capital Connect'
  );

  const latestArticles = (articles || []).filter((a) => a.published).slice(0, 3);

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="Connect. Build. Grow. Scale."
        description="7 Horse Ventures is building a connected ecosystem for founders, entrepreneurs, investors, professionals, and businesses."
      />

      {/* SECTION 2: HERO SECTION (Refined compact editorial padding: py-12 md:py-16 lg:py-20) */}
      {visibility.hero !== false && (
        <section ref={heroRef} className="relative bg-[#101010] text-[#E8E5DF] pt-10 pb-14 md:pt-16 md:pb-20 overflow-hidden border-b border-[#282828]">
          {/* Subtle dot pattern and animated SVG constellation network */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C5A46D_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            <AnimatedConstellation height={450} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Content (7 Cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="gsap-hero-badge inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181818] border border-[#262626] text-xs text-[#D8C39A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D]" />
                  <span className="font-medium text-[11px] text-stone-300">
                    Connected Ecosystem
                  </span>
                  <span className="text-stone-600">•</span>
                  <span className="text-stone-400 text-[11px]">Founders • Builders • Investors</span>
                </div>

                <h1 className="gsap-hero-title text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold text-white leading-[1.15] tracking-tight font-heading">
                  A closed-door venture ecosystem for <span className="text-[#C5A46D]">high-signal builders</span>
                </h1>

                <p className="gsap-hero-desc text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-normal">
                  No crowded mixers or unsolicited sales pitches. 7 Horse Ventures brings together verified founders, active investors, and domain practitioners for structured roundtables, curated showcases, and meaningful collaboration across physical hubs and online sessions.
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => navigate('/events')}
                    className="gsap-hero-cta px-4 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold rounded transition-colors flex items-center gap-2 cursor-pointer shadow-xs btn-press"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate('/community')}
                    className="gsap-hero-cta px-4 py-2.5 border border-[#2e2e2e] hover:border-stone-400 text-stone-200 hover:text-white text-xs font-medium rounded transition-colors cursor-pointer bg-[#161616] btn-press"
                  >
                    Join Us
                  </button>

                  <button
                    onClick={() => navigate('/collaborate')}
                    className="gsap-hero-cta px-4 py-2.5 text-stone-400 hover:text-[#C5A46D] text-xs font-medium transition-colors cursor-pointer btn-press"
                  >
                    Collaborate →
                  </button>
                </div>

                <div className="pt-5 border-t border-[#222222] grid grid-cols-3 gap-3 text-xs text-stone-400">
                  <div className="gsap-hero-stat glass-panel rounded-xl p-3 border border-white/10 hover-lift">
                    <span className="block text-white font-medium text-xs sm:text-sm">People First</span>
                    <span className="text-[10px] text-stone-400">Founders, builders & creators</span>
                  </div>
                  <div className="gsap-hero-stat glass-panel rounded-xl p-3 border border-white/10 hover-lift">
                    <span className="block text-white font-medium text-xs sm:text-sm">Flexible Formats</span>
                    <span className="text-[10px] text-stone-400">In-person, online & hybrid</span>
                  </div>
                  <div className="gsap-hero-stat glass-panel rounded-xl p-3 border border-white/10 hover-lift">
                    <span className="block text-white font-medium text-xs sm:text-sm">Ethical Capital</span>
                    <span className="text-[10px] text-stone-400">Zero pay-to-pitch fees</span>
                  </div>
                </div>
              </div>

              {/* Right Media (5 Cols) - Responsive & Manageable from CMS */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#333333] group max-w-lg mx-auto">
                  <img
                    src={heroImg.url}
                    alt={heroImg.alt}
                    style={{ objectPosition: heroImg.position, objectFit: heroImg.fit }}
                    className="w-full aspect-[4/3] sm:aspect-[16/11] object-cover brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-black/20" />

                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[#141414] border border-[#2a2a2a] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-medium text-[#C5A46D] block">
                        7 Horse Ventures
                      </span>
                      <span className="text-xs font-semibold text-white">
                        Founder Cohorts & Roundtables
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-md bg-[#1a1a1a] flex items-center justify-center border border-[#333333]">
                      <span className="text-xs font-bold text-[#D8C39A]">7H</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: INTRODUCTION (Editorial Split - Tightened Spacing: py-14 md:py-18) */}
      {visibility.intro !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#F7F5F0] border-b border-[#E8E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-5 order-2 lg:order-1">
                <ScrollReveal delay={100}>
                  <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E8E5DF] max-w-md mx-auto img-zoom-hover">
                    <img
                      src={introImg.url}
                      alt={introImg.alt}
                      style={{ objectPosition: introImg.position, objectFit: introImg.fit }}
                      className="w-full aspect-[4/3] object-cover"
                      loading="lazy"
                    />
                    <div className="p-3.5 bg-white border-t border-[#E8E5DF]">
                      <p className="text-xs text-stone-600">
                        High-signal conversations happen in closed rooms with trusted peers, not in crowded banquet halls.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
                <ScrollReveal>
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8A6D3B]">
                    <span>Our purpose and philosophy</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#101010] leading-tight font-heading mt-1">
                    Real peer relationships. Concrete commercial outcomes.
                  </h2>

                  <div className="space-y-3 text-stone-700 text-sm sm:text-base leading-relaxed mt-3">
                    <p>
                      Most founders describe the entrepreneurial journey as unexpectedly isolating. Finding peers who understand your unit economics, customer acquisition bottlenecks, and fundraising realities is rare.
                    </p>
                    <p>
                      7 Horse Ventures replaces transactional networking with disciplined, curated gatherings. We screen every attendee to ensure balanced cohorts of genuine builders, active capital allocators, and enterprise operators.
                    </p>
                    <p className="text-stone-600 text-xs sm:text-sm">
                      Our cohorts meet regularly across major innovation corridors, collaborative venues, and online sessions to exchange playbooks, solve bottlenecks, and build lasting partnerships.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/about')}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#101010] hover:text-[#8A6D3B] border-b border-[#101010] hover:border-[#8A6D3B] pb-0.5 transition-colors cursor-pointer btn-press"
                    >
                      <span>Read about our vision and values</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: WHO WE BRING TOGETHER (Asymmetric 6-Card Grid - py-14 sm:py-18) */}
      {visibility.audience !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#FFFFFF] border-b border-[#E8E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal>
              <div className="max-w-3xl mb-8 sm:mb-10 space-y-2">
                <span className="text-xs font-mono text-[#8A6D3B]">
                  Stakeholder architecture
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#101010] font-heading tracking-tight">
                  Six interconnected stakeholders, zero fragmented silos
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Venture growth accelerates when founders have direct lines to investors, enterprise buyers, and seasoned domain practitioners. We intentionally bring together these six core groups:
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {WHO_WE_BRING_TOGETHER.map((group, index) => {
                const IconComp = iconMap[group.icon] || Rocket;
                const isHighlight = index === 0 || index === 1;

                return (
                  <ScrollReveal key={group.id} delay={index * 60}>
                    <div
                      className={`p-6 sm:p-7 rounded-xl transition-all duration-200 flex flex-col justify-between border card-shadow-lift h-full ${
                        isHighlight
                          ? 'bg-[#101010] text-white border-[#2a2a2a]'
                          : 'bg-[#F7F5F0] text-[#101010] border-[#E8E5DF] hover:border-stone-400 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-9 h-9 rounded-md flex items-center justify-center ${
                              isHighlight
                                ? 'bg-[#181818] border border-[#2e2e2e] text-[#D8C39A]'
                                : 'bg-white border border-[#E8E5DF] text-[#8A6D3B]'
                            }`}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                              isHighlight
                                ? 'bg-[#1e1e1e] text-[#D8C39A]'
                                : 'bg-[#E8E5DF] text-stone-700'
                            }`}
                          >
                            {group.badge}
                          </span>
                        </div>

                        <div>
                          <h3
                            className={`text-base font-semibold font-heading mb-0.5 ${
                              isHighlight ? 'text-white' : 'text-[#101010]'
                            }`}
                          >
                            {group.title}
                          </h3>
                          <span
                            className={`text-xs font-medium block ${
                              isHighlight ? 'text-[#C5A46D]' : 'text-stone-500'
                            }`}
                          >
                            {group.subtitle}
                          </span>
                        </div>

                        <p
                          className={`text-xs leading-relaxed ${
                            isHighlight ? 'text-stone-300' : 'text-stone-600'
                          }`}
                        >
                          {group.description}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-black/10 dark:border-white/10">
                        <button
                          onClick={() => {
                            if (group.id === 'founders') navigate('/for-founders');
                            else if (group.id === 'investors') navigate('/for-investors');
                            else if (group.id === 'corporates') navigate('/partnerships');
                            else navigate('/community');
                          }}
                          className={`text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer btn-press ${
                            isHighlight
                              ? 'text-[#D8C39A] hover:text-white'
                              : 'text-[#101010] hover:text-[#8A6D3B]'
                          }`}
                        >
                          <span>Explore participation</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* SECTION 5: OUR ECOSYSTEM (5 Core Pillars - py-14 sm:py-18) */}
      {visibility.ecosystem !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#101010] text-[#E8E5DF] border-b border-[#242424]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mb-10 space-y-2">
              <span className="text-xs font-mono text-[#C5A46D]">
                Platform architecture
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white font-heading tracking-tight">
                Five structured pillars that support founders from validation to scale
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Networking without structure delivers fleeting contacts. 7 Horse Ventures operates five interconnected initiatives providing peer advisory, investor showcases, corporate pilots, and operational clinics.
              </p>
            </div>

            <div className="space-y-6">
              {FIVE_PILLARS.map((pillar, idx) => {
                const isEven = idx % 2 === 1;

                return (
                  <div
                    key={pillar.id}
                    className="bg-[#141414] rounded-xl border border-[#242424] p-5 sm:p-7 transition-colors hover:border-[#383838]"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-[#282828]">
                          <img
                            src={pillar.image}
                            alt={pillar.title}
                            className="w-full h-full object-cover brightness-90"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-[#101010]/90 px-2 py-0.5 rounded text-[10px] font-medium text-[#D8C39A] border border-[#2e2e2e]">
                            Pillar {pillar.number}
                          </div>
                        </div>
                      </div>

                      <div className={`lg:col-span-7 space-y-3 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div>
                          <span className="text-xs font-medium text-[#C5A46D] block">
                            {pillar.subtitle}
                          </span>
                          <h3 className="text-lg sm:text-xl font-semibold text-white font-heading mt-0.5">
                            {pillar.title}
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                          {pillar.summary}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-stone-400">
                          <div className="p-2.5 bg-[#121212] rounded border border-[#242424]">
                            <span className="font-medium text-stone-200 block text-[11px]">Who it serves</span>
                            <span className="text-[11px] text-stone-400">{pillar.whoItServes}</span>
                          </div>
                          <div className="p-2.5 bg-[#121212] rounded border border-[#242424]">
                            <span className="font-medium text-stone-200 block text-[11px]">What to expect</span>
                            <span className="text-[11px] text-stone-400">{pillar.whatToExpect}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => navigate(pillar.ctaLink)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C5A46D] hover:text-white transition-colors cursor-pointer"
                          >
                            <span>{pillar.ctaText}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* SECTION 6: FLAGSHIP EXPERIENCES (py-14 sm:py-18) */}
      {visibility.flagship !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#FFFFFF] border-b border-[#E8E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
                <span className="text-xs font-mono text-[#8A6D3B]">
                  Flagship gathering formats
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#101010] font-heading tracking-tight">
                  Two curated formats engineered for high signal
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Designed from the ground up to eliminate vanity award pitches and banquet-hall chaos. Every participant is pre-screened for relevance.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Experience 1: 7H Founder Connect */}
              <ScrollReveal delay={50}>
                <div className="bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] overflow-hidden flex flex-col justify-between hover:border-stone-400 transition-all duration-200 card-shadow-lift h-full shadow-xs">
                  <div>
                    <div className="relative aspect-[16/9] overflow-hidden img-zoom-hover">
                      <img
                        src={founderConnectImg.url}
                        alt={founderConnectImg.alt}
                        style={{ objectPosition: founderConnectImg.position, objectFit: founderConnectImg.fit }}
                        className="w-full h-full object-cover brightness-95"
                      />
                      <div className="absolute top-3 left-3 bg-[#101010]/90 text-[#D8C39A] text-xs font-medium px-2.5 py-0.5 rounded border border-[#2e2e2e]">
                        7H Founder Connect
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-semibold text-[#101010] font-heading">
                        Closed-door roundtables with zero vendor sales pitches
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        An intimate room limited to 30–50 verified founders and operators. We curate small-table discussions around distribution, unit economics, and hiring mechanics—so every conversation delivers actionable value.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-medium text-[#A9874D] block">
                          Core format highlights:
                        </span>
                        <ul className="space-y-1 text-xs text-stone-700">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#A9874D] shrink-0" />
                            <span>Pre-screened cohort matchings based on business stage & sector</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#A9874D] shrink-0" />
                            <span>Thematic Chatham House roundtables on real operational bottlenecks</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#A9874D] shrink-0" />
                            <span>Direct peer-to-peer enterprise pilot exchange and co-marketing</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => navigate('/founder-connect')}
                      className="w-full py-2.5 bg-[#141414] hover:bg-[#222222] text-white text-xs font-medium rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-press"
                    >
                      <span>Apply for next founder roundtable</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Experience 2: 7H Pitch & Capital Connect */}
              <ScrollReveal delay={120}>
                <div className="bg-[#FAF7F2] rounded-xl border border-[#E8E5DF] overflow-hidden flex flex-col justify-between hover:border-stone-400 transition-all duration-200 card-shadow-lift h-full shadow-xs">
                  <div>
                    <div className="relative aspect-[16/9] overflow-hidden img-zoom-hover">
                      <img
                        src={pitchConnectImg.url}
                        alt={pitchConnectImg.alt}
                        style={{ objectPosition: pitchConnectImg.position, objectFit: pitchConnectImg.fit }}
                        className="w-full h-full object-cover brightness-95"
                      />
                      <div className="absolute top-3 left-3 bg-[#101010]/90 text-[#D8C39A] text-xs font-medium px-2.5 py-0.5 rounded border border-[#2e2e2e]">
                        7H Pitch & Capital Connect
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-semibold text-[#101010] font-heading">
                        Curated investor showcases with zero pay-to-pitch fees
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                        We never charge founders to present before investors. Selected startups present structured 7-minute showcases to accredited angel syndicates and micro-VCs, followed by unvarnished feedback and private breakout meetings.
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-medium text-[#8A6D3B] block">
                          Core format highlights:
                        </span>
                        <ul className="space-y-1 text-xs text-stone-700">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8A6D3B] shrink-0" />
                            <span>Merit-based selection; no application or presentation fees</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8A6D3B] shrink-0" />
                            <span>Direct evaluation by active cheque-writers and seasoned operators</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8A6D3B] shrink-0" />
                            <span>Private breakout discussions with interested syndicate leads</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => navigate('/pitch-capital-connect')}
                      className="w-full py-2.5 bg-[#141414] hover:bg-[#222222] text-white text-xs font-medium rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-press"
                    >
                      <span>Submit pitch deck for review</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </section>
      )}

      {/* LATEST INSIGHTS & NEWS MODULE (Dynamic from CMS) */}
      {latestArticles.length > 0 && (
        <section className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#E8E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-medium text-[#8A6D3B]">
                  Knowledge and analysis
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
                  Latest insights and founder perspectives
                </h2>
              </div>
              <button
                onClick={() => navigate('/insights')}
                className="text-xs font-medium text-[#101010] hover:text-[#8A6D3B] flex items-center gap-1"
              >
                <span>View all articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {latestArticles.map((art, idx) => (
                <ScrollReveal key={art.id} delay={idx * 70}>
                  <article
                    onClick={() => navigate(`/insights/${art.slug}`)}
                    className="bg-white rounded-xl overflow-hidden border border-[#E8E5DF] hover:border-stone-400 transition-all duration-200 cursor-pointer group card-shadow-lift h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden bg-stone-900 img-zoom-hover">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#101010]/90 text-[#D8C39A] px-2 py-0.5 rounded text-[10px] font-medium">
                          {art.category}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[10px] text-stone-500 font-mono block">
                          {art.readTime} • {new Date(art.createdAt).toLocaleDateString()}
                        </span>
                        <h3 className="text-base font-semibold text-stone-900 font-heading group-hover:text-[#8A6D3B] transition-colors line-clamp-2">
                          {art.title}
                        </h3>
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="font-medium text-stone-700">{art.author?.name}</span>
                      <span className="text-[#8A6D3B] font-medium inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform duration-150">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: WHY 7 HORSE VENTURES? (5 Differentiators - py-14 sm:py-18) */}
      {visibility.differentiators !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#F7F5F0] border-b border-[#E8E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-4 space-y-3">
                <span className="text-xs font-mono text-[#8A6D3B]">
                  Ethos and differentiation
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading tracking-tight">
                  Built on accountability, not vanity metrics
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  We reject artificial valuations, pay-to-play stages, and superficial mixer networking. 7 Horse Ventures provides the disciplined infrastructure founders need: unvarnished peer feedback, active capital connections, and long-term operating support.
                </p>
                
                <div className="p-3.5 bg-white border border-[#E8E5DF] rounded-xl text-xs text-stone-700 space-y-1.5">
                  <span className="font-semibold text-[#101010] block">
                    Transparency standard:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Participation in our events or ecosystem does not guarantee investments, customer contracts, or commercial deals. All capital allocation decisions remain independent between startups and accredited investors.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                {DIFFERENTIATORS.map((diff) => (
                  <div
                    key={diff.number}
                    className="p-5 bg-white rounded-xl border border-[#E8E5DF] hover:border-[#C5A46D] transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="text-base font-bold font-mono text-[#A9874D] shrink-0">
                        {diff.number}
                      </span>
                      <div className="space-y-0.5">
                        <h3 className="text-sm sm:text-base font-bold text-[#101010] font-heading">
                          {diff.title}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {diff.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* SECTION 8: CORPORATE & ECOSYSTEM PARTNERSHIPS (py-14 sm:py-18) */}
      {visibility.partnerships !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#101010] text-[#E8E5DF] border-b border-[#282828]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mb-10 space-y-2">
              <span className="text-xs font-medium text-[#C5A46D]">
                Institutional alliances
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white font-heading tracking-tight">
                Build the ecosystem with us
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                We believe strong entrepreneurial ecosystems are built through collaboration. We welcome organisations that want to engage with founders, share knowledge, and contribute to India's business community.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 mb-8">
              {[
                { title: "Technology & Cloud Platforms", desc: "Credits, infra & technical masterclasses" },
                { title: "AI & SaaS Solutions", desc: "Developer tools & automated workflows" },
                { title: "Banks & Fintech Institutions", desc: "Corporate accounts, cross-border & debt" },
                { title: "Coworking & Innovation Spaces", desc: "Venues, regional hubs & member perks" },
                { title: "Universities & Academic Labs", desc: "Student founder pipelines & hackathons" },
                { title: "Incubators & Accelerators", desc: "Pipeline sharing & syndicate co-hosting" },
                { title: "Professional Service Advisory", desc: "Legal, tax, compliance & audit clinics" }
              ].map((cat, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#141414] rounded-lg border border-[#242424] hover:border-[#383838] transition-colors"
                >
                  <div className="text-xs font-semibold text-white font-heading mb-1">
                    {cat.title}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {cat.desc}
                  </div>
                </div>
              ))}

              <div className="p-4 bg-[#161616] rounded-lg border border-[#2e2e2e] flex flex-col justify-center">
                <span className="text-xs font-medium text-[#D8C39A]">Custom Collaboration</span>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Explore tailored initiatives with 7 Horse Ventures.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-[#141414] rounded-xl border border-[#242424]">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white font-heading">
                  Ready to explore partnership opportunities?
                </h4>
                <p className="text-[11px] text-stone-400">
                  View indicative sponsorship packages starting from ₹10,000 per event.
                </p>
              </div>
              <button
                onClick={() => navigate('/partnerships')}
                className="px-3.5 py-1.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-medium rounded transition-colors cursor-pointer shrink-0"
              >
                Explore partnership opportunities
              </button>
            </div>

          </div>
        </section>
      )}

      {/* SECTION 9: OUR FUTURE VISION (py-14 sm:py-18) */}
      {visibility.vision !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#FFFFFF] border-b border-[#E8E5DF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-medium text-[#8A6D3B]">
                Roadmap and strategic vision
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#101010] font-heading tracking-tight">
                Building for the next generation of entrepreneurs
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Our growth trajectory follows an intentional, phased evolution. Planned ambitions are built stage by stage with institutional discipline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 relative">
              {[
                { stage: "01", label: "Community", desc: "High-signal founder and builder circles across physical hubs and online groups." },
                { stage: "02", label: "Events", desc: "Structured Founder Connect roundtables and Pitch & Capital forums." },
                { stage: "03", label: "Collaboration", desc: "Active initiatives between startups, partner communities, and mentors." },
                { stage: "04", label: "Startup Support", desc: "Targeted masterclasses, compliance clinics, and fractional advisory." },
                { stage: "05", label: "Innovation Ecosystem", desc: "Structured incubation, venture acceleration, and multi-city expansion." }
              ].map((step) => (
                <div
                  key={step.stage}
                  className="p-4 bg-[#FAF7F2] rounded-lg border border-[#E8E5DF] relative hover:border-stone-400 transition-colors"
                >
                  <div className="text-xs font-mono font-medium text-[#8A6D3B] mb-1">
                    Phase {step.stage}
                  </div>
                  <h3 className="text-sm font-semibold text-[#101010] font-heading mb-0.5">
                    {step.label}
                  </h3>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-[11px] text-stone-500 italic">
                * Note: Future initiatives are presented as planned strategic ambitions as our ecosystem scales.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* SECTION 10: FINAL CTA (Compact py-14 sm:py-18) */}
      {visibility.cta !== false && (
        <section className="py-14 sm:py-16 md:py-18 bg-[#101010] text-white relative overflow-hidden">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
              <span className="text-xs font-mono text-[#D8C39A]">
                Next steps
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white font-heading tracking-tight leading-tight">
                Join an authentic ecosystem of founders, builders, and operators
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
                Whether you want to road-test your product with peer founders, present at curated showcases, or explore meaningful collaboration with our team and community, 7 Horse Ventures provides the room.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={OFFICIAL_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-black text-xs font-semibold rounded transition-all shadow-xs flex items-center gap-2 cursor-pointer btn-press"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join Our WhatsApp Community</span>
                </a>

                <button
                  onClick={() => navigate('/academy')}
                  className="px-5 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold rounded transition-all shadow-xs cursor-pointer btn-press flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Explore Academy Sessions</span>
                </button>

                <button
                  onClick={() => navigate('/collaborate')}
                  className="px-5 py-2.5 border border-[#2e2e2e] hover:border-stone-400 text-stone-200 hover:text-white text-xs font-medium rounded transition-all cursor-pointer bg-[#161616] btn-press"
                >
                  Collaborate With Us
                </button>
              </div>

              <p className="text-[11px] text-stone-500 pt-1">
                Curated for operational relevance • Zero pay-to-pitch fees • No unsolicited sales pitches
              </p>
            </div>
          </ScrollReveal>
        </section>
      )}
    </div>
  );
}
