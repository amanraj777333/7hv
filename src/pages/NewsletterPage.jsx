import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import LottiePlayer from '../components/LottiePlayer';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Inbox } from 'lucide-react';

export default function NewsletterPage() {
  const { showToast, newsletters, getImage } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: 'Gurugram',
    interests: ['Venture Insights', 'Upcoming Events'],
    consent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const newsletterImg = getImage(
    'newsletter.header',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    '7H Founder Brief Desk'
  );

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please confirm your consent to receive the 7H Founder Brief.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'Newsletter Landing Page',
          status: 'active',
          doubleOptIn: true
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        showToast('Subscribed! Welcome to the 7H Founder Brief.', 'success');
      } else {
        setErrorMsg(data.message || 'Subscription failed');
      }
    } catch (err) {
      setErrorMsg('Network error while processing subscription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sentIssues = (newsletters || []).filter((n) => n.status === 'sent');

  return (
    <div className="bg-[#F7F5F0] text-[#101010] min-h-screen">
      <SEO
        title="7H Founder Brief — Official Monthly Venture Newsletter"
        description="Subscribe to 7H Founder Brief: High-signal analysis, venture mechanics, upcoming private roundtables, and operator case studies."
        canonicalUrl="/newsletter"
      />

      {/* Hero Header */}
      <section className="bg-[#101010] text-white py-12 sm:py-16 border-b border-[#282828]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#1D1D1D] border border-[#2c2c2c] text-xs text-[#D8C39A]">
                <Mail className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="font-medium text-[10px]">
                  Official ecosystem dispatch
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-heading leading-tight tracking-tight">
                7H Founder Brief
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal max-w-xl">
                A high-signal monthly dispatch curated for founders, investors, and business leaders. Delivered on the first Thursday of every month: raw operator breakdowns, regional funding trends, and priority invitations to private roundtables.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A46D]" /> Monthly cadence
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A46D]" /> Priority cohort invitations
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A46D]" /> One-click unsubscribe
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#333333] max-w-md mx-auto">
                <img
                  src={newsletterImg.url}
                  alt={newsletterImg.alt}
                  style={{ objectPosition: newsletterImg.position, objectFit: newsletterImg.fit }}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Subscription Card Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          {subscribed ? (
            <div className="bg-white p-8 sm:p-10 rounded-2xl border-2 border-[#C5A46D] text-center space-y-4 shadow-md animate-fadeIn">
              <div className="mx-auto flex justify-center">
                <LottiePlayer preset="success" size={56} />
              </div>
              <h2 className="text-xl font-bold text-stone-900 font-heading">
                Subscription Confirmed
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                Thank you for subscribing to the <strong>7H Founder Brief</strong>. You will receive our next monthly dispatch and priority invitations for cohort roundtables.
              </p>
              <button
                onClick={() => setSubscribed(false)}
                className="text-xs text-[#A9874D] font-bold underline cursor-pointer btn-press"
              >
                Subscribe another email address
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 sm:p-10 rounded-2xl border border-[#E8E5DF] shadow-md space-y-6">
              <div>
                <h2 className="text-xl font-bold text-stone-900 font-heading">
                  Join 240+ Founders & Investors on the List
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Customise your preferences below to receive tailored regional alerts.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-md">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubscribe} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Varun Khanna"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Work / Preferred Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="varun@startup.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-[#C5A46D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Preferred City / Hub</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded bg-white focus:border-[#C5A46D] focus:outline-none"
                  >
                    <option>Gurugram</option>
                    <option>New Delhi</option>
                    <option>Noida</option>
                    <option>Bengaluru</option>
                    <option>Mumbai</option>
                    <option>Online / Remote</option>
                    <option>Other / Pan-India</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Areas of Interest</label>
                  <div className="flex flex-wrap gap-2">
                    {['Venture Insights', 'Upcoming Events', 'Startup News', 'Angel Investing', 'Founder Spotlights'].map((interest) => (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-[#101010] text-[#D8C39A] font-semibold'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="nl-consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded border-stone-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                  />
                  <label htmlFor="nl-consent" className="text-[11px] text-stone-600 leading-normal">
                    I consent to receiving the 7H Founder Brief and occasional cohort notices. I can unsubscribe at any time with one click.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#101010] hover:bg-[#252525] text-white text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Subscribing...' : 'Subscribe to 7H Founder Brief'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A46D]" />
                </button>
              </form>
            </div>
          )}

          {/* Past Dispatches Archive */}
          {sentIssues.length > 0 && (
            <div className="mt-12 space-y-4">
              <h3 className="text-base font-bold text-stone-900 font-heading">
                Recent Dispatches & Issues
              </h3>
              <div className="space-y-3">
                {sentIssues.map((issue) => (
                  <div key={issue.id} className="p-4 bg-white rounded-xl border border-[#E8E5DF] space-y-1">
                    <span className="text-[10px] text-stone-400 font-mono">
                      Sent {new Date(issue.sentAt).toLocaleDateString()}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">{issue.subject}</h4>
                    <p className="text-xs text-stone-600">{issue.previewText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
