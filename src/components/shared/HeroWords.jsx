// CLONE_SPEC-PAGES §0.1 "hero words": the homepage hero header only (3 × h1.h1),
// no subhead, no info block, no border. The hidden .hero_navigation_wrapper is not rendered.
// Motion hooks match the homepage hero (hero-header-wrap / hero-heading).
export default function HeroWords({ sectionClass, words }) {
  return (
    <section className={`${sectionClass} overflow-hidden`} data-motion="hero">
      <div className="padding-global">
        <div className="container-main">
          <div className="hero-element flex flex-col">
            <div
              className="hero_header_wrap flex flex-col justify-center pb-192 pt-240 sm:pb-128 sm:pt-160"
              data-motion="hero-header-wrap"
            >
              <div className="hero_heading-wrapper">
                <div
                  className="hero_heading_contain relative z-5 flex w-full flex-wrap items-center justify-between sm:justify-start sm:gap-x-14"
                  data-motion="hero-heading"
                >
                  {words.map((word) => (
                    <h1 key={word} className="h1 text-display uppercase tracking-h1 text-ink-h1">
                      {word}
                    </h1>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
