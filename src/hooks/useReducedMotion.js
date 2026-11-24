import { useState, useEffect } from 'react';

/**
 * useReducedMotion
 * Follows the accessible-animation skill specification:
 * - Reactive check for (prefers-reduced-motion: reduce)
 * - Safe across SSR and live OS toggles without requiring a page reload
 */
export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)';
  
  const getInitial = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [reduced, setReduced] = useState(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mq = window.matchMedia(query);
    const onChange = (e) => setReduced(e.matches);

    // Initial sync
    setReduced(mq.matches);

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
