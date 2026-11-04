// /about team row hover (IX2 a-10 in / a-11 out on .team_list_item), measured on the original:
//   in:  sibling .team_image_grid display:flex + scale 0 (instant reset group), then
//        scale 0 → 1 over 800ms easeOutQuart. Border #CECECE → #000 500ms linear (CSS).
//   out: display:flex + scale 1 (instant), then scale → 0 over 100ms
//        cubic-bezier(.6,.04,.98,.335); display:none after 800ms. Border back 500ms quart (CSS).
// IX2 runs it at every breakpoint, and the inline display:flex beats the CSS display:none,
// so the image also appears below 992px when hovered with a mouse.
import { gsap, EASE } from './core.js';
import { CustomEase } from 'gsap/CustomEase';

const OUT = CustomEase.create('ix2TeamOut', '0.6,0.04,0.98,0.335');

export function initTeamHover(scope = document) {
  const offs = [];
  scope.querySelectorAll('.team_list_item').forEach((row) => {
    const grid = row.parentElement.querySelector('.team_image_grid');
    if (!grid) return;
    let hide = null;
    const enter = () => {
      hide && hide.kill();
      gsap.killTweensOf(grid);
      gsap.set(grid, { display: 'flex', scale: 0 });
      gsap.to(grid, { scale: 1, duration: 0.8, ease: EASE.quart });
    };
    const leave = () => {
      hide && hide.kill();
      gsap.killTweensOf(grid);
      gsap.set(grid, { display: 'flex', scale: 1 });
      gsap.to(grid, { scale: 0, duration: 0.1, ease: OUT });
      hide = gsap.delayedCall(0.8, () => gsap.set(grid, { display: 'none' }));
    };
    row.addEventListener('mouseenter', enter);
    row.addEventListener('mouseleave', leave);
    offs.push(() => {
      row.removeEventListener('mouseenter', enter);
      row.removeEventListener('mouseleave', leave);
      hide && hide.kill();
      gsap.killTweensOf(grid);
      gsap.set(grid, { clearProps: 'display,transform,scale' });
    });
  });
  return () => offs.forEach((f) => f());
}
