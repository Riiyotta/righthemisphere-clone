import { ButtonV2 } from './ui/Parts.jsx';

// §12. Three display lines (original classes: lets_create / something / pretty).
// Motion hooks: original line classes map to .line_1 / .line_2 / .line_3 (see handoff).
const LINES = ['ready to create', 'something', 'pretty'];
const BUTTON = { label: 'wORK wITH US', href: '/contact' };

export default function Contact() {
  return (
    <section id="contact" className="section_contact">
      <div className="padding-global">
        <div className="container-main">
          <div className="contact_element grid grid-cols-six pb-80 pt-240 md:py-96">
            <div className="contact_element_wrapper col-span-6 flex flex-col items-center gap-24 text-center md:gap-40 sm:mb-40" data-motion="contact">
              <div className="contact_heading_wrapper">
                {LINES.map((line, i) => (
                  <h2
                    key={line}
                    className={`contact_heading line_${i + 1} text-display uppercase tracking-h2 text-ink`}
                    data-line={i + 1}
                  >
                    {line}
                  </h2>
                ))}
              </div>
              <ButtonV2 label={BUTTON.label} href={BUTTON.href} className="contact w-192 max-w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
