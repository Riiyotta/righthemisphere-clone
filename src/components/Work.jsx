import { ButtonV2, DiagArrow } from './ui/Parts.jsx';

// §3. 10 cards, explicit 6-col placement. `place` = ≥992 grid placement + offsets,
// `resp` = ≤991 column-flow widths.
export const RESP = {
  push: 'md:w-1/2 md:ml-card-push sm:ml-0 sm:w-card-sm', // #1, #9
  threeQ: 'md:w-3/4 sm:w-card-sm', // #2, #10
  full: 'md:w-full sm:w-card-sm', // #5, #7, #8
  cap496: 'md:w-full md:max-w-496 xs:max-w-none xs:w-card-sm', // #3 (intrinsic cap)
  cap479: 'md:w-full md:max-w-479 xs:max-w-none xs:w-card-sm', // #6 (intrinsic cap)
  eightyFive: 'xs:w-card-sm', // #4 keeps 85% to 767
};

const IMG = '/images/';

const GRID_1 = [
  {
    variant: 'work_card_portrait_hero', hero: true,
    place: 'col-start-1 col-end-3 row-start-1 mb-160', resp: RESP.push,
    title: 'Bare Bones Collective', detail: null,
    href: 'https://www.barebonescollective.com/', external: true,
    img: `${IMG}6a8827216cb56caa7e99ca52_bbc.png`,
    alt: 'Cartoon skeleton wearing pink shorts surfing on teal ocean waves with a yellow surfboard against a black background.',
    fill: 'bg-project-black', year: '2025',
    caption: 'DESIGN / DEVELOPMENT', caps: true,
  },
  {
    titleFull: true, variant: 'work_card_landscape_right_hero', hero: true,
    place: 'col-start-4 col-end-7 row-start-1 mb-160', resp: RESP.threeQ,
    title: 'RiseIndia', detail: 'Official Strategic partner for Nike India',
    href: 'https://rise-india-wip.webflow.io/', external: true,
    img: `${IMG}6a8827216cb56caa7e99ca4f_Mask%20group-min%201.png`,
    srcSet: `${IMG}6a8827216cb56caa7e99ca4f_Mask%20group-min%201-p-500.png 500w, ${IMG}6a8827216cb56caa7e99ca4f_Mask%20group-min%201.png 741w`,
    sizes: '100vw',
    alt: 'Group of eight diverse young men forming a circle looking down at the camera with a dark blue sky background and a white Nike logo in the center.',
    fill: 'bg-project-navy', year: '2025',
    caption: 'DESIGN / DEVELOPMENT (Project under development)', caps: true,
  },
  {
    titleFull: true, variant: 'work_card_landscape_left',
    place: 'col-span-2 col-start-1 row-start-2 mb-192', resp: RESP.cap496,
    title: 'Anomaly Brands', titleClass: 'w-192', detail: 'Web archive 2025',
    href: 'https://anomalybrands.com/', external: true,
    img: `${IMG}6a8827216cb56caa7e99ca50_Frame%201244839316.png`,
    alt: "Word 'Anomaly' repeated three times in white uppercase and lowercase letters on a black background, with the top and bottom instances shown upside down and distorted as reflections.",
    fill: 'bg-project-black', year: '2025',
    caption: 'DEVELOPMENT', caps: true,
  },
  {
    titleFull: true, variant: 'work_card_landscape_right',
    place: 'col-start-4 col-end-7 row-start-2 -top-192 w-card-85 mb-160', resp: RESP.eightyFive,
    title: 'Moshimbo', detail: 'A beautiful design studio with an ugly \u2018m\u2019',
    href: 'https://www.moshimbo.com/', external: true,
    img: `${IMG}6abc95dcc8b60eb215447084_moshimbo.png`,
    srcSet: `${IMG}6abc95dcc8b60eb215447084_moshimbo-p-500.png 500w, ${IMG}6abc95dcc8b60eb215447084_moshimbo.png 756w`,
    sizes: '100vw',
    alt: 'A three-dimensional arrangement of pink letters scattered and rotated on a black background, appearing as abstract shapes without forming readable words.',
    fill: 'bg-project-violet', year: '2025',
    caption: 'DEVELOPMENT', caps: false,
  },
  {
    titleFull: true, variant: 'work_card_landscape_left',
    place: 'col-start-1 col-end-4 row-start-3 mb-160', resp: RESP.full,
    title: 'Kulfi\u00a0Collective', detail: 'Stories that shape culture', detailNarrow: true,
    href: 'https://www.kulficollective.com/', external: true,
    img: `${IMG}6a8827216cb56caa7e99ca53_kulfi.png`,
    srcSet: `${IMG}6a8827216cb56caa7e99ca53_kulfi-p-500.png 500w, ${IMG}6a8827216cb56caa7e99ca53_kulfi.png 764w`,
    sizes: '100vw',
    alt: "Three women sitting inside a car with colorful lighting, one in the foreground looking intently at the camera, text reading 'Stories that shape culture' overlayed in white.",
    fill: 'bg-project-teal', year: '2023',
    caption: 'DEVELOPMENT', caps: true,
  },
  {
    titleFull: true, variant: 'work_card_portrait',
    place: 'col-start-5 col-end-7 row-start-3 -top-280', resp: RESP.cap479,
    title: 'Post Office Studios', detail: 'Exploring new dimensions of storytelling', detailNarrow: true,
    href: 'https://www.postofficestudios.com/', external: true,
    img: `${IMG}6a8827216cb56caa7e99ca54_Frame%201244839319.png`,
    alt: 'Close-up of a LEGO Batman minifigure with a black mask and cape, glowing eyes, and a grimacing mouth, set against a blurred orange background.',
    fill: 'bg-project-orange', year: '2024',
    caption: 'DEVELOPMENT', caps: true,
  },
  {
    titleFull: true, variant: 'work_card_landscape_left',
    place: 'col-start-1 col-end-4 row-start-4 -top-80', resp: RESP.full,
    title: 'Supari\u00a0Studios', detail: 'Killing it since 1975',
    href: 'https://www.suparistudios.com/', external: true,
    img: `${IMG}6abc951fa900d21d00bd0780_supari%20studios.png`,
    srcSet: `${IMG}6abc951fa900d21d00bd0780_supari%20studios-p-500.png 500w, ${IMG}6abc951fa900d21d00bd0780_supari%20studios.png 756w`,
    sizes: '100vw',
    alt: 'Cartoon illustration of seven diverse characters with various hairstyles and outfits standing confidently on a hill with an orange sky and clouds in the background, accompanied by a small glowing-eyed robot on the right.',
    fill: 'bg-project-amber', year: '2024',
    caption: 'DEVELOPMENT', caps: true,
  },
  {
    titleFull: true, variant: 'work_card_landscape_right',
    place: 'col-start-5 col-end-7 row-start-4 -top-96 mb-128', resp: RESP.full,
    title: 'Watch with Papa', detail: null,
    href: '/watch-with-papa',
    img: `${IMG}6ab64d22277ca773fad5baff_WATCH%20WITH%20PAPA.png`,
    srcSet: `${IMG}6ab64d22277ca773fad5baff_WATCH%20WITH%20PAPA-p-500.png 500w, ${IMG}6ab64d22277ca773fad5baff_WATCH%20WITH%20PAPA-p-800.png 800w, ${IMG}6ab64d22277ca773fad5baff_WATCH%20WITH%20PAPA.png 1000w`,
    sizes: '100vw',
    alt: 'Three men indoors with an older man in a brown suit and glasses standing behind two younger men sitting on a couch, one wearing a blue striped shirt and the other a black shirt.',
    fill: 'bg-project-forest', year: '2026',
    caption: 'web app DEVELOPMENT', caps: true,
  },
];

