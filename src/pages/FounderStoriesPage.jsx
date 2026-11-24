import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { UserCheck, Search, ArrowRight, Quote, Calendar, Building } from 'lucide-react';

export default function FounderStoriesPage({ storySlug }) {
  const { articles, navigate } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  if (storySlug) {
    const story = articles.find((a) => (a.slug === storySlug || a.id === storySlug) && a.type === 'founder-story');

    if (!story) {
      return (
        <div className="bg-[#F7F5F0] text-[#101010] min-h-[60vh] flex items-center justify-center py-16 px-4">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-[#E8E5DF]">
            <h2 className="text-xl font-bold font-heading">Story Not Found</h2>
            <button onClick={() => navigate('/founder-stories')} className="px-4 py-2 bg-[#101010] text-white text-xs font-bold rounded">
              Back to Stories
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#F7F5F0] text-[#101010] min-h-screen py-12 sm:py-16">
        <SEO title={`${story.title} — Founder Stories`} description={story.excerpt} />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <button
              onClick={() => navigate('/founder-stories')}
              className="text-xs font-semibold text-stone-600 hover:text-[#101010] inline-flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Founder Stories
            </button>
          </div>

          <div className="space-y-4">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#101010] text-[#D8C39A]">
              Founder spotlight
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#101010] font-heading leading-tight">
              {story.title}
            </h1>
            <p className="text-sm text-stone-600 font-medium leading-relaxed">
              {story.excerpt}
            </p>
          </div>

          {story.coverImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E8E5DF]">
              <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E5DF] text-xs sm:text-sm text-stone-800 leading-relaxed space-y-4 whitespace-pre-line">
            {story.content}
          </div>
        </article>
      </div>
    );
  }

  const storiesList = (articles || []).filter((a) => a.published && a.type === 'founder-story');
  const filtered = storiesList.filter(
    (s) => s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="Founder Stories & Interviews — 7 Horse Ventures"
        description="Authentic journeys from the field: raw lessons on early traction, sales, hiring, failure, and breakthroughs."
        canonicalUrl="/founder-stories"
      />

      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-[#C5A46D]">
              Unvarnished journeys
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Founder Stories & Field Journeys
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              No press-release fluff or vanity metrics. Deep, honest conversations with builders on surviving the early zero-to-one phase and building enduring companies.
            </p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-[#E8E5DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search founder journeys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:border-[#C5A46D] focus:outline-none bg-[#FAF7F2]"
            />
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <ScrollReveal key={item.id} delay={idx * 0.06}>
                  <article
                    onClick={() => navigate(`/founder-stories/${item.slug}`)}
                    className="bg-white rounded-xl overflow-hidden border border-[#E8E5DF] hover:border-stone-400 transition-colors cursor-pointer group shadow-xs flex flex-col justify-between card-shadow-lift hover-lift h-full"
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-500 ease-out" />
                        <span className="absolute top-3 left-3 bg-[#101010]/90 text-[#D8C39A] px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-xs">
                          Spotlight
                        </span>
                      </div>

                      <div className="p-6 space-y-2">
                        <span className="text-[10px] text-stone-400 font-mono block">
                          {item.readTime} • {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <h3 className="text-base font-semibold text-stone-900 font-heading group-hover:text-[#A9874D] transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-stone-600 line-clamp-3">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-[#A9874D] font-medium">
                      <span>Read interview</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-[#E8E5DF] text-xs text-stone-600">
              No matching founder stories currently published.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
