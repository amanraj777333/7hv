import React, { useEffect, useState } from 'react';

/**
 * AnimatedConstellation
 * High-performance animated SVG representing the 7 Horse syndication network:
 * Interconnected nodes (Founders, Angels, VCs, Operators, Mentors, Ecosystem Partners)
 * with animated dashed connector lines and glowing pulsing beacons.
 */
export function AnimatedConstellation({ className = '', height = 320 }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className={`relative overflow-hidden select-none pointer-events-none ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 800 320"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold Gradient */}
          <linearGradient id="constellationGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D8C39A" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#C5A46D" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8A6D3B" stopOpacity="0.1" />
          </linearGradient>

          {/* Node Glow Filter */}
          <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Grid Lines */}
        <g stroke="#262626" strokeWidth="0.5" strokeOpacity="0.4">
          <line x1="0" y1="80" x2="800" y2="80" strokeDasharray="4 8" />
          <line x1="0" y1="160" x2="800" y2="160" strokeDasharray="4 8" />
          <line x1="0" y1="240" x2="800" y2="240" strokeDasharray="4 8" />
          <line x1="200" y1="0" x2="200" y2="320" strokeDasharray="4 8" />
          <line x1="400" y1="0" x2="400" y2="320" strokeDasharray="4 8" />
          <line x1="600" y1="0" x2="600" y2="320" strokeDasharray="4 8" />
        </g>

        {/* Dynamic Connector Pathways */}
        <g fill="none" stroke="url(#constellationGold)" strokeWidth="1.2">
          {/* Main Highway 1 */}
          <path
            d="M 90,140 Q 240,60 400,120 T 710,100"
            strokeDasharray="6 4"
            className={reducedMotion ? '' : 'animate-[dashFlow_20s_linear_infinite]'}
          />
          {/* Main Highway 2 */}
          <path
            d="M 120,220 Q 300,260 480,180 T 730,220"
            strokeDasharray="4 6"
            className={reducedMotion ? '' : 'animate-[dashFlowReverse_24s_linear_infinite]'}
          />
          {/* Cross Bridge */}
          <line x1="240" y1="95" x2="320" y2="230" strokeOpacity="0.3" strokeDasharray="3 3" />
          <line x1="400" y1="120" x2="480" y2="180" strokeOpacity="0.5" strokeDasharray="2 4" />
          <line x1="560" y1="90" x2="650" y2="210" strokeOpacity="0.3" strokeDasharray="3 3" />
        </g>

        {/* Pulse Rings around Primary Hubs */}
        {!reducedMotion && (
          <>
            <circle cx="400" cy="120" r="16" fill="none" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.3" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="240" cy="95" r="12" fill="none" stroke="#D8C39A" strokeWidth="1" strokeOpacity="0.3" className="animate-ping" style={{ animationDuration: '4s' }} />
            <circle cx="580" cy="105" r="14" fill="none" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.25" className="animate-ping" style={{ animationDuration: '3.5s' }} />
          </>
        )}

        {/* Network Nodes */}
        {/* Node 1: Founders */}
        <g filter="url(#nodeGlow)">
          <circle cx="90" cy="140" r="4.5" fill="#C5A46D" />
          <circle cx="90" cy="140" r="7" fill="none" stroke="#D8C39A" strokeWidth="1" strokeOpacity="0.6" />
        </g>

        {/* Node 2: Builders */}
        <g filter="url(#nodeGlow)">
          <circle cx="240" cy="95" r="5" fill="#D8C39A" />
        </g>

        {/* Center Keystone Hub: 7 Horse Core */}
        <g filter="url(#nodeGlow)">
          <circle cx="400" cy="120" r="8" fill="#141414" stroke="#C5A46D" strokeWidth="2.5" />
          <circle cx="400" cy="120" r="4" fill="#C5A46D" />
        </g>

        {/* Node 4: Angels */}
        <g filter="url(#nodeGlow)">
          <circle cx="480" cy="180" r="5" fill="#D8C39A" />
        </g>

        {/* Node 5: Institutional VCs */}
        <g filter="url(#nodeGlow)">
          <circle cx="580" cy="105" r="5" fill="#C5A46D" />
        </g>

        {/* Node 6: Partners */}
        <g filter="url(#nodeGlow)">
          <circle cx="710" cy="100" r="4.5" fill="#D8C39A" />
        </g>

        {/* Secondary Constellation Nodes */}
        <circle cx="120" cy="220" r="3.5" fill="#8A6D3B" />
        <circle cx="320" cy="230" r="4" fill="#C5A46D" />
        <circle cx="650" cy="210" r="3.5" fill="#D8C39A" />
        <circle cx="730" cy="220" r="3" fill="#8A6D3B" />
      </svg>
    </div>
  );
}

/**
 * AnimatedEmblemMark
 * Vector SVG of the brand's '7' mark with subtle stroke draw-on and gold ambient shimmer
 */
export function AnimatedEmblemMark({ size = 32, className = '' }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" className="w-full h-full">
        <defs>
          <linearGradient id="emblemGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F6F1E6" />
            <stop offset="40%" stopColor="#D8C39A" />
            <stop offset="80%" stopColor="#C5A46D" />
            <stop offset="100%" stopColor="#8A6D3B" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Box */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="10"
          fill="#101010"
          stroke="url(#emblemGoldGrad)"
          strokeWidth="1.5"
        />

        {/* Stylised Dynamic Number 7 */}
        <path
          d="M 12,14 L 35,14 L 21,36 L 17,36 L 29,18 L 12,18 Z"
          fill="url(#emblemGoldGrad)"
        />

        {/* Mane Whisps Vector Accent */}
        <path
          d="M 28,14 Q 36,10 40,15 Q 36,18 31,18 Z"
          fill="#D8C39A"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedGoldDivider
 * Subtle editorial gold divider line that animates across the section width
 */
export function AnimatedGoldDivider({ className = '' }) {
  return (
    <div className={`relative h-[1px] w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A46D]/60 to-transparent" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF]/80 to-transparent w-1/3 animate-[shimmerMove_3.5s_infinite]"
      />
    </div>
  );
}
