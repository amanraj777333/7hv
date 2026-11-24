/**
 * Soothing Voice & Ambient Soundscape Engine for 7 Horse Ventures
 * Provides calm, editorial voice narration using Speech Synthesis paired with
 * a gentle harmonic ambient chord via Web Audio API.
 */

let audioCtx = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientGain = null;
let isSpeakingState = false;

const NARRATION_SCRIPT =
  "Welcome to 7 Horse Ventures. We are building a connected peer ecosystem for India's emerging founders, seasoned operators, and strategic capital partners. Explore our hands-on Academy masterclasses, connect with fellow builders in our private roundtables, and collaborate across high-growth venture opportunities.";

/**
 * Initialize soft ambient harmonic soundscape (432Hz & 528Hz calming harmonics)
 */
function startAmbientSound() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Stop any existing oscillators
    stopAmbientSound();

    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    // Smooth fade in to a gentle whisper level (0.025 max)
    ambientGain.gain.exponentialRampToValueAtTime(0.025, audioCtx.currentTime + 1.5);

    // Warm Low-pass filter for velvety texture
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);

    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(432, audioCtx.currentTime); // Calming resonance

    ambientOsc2 = audioCtx.createOscillator();
    ambientOsc2.type = 'sine';
    ambientOsc2.frequency.setValueAtTime(528, audioCtx.currentTime); // Harmonic warmth

    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
  } catch (err) {
    console.debug('Ambient audio not allowed without user interaction:', err);
  }
}

function stopAmbientSound() {
  try {
    if (ambientGain && audioCtx) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      setTimeout(() => {
        try {
          if (ambientOsc1) ambientOsc1.stop();
          if (ambientOsc2) ambientOsc2.stop();
        } catch {}
      }, 700);
    }
  } catch {}
}

/**
 * Plays a calm soothing tone on micro-interaction
 */
export function playSoftChime() {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

/**
 * Speaks the calm introductory message using SpeechSynthesis
 */
export function startSmoothingVoice(onStart, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  startAmbientSound();

  const utterance = new SpeechSynthesisUtterance(NARRATION_SCRIPT);
  utterance.rate = 0.86; // Relaxed, unhurried, calm pace
  utterance.pitch = 0.94; // Warm, grounded pitch
  utterance.volume = 1.0;

  // Select the smoothest available natural English voice
  const selectVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = voices.filter(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google UK English Female') ||
          v.name.includes('Samantha') ||
          v.name.includes('Serena') ||
          v.name.includes('Natural') ||
          v.name.includes('Daniel') ||
          v.name.includes('Karen') ||
          v.name.includes('Victoria'))
    );

    if (preferredVoices.length > 0) {
      utterance.voice = preferredVoices[0];
    } else {
      const anyEn = voices.find((v) => v.lang.startsWith('en'));
      if (anyEn) utterance.voice = anyEn;
    }
  };

  selectVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = selectVoice;
  }

  utterance.onstart = () => {
    isSpeakingState = true;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    isSpeakingState = false;
    stopAmbientSound();
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    isSpeakingState = false;
    stopAmbientSound();
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSmoothingVoice() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeakingState = false;
  stopAmbientSound();
}

export function isSmoothingVoiceActive() {
  return isSpeakingState;
}
