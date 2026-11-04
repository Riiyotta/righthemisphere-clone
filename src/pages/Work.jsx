import PageShell from '../components/shared/PageShell.jsx';
import HeroWords from '../components/shared/HeroWords.jsx';
import WorkGrid from '../components/work/WorkGrid.jsx';
import Contact from '../components/Contact.jsx';
import { pages } from '../data/content.js';
import { usePageMotion } from '../motion';

// §3: hero words variant (section_hero_blog), 25 cards, contact CTA.
export default function WorkPage() {
  // §3.M: work intro (heading 65%, hero cards as home), Lenis, site work-card reveals
  usePageMotion({ intro: 'work' });
  return (
    <PageShell active="/work">
      <HeroWords sectionClass="section_hero_blog" words={pages.work.heroWords} />
      <WorkGrid wrappers={pages.work.wrappers} />
      <Contact />
    </PageShell>
  );
}
