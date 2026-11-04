import { useState } from 'react';
import { Brand } from './ui/Parts.jsx';
import { ArrowRight, MenuGlyph, CloseGlyph } from './ui/Icons.jsx';

// §1
const LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'services', href: '/services' },
  { label: 'about', href: '/about' },
  { label: 'Blog', href: '/blog' },
];
const CONTACT = { label: 'CONTACT', href: '/contact' };
const MENU_LABEL = { closed: 'MENU', open: 'CLOSE' };

// `active`: current pathname. The matching link gets Webflow's .w--current (#120DF7,
// CLONE_SPEC-PAGES §0). Default null keeps the homepage output unchanged.
export default function Navbar({ active = null }) {
  const [open, setOpen] = useState(false);
  const current = (href) =>
    href === active ? { 'aria-current': 'page', currentClass: ' w--current' } : { currentClass: '' };

  return (
    <div className="nav fixed left-0 right-0 top-0 z-nav h-nav bg-paper px-32 md:px-0" data-motion="nav">
      <div className="nav_wrapper relative grid h-full grid-cols-six py-8 md:flex md:items-center md:justify-between md:py-0">
        {/* ≤991: white bar layer so the menu panel can slide out from behind it */}
        <div className="nav_bar_bg absolute inset-x-0 top-0 z-5 hidden h-nav bg-paper md:block" aria-hidden="true" />

        <Brand className="relative z-10 col-start-1 md:ml-20 xs:ml-16" />

        <nav
          id="nav-menu"
          className={`navigation col-start-2 col-end-7 flex items-end justify-between
            md:absolute md:left-0 md:right-0 md:top-44 md:z-0 md:flex-col md:items-start md:justify-start
            md:border-b md:border-solid md:border-rule md:bg-paper md:px-20 md:py-40 xs:px-16
            md:transition-[transform,visibility] md:duration-400 md:ease-[ease]
            ${open ? 'md:visible md:translate-y-0' : 'md:invisible md:-translate-y-[calc(100%+44px)]'}`}
          data-open={open}
        >
          {LINKS.map((l) => (
            <div key={l.label} className="nav_link_wrapper w-1/5 md:mb-8 md:flex md:w-auto">
              <a
                href={l.href}
                className={`nav_link${current(l.href).currentClass}`}
                aria-current={current(l.href)['aria-current']}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </div>
          ))}
          <div className="nav_link_wrapper w-1/5 md:mb-8 md:flex md:w-full">
            <a
              href={CONTACT.href}
              className={`nav_link contact relative flex w-full items-center justify-between pt-[7.2px]${current(CONTACT.href).currentClass}`}
              aria-current={current(CONTACT.href)['aria-current']}
              onClick={() => setOpen(false)}
            >
              <span>{CONTACT.label}</span>
              <span className="contact_link_icon_wrapper arrow_pair h-v-t14 w-v-t14 md:h-10 md:w-10" data-motion="contact-arrow">
                <ArrowRight className="contact_link_icon default" />
                <ArrowRight className="contact_link_icon left" />
              </span>
              <span className="button_line" data-motion="button-line" />
            </a>
          </div>
        </nav>

        <button
          type="button"
          className="menu_button relative z-10 hidden items-center gap-8 text-ink md:mr-20 md:flex xs:mr-16"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-menu-label uppercase">{open ? MENU_LABEL.open : MENU_LABEL.closed}</span>
          {open ? (
            <CloseGlyph className="h-10 w-10 text-accent" />
          ) : (
            <MenuGlyph className="h-10 w-10 text-accent" />
          )}
        </button>
      </div>
    </div>
  );
}
