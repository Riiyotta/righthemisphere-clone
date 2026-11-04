// Scroll-reveal registry: every IX3 `wf:scroll` interaction, keyed by its trigger class.
// One ScrollTrigger + one timeline per matching element, play once, never reverse, no scrub.
// Children are "within" the trigger, as in IX3. Durations default to 0.5 when IX3 sets none.
import { gsap, ScrollTrigger, EASE, MQ, st } from './core.js';
import { split } from './split.js';

const { none, circ, p1 } = EASE;
const ARROW_CLEAR = 'transform,translate,rotate,scale,opacity';
const $$ = (el, sel) => Array.from(el.querySelectorAll(sel));
const fade = { opacity: 0 };
const shown = { opacity: 1 };

/**
 * Entry shape: { key, selector, start, media?, fonts?, skip?, build(tl, el, api) }
 *   media: 'desktop' (default, ≥768) | 'desktop+tiny'
 *   fonts: true → built after document.fonts.ready (line splits need final metrics)
 *   api.split(el, opts) registers a split that is restored on cleanup / completion.
 */
export const REVEALS = [
  {
    key: 'work-image',
    selector: '.work_card_image_wrapper',
    start: 'top 95%',
    build(tl, el) {
      tl.fromTo(el, fade, { ...shown, duration: 0.5, ease: none }, 0);
      const img = $$(el, '.project_img');
      if (img.length) tl.fromTo(img, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.8, ease: none }, 0.2);
    },
  },
  { key: 'work-portrait', selector: '.work_card_portrait', start: 'top bottom', build: (tl, el) => tl.fromTo(el, { y: '8rem' }, { y: 0, duration: 1, ease: circ }, 0) },
  { key: 'work-left', selector: '.work_card_landscape_left', start: 'top bottom', build: (tl, el) => tl.fromTo(el, { x: '-5rem' }, { x: 0, duration: 1, ease: circ }, 0) },
  { key: 'work-right', selector: '.work_card_landscape_right', start: 'top bottom', build: (tl, el) => tl.fromTo(el, { x: '5rem' }, { x: 0, duration: 1, ease: circ }, 0) },
  {
    key: 'work-header',
    selector: '.work_card_header_wrapper',
    start: 'top 100%',
    media: 'desktop+tiny', // IX3 disables this one on `small` only
    build: (tl, el) => tl.fromTo(el, fade, { ...shown, duration: 1, ease: none }, 0),
  },
  {
    key: 'work-detail',
    selector: '.work_card_detail_wrapper',
    start: 'top 100%',
    build(tl, el) {
      tl.fromTo(el, fade, { ...shown, duration: 1, ease: none }, 0);
      const icons = $$(el, '.work_arrow_icon');
      // clearProps afterwards so the CSS hover (translate) owns the arrows again
      if (icons.length)
        tl.fromTo(icons, { opacity: 0, xPercent: -100, yPercent: 100 }, { opacity: 1, xPercent: 0, yPercent: 0, duration: 1, ease: circ, clearProps: ARROW_CLEAR }, 0);
    },
  },
  {
    key: 'work-year',
    selector: '.proj_card_year_wrapper',
    start: 'top bottom',
    build: (tl, el) => tl.fromTo(el, { opacity: 0, yPercent: 200 }, { opacity: 1, yPercent: 0, duration: 1, ease: none }, 0),
  },
  { key: 'large-para', selector: '.text-size-large.long_para', start: 'top bottom', build: (tl, el) => tl.fromTo(el, fade, { ...shown, duration: 1, ease: circ }, 0) },
  { key: 'h2-caps', selector: '.text-size-h2.caps', start: 'top bottom', build: (tl, el) => tl.fromTo(el, fade, { ...shown, duration: 1, ease: circ }, 0) },
  {
    key: 'medium',
    selector: '.text-size-medium',
    start: 'top bottom',
    // includes the credits overlay's partner names (display:none): as on the original, their
    // trigger reads a 0 rect, so they fade in on the first refresh after scrolling starts
    // (the layout-change refresh below), long before the overlay can be opened
    skip: '[data-motion-skip]',
    build: (tl, el) => tl.fromTo(el, fade, { ...shown, duration: 1, ease: none }, 0),
  },
  {
    key: 'medium-lines',
    selector: '.text-size-medium.long-para',
    start: 'top bottom',
    fonts: true,
    build(tl, el, api) {
      const { lines } = api.split(el, { type: 'lines' });
      tl.fromTo(lines, fade, { ...shown, duration: 1, ease: none, stagger: { amount: 0.5 } }, 0);
    },
  },
  {
    // IX3 targets `.button_v2` *within* the trigger, so the button itself never fades or
    // resizes (verified: no inline style on any button_v2). Only line + arrow box animate.
    key: 'button',
    selector: '.button_v2',
    start: 'top bottom',
    build(tl, el) {
      const line = $$(el, '.button_line');
      if (line.length) tl.fromTo(line, { width: '0%' }, { width: '100%', duration: 1, ease: circ }, 0);
      // the blog-card row's arrow box is .blog_arrow_wrapper on the original (no tween)
      const arrow = $$(el, '.btn_v2_arrow_wrapper:not(.blog_arrow_wrapper)');
      if (arrow.length) tl.fromTo(arrow, { opacity: 0, xPercent: -200 }, { opacity: 1, xPercent: 0, duration: 1, ease: circ }, 0);
    },
  },
  {
    key: 'service-row',
    selector: '.service_wrapper',
    start: 'top bottom',
    build(tl, el) {
      tl.fromTo(el, fade, { ...shown, duration: 1, ease: none }, 0);
      tl.fromTo(el, { width: '20%' }, { width: '100%', duration: 1, ease: circ }, 0);
    },
  },
  {
    key: 'award',
    selector: '.award_wrapper',
    start: 'top bottom',
    build(tl, el) {
      tl.fromTo($$(el, '.award_image_wrapper'), { scale: 0 }, { scale: 1, duration: 0.8, ease: circ }, 0);
      tl.fromTo($$(el, '.text-size-medium'), fade, { ...shown, duration: 1, ease: none }, 0.14);
      tl.fromTo($$(el, '.text-size-small.color-grey'), fade, { ...shown, duration: 1, ease: none }, 0.34);
    },
  },
  ...['.award_winner_item', '.media_mention_item', '.faq_item', '.contact_form_block', '.blog_card_item_wrapper'].map((selector) => ({
    key: selector.slice(1),
    selector,
    start: 'top bottom',
    build: (tl, el) => tl.fromTo(el, { opacity: 0, width: '50%' }, { opacity: 1, width: '100%', duration: 1, ease: circ }, 0),
  })),
  {
    key: 'partner-row',
    selector: '.partner_list_image_grid',
    start: 'top bottom',
    build(tl, el) {
      tl.fromTo($$(el, '.partner_image_item'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5, ease: circ, stagger: { amount: 1, from: 'random' } }, 0);
      tl.fromTo($$(el, '.client_name'), fade, { ...shown, duration: 0.49, ease: none, stagger: { amount: 1 } }, 0);
    },
  },
  {
    key: 'partner-list-item',
    selector: '.partner_list_item',
    start: 'top bottom',
    // IX3 targets every .partner_list_item (not "within"); the first trigger plays them all
    build: (tl) => tl.fromTo('.partner_list_item', fade, { ...shown, duration: 0.5, ease: none, stagger: { amount: 0.5, from: 'start' } }, 0),
    once: true,
  },
  { key: 'slider-left', selector: '.testimonial_left_arrow', start: 'top bottom', build: (tl, el) => tl.fromTo(el, { opacity: 0, xPercent: 200 }, { opacity: 1, xPercent: 0, duration: 1, ease: circ }, 0) },
  { key: 'slider-right', selector: '.testimonial_right_arrow', start: 'top bottom', build: (tl, el) => tl.fromTo(el, { opacity: 0, xPercent: -200 }, { opacity: 1, xPercent: 0, duration: 1, ease: p1 }, 0) },
  {
    key: 'blog-image',
    selector: '.blog_image_wrapper',
    start: 'top bottom',
    build(tl, el) {
      tl.fromTo(el, fade, { ...shown, duration: 0.8, ease: none }, 0);
      tl.fromTo($$(el, '.blog_img'), { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.8, ease: circ }, 0.11);
    },
  },
  {
    key: 'contact',
    selector: '.contact_element_wrapper',
    start: 'top 90%',
    fonts: true,
    build(tl, el, api) {
      // original classes lets_create / something / pretty = replica line_1 / line_2 / line_3
      const rows = [
        ['.contact_heading.lets_create, .contact_heading.line_1', '5rem', 1.01],
        ['.contact_heading.something, .contact_heading.line_2', '-5rem', 1.01],
        ['.contact_heading.pretty, .contact_heading.line_3', '5rem', 1.0],
      ];
      for (const [sel, x, duration] of rows) {
        const h = el.querySelector(sel) || document.querySelector(sel);
        if (!h) continue;
        const { lines } = api.split(h, { type: 'lines', mask: 'lines' });
        tl.fromTo(lines, { opacity: 0, x, yPercent: 200 }, { opacity: 1, x: 0, yPercent: 0, duration, ease: circ, stagger: { amount: 1 } }, 0.1);
      }
    },
  },
  {
    key: 'footer',
    selector: '.footer_block',
    start: 'top bottom',
    fonts: true,
    build(tl, el, api) {
      const { chars } = api.split(el, { type: 'chars' });
      tl.fromTo(chars, fade, { ...shown, duration: 1, ease: none, stagger: { amount: 0.5, from: 'random' } }, 0);
    },
  },
];

