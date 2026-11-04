import PageShell from '../components/shared/PageShell.jsx';
import HeroWords from '../components/shared/HeroWords.jsx';
import Blogs from '../components/Blogs.jsx';
import { pages } from '../data/content.js';
import { toBlogPost } from '../components/shared/mappers.js';
import { usePageMotion } from '../motion';

// §5: all 10 cards. The 3-card stagger repeats via auto-placement: 3n+1 at cols 1/3 on its
// own row, 3n+2 at cols 2/4 and 3n+3 at cols 5/7 on the next. No contact CTA.
const PLACES = ['col-start-1 col-end-3', 'col-start-2 col-end-4', 'col-start-5 col-end-7'];

export default function BlogList() {
  // §5: blog intro (heading 60%), Lenis, site reveals
  usePageMotion({ intro: 'blog' });
  return (
    <PageShell active="/blog">
      <HeroWords sectionClass="section_hero_blog" words={pages.blog.heroWords} />
      <Blogs heading={pages.blog.heading} posts={pages.blog.cards.map((c, i) => toBlogPost(c, PLACES[i % 3]))} />
    </PageShell>
  );
}
