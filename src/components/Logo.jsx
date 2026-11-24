import React from 'react';
import { useApp } from '../context/AppContext';

export default function Logo({ variant, size = 'normal' }) {
  let themeContext = null;
  try {
    themeContext = useApp();
  } catch {}

  const currentTheme = themeContext?.theme || 'dark';
  // If variant is explicitly provided, use it. Otherwise, if theme is dark -> text is white; if light -> text is dark.
  const isDarkEmblem = variant ? variant === 'light' : currentTheme === 'dark';

  const imgDimension = size === 'large' ? 'w-10 h-10' : size === 'small' ? 'w-7 h-7' : 'w-8 h-8';
  const textClass = size === 'large' ? 'text-xl' : size === 'small' ? 'text-sm' : 'text-base';

  return (
    <div className="group flex items-center gap-2.5 select-none cursor-pointer">
      <div className="relative shrink-0">
        <img
          src="/7horse-logo.jpg"
          alt="7 Horse Ventures official emblem"
          className={`${imgDimension} rounded-lg object-cover shrink-0 border border-[#C5A46D]/40 shadow-xs transition-all duration-200 group-hover:scale-105 group-hover:border-[#C5A46D] group-hover:shadow-[0_0_12px_rgba(197,164,109,0.35)]`}
        />
        {/* Specular Edge Highlight */}
        <div className="absolute inset-0 rounded-lg pointer-events-none border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
      <div className="flex flex-col text-left leading-tight">
        <span
          className={`font-semibold tracking-tight ${textClass} ${
            isDarkEmblem ? 'text-[#F7F5F0]' : 'text-[#101010]'
          } transition-colors group-hover:text-[#C5A46D]`}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          7 Horse
        </span>
        <span
          className={`text-[10px] tracking-wider uppercase font-medium ${
            isDarkEmblem ? 'text-[#D8C39A]' : 'text-[#8A6D3B]'
          }`}
        >
          Ventures
        </span>
      </div>
    </div>
  );
}
