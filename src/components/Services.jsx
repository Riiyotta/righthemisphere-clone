import { ButtonV2 } from './ui/Parts.jsx';

// §5
const HEADING = 'Things we do';
const SERVICES = [
  { title: 'UI/UX Design', note: 'Ensuring users are happy & keep coming back', index: '01' },
  { title: 'Web Design', note: 'Adding aesthetics to your functional website', index: '02' },
  { title: 'Digital Design', note: 'Helping you engage and convert with digital collaterals\u00a0', index: '03' },
  { title: 'Web Development', note: 'Building a website that fits and grows with your business', index: '04' },
];
const BUTTON = { label: 'LEARN MORE', href: '/services' };

export default function Services() {
  return (
    <section id="services" className="section_services_v2">
      <div className="padding-global">
        <div className="container-main">
          <div className="services_element_v2 grid grid-cols-six py-112 md:py-96 sm:flex sm:flex-col">
            <div className="services_block col-start-1 col-end-3 flex flex-col items-start gap-40 md:col-end-4">
              <h2 className="text-size-h2 caps">{HEADING}</h2>
              <div className="services_detail_wrapper_v2 w-full border-t border-solid border-rule">
                {SERVICES.map((s) => (
                  <div
                    key={s.index}
                    className="service_wrapper flex items-start justify-between border-b border-solid border-rule py-12"
                    data-motion="service-row"
                  >
                    <div className="service_item_wrap flex max-w-service flex-col gap-3.2">
                      <div className="text-size-large">{s.title}</div>
                      <div className="text-size-small color-grey">{s.note}</div>
                    </div>
                    <div className="text-size-large">{s.index}</div>
                  </div>
                ))}
                <ButtonV2 label={BUTTON.label} href={BUTTON.href} className="services mt-40 w-[46%] py-2.4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
