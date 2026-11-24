import React from 'react';
import { useApp, OFFICIAL_WHATSAPP_LINK } from '../context/AppContext';
import Logo from './Logo';
import { Mail, MapPin, Lock, MessageCircle, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { navigate, websiteSettings, theme } = useApp();
  const contactEmail = websiteSettings?.contactEmail || 'connect@7horseventures.com';
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t pt-16 pb-12 transition-colors duration-200 ${
      isDark ? 'bg-[#0E0E0E] text-[#E8E5DF] border-[#262626]' : 'bg-[#FFFFFF] text-[#101010] border-[#E8E5DF]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b ${
          isDark ? 'border-[#222222]' : 'border-[#E8E5DF]'
        }`}>
          
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-5">
            <button
              onClick={() => navigate('/')}
              className="cursor-pointer focus:outline-none"
              aria-label="7 Horse Ventures Home"
            >
              <Logo size="large" />
            </button>

            <p className="text-xs font-mono text-[#C5A46D]">
              Connect • Build • Grow • Scale
            </p>

            <p className={`text-sm leading-relaxed max-w-md ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              7 Horse Ventures is building a connected ecosystem for founders, entrepreneurs, investors, professionals, students, startups, and corporate organisations to connect, build, grow, and scale.
            </p>

            <div className="pt-2">
              <a
                href={OFFICIAL_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-all btn-press"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Join Our WhatsApp Community</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Col 3: Ecosystem Pillars */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-white tracking-normal font-heading">
              Our ecosystem
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/founder-connect')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  7H Founder Connect
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/pitch-capital-connect')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  7H Pitch & Capital Connect
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/ecosystem')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  7H Professional Network
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/partnerships')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  Corporate & Tech Alliances
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/ecosystem')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  Startup Growth Initiatives
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Direct Portals */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-white tracking-normal font-heading">
              Community & access
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigate('/for-founders')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>For Founders</span>
                  <span className="text-[10px] text-[#C5A46D] bg-[#C5A46D]/15 px-1.5 py-0.2 rounded font-mono">Join</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/for-investors')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  For Investors & Mentors
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/academy')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Academy Sessions</span>
                  <span className="text-[10px] text-[#C5A46D] bg-[#C5A46D]/15 px-1.5 py-0.2 rounded font-mono">Masterclasses</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/events')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  Events & Roundtables
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  About Our Vision
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/collaborate')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  Collaborate With Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/community')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  Join the Community
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="text-stone-400 hover:text-[#C5A46D] transition-colors cursor-pointer text-left"
                >
                  Contact Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Verified Contact & Governance */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-white tracking-normal font-heading">
              Official desk
            </h3>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 block">General Correspondence</span>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-stone-300 hover:text-[#C5A46D] transition-colors break-all"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 block">Presence & Reach</span>
                  <span className="text-stone-300">
                    In-Person Hubs & Online Forums
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-3 bg-[#181818] border border-[#282828] rounded text-[11px] text-stone-400 leading-normal">
                  <span className="font-semibold text-stone-300 block mb-1">
                    Regulatory & Transparency Note:
                  </span>
                  7 Horse Ventures does not operate as an investment fund or guarantee investment returns, funding, or commercial outcomes.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal, Admin */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 7 Horse Ventures. All rights reserved.
          </div>

          {/* Legal Drafts Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Privacy Policy (Draft)
            </button>
            <span className="text-stone-700">•</span>
            <button
              onClick={() => navigate('/terms')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span className="text-stone-700">•</span>
            <button
              onClick={() => navigate('/disclaimer')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Event Disclaimer
            </button>
            <span className="text-stone-700">•</span>
            <button
              onClick={() => navigate('/admin')}
              className="hover:text-[#C5A46D] transition-colors cursor-pointer inline-flex items-center gap-1 text-stone-600"
              title="Ecosystem Administration"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
