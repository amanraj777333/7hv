import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import {
  Menu,
  X,
  ArrowUpRight,
  Lock,
  GraduationCap,
  Sparkles,
  UserCheck,
  Volume2
} from 'lucide-react';

export default function Navbar() {
  const {
    currentPath,
    navigate,
    currentUser,
    setSignInModalOpen,
    openWhatsAppCommunity,
    isVoicePlaying,
    toggleVoice
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
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
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-panel glass-specular-top py-3 shadow-[0_12px_32px_rgba(0,0,0,0.4)] bg-[#101010]/95 backdrop-blur-md'
          : 'bg-[#101010] border-b border-[#222222] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] rounded-md p-1 shrink-0"
            aria-label="7 Horse Ventures Home"
          >
            <Logo size="normal" />
          </button>

          {/* Desktop Navigation (Clean, Compact, No Separate Ecosystem Dropdown) */}
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

            {/* 5. Academy (Prominent Navigation Item) */}
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

          {/* Right-Side Actions: Soothing Voice, Sign In, Join Community (WhatsApp) */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-3">
            
            {/* Action 1: Soothing Voice Guide */}
            <button
              onClick={toggleVoice}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-2 cursor-pointer btn-press ${
                isVoicePlaying
                  ? 'border-[#C5A46D] bg-[#C5A46D]/15 text-[#C5A46D] shadow-[0_0_14px_rgba(197,164,109,0.35)]'
                  : 'border-[#2E2E2E] bg-[#181818] text-stone-300 hover:text-white hover:border-[#C5A46D]'
              }`}
              title={isVoicePlaying ? 'Pause Soothing Voice Guide' : 'Listen to Soothing Voice Guide'}
              aria-label="Soothing Voice Guide"
            >
              <Volume2 className={`w-3.5 h-3.5 text-[#C5A46D] ${isVoicePlaying ? 'animate-pulse' : ''}`} />
              <span className="text-[11px] font-heading hidden md:inline">
                {isVoicePlaying ? 'Playing Guide' : 'Soothing Voice'}
              </span>
              {isVoicePlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D] animate-ping" />
              )}
            </button>

            {/* Action 2: Sign In */}
            {currentUser ? (
              <button
                onClick={() => navigate('/admin')}
                className="px-3 py-1.5 text-xs font-medium border border-[#333333] rounded transition-colors flex items-center gap-1.5 cursor-pointer btn-press text-stone-300 hover:text-white hover:bg-white/5"
                title={`Signed in as ${currentUser.name}`}
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C5A46D]" />
                <span className="hidden md:inline">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setSignInModalOpen(true)}
                className="px-3 py-1.5 text-xs font-medium border border-[#333333] rounded transition-colors flex items-center gap-1.5 cursor-pointer btn-press text-stone-300 hover:text-white hover:border-[#C5A46D]"
              >
                <Lock className="w-3 h-3 text-[#C5A46D]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Action 3: Join Community (Direct WhatsApp Community Link with Animated Hover Emoji) */}
            <button
              onClick={openWhatsAppCommunity}
              className="px-3.5 py-1.5 bg-[#C5A46D] hover:bg-[#D8C39A] text-black text-xs font-semibold rounded flex items-center gap-2 cursor-pointer shadow-xs transition-all duration-200 btn-press group"
              title="Join 7 Horse Ventures WhatsApp Community"
            >
              <span className="text-sm inline-block transition-transform duration-300 group-hover:scale-135 select-none" aria-hidden="true">
                👥
              </span>
              <span>Join Community</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Header Actions: Soothing Voice + Hamburger Menu */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={toggleVoice}
              className={`p-2 rounded-lg border text-xs cursor-pointer ${
                isVoicePlaying
                  ? 'border-[#C5A46D] bg-[#C5A46D]/20 text-[#C5A46D]'
                  : 'border-[#2E2E2E] bg-[#181818] text-stone-400 hover:text-white'
              }`}
              aria-label="Soothing Voice"
              title="Soothing Voice"
            >
              <Volume2 className={`w-4 h-4 ${isVoicePlaying ? 'animate-pulse text-[#C5A46D]' : ''}`} />
            </button>

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
        <div className="xl:hidden fixed inset-x-0 top-[65px] border-b border-[#282828] shadow-2xl p-5 transition-all duration-200 max-h-[calc(100vh-70px)] overflow-y-auto bg-[#121212] text-white">
          {/* Top Actions in Mobile Drawer */}
          <div className="grid grid-cols-2 gap-2 pb-5 border-b border-stone-500/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSignInModalOpen(true);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold rounded border border-stone-700 text-stone-300 hover:text-white cursor-pointer"
            >
              {currentUser ? `Signed In (${currentUser.name.split(' ')[0]})` : 'Sign In'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openWhatsAppCommunity();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold bg-[#C5A46D] hover:bg-[#D8C39A] text-black rounded cursor-pointer shadow-xs flex items-center justify-center gap-1.5 group"
            >
              <span className="text-sm transition-transform duration-200 group-hover:scale-125">👥</span>
              <span>Join Community</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Core Navigation Items (No Separate Ecosystem Item) */}
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
