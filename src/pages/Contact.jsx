import PageShell from '../components/shared/PageShell.jsx';
import HeroWords from '../components/shared/HeroWords.jsx';
import ContactInfo from '../components/contact/ContactInfo.jsx';
import ContactForm from '../components/contact/ContactForm.jsx';
import { pages } from '../data/content.js';
import { usePageMotion, PAGE_REVEALS } from '../motion';

// §4: no contact CTA on this page.
export default function ContactPage() {
  // §4.M: contact intro (+ info row), Lenis, site reveals + page .text-size-large
  usePageMotion({ intro: 'contact', reveals: { extra: PAGE_REVEALS.contact } });
  return (
    <PageShell active="/contact">
      <HeroWords sectionClass="section_contact_hero" words={pages.contact.heroWords} />
      <ContactInfo info={pages.contact.info} />
      <ContactForm form={pages.contact.form} />
    </PageShell>
  );
}
