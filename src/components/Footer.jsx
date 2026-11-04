import { useLayoutEffect, useRef, useState } from 'react';
import { openCredits, resetCredits } from '../motion/interactions.js';
import { Brand, DiagArrow } from './ui/Parts.jsx';
import { Plus, CloseGlyph } from './ui/Icons.jsx';

// §13
const CREDITS_LABEL = 'our partners';
const BADGE = { src: '/images/6ac77657eb7dd3860174f3d1_certified_partner_badge_white.png', href: '#' };
const BADGE_NOTE = '\u00a9 Right Hemisphere, 2026';
const ADDRESS = {
  label: 'ADDRESS:',
  lines: ['5th floor, Peace Enclave, Ulubari, GS Road,', 'Guwahati-7,\u00a0Assam, India'],
  contacts: [
    { label: 'EMAIL:', text: 'hello@righthemisphere.studio', href: 'mailto:hello@righthemisphere.studio' },
    { label: 'CALL:', text: '+91 9085226014', href: 'tel:+919085226014' },
  ],
};
const PRODUCTS = {
  label: 'OUR PRODUCTS:',
  links: [
    { label: 'BORNO.APP', href: 'https://borno-app.webflow.io/', external: true },
    { label: 'SATOPLAYER.COM', href: 'https://www.satoplayer.com/', external: true },
    { label: 'SKARA.APP', href: 'https://skara.app/', external: true },
  ],
};
const SITEMAP = {
  label: 'SITEMAP:',
  links: [
    { label: 'home', href: '/', current: true },
    { label: 'work', href: '/work' },
    { label: 'services', href: '/services' },
    { label: 'about', href: '/about' },
    { label: 'blog', href: '/blog' },
    { label: 'contact', href: '/contact' },
  ],
};
const SOCIALS = {
  label: 'SOCIALS:',
  links: [
    { label: 'INSTAGRAM', href: 'https://www.instagram.com/hemisphereco/', external: true },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/company/righthemisphere/', external: true },
  ],
};

// Partner-credits overlay content
const OVERLAY = {
  heading: 'OUR PARTNERS',
  body: 'Everybody needs somebody. Here\u2019s a few of the talented teams we\u2019ve partnered with throughout the years.',
  partners: [
    {
      name: 'Mattered', note: 'Lifecycle Marketing & Development for World-Class Brands',
      href: 'https://mattered.com/', logo: '/images/6abb92b279b497c79853f7eb_mattered.png',
    },
    {
      name: 'Moshimbo', note: 'A brand building studio, run by one dog, trusted by many brands',
      href: 'https://www.moshimbo.com/', logo: '/images/6abb92b249978dc1dbc3d47c_moshimbo.png',
    },
    {
      name: 'Bare Bones Collective', note: 'Creative agency that believes, great brands are built through audacious work',
      href: 'https://www.barebonescollective.com/', logo: '/images/6abb92b2558d7199c2de20f1_bbc.png',
    },
    {
      name: 'Studio Ping Pong', note: 'A tiny-mighty design studiobased in Bengaluru & Kolkata',
      href: 'https://studiopingpong.com/', logo: '/images/6abb92b2558d7199c2de20f4_ping%20pong.png',
    },
  ],
};

