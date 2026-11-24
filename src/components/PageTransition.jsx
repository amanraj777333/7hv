import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * PageTransition
 * Handles smooth enter transitions between pages without layout thrashing
 * or white flashes. Adheres to 60fps-animation and accessible-animation guidelines.
 */
export default function PageTransition({ children }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={
        reducedMotion
          ? 'animate-[pageFade_150ms_ease_forwards]'
          : 'animate-[pageEnter_240ms_cubic-bezier(0.16,1,0.3,1)_forwards]'
      }
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </div>
  );
}
