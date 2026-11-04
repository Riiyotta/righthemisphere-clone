// Public motion API for every page.
//
//   usePageMotion({ intro: 'home', smooth: true, reveals: { exclude, extra } })
//
//   intro   'home' | 'about' | 'services' | 'work' | 'contact' | 'blog' | steps[] | null
//   smooth  Lenis (default true; blog posts use false = native scroll)
//   reveals options for initReveals (false disables reveals entirely)
//   setup   optional extra initialisers (scope → cleanup), e.g. initTeamHover on /about
//
// Call it once at the top of the page component. It runs in useLayoutEffect so intro
// from-states land before first paint, and it cleans up everything on unmount.
import { useLayoutEffect } from 'react';
import './hovers.css';
import { ScrollTrigger } from './core.js';
import { initSmoothScroll } from './lenis.js';
import { playIntro } from './intros.js';
import { initReveals } from './reveals.js';

export function usePageMotion({ intro = null, smooth = true, reveals = {}, setup = [] } = {}) {
  useLayoutEffect(() => {
    const cleanups = [];
    if (smooth) cleanups.push(initSmoothScroll());
    if (intro) cleanups.push(playIntro(intro));
    if (reveals !== false) cleanups.push(initReveals(reveals));
    setup.forEach((fn) => cleanups.push(fn(document)));
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState !== 'complete') window.addEventListener('load', onLoad, { once: true });
    return () => {
      window.removeEventListener('load', onLoad);
      cleanups.reverse().forEach((fn) => fn());
    };
    // options are static per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export { INTROS, playIntro } from './intros.js';
export { REVEALS, PAGE_REVEALS, initReveals } from './reveals.js';
export { animateFaq, openCredits, resetCredits } from './interactions.js';
export { initTeamHover } from './team-hover.js';
export { getLenis, initSmoothScroll } from './lenis.js';
export { split } from './split.js';
export { gsap, ScrollTrigger, EASE, MQ } from './core.js';
