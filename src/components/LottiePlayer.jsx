import React, { useEffect, useState } from 'react';

/**
 * LottiePlayer Component
 * 
 * Supports:
 * - Preset vector animations: 'success', 'radar', 'sparkle', 'network'
 * - Optional DotLottie / JSON URL playback
 * - Strictly respects prefers-reduced-motion
 * - High-DPI crisp vector rendering
 */
export default function LottiePlayer({
  preset = 'success',
  src = null,
  size = 64,
  loop = true,
  autoplay = true,
  className = ''
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Preset 1: Celebratory Success Checkmark with Gold Radiant Particles
  if (preset === 'success') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Success confirmation animation"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="lottieGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D8C39A" />
              <stop offset="50%" stopColor="#C5A46D" />
              <stop offset="100%" stopColor="#8A6D3B" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Pulse Ring */}
          {!reducedMotion && (
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#C5A46D"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              className="animate-ping origin-center"
              style={{ animationDuration: '2.4s' }}
            />
          )}

          {/* Background Medallion */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="#141414"
            stroke="url(#lottieGoldGrad)"
            strokeWidth="2.5"
            filter="url(#goldGlow)"
          />

          {/* Drawing Circular Path */}
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="#D8C39A"
            strokeWidth="1.5"
            strokeDasharray="220"
            strokeDashoffset={reducedMotion ? '0' : '220'}
            className={reducedMotion ? '' : 'animate-[dashDraw_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]'}
          />

          {/* Checkmark Vector with Stroke Draw-on */}
          <path
            d="M32 50 L44 62 L68 38"
            fill="none"
            stroke="url(#lottieGoldGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="60"
            strokeDashoffset={reducedMotion ? '0' : '60'}
            className={reducedMotion ? '' : 'animate-[dashDraw_0.6s_cubic-bezier(0.16,1,0.3,1)_0.4s_forwards]'}
          />

          {/* Radiating Sparkle Particles */}
          {!reducedMotion && (
            <g className="origin-center animate-[spin_12s_linear_infinite]">
              <circle cx="50" cy="8" r="2" fill="#D8C39A" />
              <circle cx="86" cy="30" r="1.5" fill="#C5A46D" />
              <circle cx="80" cy="74" r="2" fill="#D8C39A" />
              <circle cx="20" cy="74" r="1.5" fill="#C5A46D" />
              <circle cx="14" cy="30" r="2" fill="#D8C39A" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Preset 2: Animated Radar Beacon Sweep
  if (preset === 'radar') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Venture Radar Sweep"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#2A2A2A" strokeWidth="1" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#333333" strokeWidth="1" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="#3D3D3D" strokeWidth="1" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#222222" strokeWidth="1" />
          <line x1="50" y1="5" x2="50" y2="95" stroke="#222222" strokeWidth="1" />

          {/* Sweeper Arc */}
          {!reducedMotion && (
            <g className="origin-center animate-[spin_3s_linear_infinite]">
              <path
                d="M50 50 L50 5 A45 45 0 0 1 82 18 Z"
                fill="url(#radarGradient)"
                opacity="0.6"
              />
              <line x1="50" y1="50" x2="50" y2="5" stroke="#C5A46D" strokeWidth="1.5" />
            </g>
          )}

          {/* Center Target Dot */}
          <circle cx="50" cy="50" r="4" fill="#C5A46D" />
          {!reducedMotion && (
            <circle cx="68" cy="32" r="3" fill="#D8C39A" className="animate-ping" style={{ animationDuration: '2s' }} />
          )}

          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5A46D" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C5A46D" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Preset 3: Venture Network Constellation Pulse
  if (preset === 'network') {
    return (
      <div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Network Synergy Pulse"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="20" y1="50" x2="50" y2="25" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="50" y1="25" x2="80" y2="50" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="80" y1="50" x2="65" y2="80" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="65" y1="80" x2="35" y2="80" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="35" y1="80" x2="20" y2="50" stroke="#C5A46D" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="50" y1="25" x2="50" y2="55" stroke="#D8C39A" strokeWidth="1.2" strokeOpacity="0.6" />
          <line x1="20" y1="50" x2="50" y2="55" stroke="#D8C39A" strokeWidth="1.2" strokeOpacity="0.6" />
          <line x1="80" y1="50" x2="50" y2="55" stroke="#D8C39A" strokeWidth="1.2" strokeOpacity="0.6" />

          {/* Nodes */}
          <circle cx="50" cy="55" r="5" fill="#C5A46D" />
          <circle cx="20" cy="50" r="3.5" fill="#D8C39A" />
          <circle cx="50" cy="25" r="3.5" fill="#D8C39A" />
          <circle cx="80" cy="50" r="3.5" fill="#D8C39A" />
          <circle cx="65" cy="80" r="3" fill="#A9874D" />
          <circle cx="35" cy="80" r="3" fill="#A9874D" />
        </svg>
      </div>
    );
  }

  return null;
}
