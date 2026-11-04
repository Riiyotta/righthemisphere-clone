import { ArrowNESmall } from './ui/Icons.jsx';

// §2
const HEADING = ['building', 'web', 'experiences'];
const SUBHEAD = 'for design-first brands';
const BUTTON = { lines: ['Things', 'we did'], href: '#' };
const ADDRESS = {
  label: ['Click-clack,', 'ring-ring:'],
  email: 'hello@righthemisphere.studio',
  phone: '+91 9085226014',
  tel: 'tel:+919085226014',
};

export default function Hero() {
  return (
    <section className="section_hero overflow-hidden border-b border-solid border-rule" data-motion="hero">
      <div className="padding-global">
        <div className="container-main">
          <div className="hero-element flex flex-col">
            <div className="hero_header_wrap flex flex-col justify-center pb-192 pt-240 sm:pb-128 sm:pt-160" data-motion="hero-header-wrap">
              <div
                className="hero_heading_contain relative z-5 flex w-full flex-wrap items-center justify-between sm:justify-start sm:gap-x-14"
                data-motion="hero-heading"
              >
                {HEADING.map((word) => (
                  <h1 key={word} className="h1 text-display uppercase tracking-h1 text-ink-h1">
                    {word}
                  </h1>
                ))}
              </div>
              <div className="hero_subhead_block flex justify-end sm:justify-start">
                <div className="hero_subhead_wrapper md:w-[clamp(333px,191.8px+18.3857vw,374px)] sm:w-auto">
                  <div className="hero_subhead text-left text-hero-sub uppercase" data-motion="hero-subhead">
                    {SUBHEAD}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero_info_block flex items-end justify-between pb-40 sm:flex-col-reverse sm:items-stretch sm:gap-16"
              data-motion="hero-info"
            >
              <a href={BUTTON.href} className="hero_btn flex items-end gap-8 text-ink sm:hidden">
                <span className="text-size-medium_hero uppercase">
                  {BUTTON.lines[0]}
                  <br />
                  {BUTTON.lines[1]}
                </span>
                <ArrowNESmall className="hero_btn_arrow_icon mb-3.36 h-v-t14 w-v-t14 rotate-90 text-accent md:mb-4.8 md:h-10 md:w-10" />
              </a>
              <div className="hero_address_wrapper flex flex-col items-end gap-4 text-right sm:flex-row sm:items-center sm:justify-between">
                <div className="text-size-small_hero uppercase text-grey sm:hidden">
                  {ADDRESS.label[0]}
                  <br />
                  {ADDRESS.label[1]}
                </div>
                <a href={`mailto:${ADDRESS.email}`} className="text-size-small_hero text-ink">
                  {ADDRESS.email}
                </a>
                <a href={ADDRESS.tel} className="text-size-small_hero text-ink">
                  {ADDRESS.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
