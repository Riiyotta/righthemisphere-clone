// Lenis smooth scroll, verbatim options from the original's inline script.
// `smoothTouch:false` is the 1.1.x name; in 1.3 the equivalent is syncTouch:false (the default).
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './core.js';

let instance = null;
export const getLenis = () => instance;

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    syncTouch: false,
  });
  instance = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    if (instance === lenis) instance = null;
  };
}