// Page-scoped reveals from CLONE_SPEC-PAGES.md, opt in via initReveals({ extra }).
export const PAGE_REVEALS = {
  about: [
    {
      key: 'team-item',
      selector: '.team_item',
      start: 'top bottom',
      build: (tl, el) => tl.fromTo(el, { opacity: 0, width: '20%' }, { opacity: 1, width: '100%', duration: 1, ease: circ }, 0),
    },
    {
      key: 'product-link',
      selector: '.product_link',
      start: 'top bottom',
      once: true, // the first row to enter plays all rows (IX3 targets every .product_link)
      build: (tl) => tl.fromTo('.product_link', { opacity: 0, width: '50%' }, { opacity: 1, width: '100%', duration: 1, ease: circ, stagger: { amount: 0.5 } }, 0),
    },
  ],
  contact: [
    { key: 'large', selector: '.text-size-large', start: 'top bottom', build: (tl, el) => tl.fromTo(el, fade, { ...shown, duration: 1, ease: none }, 0) },
  ],
};

// Elements that get no reveals by default: the credits overlay (display:none, opened on click).
// An entry can override this with its own `skip` selector.
const SKIP = '.partners_list_wrapper-copy, [data-motion-skip]';

const REVEAL_ID = 'ix3-reveal';

function createFor(entry, scope, splits) {
  const skip = entry.skip || SKIP;
  const els = Array.from(scope.querySelectorAll(entry.selector)).filter((el) => !el.closest(skip));
  // `once` entries tween every match from a single trigger: the first (top-most) element
  for (const el of entry.once ? els.slice(0, 1) : els) {
    const own = [];
    const api = {
      split(node, opts) {
        const s = split(node, opts);
        own.push(s);
        splits.push(s);
        return s;
      },
    };
    const tl = gsap.timeline({
      scrollTrigger: { ...st(el, entry.start), id: REVEAL_ID },
      onComplete: () => own.forEach((s) => s.restore()),
    });
    entry.build(tl, el, api);
  }
}

