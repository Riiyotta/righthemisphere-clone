// CLONE_SPEC-PAGES §1.1. No scroll reveal: the paragraph animates only in the load
// timeline (SplitText words, y 150% → 0), hook data-motion="about-intro".
export default function AboutIntro({ text }) {
  return (
    <section className="section_about_us_page">
      <div className="padding-global">
        <div className="container-main">
          <div className="about_us_v2" data-motion="about-intro">
            <div className="text-size-large">{text}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
