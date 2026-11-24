import React from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import { FIVE_PILLARS } from '../data/initialData';
import { AnimatedConstellation, AnimatedGoldDivider } from '../components/SvgAnimations';
import ScrollReveal from '../components/ScrollReveal';
import { ArrowRight, CheckCircle2, Users, Target, Calendar, ShieldCheck } from 'lucide-react';

export default function EcosystemPage() {
  const { navigate } = useApp();

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="Our Ecosystem — Five Synergistic Pillars"
        description="Explore the five foundational pillars of 7 Horse Ventures: Founder Connect, Pitch & Capital Connect, Professional Ecosystem, Corporate Partnerships, and Startup Growth."
        canonicalUrl="/ecosystem"
      />

      {/* Hero Header */}
      <section className="relative bg-[#101010] text-white py-14 sm:py-18 border-b border-[#242424] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
          <AnimatedConstellation height={360} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono text-[#C5A46D]">
              Platform architecture
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              A connected ecosystem built for sustainable venture scale
            </h1>
            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              Unlike single-format meetup clubs, 7 Horse Ventures operates five interconnected pillars designed to support founders across community, capital, professional advisory, corporate integrations, and sustainable venture growth.
            </p>
          </div>
        </div>
      </section>

      {/* 5 Pillars Deep Dive with Unique Visual Compositions */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {FIVE_PILLARS.map((pillar, idx) => {
            const isDark = idx % 2 === 1;

            return (
              <ScrollReveal key={pillar.id} delay={0.05}>
                <div
                  id={pillar.id}
                  className={`rounded-2xl overflow-hidden border card-shadow-lift transition-all duration-300 ${
                    isDark
                      ? 'bg-[#101010] text-white border-[#242424]'
                      : 'bg-white text-[#101010] border-[#E8E5DF]'
                  }`}
                >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 sm:p-12 lg:p-14 items-center">
                  
                  {/* Left Column (Details) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-medium px-2.5 py-0.5 rounded ${
                        isDark ? 'bg-[#181818] text-[#D8C39A] border border-[#2c2c2c]' : 'bg-[#FAF7F2] text-[#A9874D] border border-[#E8E5DF]'
                      }`}>
                        Pillar {pillar.number}
                      </span>
                      <span className={`text-xs font-medium ${
                        isDark ? 'text-stone-400' : 'text-stone-500'
                      }`}>
                        {pillar.subtitle}
                      </span>
                    </div>

                    <h2 className={`text-2xl sm:text-3xl font-semibold font-heading leading-tight ${
                      isDark ? 'text-white' : 'text-[#101010]'
                    }`}>
                      {pillar.title}
                    </h2>

                    <p className={`text-sm sm:text-base leading-relaxed ${
                      isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}>
                      {pillar.whatItIs}
                    </p>

                    {/* Breakdown Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'bg-[#181818] border-[#242424]' : 'bg-[#FAF7F2] border-[#E8E5DF]'
                      }`}>
                        <span className={`text-xs font-medium block mb-1 ${
                          isDark ? 'text-[#D8C39A]' : 'text-[#A9874D]'
                        }`}>
                          Who it serves
                        </span>
                        <p className={`text-xs leading-relaxed ${
                          isDark ? 'text-stone-300' : 'text-stone-600'
                        }`}>
                          {pillar.whoItServes}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl border ${
                        isDark ? 'bg-[#181818] border-[#242424]' : 'bg-[#FAF7F2] border-[#E8E5DF]'
                      }`}>
                        <span className={`text-xs font-medium block mb-1 ${
                          isDark ? 'text-[#D8C39A]' : 'text-[#A9874D]'
                        }`}>
                          What to expect
                        </span>
                        <p className={`text-xs leading-relaxed ${
                          isDark ? 'text-stone-300' : 'text-stone-600'
                        }`}>
                          {pillar.whatToExpect}
                        </p>
                      </div>
                    </div>

                    {/* How to Participate */}
                    <div className="pt-2 space-y-2">
                      <span className={`text-xs font-medium block ${
                        isDark ? 'text-white' : 'text-[#101010]'
                      }`}>
                        How to participate:
                      </span>
                      <p className={`text-xs leading-relaxed ${
                        isDark ? 'text-stone-400' : 'text-stone-600'
                      }`}>
                        {pillar.howToParticipate}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => navigate(pillar.ctaLink)}
                        className={`px-5 py-2.5 rounded text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                          isDark
                            ? 'bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010]'
                            : 'bg-[#101010] hover:bg-[#252525] text-white'
                        }`}
                      >
                        <span>{pillar.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column (Visual Showcase) */}
                  <div className="lg:col-span-5">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 group">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-full object-cover brightness-95"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                        <span className="font-mono text-[#D8C39A] text-[10px] block">
                          7 Horse Ventures Ecosystem
                        </span>
                        <span className="font-medium drop-shadow-sm">
                          {pillar.title}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          );
        })}
        </div>
      </section>

      {/* Cross-Link Banner */}
      <section className="py-16 bg-[#101010] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Looking for a specific engagement track?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/for-founders')}
              className="px-5 py-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-[#C5A46D] text-white text-xs font-semibold rounded cursor-pointer transition-all"
            >
              Founders Track
            </button>
            <button
              onClick={() => navigate('/for-investors')}
              className="px-5 py-2.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-[#C5A46D] text-white text-xs font-semibold rounded cursor-pointer transition-all"
            >
              Investors Track
            </button>
            <button
              onClick={() => navigate('/partnerships')}
              className="px-5 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-bold rounded cursor-pointer transition-all"
            >
              Corporate & Alliances
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
