import { DiagArrow } from './ui/Parts.jsx';

// §6
const INTRO = 'Accolades from the community is\u00a0never the goal but not out of question';
const HEADING = 'features';
const AWWWARDS = {
  src: '/images/6ab501af9fbb937d908bf929_Frame%201244839560.png',
  alt: 'White letter W followed by a period on a solid red square background.',
};
// `bottom` reproduces the original's hover-arrow file per row (see DiagArrow).
const GROUPS = [
  {
    name: 'Awwwards', sub: 'Honorable Mention', logo: AWWWARDS,
    rows: [
      { project: 'Supari Studios', category: 'July 12, 2026', href: 'https://www.awwwards.com/sites/supari-studios' },
      { project: 'Cheggout', category: 'Feb 21, 2026', href: 'https://www.awwwards.com/sites/cheggout' },
      { project: 'Cafe Mocha', category: 'Jun 14, 2023', href: 'https://www.awwwards.com/sites/mocha-cafe-bar' },
      { project: 'School of Yokohama', category: 'Feb 10, 2023', href: 'https://www.awwwards.com/sites/school-of-yokohama' },
      { project: 'Borno', category: 'Nov 14, 2022', href: 'https://www.awwwards.com/sites/borno-1' },
    ],
  },
  {
    name: 'Awwwards', sub: 'Nominee', logo: AWWWARDS,
    rows: [
      { project: 'Shabda.io', category: 'May 27, 2024', href: 'https://www.awwwards.com/sites/shabda-io' },
      { project: 'Kulfi Collective', category: 'Oct 04, 2023', href: 'https://www.awwwards.com/sites/kulfi-collective', bottom: 'black' },
    ],
  },
  {
    name: 'Kyoorius Design Awards', sub: 'First List',
    logo: {
      src: '/images/6ab501ce88aa732a292e1a01_Frame%201244839561.png',
      alt: 'White elephant icon with raised trunk on solid blue background.',
    },
    rows: [
      { project: 'Moshimbo', category: '2025', href: 'https://kyooriusdesign2025.awardsengine.com/?action=ows:entries.details&e=194202&project_year=2025', bottom: 'small' },
      { project: 'Boon', category: '2025', href: 'https://kyooriusdesign2025.awardsengine.com/?action=ows:entries.details&e=194209&project_year=2025' },
      { project: 'Borno', category: '2024', href: 'https://kyooriusdesign2025.awardsengine.com/?action=ows:entries.details&e=163894&project_year=2024' },
    ],
  },
  {
    name: 'Lottie Files', sub: 'Featured',
    logo: {
      src: '/images/6ab501d843e437a1b653326d_Frame%201244839562.png',
      alt: "White curved line shaped like a tilted lowercase 's' on a teal green square background.",
    },
    rows: [{ project: 'Borno', category: '2024', href: 'https://lottiefiles.com/built-with-lottie/borno-app' }],
  },
];

export default function Awards() {
  return (
    <section className="section_awards">
      <div className="padding-global">
        <div className="container-main">
          <div className="awards_element_v2 py-112 md:py-96">
            <div className="awards_info_header grid grid-cols-six pb-112 md:pb-40">
              <p className="text-size-medium long-para col-start-1 col-end-2 md:col-end-4 sm:col-end-7">{INTRO}</p>
            </div>

            <div className="awards_list_detail_grid grid grid-cols-six md:flex md:flex-col">
              <div className="awards_header_element col-span-2 max-w-320 pb-80 md:pb-40">
                <h2 className="text-size-h2 caps">{HEADING}</h2>
              </div>
              <div className="awards_list col-start-3 col-end-7 flex flex-col gap-112 md:w-1/2 md:gap-40 sm:w-full">
                {GROUPS.map((g) => (
                  <div key={g.name + g.sub} className="awards_list_item_v2 grid grid-cols-four items-start pb-24 md:flex md:flex-col md:gap-40">
                    <div className="award_wrapper col-start-1 col-end-2 flex gap-8" data-motion="award">
                      <div className="award_image_wrapper h-40 w-40 flex-none">
                        <img src={g.logo.src} alt={g.logo.alt} className="h-40 w-40" />
                      </div>
                      <div className="award_name_wrapper max-w-[160px]">
                        <div className="text-size-medium">{g.name}</div>
                        <div className="text-size-small color-grey">{g.sub}</div>
                      </div>
                    </div>
                    <div className="award_winner_list col-start-2 col-end-5 flex flex-col border-t md:w-full border-solid border-rule">
                      {g.rows.map((r, i) => (
                        <a
                          key={i}
                          href={r.href}
                          target="_blank"
                          className="award_winner_item list_row grid grid-cols-three items-center py-8"
                          data-motion="award-row"
                        >
                          <div className="text-size-medium text-ink">{r.project}</div>
                          <div className="text-size-medium color-grey justify-self-end">{r.category}</div>
                          <span className="justify-self-end">
                            <DiagArrow bottomVariant={r.bottom} />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
