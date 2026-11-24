import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { Newspaper, Search, ArrowRight, Share2, Tag, Calendar } from 'lucide-react';

export default function NewsPage({ newsSlug }) {
  const { articles, navigate, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // If a slug is specified, render the individual news story
  if (newsSlug) {
    const item = articles.find((a) => (a.slug === newsSlug || a.id === newsSlug) && a.type === 'news');

    if (!item) {
      return (
        <div className="bg-[#F7F5F0] text-[#101010] min-h-[60vh] flex items-center justify-center py-16 px-4">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-[#E8E5DF]">
            <h2 className="text-xl font-bold font-heading">News Story Not Found</h2>
            <button onClick={() => navigate('/news')} className="px-4 py-2 bg-[#101010] text-white text-xs font-bold rounded">
              Back to News
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#F7F5F0] text-[#101010] min-h-screen py-12 sm:py-16">
        <SEO title={`${item.title} — Startup News`} description={item.excerpt} />
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <button
              onClick={() => navigate('/news')}
              className="text-xs font-semibold text-stone-600 hover:text-[#101010] inline-flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Startup News
            </button>
          </div>

          <div className="space-y-4">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#101010] text-[#D8C39A]">
              {item.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#101010] font-heading leading-tight">
              {item.title}
            </h1>
            <p className="text-xs text-stone-500 font-mono">
              Published on {new Date(item.createdAt).toLocaleDateString()} • {item.author?.name}
            </p>
          </div>

          {item.coverImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E8E5DF]">
              <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E5DF] text-xs sm:text-sm text-stone-800 leading-relaxed space-y-4 whitespace-pre-line">
            {item.content}
          </div>
        </article>
      </div>
    );
  }

  // Directory of News
  const newsList = (articles || []).filter((a) => a.published && a.type === 'news');
  const filtered = newsList.filter(
    (n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="Startup & Ecosystem News — 7 Horse Ventures"
        description="Stay updated with funding rounds, policy changes, sector teardowns, and ecosystem announcements."
        canonicalUrl="/news"
      />

      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-[#C5A46D]">
              Ecosystem pulse
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Startup & Capital News
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Timely analysis on venture allocations, policy developments, technology innovations, and founder milestones across startup hubs.
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
              placeholder="Search news & updates..."
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
              {filtered.map((news, idx) => (
                <ScrollReveal key={news.id} delay={idx * 0.06}>
                  <article
                    onClick={() => navigate(`/news/${news.slug}`)}
                    className="bg-white rounded-xl overflow-hidden border border-[#E8E5DF] hover:border-stone-400 transition-colors cursor-pointer group shadow-xs flex flex-col justify-between card-shadow-lift hover-lift h-full"
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
                        <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-500 ease-out" />
                        <span className="absolute top-3 left-3 bg-[#101010]/90 text-[#D8C39A] px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-xs">
                          {news.category}
                        </span>
                      </div>

                      <div className="p-6 space-y-2">
                        <span className="text-[10px] text-stone-400 font-mono block">
                          {new Date(news.createdAt).toLocaleDateString()}
                        </span>
                        <h3 className="text-base font-semibold text-stone-900 font-heading group-hover:text-[#A9874D] transition-colors line-clamp-2 leading-snug">
                          {news.title}
                        </h3>
                        <p className="text-xs text-stone-600 line-clamp-3">
                          {news.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-[#A9874D] font-medium">
                      <span>Read report</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-[#E8E5DF] text-xs text-stone-600">
              No matching news stories currently published.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