/**
 * initReveals({ scope, include, exclude, extra }) → cleanup
 *   include / exclude: arrays of registry keys; extra: additional entries (e.g. PAGE_REVEALS.about)
 * Uses gsap.matchMedia so everything is static (end state, no splits) at ≤767.
 */
export function initReveals({ scope = document, include, exclude = [], extra = [] } = {}) {
  const entries = [...REVEALS, ...extra].filter((e) => (!include || include.includes(e.key)) && !exclude.includes(e.key));
  const mm = gsap.matchMedia();
  let alive = true;

  const run = (filter) => () => {
    const splits = [];
    const now = entries.filter((e) => filter(e) && !e.fonts);
    const later = entries.filter((e) => filter(e) && e.fonts);
    now.forEach((e) => createFor(e, scope, splits));
    let ctxDone = false;
    // hide line/char-split targets until fonts settle, then split and build
    const pending = later.flatMap((e) => Array.from(scope.querySelectorAll(e.selector)).filter((el) => !el.closest(SKIP)));
    const veil = pending.length ? gsap.set(pending, { visibility: 'hidden' }) : null;
    const ctx = gsap.context(() => {});
    fontsReady().then(() => {
      if (!alive || ctxDone) return;
      ctx.add(() => {
        veil && veil.revert();
        later.forEach((e) => createFor(e, scope, splits));
      });
      ScrollTrigger.refresh();
    });
    return () => {
      ctxDone = true;
      ctx.revert();
      splits.forEach((s) => s.restore());
    };
  };

  mm.add(MQ.desktop, run(() => true));
  mm.add(MQ.tiny, run((e) => e.media === 'desktop+tiny'));

  // Keep trigger positions true while the layout settles (the hero's 90vh → auto intro,
  // images, and the 50% → 100% width reveals all change the page height). The original's
  // triggers track these shifts too (measured: faq start 8332 → 8181 with no manual refresh).
  let timer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!alive) return;
      ScrollTrigger.refresh();
      // IX3 refreshes each trigger on its own, at the current scroll. That only differs from a
      // global refresh for box-less (display:none) triggers, e.g. the credits overlay's names:
      // their start becomes scrollY - 100vh, so they play now (measured on the original).
      ScrollTrigger.getAll().forEach((s) => {
        if (s.vars.id === REVEAL_ID && s.trigger && !s.trigger.getClientRects().length) s.refresh();
      });
    }, 120);
  });
  ro.observe(document.body);

  return () => {
    alive = false;
    clearTimeout(timer);
    ro.disconnect();
    mm.revert();
  };
}

export function fontsReady(timeout = 1500) {
  if (!document.fonts || document.fonts.status === 'loaded') return Promise.resolve();
  return Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, timeout))]);
}
