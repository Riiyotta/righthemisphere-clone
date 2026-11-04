// IX2 click interactions that need JS (all breakpoints). Hovers are pure CSS in hovers.css.
import { gsap, EASE } from './core.js';

const { quart } = EASE;

// FAQ (a-4 open / a-5 close): .faq_item_detail height 0 ↔ auto, 500ms easeOutQuart.
// The plus icon's scaleY 1 ↔ 0 is a CSS transition on the same curve (Faq.jsx).
// Close (measured): same curve, starts one frame after the click, unrounded px.
export function animateFaq(detail, open, { immediate = false } = {}) {
  if (!detail) return;
  const close = !open && !immediate ? { delay: 1 / 60, autoRound: false } : null;
  gsap.to(detail, { height: open ? 'auto' : 0, duration: immediate ? 0 : 0.5, ease: quart, overwrite: true, ...close });
}

// Footer partner credits (a-18 open). Backdrop appears instantly (display:flex).
// Cover scale 0 → 1 800ms from the top-right; rows width 50% → 100% (row 1 800ms,
// rows 2–4 1000ms at +200/+400/+600ms); content opacity 0 → 1 400ms at +600ms.
export function openCredits(root) {
  if (!root) return null;
  const tl = gsap.timeline();
  tl.fromTo(root.querySelector('.partner_white_cover'), { scale: 0, transformOrigin: '100% 0%' }, { scale: 1, duration: 0.8, ease: quart }, 0);
  root.querySelectorAll('.partner_link').forEach((row, i) => {
    tl.fromTo(row, { width: '50%' }, { width: '100%', duration: i === 0 ? 0.8 : 1, ease: quart }, i * 0.2);
  });
  tl.fromTo(root.querySelector('.partners_items_wrapper'), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: quart }, 0.6);
  return tl;
}

// a-22 close: instant reset.
export function resetCredits(root, tl) {
  if (tl) tl.kill();
  if (!root) return;
  gsap.set([root.querySelector('.partner_white_cover'), root.querySelector('.partners_items_wrapper'), ...root.querySelectorAll('.partner_link')], {
    clearProps: 'transform,scale,opacity,width,transformOrigin',
  });
}
