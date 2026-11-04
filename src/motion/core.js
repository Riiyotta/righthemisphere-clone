// Shared GSAP setup for every page. Values from the original's IX3/IX2 config
// (webflow.817d5eb9…js) and checked by sampling computed styles over time.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// IX3 easing codes: 0 = none, 2 = power1.out, 20 = circ.out. When IX3 sets no ease, GSAP's
// default (power1.out) applies. IX2 (hover/click) eases are easeOutQuart; the original's
// sampled curves follow the CSS bezier, so the GSAP-driven IX2 tweens use the same curve.
export const EASE = {
  none: 'none',
  p1: 'power1.out',
  circ: 'circ.out',
  quart: CustomEase.create('ix2Quart', '0.165,0.84,0.44,1'),
};

// Webflow breakpoints. IX3 load + scroll interactions are `dont-animate` on small and tiny.
export const MQ = {
  desktop: '(min-width: 768px)', // main + medium: all IX3 motion
  tiny: '(max-width: 479px)', // work_card_header_wrapper still fades here
};

// IX3 wraps every start/end in clamp() and plays once (toggleActions "play none none none").
export const st = (trigger, start) => ({
  trigger,
  start: `clamp(${start})`,
  toggleActions: 'play none none none',
});

export { gsap, ScrollTrigger, SplitText };