const GRID_2 = [
  {
    variant: 'work_card_portrait',
    place: 'col-start-1 col-end-3 row-start-1 mb-80', resp: RESP.push,
    title: 'Cheggout SDK', detail: 'Connecting banks, brands through intelligent rewards',
    href: '/cheggout-sdk',
    img: `${IMG}6ab657cc17b9e5b0b6bc6502_cheggout.png`,
    srcSet: `${IMG}6ab657cc17b9e5b0b6bc6502_cheggout-p-500.png 500w, ${IMG}6ab657cc17b9e5b0b6bc6502_cheggout.png 688w`,
    sizes: '100vw',
    alt: 'Mobile phone screen showing Bank of Baroda app with offer for 2 months of Audible Premium Plus free, options for hot deals, locals, flights, dine in, and gift cards, and featured coupons including free 2 months Audible Premium Plus and flat 20% off premium tea.',
    fill: 'bg-project-forest', outerFill: 'bg-project-olive', year: '2025',
    caption: 'UI/UX\u00a0Design', caps: true,
  },
  {
    variant: 'work_card_landscape_right',
    place: 'col-start-4 col-end-7 row-start-1 mb-160', resp: RESP.threeQ,
    title: 'World of waste', detail: 'Developing and disseminating data on textile waste',
    href: 'https://www.worldofwaste.co/', external: true,
    img: `${IMG}6a8827216cb56caa7e99ca58_image%204764.png`,
    srcSet: `${IMG}6a8827216cb56caa7e99ca58_image%204764-p-500.png 500w, ${IMG}6a8827216cb56caa7e99ca58_image%204764.png 724w`,
    sizes: '100vw',
    alt: 'World map highlighting the countries Canada, United States of America, United Kingdom, Netherlands, Belgium, Germany, Poland, Spain, Morocco, Tunisia, Egypt, Turkey, Pakistan, India, Bangladesh, Sri Lanka in teal while other countries are in gray.',
    fill: 'bg-project-cyan', year: '2025',
    caption: 'DEVELOPMENT', caps: true,
  },
];

