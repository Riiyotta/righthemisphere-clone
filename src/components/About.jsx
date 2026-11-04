import { ButtonV2 } from './ui/Parts.jsx';

// §4
const STATEMENT = 'Pretty peculiar about pretty pixels\u00a0\u00a0';
const PARAGRAPH =
  'We\u2019re a bunch of creatives and engineers exploring how beauty meets utility to create\u00a0web experiences that command attention.';
const BUTTON = { label: 'KNOW US BETTER', href: '/about' };

export default function About() {
  return (
    <section id="about" className="section_about_us">
      <div className="padding-global">
        <div className="container-main">
          <div className="about_us_v2 on_home grid grid-cols-six items-start py-112 md:flex md:flex-col md:gap-40 md:py-96">
            <div className="text-size-h2 caps col-start-1 col-end-2">{STATEMENT}</div>
            <p className="text-size-large long_para col-start-4 col-end-7 row-start-1" data-motion="about-para">
              {PARAGRAPH}
            </p>
            <div className="about-btn_wrapper col-start-4 col-end-5 row-start-2 self-end md:grid md:w-full md:grid-cols-three md:gap-16 sm:flex sm:flex-col sm:gap-0">
              <ButtonV2 label={BUTTON.label} href={BUTTON.href} className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
