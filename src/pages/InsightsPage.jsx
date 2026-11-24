import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import ScrollReveal from '../components/ScrollReveal';
import { BookOpen, Search, Clock, ArrowRight, Share2, Tag, Calendar, User } from 'lucide-react';

export default function InsightsPage({ articleSlug }) {
  const { articles, navigate, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // If a slug is passed, display the individual article detail view
  if (articleSlug) {
    const article = articles.find((a) => a.slug === articleSlug || a.id === articleSlug);

    if (!article) {
      return (
        <div className="bg-[#F7F5F0] text-[#101010] min-h-[60vh] flex items-center justify-center py-16 px-4">
          <div className="text-center space-y-4 max-w-md bg-white p-8 rounded-2xl border border-[#E8E5DF]">
            <h2 className="text-xl font-bold font-heading">Article Not Found</h2>
            <p className="text-xs text-stone-600">The requested article could not be located or has been archived.</p>
            <button
              onClick={() => navigate('/insights')}
              className="px-4 py-2 bg-[#101010] text-white text-xs font-bold rounded"
            >
              Back to Insights
            </button>
          </div>
        </div>
      );
    }

    const relatedArticles = articles
      .filter((a) => a.id !== article.id && a.published)
      .slice(0, 2);

    const handleShare = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('Article link copied to clipboard', 'info');
      }
    };

    return (
      <div className="bg-[#F7F5F0] text-[#101010] min-h-screen py-12 sm:py-16">
        <SEO
          title={`${article.title} — 7 Horse Insights`}
          description={article.excerpt}
          ogType="article"
          ogImage={article.coverImage}
        />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Back button */}
          <div>
            <button
              onClick={() => navigate('/insights')}
              className="text-xs font-semibold text-stone-600 hover:text-[#101010] inline-flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Insights Directory
            </button>
          </div>

          {/* Article Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#101010] text-[#D8C39A]">
                {article.category}
              </span>
              <span className="text-xs text-stone-500 font-mono">
                {article.readTime} • Published {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#101010] font-heading leading-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
              {article.excerpt}
            </p>

            {/* Author Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-b border-[#E8E5DF] py-3">
              <div className="flex items-center gap-3">
                <img
                  src={article.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={article.author?.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E8E5DF]"
                />
                <div>
                  <span className="text-xs font-bold text-stone-900 block font-heading">
                    {article.author?.name}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    {article.author?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="p-2 border border-stone-300 hover:border-[#C5A46D] rounded text-stone-700 hover:text-black transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                title="Share article"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          {article.coverImage && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-sm">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body Content */}
          <div className="prose prose-stone max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed space-y-4 whitespace-pre-line bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E5DF]">
            {article.content}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Tag className="w-3.5 h-3.5 text-[#A9874D]" />
              <span className="text-xs font-semibold text-stone-500">Tags:</span>
              {article.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded bg-stone-200/60 text-stone-700 text-xs font-medium">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-8 border-t border-[#E8E5DF] space-y-4">
              <h3 className="text-lg font-bold text-[#101010] font-heading">
                Related Founder Insights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/insights/${rel.slug}`)}
                    className="p-4 bg-white rounded-xl border border-[#E8E5DF] hover:border-[#C5A46D] transition-colors cursor-pointer space-y-1"
                  >
                    <span className="text-[10px] text-[#A9874D] font-mono uppercase font-bold">{rel.category}</span>
                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{rel.title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2">{rel.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  // Directory View
  const publishedArticles = (articles || []).filter((a) => a.published && (a.type === 'blog' || !a.type));

  const tagsList = ['All', ...new Set(publishedArticles.flatMap((a) => a.tags || []))];

  const filtered = publishedArticles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || (art.tags && art.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="Venture Insights & Analysis — 7 Horse Ventures"
        description="Thought leadership, playbooks, unit economics analysis, and venture guides written for founders and operators."
        canonicalUrl="/insights"
      />

      {/* Header (Compact Spacing: py-14 sm:py-18) */}
      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono text-[#C5A46D]">
              Knowledge infrastructure
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
              Venture Insights & Tactical Playbooks
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Deep dives on fundraising, cap-table mechanics, enterprise sales, team hiring, and regulatory frameworks curated by experienced operators.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-6 bg-white border-b border-[#E8E5DF] sticky top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:border-[#C5A46D] focus:outline-none bg-[#FAF7F2]"
              />
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-center overflow-x-auto pb-1 sm:pb-0">
              {tagsList.slice(0, 6).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                    selectedTag === tag
                      ? 'bg-[#101010] text-[#D8C39A] font-semibold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((art, idx) => (
                <ScrollReveal key={art.id} delay={idx * 0.06}>
                  <article
                    onClick={() => navigate(`/insights/${art.slug}`)}
                    className="bg-white rounded-xl overflow-hidden border border-[#E8E5DF] hover:border-stone-400 transition-colors cursor-pointer group shadow-xs flex flex-col justify-between card-shadow-lift hover-lift h-full"
                  >
                    <div>
                      <div className="relative aspect-[16/9] overflow-hidden bg-stone-900">
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 bg-[#101010]/90 text-[#D8C39A] px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-xs">
                          {art.category}
                        </span>
                      </div>

                      <div className="p-6 space-y-2.5">
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono">
                          <span>{art.readTime}</span>
                          <span>•</span>
                          <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                        </div>

                        <h3 className="text-base font-semibold text-stone-900 font-heading group-hover:text-[#A9874D] transition-colors line-clamp-2 leading-snug">
                          {art.title}
                        </h3>

                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          {art.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 mt-2">
                      <span className="font-medium text-stone-700">{art.author?.name}</span>
                      <span className="text-[#A9874D] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Read Article <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center max-w-md mx-auto bg-white rounded-2xl border border-[#E8E5DF] space-y-3">
              <BookOpen className="w-8 h-8 text-[#A9874D] mx-auto" />
              <h3 className="text-base font-bold text-stone-900 font-heading">No insights found</h3>
              <p className="text-xs text-stone-600">Try adjusting your keyword search or tag selection.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('All');
                }}
                className="px-4 py-1.5 bg-[#101010] text-white text-xs font-semibold rounded cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