const VIEW_LABEL = 'VIEW';
const SEE_ALL = { label: 'see all work', href: '/work' };

// ≤767: wrappers lose their top padding (it moves to .work_element) and get 160 bottom; ≤479: 80.
export const WRAPPER =
  'work_element_content_wrapper grid grid-cols-six gap-0 md:flex md:flex-col md:items-start md:gap-160 sm:pb-160 sm:pt-0 xs:gap-80 xs:pb-80';

// Exported for /work (CLONE_SPEC-PAGES §3), which renders 25 of these in 4 wrappers.
export function WorkCard({ card }) {
  const h = card.hero;
  const image = (
    <div className={`project_image_wrap overflow-hidden ${card.fill}`}>
      <img
        src={card.img}
        srcSet={card.srcSet}
        sizes={card.sizes}
        alt={card.alt}
        className={`${h ? 'project_img_hero' : 'project_img'} h-auto w-full`}
        data-motion="work-image"
      />
    </div>
  );

  return (
    <a
      href={card.href}
      {...(card.external ? { target: '_blank' } : {})}
      className={`work_card ${card.variant} relative flex flex-col self-start ${card.place}
        md:top-0 md:mb-0 ${card.resp}`}
      data-motion="work-card"
      data-variant={card.variant}
    >
      <div
        className={`${h ? 'work_card_header_wrapper_hero' : 'work_card_header_wrapper'}
          flex items-end justify-between gap-14 overflow-hidden pb-10
          sm:flex-col sm:items-start sm:gap-4 sm:pb-12 xs:py-12 xs:pl-0 xs:pr-12`}
        data-motion="work-header"
      >
        <div className={`text-size-h2 ${card.titleClass || ''} ${card.titleFull ? 'sm:w-full' : ''}`}>{card.title}</div>
        {card.detail && (
          <div
            className={`work_card_header_detail_wrapper text-size-regular text-right sm:text-left
              ${card.detailNarrow ? 'kulfi max-w-detail-sm' : 'max-w-detail'} sm:max-w-full ${card.detailExtra || ''}`}
          >
            {card.detail}
          </div>
        )}
      </div>

      <div className={`${h ? '' : 'work_card_image_wrapper'} relative`} data-motion="work-image-wrapper">
        {card.outerFill ? <div className={card.outerFill}>{image}</div> : image}
        <div className="work_year_wrapper absolute left-full top-0">
          <div
            className={`${h ? 'proj_card_year_wrapper_hero' : 'proj_card_year_wrapper'}
              absolute left-0 top-10 -rotate-90 whitespace-nowrap`}
            data-motion="work-year"
          >
            <div className="text-t16 leading-year">{card.year}</div>
          </div>
        </div>
      </div>

      <div className="work_card_detail_wrapper relative flex items-end justify-between pt-10 sm:pt-12" data-motion="work-detail">
        <div className={`text-size-regular ${card.caps ? 'caps' : ''}`}>{card.caption}</div>
        <div className="view_wrapper text-size-regular caps">{VIEW_LABEL}</div>
        <span className="work_arrow_wrapper absolute bottom-[3.2px] right-[clamp(-26.4px,-9.651px-0.9626vw,-19.2px)] md:right-[-26px]">
          <DiagArrow sizeClass="h-v-t14 w-v-t14 md:h-12 md:w-12" iconClass="work_arrow_icon" />
        </span>
      </div>
    </a>
  );
}

export default function Work() {
  return (
    <section id="work" className="section_work relative overflow-hidden">
      <div className="padding-global">
        <div className="container-main">
          <div className="work_element md:flex md:flex-col md:gap-160 sm:gap-0 sm:pt-160 xs:pt-80">
            <div className={`${WRAPPER} pt-40`}>
              {GRID_1.map((c, i) => (
                <WorkCard key={i} card={c} />
              ))}
            </div>
            <div className={`${WRAPPER} _2 pt-24 md:pb-80`}>
              {GRID_2.map((c, i) => (
                <WorkCard key={i} card={c} />
              ))}
              <div className="see_all_work_wrapper col-start-4 col-end-5 row-start-2 pb-112 md:grid md:w-full md:grid-cols-three xs:block xs:pb-0">
                <ButtonV2 label={SEE_ALL.label} href={SEE_ALL.href} className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
