import React from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Sparkles, X, Play, Pause } from 'lucide-react';

export default function SoothingVoiceWidget() {
  const { isVoicePlaying, toggleVoice, stopVoice } = useApp();

  if (!isVoicePlaying) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div className="glass-panel glass-specular-top rounded-full py-2.5 px-4 shadow-2xl border border-[#C5A46D]/40 flex items-center gap-3 backdrop-blur-md bg-[#121212]/90 text-white">
        
        {/* Animated Sound Waveform Indicator */}
        <div className="flex items-center gap-0.5 h-4 px-1">
          <span className="w-1 bg-[#C5A46D] rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-3" />
          <span className="w-1 bg-[#D8C39A] rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-4" />
          <span className="w-1 bg-[#C5A46D] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2.5" />
          <span className="w-1 bg-[#D8C39A] rounded-full animate-[pulse_1.2s_ease-in-out_infinite_0.1s] h-3.5" />
        </div>

        <div className="text-left pr-2 border-r border-white/10">
          <span className="text-[11px] font-semibold text-white block leading-tight font-heading flex items-center gap-1">
            <span>Soothing Voice</span>
            <span className="text-[9px] font-mono text-[#C5A46D] bg-[#C5A46D]/15 px-1 py-0.2 rounded">432Hz</span>
          </span>
          <span className="text-[10px] text-stone-400 block font-normal">7H Audio Guide playing</span>
        </div>

        {/* Controls */}
        <button
          onClick={toggleVoice}
          className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
          title="Pause or Restart Voice"
          aria-label="Pause or Restart Voice"
        >
          <Volume2 className="w-4 h-4 text-[#C5A46D]" />
        </button>

        <button
          onClick={stopVoice}
          className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          title="Stop Voice Guide"
          aria-label="Stop Voice Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
