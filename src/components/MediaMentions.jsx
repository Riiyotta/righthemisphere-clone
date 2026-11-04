import { DiagArrow } from './ui/Parts.jsx';

// §7
const HEADING = 'Media Mentions';
const INTRO = 'Sometimes our blogs end up on products and courses...';
const MENTIONS = [
  {
    title: 'Digital Accessibility Knowledge Base', source: 'evinced.com',
    href: 'https://knowledge.evinced.com/mobile-validations/tappable-area?utm_source=gemini',
  },
  { title: 'Figmacode prequisites', source: 'Figmacode', href: 'https://figmacode.com/read/prerequisites' },
  {
    title: 'When is a spacing unit more than a spacing unit?', source: 'Zeroheight.com',
    href: 'https://zeroheight.com/blog/when-is-a-spacing-unit-more-than-a-spacing-unit/?utm_source=gemini',
  },
  {
    title: 'What is Fitts\u2019 Law and How to Apply It in UX Design?', source: 'Bootcamp',
    href: 'https://medium.com/design-bootcamp/what-is-fitts-law-and-how-to-apply-it-in-ux-design-63f386c968ad?utm_source=gemini',
  },
];

export default function MediaMentions() {
  return (
    <section className="section_media_mentions">
      <div className="padding-global">
        <div className="container-main">
          <div className="media_mentions_wrapper grid grid-cols-six py-112 md:block md:py-96">
            <div className="media_mentions_element col-start-3 col-end-7 grid grid-cols-four sm:flex sm:flex-col sm:gap-40">
              <div className="media_mentions_header_wrapper col-span-2 flex max-w-media flex-col items-start gap-8">
                <h2 className="text-size-h2 caps">{HEADING}</h2>
                <p className="text-size-medium">{INTRO}</p>
              </div>
              <div className="media_mention_list col-span-2 border-t border-solid border-rule">
                {MENTIONS.map((m, i) => (
                  <a
                    key={i}
                    href={m.href}
                    target="_blank"
                    className="media_mention_item list_row flex justify-between py-12"
                    data-motion="media-row"
                  >
                    <div className="media_mention_content_wrapper flex w-[352px] max-w-full flex-col items-start gap-4">
                      <div className="text-size-medium text-ink">{m.title}</div>
                      <div className="text-size-small color-grey">{m.source}</div>
                    </div>
                    <DiagArrow />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
