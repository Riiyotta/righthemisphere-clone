// Page-load intros (IX3 `wf:load`, ≥768 only). Each page is a list of steps placed at the
// original's timeline positions. Missing selectors are no-ops, as they are in IX3.
// Call from useLayoutEffect: targets are hidden (or in their from-state) before first paint,
// so nothing flashes; from-states and play share a frame once fonts are ready.
import { gsap, EASE, MQ } from './core.js';
import { split } from './split.js';
import { fontsReady } from './reveals.js';

const { none, circ, p1 } = EASE;
const RANDOM = { amount: 0.5, from: 'random' };
const CLEAR_ARROW = 'transform,translate,rotate,scale,opacity';

/** step(pos, selector, from, to, { dur, ease, split, stagger, clear }) */
const step = (pos, sel, from, to, o = {}) => ({ pos, sel, from, to, dur: 0.5, ease: p1, ...o });
const chars = (pos, sel, dur, ease) => step(pos, sel, { opacity: 0 }, { opacity: 1 }, { dur, ease, split: { type: 'chars', mask: 'chars' }, stagger: RANDOM });

// Shared tail of every intro: nav chars @1.59, logo @1.91, every underline @2.22, nav CONTACT arrows @2.93.
const TAIL = (navSel = '.nav') => [
  chars(1.59, navSel, 0.68, p1),
  step(1.91, '.logo_img', { opacity: 0 }, { opacity: 1 }, { dur: 0.5, ease: circ }),
  step(2.22, '.button_line', { width: '0%', transformOrigin: '0% 50%' }, { width: '100%' }, { dur: 1, ease: circ }),
  // cleared afterwards so the CSS hover (translate) owns the icons again
  step(2.93, '.contact_link_icon', { opacity: 0, xPercent: -100 }, { opacity: 1, xPercent: 0 }, { dur: 0.64, ease: circ, clear: CLEAR_ARROW }),
];

const HERO_WORDS = (widthFrom, heightDur) => [
  chars(0, '.hero_heading_contain', 0.5, none),
  step(1.25, '.hero_heading_contain', { width: widthFrom }, { width: '100%' }, { dur: 0.8, ease: circ }),
  step(1.27, '.hero_header_wrap', { height: '90vh' }, { height: 'auto' }, { dur: heightDur, ease: circ }),
];

const HERO_CARDS = [
  chars(1.86, '.work_card_header_wrapper_hero', 0.5, p1),
  step(1.88, '.work_card_portrait_hero', { opacity: 0, y: '8rem' }, { opacity: 1, y: 0 }, { dur: 1, ease: circ }),
  step(1.88, '.work_card_landscape_right_hero', { opacity: 0, x: '5rem' }, { opacity: 1, x: 0 }, { dur: 1, ease: circ }),
  step(1.88, '.project_img_hero', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1 }, { dur: 1.01, ease: circ }),
  step(1.89, '.proj_card_year_wrapper_hero', { opacity: 0, yPercent: 200 }, { opacity: 1, yPercent: 0 }, { dur: 0.99, ease: circ }),
];

export const INTROS = {
  // CLONE_SPEC §14.3 (re-measured: see handoff table)
  home: [
    step(0, '.section_hero', { opacity: 0 }, { opacity: 1 }, { dur: 0.5, ease: circ }),
    ...HERO_WORDS('86%', 0.8),
    chars(1.75, '.hero_subhead', 0.41, circ),
    ...HERO_CARDS,
    step(2.2, '.hero_btn_arrow_icon', { opacity: 0, xPercent: -100, yPercent: -100 }, { opacity: 1, xPercent: 0, yPercent: 0 }, { dur: 0.64, ease: circ }),
    // nav + hero_info_block are one IX3 action: one random stagger across both sets of chars
    ...TAIL('.nav, .hero_info_block'),
  ],
  // CLONE_SPEC-PAGES §1.M
  about: [
    ...HERO_WORDS('92%', 1.17),
    step(1.27, '.about_us_v2', { opacity: 0, yPercent: 150 }, { opacity: 1, yPercent: 0 }, { dur: 1.21, ease: circ, split: { type: 'words' } }),
    ...TAIL(),
  ],
  // CLONE_SPEC-PAGES §2.M (no height intro: its target does not exist there)
  services: [
    step(0, '.section_hero_services', { opacity: 0 }, { opacity: 1 }, { dur: 0.5, ease: circ }),
    chars(0, '.services_heading_contain', 0.5, none),
    step(1.25, '.services_hero_header_wrapper', { xPercent: -50 }, { xPercent: 0 }, { dur: 0.99, ease: circ }),
    step(1.27, '.services_in-detail_description', { opacity: 0, y: 200 }, { opacity: 1, y: 0 }, { dur: 1.27, ease: circ, split: { type: 'words' } }),
    step(1.51, '.services_in_detail_list_element', { opacity: 0, y: 200 }, { opacity: 1, y: 0 }, { dur: 1.24, ease: circ }),
    ...TAIL(),
  ],
  // CLONE_SPEC-PAGES §3.M
  work: [...HERO_WORDS('65%', 0.8), ...HERO_CARDS, ...TAIL()],
  // CLONE_SPEC-PAGES §4.M
  contact: [
    ...HERO_WORDS('60%', 1.17),
    step(1.27, '.contact_info_wrapper', { opacity: 0 }, { opacity: 1 }, { dur: 1.21, ease: circ }),
    ...TAIL(),
  ],
  // CLONE_SPEC-PAGES §5
  blog: [...HERO_WORDS('60%', 1.17), ...TAIL()],
};

