// CLONE_SPEC-PAGES §2.1. Hooks for the load timeline: hero fade, heading chars,
// "services" word x −50% → 0, intro words y 200px → 0.
export default function ServicesHero({ words, intro }) {
  return (
    <section className="section_hero_services overflow-hidden" data-motion="services-hero">
      <div className="padding-global">
        <div className="container-main">
          <div className="services_hero_element flex flex-col">
            <div className="services_hero_header_wrap">
              <div className="services_heading-wrapper">
                <div className="services_heading_contain" data-motion="services-heading">
                  <h1 className="h1 text-display uppercase tracking-h1 text-ink-h1">{words[0]}</h1>
                  <div className="services_hero_header_wrapper" data-motion="services-word">
                    <h1 className="h1 text-display uppercase tracking-h1 text-ink-h1">{words[1]}</h1>
                  </div>
                </div>
              </div>
            </div>
            <div className="services_in_detail_element">
              <div className="services_in-detail_description" data-motion="services-intro">
                <p className="text-size-medium_services_hero">{intro}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
