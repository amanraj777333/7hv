import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import {
  Menu,
  X,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';

export default function Navbar() {
  const {
    currentPath,
    navigate,
    openWhatsAppCommunity
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 flex items-center ${
        isScrolled
          ? 'bg-[#101010]/95 backdrop-blur-md border-b border-[#242424] shadow-[0_8px_30px_rgba(0,0,0,0.6)]'
          : 'bg-[#101010]/90 backdrop-blur-sm border-b border-[#1c1c1c]'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] rounded-md p-1 shrink-0"
            aria-label="7 Horse Ventures Home"
          >
            <Logo size="normal" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('/')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded cursor-pointer relative ${
                isActive('/') && currentPath === '/'
                  ? 'text-[#C5A46D] font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Home
              {isActive('/') && currentPath === '/' && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C5A46D] rounded-full" />
              )}
            </button>

            {/* 2. Events */}
            <button
              onClick={() => handleNavClick('/events')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded cursor-pointer relative ${
                isActive('/events')
                  ? 'text-[#C5A46D] font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Events
              {isActive('/events') && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C5A46D] rounded-full" />
              )}
            </button>

            {/* 3. Pitch to Us */}
            <button
              onClick={() => handleNavClick('/pitch-capital-connect')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded cursor-pointer relative ${
                isActive('/pitch-capital-connect') || isActive('/pitch-to-us')
                  ? 'text-[#C5A46D] font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Pitch to Us
              {(isActive('/pitch-capital-connect') || isActive('/pitch-to-us')) && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C5A46D] rounded-full" />
              )}
            </button>

            {/* 4. Collaborations */}
            <button
              onClick={() => handleNavClick('/collaborate')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded cursor-pointer relative ${
                isActive('/collaborate') || isActive('/partnerships')
                  ? 'text-[#C5A46D] font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Collaborations
              {(isActive('/collaborate') || isActive('/partnerships')) && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C5A46D] rounded-full" />
              )}
            </button>

            {/* 5. Academy */}
            <button
              onClick={() => handleNavClick('/academy')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded cursor-pointer relative inline-flex items-center gap-1.5 ${
                isActive('/academy')
                  ? 'text-[#C5A46D] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#C5A46D]" />
              <span>Academy</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30">
                Sessions
              </span>
              {isActive('/academy') && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C5A46D] rounded-full" />
              )}
            </button>

            {/* 6. About Us */}
            <button
              onClick={() => handleNavClick('/about')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors rounded cursor-pointer relative ${
                isActive('/about')
                  ? 'text-[#C5A46D] font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              About Us
              {isActive('/about') && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#C5A46D] rounded-full" />
              )}
            </button>
          </nav>

          {/* Right-Side Action: Join Community CTA (No Login or Sound button) */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={openWhatsAppCommunity}
              className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer shadow-xs transition-all duration-200 btn-press group"
              title="Join 7 Horse Ventures WhatsApp Community"
            >
              <span className="text-sm inline-block transition-transform duration-300 group-hover:scale-135 select-none" aria-hidden="true">
                👥
              </span>
              <span>Join Community</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md transition-colors cursor-pointer text-stone-300 hover:text-white hover:bg-[#181818]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#C5A46D]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[72px] border-b border-[#282828] shadow-2xl p-5 transition-all duration-200 max-h-[calc(100vh-72px)] overflow-y-auto bg-[#121212]/98 backdrop-blur-md text-white">
          {/* Top WhatsApp Community Action in Mobile Drawer */}
          <div className="pb-5 border-b border-stone-500/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsAppCommunity();
              }}
              className="w-full py-3 text-center text-xs font-semibold bg-[#C5A46D] hover:bg-[#D8C39A] text-black rounded-lg cursor-pointer shadow-xs flex items-center justify-center gap-2 group transition-colors"
            >
              <span className="text-base transition-transform duration-200 group-hover:scale-125">👥</span>
              <span>Join WhatsApp Community</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Core Navigation Items */}
          <div className="flex flex-col space-y-1 py-4 border-b border-stone-500/20">
            {[
              { label: 'Home', path: '/' },
              { label: 'Events', path: '/events' },
              { label: 'Pitch to Us', path: '/pitch-capital-connect' },
              { label: 'Collaborations', path: '/collaborate' },
              { label: 'Academy', path: '/academy', isSpecial: true },
              { label: 'About Us', path: '/about' }
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center justify-between text-left py-2.5 px-3 text-sm font-medium rounded transition-colors ${
                  isActive(item.path)
                    ? 'text-[#C5A46D] bg-[#C5A46D]/10 font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isSpecial && <GraduationCap className="w-4 h-4 text-[#C5A46D]" />}
                  <span>{item.label}</span>
                </div>
                {item.isSpecial && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#C5A46D]/20 text-[#C5A46D]">
                    Sessions
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Secondary Directory & Network Links */}
          <div className="pt-4 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 px-3 block mb-1">
              Explore Network
            </span>
            {[
              { label: 'Founders Directory', path: '/founders' },
              { label: 'Startups Directory', path: '/startups' },
              { label: 'Opportunity Radar', path: '/opportunities' },
              { label: 'Venture Insights', path: '/insights' },
              { label: 'Founder Stories', path: '/founder-stories' },
              { label: 'Startup News', path: '/news' },
              { label: 'Contact Desk', path: '/contact' }
            ].map((sub) => (
              <button
                key={sub.path}
                onClick={() => handleNavClick(sub.path)}
                className="w-full text-left py-2 px-3 text-xs rounded transition-colors text-stone-400 hover:text-white hover:bg-white/5"
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
