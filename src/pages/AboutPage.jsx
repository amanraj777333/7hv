import React from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { Eye, Target, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const { navigate, getImage } = useApp();

  const values = [
    {
      title: "Trust",
      description: "We operate with radical transparency. No fabricated stats, no deceptive pitch fees, and no exaggerated funding claims. Trust is our foundational currency."
    },
    {
      title: "Collaboration",
      description: "We believe individual builders move faster alone, but ecosystem builders go further together. We break industry silos to unlock collective intelligence."
    },
    {
      title: "Ambition",
      description: "We support founders who dare to solve hard, structural problems for India and the global economy, providing a launchpad worthy of their audacity."
    },
    {
      title: "Integrity",
      description: "Every gathering is curated with pure intent. We ensure every participant—whether a student or seasoned VC—is treated with fairness and respect."
    },
    {
      title: "Innovation",
      description: "We continuously rethink how founders connect, learn, and grow, replacing stale networking mixers with high-signal, productive roundtables."
    },
    {
      title: "Long-Term Thinking",
      description: "We are not building a fleeting event agency. We are building enduring multi-decade infrastructure for India’s next generation of business leaders."
    }
  ];

  const aboutHeroImg = getImage(
    'about.hero.image',
    'https://images.unsplash.com/photo-1522071823991-b9671e9d7fbe?auto=format&fit=crop&w=1200&q=80',
    'Entrepreneurs in collaborative session'
  );

  return (
    <div className="bg-[#F7F5F0] text-[#101010]">
      <SEO
        title="About Us — A Shared Vision for Indian Entrepreneurship"
        description="Learn about 7 Horse Ventures: our mission, vision, and core values building a connected ecosystem for founders, investors, and business leaders."
        canonicalUrl="/about"
      />

      {/* Hero Header (Compact: py-12 sm:py-16) */}
      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-[#C5A46D]">
              Our foundation & philosophy
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              A shared vision to build a disciplined entrepreneurial ecosystem
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              7 Horse Ventures was founded on a simple premise: great enterprises flourish when founders have direct, honest access to verified peers, seasoned operators, corporate buyers, and ethical capital.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are & Why We Exist (py-12 sm:py-16) */}
      <section className="py-12 sm:py-16 border-b border-[#E8E5DF] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            <ScrollReveal>
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#A9874D]">
                  Who we are
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
                  An Emerging Founder & Business Ecosystem
                </h2>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  7 Horse Ventures is an emerging founder and business ecosystem focused on bringing together entrepreneurs, founders, investors, professionals, students, and organisations.
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Active across vibrant startup corridors, collaborative spaces, and online forums, our vision is to build an open, interconnected ecosystem where founders, creators, and operators collaborate and grow together.
                </p>
                <div className="p-3 bg-[#FAF7F2] border-l-2 border-[#C5A46D] rounded text-xs text-stone-600">
                  <span className="font-semibold text-[#101010] block mb-0.5">Authentic Growth Policy:</span>
                  We do not pretend to be decades old or claim false portfolio metrics. We are actively constructing this ecosystem brick by brick with dedicated community cohorts.
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="space-y-4 bg-[#F7F5F0] p-6 sm:p-8 rounded-2xl border border-[#E8E5DF]">
                <span className="text-xs font-mono text-[#A9874D]">
                  Why we exist
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#101010] font-heading">
                  The Founder Journey Demands Real Signal
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  The entrepreneurial journey can be dauntingly solitary without the right network, timely domain advice, and authentic collaboration opportunities.
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  In a market inundated with transactional event organizers and vanity awards, founders struggle to identify genuine peer relationships and credible investors.
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium text-[#101010]">
                  We exist to create spaces and experiences where people can meet without pretense, exchange actionable playbooks, and forge enduring commercial relationships.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Vision & Mission (py-12 sm:py-16) */}
      <section className="py-12 sm:py-16 bg-[#101010] text-white border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <ScrollReveal delay={50}>
              <div className="p-6 sm:p-8 rounded-2xl bg-[#181818] border border-[#242424] space-y-3 h-full">
                <div className="w-10 h-10 rounded-lg bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#D8C39A]">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#C5A46D] block">
                  Our vision
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold font-heading text-white">
                  To build a connected entrepreneurial ecosystem that contributes to the sustainable growth of startups, businesses, and the next generation of entrepreneurs.
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  We envision a future where any determined entrepreneur in India can access high-calibre guidance, collaborative peers, and genuine venture opportunities.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <div className="p-6 sm:p-8 rounded-2xl bg-[#181818] border border-[#242424] space-y-3 h-full">
                <div className="w-10 h-10 rounded-lg bg-[#C5A46D]/15 border border-[#C5A46D]/30 flex items-center justify-center text-[#D8C39A]">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-[#C5A46D] block">
                  Our mission
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold font-heading text-white">
                  To connect people, create meaningful experiences, encourage collaboration, and build partnerships that support entrepreneurship and business growth.
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  We execute this by organizing curated founder roundtables, transparent pitch forums, legal clinics, and strategic corporate alliances.
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Our Values (py-12 sm:py-16) */}
      <section className="py-12 sm:py-16 bg-[#FFFFFF] border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal>
            <div className="max-w-3xl mb-8 space-y-2">
              <span className="text-xs font-mono text-[#A9874D]">
                Guiding principles
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
                Our values
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                The ethical compass that guides every cohort we convene, partnership we sign, and initiative we launch.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((val, idx) => (
              <ScrollReveal key={val.title} delay={idx * 60}>
                <div
                  className="p-5 rounded-xl bg-[#FAF7F2] border border-[#E8E5DF] hover:border-[#C5A46D] transition-all duration-200 card-shadow-lift h-full"
                >
                  <div className="text-xs font-mono font-medium text-[#A9874D] mb-1">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-semibold text-[#101010] font-heading mb-1">
                    {val.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-[#F7F5F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#101010] font-heading">
            Join the movement to build a better ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Become part of an open, connected ecosystem of founders, builders, and operators.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/community')}
              className="px-5 py-2.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold rounded transition-colors cursor-pointer"
            >
              Join Us
            </button>
            <button
              onClick={() => navigate('/events')}
              className="px-5 py-2.5 bg-[#101010] hover:bg-stone-800 text-white text-xs font-medium rounded transition-colors cursor-pointer"
            >
              Explore Events
            </button>
            <button
              onClick={() => navigate('/collaborate')}
              className="px-5 py-2.5 border border-stone-300 hover:border-[#C5A46D] text-[#101010] text-xs font-medium rounded transition-colors cursor-pointer bg-white"
            >
              Collaborate
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
