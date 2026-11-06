import { useLayoutEffect, useRef, useState } from 'react';
import { animateFaq } from '../motion/interactions.js';
import { Plus, Minus } from './ui/Icons.jsx';

// §10
const HEADING = "faq's";
const ITEMS = [
  {
    q: 'Who we work with',
    a: 'Brands that believe in the intangible value of design. Teams that want a development partner to get their visions built without compromises.',
  },
  {
    q: 'What is our tech stack',
    a: 'We build on Webflow, Framer, Wix, Shopify and Wordpress. If required, we write custom code for automations and added functionalities.',
  },
  {
    q: 'Do we migrate websites',
    a: 'Yes. A large chunk of our work involves frictionless migration of websites from legacy systems to new ones. We work closely with your old team to ensure you regain control over your website.',
  },
  {
    q: 'Do we offer website maintenance',
    a: 'Yes. Every site we build comes with 2 months of free maintenance post-handover. Beyond that we have maintenance retainers which is way more economical than keeping an in-house tech team on payroll.',
  },
  {
    q: 'Do we offer a free UI and UX audit',
    a: 'Yes. If you are unsure about your website being user-friendly, fill out the contact form and we will sit with you to give you honest and research-backed feedback.',
  },
];

function FaqItem({ index, item }) {
  const [open, setOpen] = useState(false); // all start closed; items are independent
  const detail = useRef(null);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    animateFaq(detail.current, open); // a-4 / a-5: height 0 ↔ auto, 500ms easeOutQuart
  }, [open]);
  return (
    <div className="faq_item cursor-pointer border-b border-solid border-rule pb-16" data-open={open} data-motion="faq-item">
      <button
        type="button"
        className="faq_item_header grid w-full grid-cols-four grid-rows-faq text-left"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="faq_item_header_wrapper col-span-3 flex items-center">
          <div className="text-size-medium w-40 shrink">{String(index + 1).padStart(2, '0')}</div>
          <div className="text-size-medium">{item.q}</div>
        </div>
        <div className="faq-toggle flex h-32 w-32 items-center justify-center justify-self-end">
          <span className="relative block h-v-t20 w-v-t20 text-accent">
            <Minus className="faq_minus_icon absolute inset-0 h-full w-full" />
            <Plus
              className={`faq_add_icon absolute inset-0 h-full w-full transition-transform duration-500 ease-quart ${
                open ? 'scale-y-0' : 'scale-y-100'
              }`}
            />
          </span>
        </div>
      </button>
      <div ref={detail} className="faq_item_detail overflow-hidden" style={{ height: 0 }}>
        <div className="px-40 pt-8">
          <p className="text-size-regular">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section className="section_faq">
      <div className="padding-global">
        <div className="container-main">
          <div className="faq_element pb-112 pt-160 md:pb-96 md:pt-128">
            <div className="faq_detail_grid grid grid-cols-six sm:flex sm:flex-col">
              <div className="faq_header col-start-3 col-end-4 pb-80 md:col-start-1 md:col-end-4 sm:pb-40">
                <h2 className="text-size-h2 caps">{HEADING}</h2>
              </div>
              <div className="faq_items_wrapper col-start-4 col-end-7 flex flex-col gap-8">
                {ITEMS.map((item, i) => (
                  <FaqItem key={i} index={i} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