function build(steps, scope, splits) {
  const tl = gsap.timeline({ paused: true });
  for (const s of steps) {
    const els = gsap.utils.toArray(scope.querySelectorAll(s.sel));
    if (!els.length) continue;
    let targets = els;
    if (s.split) {
      targets = els.flatMap((el) => {
        const r = split(el, s.split);
        splits.push(r);
        return r.targets;
      });
    }
    const to = { ...s.to, duration: s.dur, ease: s.ease };
    if (s.stagger) to.stagger = s.stagger;
    if (s.clear) to.clearProps = s.clear;
    tl.fromTo(targets, s.from, to, s.pos);
  }
  return tl;
}

// Elements that directly hold the visible text of `root` (SVG excluded).
function textParents(root) {
  const out = new Set();
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const p = n.parentElement;
    if (p && n.nodeValue.trim() && !p.closest('svg')) out.add(p);
  }
  return [...out];
}

/**
 * While fonts load, hide what the intro will reveal *without* applying its from-states, so
 * the from-states land on the same frame the timeline starts (IX3 sets them and plays at once).
 *  - split steps: hide only the elements holding their text (the nav keeps its bar/background)
 *  - opacity steps: visibility:hidden (looks identical to opacity 0)
 *  - layout-only steps (height / width / xPercent): from-state now, so nothing shifts later
 * Returns release().
 */
function hold(steps, scope) {
  const hidden = new Map();
  const hide = (el) => {
    if (hidden.has(el)) return;
    hidden.set(el, el.style.visibility);
    el.style.visibility = 'hidden';
  };
  for (const s of steps) {
    const els = Array.from(scope.querySelectorAll(s.sel));
    if (!els.length) continue;
    if (s.split) els.forEach((el) => textParents(el).forEach(hide));
    else if ('opacity' in s.from) els.forEach(hide);
    else gsap.set(els, s.from);
  }
  return () => {
    hidden.forEach((v, el) => {
      el.style.visibility = v;
    });
    hidden.clear();
  };
}

/**
 * playIntro(name | steps, { scope }) → cleanup. Call inside useLayoutEffect.
 * ≥768: fonts ready → split, apply from-states and start the timeline in one go (before paint
 * when fonts are already loaded; otherwise the targets are held hidden until they are).
 * ≤767: nothing runs (IX3 `dont-animate` on small/tiny).
 */
export function playIntro(intro, { scope = document } = {}) {
  const steps = typeof intro === 'string' ? INTROS[intro] : intro;
  if (!steps) return () => {};
  const mm = gsap.matchMedia();
  let built = false;
  mm.add(MQ.desktop, (ctx) => {
    // load-only: resizing back up to ≥768 later must not replay it
    if (built) return undefined;
    built = true;
    const splits = [];
    let live = true;
    let release = null;
    const start = () => {
      if (release) release();
      release = null;
      const tl = build(steps, scope, splits);
      tl.eventCallback('onComplete', () => splits.forEach((s) => s.restore()));
      tl.play(0);
    };
    // flush styles so the just-committed text has requested its fonts and status is accurate
    void document.body.offsetWidth;
    if (!document.fonts || document.fonts.status === 'loaded') start();
    else {
      release = hold(steps, scope);
      fontsReady(1000).then(() => live && ctx.add(start));
    }
    return () => {
      live = false;
      if (release) release();
      splits.forEach((s) => s.restore());
    };
  });
  return () => mm.revert();
}
