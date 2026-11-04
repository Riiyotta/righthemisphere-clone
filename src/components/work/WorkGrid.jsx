import { Fragment } from 'react';
import { WorkCard, RESP, WRAPPER } from '../Work.jsx';
import { imgProps } from '../../data/content.js';

// CLONE_SPEC-PAGES §3: 25 homepage work cards in 4 grid wrappers, no "see all" button.
// Placement per the §3 table (1-based card numbers). Bottom spacing comes from the original
// class rules, not from stretching: base .work_card_* have padding-bottom 10rem, which the
// modifiers replace (e.g. .anomaly mb 12rem, .jungle.left mb 13rem, .mocha pb 13rem;
// .passion_films and .portrait.moshimbo.right keep pb 10rem).
// R = pushed right at ≤991, L = left-aligned 3/4 width.
const PLACE = {
  1: ['col-start-1 col-end-3 row-start-1 mb-160', 'R'],
  2: ['col-start-4 col-end-7 row-start-1 mb-160', 'L'],
  3: ['col-span-2 mb-192', 'R'],
  4: ['col-start-4 col-end-7 row-start-2 -top-192 w-card-85 mb-160', 'L'],
  5: ['col-start-1 col-end-4 row-start-3 mb-160', 'L'],
  6: ['col-start-5 col-end-7 row-start-3 -top-280', 'R'],
  7: ['col-start-1 col-end-4 row-start-4 -top-80', 'L'],
  8: ['col-start-5 col-end-7 row-start-4 -top-96 mb-128', 'R'],
  9: ['col-start-1 col-end-3 row-start-1 mb-208', 'R'],
  10: ['col-start-4 col-end-7 row-start-1 mb-160', 'L'],
  11: ['col-span-2 row-start-2 pb-208 md:pb-0', 'R'],
  12: ['col-start-4 col-end-7 row-start-2 -top-192 w-card-85 mb-160', 'L'],
  13: ['col-span-3 row-start-3 pb-160 md:pb-0', 'L'],
  14: ['col-start-5 col-end-7 row-start-3 -top-192 pb-160 md:pb-0', 'R'],
  15: ['col-start-1 col-end-4 row-start-4 -top-80', 'L'],
  16: ['col-start-5 col-end-7 row-start-4 -top-96 mb-128', 'R'],
  17: ['col-start-1 col-end-3 row-start-1 mb-208', 'R'],
  18: ['col-start-4 col-end-7 row-start-1 mb-160', 'L'],
  19: ['col-span-2 mb-192', 'R'],
  20: ['col-start-4 col-end-7 row-start-2 -top-192 w-card-85 mb-160', 'L'],
  21: ['col-start-5 col-end-7 row-start-3 -top-192 pb-160 md:pb-0', 'R'],
  22: ['col-start-1 col-end-4 row-start-3 mb-160', 'L'],
  23: ['col-start-1 col-end-4 row-start-4 -top-80', 'L'],
  24: ['col-start-5 col-end-7 row-start-4 -top-96 mb-128', 'R'],
  25: ['col-start-3 col-end-5 row-start-1 mb-208', 'R'],
};
const RESP_OF = { R: RESP.push, L: RESP.threeQ };
// Captions without .caps in the original markup.
const NO_CAPS = new Set([4, 20]);
// .project_image_wrap modifier → fill token
const FILL = {
  black: 'bg-project-black',
  navy: 'bg-project-navy',
  violet: 'bg-project-violet',
  green: 'bg-project-teal',
  orange: 'bg-project-orange',
  yellow: 'bg-project-amber',
  'dark-green': 'bg-project-forest',
  bottle_green: 'bg-project-cyan',
  'yellow-green': 'bg-project-yellow-green',
  beige: 'bg-project-beige',
  grey: 'bg-project-grey',
  blue_grey: 'bg-project-blue-grey',
};
// Header-detail modifiers: .kulfi (max 7rem), .borno (max 18rem). (.card_right's 14px
// never reaches the text on the original: the inner .text-size-regular sets its own size.)
const detailMods = (cls = '') => ({
  detailNarrow: cls.includes('kulfi'),
  detailExtra: cls.includes('borno') ? '!max-w-[18rem]' : '',
});
// Cards whose title sits in .work_card-heading_wrapper.anomaly (192px wide, as on the homepage).
const ANOMALY_TITLE = new Set([3, 19]);

const title = (t) =>
  t.includes('\n')
    ? t.split('\n').map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {part}
        </Fragment>
      ))
    : t;

function toCard(c, n) {
  const [place, resp] = PLACE[n];
  const img = imgProps(c.image);
  const fillKey = c.fillClass.replace('project_image_wrap', '').replace('hero', '').trim();
  return {
    variant: c.class,
    hero: c.class.includes('_hero'),
    place,
    resp: RESP_OF[resp],
    title: title(c.title),
    titleFull: true,
    titleClass: ANOMALY_TITLE.has(n) ? 'w-192' : '',
    detail: c.detail,
    ...detailMods(c.detailClass || ''),
    href: c.href,
    external: c.target === '_blank',
    img: img.src,
    srcSet: img.srcSet,
    sizes: img.sizes,
    alt: img.alt,
    fill: FILL[fillKey],
    year: c.year,
    caption: c.caption,
    caps: !NO_CAPS.has(n),
  };
}

export default function WorkGrid({ wrappers }) {
  let n = 0;
  return (
    <section id="work" className="section_work relative overflow-hidden">
      <div className="padding-global">
        <div className="container-main">
          <div className="work_element md:flex md:flex-col md:gap-160 sm:gap-0 sm:pt-160 xs:pt-80">
            {wrappers.map((w, wi) => (
              <div key={wi} className={wi === 0 ? `${WRAPPER} pt-40` : `${WRAPPER} _2 pt-24 md:pb-80`}>
                {w.cards.map((c) => {
                  n += 1;
                  return <WorkCard key={n} card={toCard(c, n)} />;
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
