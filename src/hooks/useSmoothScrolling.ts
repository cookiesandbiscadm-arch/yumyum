import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Check if the device is mobile or tablet
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Check if the screen size is mobile (less than 768px)
const isMobileSize = () => {
  return window.innerWidth < 768;
};

export const useSmoothScrolling = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const isMobile = isTouchDevice() || isMobileSize();

  useEffect(() => {
    // Don't initialize on mobile/touch devices
    if (isMobile) {
      return;
    }

    // Initialize Lenis with basic options
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isMobile]);
};