function LinkGroup({ label, links, className = '', ...rest }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`} {...rest}>
      <div className="text-size-small color-grey">{label}</div>
      {links.map((l) => {
        const item = l;
        return (
          <a
            key={item.label}
            href={item.href}
            {...(item.external ? { target: '_blank' } : {})}
            className={`nav_link ${item.current ? 'w--current' : ''}`}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

// Overlay layout per the original: a 6-col list (padding 32/32, items end) holding a
// 4-col panel grid: header (col 1, pt 80), list (cols 2–3, row 2, my 32), close (col 4, row 1).
// The white cover is 100vw square anchored to the panel's top-right, so it also whites out
// everything left of and below the panel.
function PartnerCredits({ open, onClose }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (!open) return undefined;
    const tl = openCredits(root.current); // a-18 reveal sequence
    return () => resetCredits(root.current, tl); // a-22: close is instant
  }, [open]);
  return (
    <div
      ref={root}
      className={`partners_list_wrapper-copy fixed inset-0 z-overlay overflow-hidden bg-overlay ${open ? 'flex' : 'hidden'} items-end justify-center`}
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={OVERLAY.heading}
    >
      <div className="padding-global w-full">
        <div className="container-main">
          <div className="partners_list grid grid-cols-six items-end py-32 md:flex">
            <div className="partners_list_element relative col-span-4 md:w-full" data-motion="partner-panel">
              <div className="partners_items_wrapper relative z-10 grid grid-cols-four items-start xs:h-480" data-motion="partner-items">
                <div className="partners_items_header_wrapper col-start-1 row-start-1 flex flex-col items-start gap-16 pt-80 sm:col-end-3 xs:col-end-4 xs:self-end xs:pb-32">
                  <div className="text-size-h2">{OVERLAY.heading}</div>
                  <p className="text-size-regular">{OVERLAY.body}</p>
                </div>
                <div className="partners_items_contain col-start-2 col-end-4 row-start-2 my-32 flex flex-col items-start border-t border-solid border-rule sm:col-start-1 sm:mt-0 xs:mb-0">
                  {OVERLAY.partners.map((p, i) => (
                    <a key={i} href={p.href} target="_blank" className="partner_link list_row flex w-full flex-col gap-8 py-16" data-motion="partner-link">
                      <div className="partner_name_wrapper flex items-start justify-between">
                        <div className="company_item flex items-center gap-16">
                          <img src={p.logo} alt="" className="partner_logo h-64 w-64 flex-none" />
                          <div className="company_name_detail flex max-w-[70%] flex-col items-start gap-2">
                            <div className="text-size-medium">{p.name}</div>
                            <div className="text-size-regular color-grey">{p.note}</div>
                          </div>
                        </div>
                        <DiagArrow />
                      </div>
                    </a>
                  ))}
                </div>
                <button
                  type="button"
                  className="partner_close_btn col-start-4 row-start-1 mr-32 mt-32 flex h-32 w-32 items-center justify-center self-start justify-self-end text-accent"
                  aria-label="Close partner credits"
                  onClick={onClose}
                >
                  <CloseGlyph className="partners_close_icon h-v-t20 w-v-t20" />
                </button>
              </div>
              <div
                className="partner_white_cover absolute right-0 top-0 z-[9] h-[100vw] w-[100vw] origin-top-right bg-paper sm:h-[800px]"
                data-motion="partner-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// `currentPath` (optional): marks the matching sitemap link .w--current, as Webflow does on
// every route; null marks none (blog posts, case studies). Omitted = homepage behaviour.
export default function Footer({ currentPath } = {}) {
  const sitemap =
    currentPath === undefined
      ? SITEMAP
      : { ...SITEMAP, links: SITEMAP.links.map((l) => ({ ...l, current: l.href === currentPath })) };
  const [creditsOpen, setCreditsOpen] = useState(false);

  return (
    <footer className="section_footer">
      <div className="padding-global">
        <div className="container-main">
          <div className="footer_element grid grid-cols-six items-end pb-32 pt-112 md:pt-96 xs:grid-cols-one">
            <div
              className="footer_block brand col-span-2 flex h-full flex-col items-start justify-between
                md:col-start-1 md:col-end-3 md:row-start-2 md:mt-40 sm:col-end-4 xs:col-auto xs:row-start-4"
              data-motion="footer-block"
            >
              <button
                type="button"
                className="partners_element_v3 relative flex w-fit items-center justify-between gap-16 overflow-hidden uppercase text-ink"
                onClick={() => setCreditsOpen(true)}
              >
                <span className="text-size-small">{CREDITS_LABEL}</span>
                <span className="btn_v2_arrow_wrapper text-accent">
                  <Plus className="h-full w-full" />
                </span>
                <span className="button_line" data-motion="button-line" />
              </button>
              <div className="brang_wrapper_footer flex flex-col items-start gap-8">
                <Brand href="#" className="footer mb-4" />
                <a href={BADGE.href} target="_blank" className="certified_partner_link">
                  <img src={BADGE.src} alt="" className="certified_partner_badge h-badge w-badge" />
                </a>
                <div className="text-size-small color-grey">{BADGE_NOTE}</div>
              </div>
            </div>

            <div
              className="footer_block col-start-3 col-end-5 md:col-start-1 md:col-end-4 md:row-start-1 xs:col-auto xs:row-start-1"
              data-motion="footer-block"
            >
              <div className="footer_detail_block flex flex-col gap-8">
                <div className="text-size-small color-grey">{ADDRESS.label}</div>
                <div className="text-size-small">
                  {ADDRESS.lines[0]}
                  <br />
                  {ADDRESS.lines[1]}
                </div>
                {ADDRESS.contacts.map((c) => (
                  <div key={c.label} className="text-size-small">
                    <span className="color-grey">{c.label}</span>{' '}
                    <a href={c.href} className="link">
                      {c.text}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <LinkGroup
              {...PRODUCTS}
              data-motion="footer-block"
              className="footer_block products col-start-5 col-end-6 md:col-start-5 md:col-end-7 md:row-start-2 md:items-end md:justify-self-end md:text-right xs:col-auto xs:row-start-3 xs:items-start xs:justify-self-start xs:pt-24 xs:text-left"
            />

            <div
              className="footer_block right_align col-start-6 col-end-7 flex flex-col items-end gap-16 text-right md:col-start-4 md:col-end-7 md:row-start-1 xs:col-auto xs:row-start-2 xs:items-start xs:pt-24 xs:text-left"
              data-motion="footer-block"
            >
              <LinkGroup {...sitemap} className="items-end xs:items-start" />
              <LinkGroup {...SOCIALS} className="items-end xs:items-start" />
            </div>
          </div>
        </div>
      </div>
      <PartnerCredits open={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </footer>
  );
}
