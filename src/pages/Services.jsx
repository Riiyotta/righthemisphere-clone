import PageShell from '../components/shared/PageShell.jsx';
import ServicesHero from '../components/services/ServicesHero.jsx';
import ServicesTable from '../components/services/ServicesTable.jsx';
import Faq from '../components/Faq.jsx';
import Contact from '../components/Contact.jsx';
import { pages } from '../data/content.js';
import { usePageMotion } from '../motion';

const s = pages.services;

// §2.3: the homepage FAQ unchanged (its 5 items match pages.services.faq verbatim).
export default function Services() {
  // §2.M: services intro (no height tween), Lenis, site reveals (service rows stay static)
  usePageMotion({ intro: 'services' });
  return (
    <PageShell active="/services">
      <ServicesHero words={s.heroWords} intro={s.intro} />
      <ServicesTable header={s.tableHeader} services={s.services} />
      <Faq />
      <Contact />
    </PageShell>
  );
}
