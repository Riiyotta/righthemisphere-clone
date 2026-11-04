import { ButtonV2 } from './ui/Parts.jsx';

// §8. 3 rows × 5 tiles. `col` + `justify` reproduce the measured placement table.
// `num` is the original's number colour on the logo (color-white / color-black / unset = grey).
const HEADING = 'Clients';
const I = '/images/';
const ROWS = [
  [
    { col: 'col-start-1', justify: 'justify-self-start', name: 'Prime Video', num: 'white',
      src: `${I}6a8ff838dec8341819739a78_prime%20video.png`, alt: 'Prime Video logo with white text and a curved arrow on a blue background.' },
    { col: 'col-start-2', justify: 'justify-self-start', name: 'UC\u00a0Berkeley', num: 'white',
      src: `${I}6a8ff83bdec8341819739c91_uc%20berkeley.png`, alt: 'UC Berkeley logo with gold text on a dark blue background.' },
    { col: 'col-start-3', justify: 'justify-self-start', name: 'Razorpay', num: 'white',
      src: `${I}6a8ff8394a84a8e59e61e16c_razorpay.png`, alt: "Razorpay logo with stylized blue and white 'R' followed by the word 'azorpay' in white on black background." },
    { col: 'col-start-5', justify: 'justify-self-end', name: 'Govt of Madhya Pradesh', num: 'black',
      src: `${I}6a8ff838ae7857075677b005_mp%20govt.png`, alt: "Emblem of India featuring the Lion Capital of Ashoka above the text 'The heart of Incredible India'." },
    { col: 'col-start-6', justify: 'justify-self-end', name: 'Studio Ping Pong', num: 'black',
      src: `${I}6a8ff838fb0202d3b455f6d2_ping%20pong.png`, alt: "The words 'PING PONG' in bold black letters on a yellow background, with the letters stylized and a dot used to represent the letter 'O' in 'PONG'." },
  ],
  [
    { col: 'col-start-1', justify: 'justify-self-end', name: 'Mattered', num: 'white',
      src: `${I}6a8ff841c5ebb416ebede5f2_mattered.png`, alt: "White text on a black background reading 'Mattered.'" },
    { col: 'col-start-2', justify: 'justify-self-end', name: 'Moshimbo', num: 'black',
      src: `${I}6a8ff8414a84a8e59e61e5ce_moshimbo.png`, alt: "The word 'moshimbo' written in bold black stylized lowercase letters on a light pink background." },
    { col: 'col-start-3', justify: 'justify-self-end', name: 'Supari Studios', num: 'white',
      src: `${I}6a8ff83afb0202d3b455f847_supari%20studios.png`, alt: "White stylized text reading 'SUPARI STUDIOS' with a burst shape behind 'SUPARI' on a red background." },
    { col: 'col-start-4', justify: 'justify-self-end', name: 'Bare Bones Collective', num: 'white',
      src: `${I}6a8ff83da42bf0f579cb4c40_bare%20bones%20collective.png`, alt: "Logo with the words 'BARE BONES COLLECTIVE' spelled out in white rounded square blocks on a black background." },
    { col: 'col-start-6', justify: 'justify-self-start', name: 'Kulfi Collective', num: 'white',
      src: `${I}6a8ff840cd7764f54d32d400_kulfi%20collective.png`, alt: "White stylized logo on black background featuring the letters 'K', 'U', and 'fi' with decorative elements including a starburst and connecting lines." },
  ],
  [
    { col: 'col-start-1', justify: 'justify-self-start', name: 'Post Office Studios', num: 'white',
      src: `${I}6a8ff838294ee17b5de0ba7c_post%20office.png`, alt: "Teal colored rectangular outline with the words 'POST OFFICE' inside on a black background." },
    { col: 'col-start-2', justify: 'justify-self-start', name: 'Fashion for Good', num: 'black',
      src: `${I}6a8ff8400ec37c4f7d3cd1dd_fashion%20for%20good.png`, alt: "Logo featuring the words 'FASHION FOR GOOD' with the letters arranged in a stacked and aligned format with a stylized green circular icon on top." },
    { col: 'col-start-4', justify: 'justify-self-start', name: 'Boon', num: 'white',
      src: `${I}6a8ff83d8073883a3f4ce3c7_boon.png`, alt: "White lowercase letters spelling 'boon' on a blue background." },
    { col: 'col-start-5', justify: 'justify-self-start', name: 'Anomaly Brands', num: 'black',
      src: `${I}6a8ff83bdec8341819739cd3_anomaly.png`, alt: "The word 'Anomaly:' written in bold black text on a white background." },
    { col: 'col-start-6', justify: 'justify-self-end', name: 'Pigeon & Co.', num: null,
      src: `${I}6aeae8d83c43d5c571a5baa8_pigeon%20&%20co.png`, alt: '' },
  ],
];
const NUM_COLOR = { white: 'text-paper', black: 'text-ink' };
const BUTTON = { label: 'see all clients', href: '/about#clients' };

// Optional props (CLONE_SPEC-PAGES §1.4, /about): 4 rows of tiles, no button, id="clients".
// Defaults keep the homepage output identical.
export default function Partners({ rows = ROWS, button = BUTTON, id } = {}) {
  let n = 0;
  return (
    <section id={id} className="section_partners_v3">
      <div className="padding-global">
        <div className="container-main">
          <div className="partners_element_v2 py-112 md:py-96">
            <div className="w-480 max-w-full pb-40">
              <h2 className="text-size-h2 caps">{HEADING}</h2>
            </div>

            {rows.map((row, r) => (
              <div
                key={r}
                className="partner_list_image_grid grid grid-cols-six items-start pb-16 md:block md:pb-0"
                data-motion="partner-row"
              >
                {row.map((t) => {
                  n += 1;
                  const num = String(n).padStart(2, '0');
                  return (
                    <div
                      key={num}
                      className={`partner_image_item_wrapper flex w-1/2 flex-col items-center gap-4 text-center ${t.col} ${t.justify}
                        md:col-auto md:w-full md:flex-row md:justify-self-stretch md:p-8 md:text-left`}
                    >
                      <div className="partner_image_item relative aspect-square w-full overflow-hidden md:static md:flex md:aspect-auto md:w-24 md:flex-none md:items-center" data-motion="partner-tile">
                        <img src={t.src} alt={t.alt} className="h-auto w-full md:hidden" />
                        <div className="partner_image_number_wrapper absolute left-0 top-0 pl-4 pt-4 md:static md:p-0">
                          <div className={`client_name text-t14 ${NUM_COLOR[t.num] || 'text-grey'} md:text-client-md md:text-ink`}>{num}</div>
                        </div>
                      </div>
                      <div className="client_name text-t14 text-grey md:text-client-md md:text-ink">{t.name}</div>
                    </div>
                  );
                })}
              </div>
            ))}

            {button && (
              <div className="partner_list_detail_grid grid grid-cols-six sm:grid-cols-two">
                <div className="clients_btn_wrapper col-start-5 row-start-2 pt-40 md:col-start-1 md:col-end-3 sm:col-end-2 sm:row-start-3">
                  <ButtonV2 label={button.label} href={button.href} className="w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
