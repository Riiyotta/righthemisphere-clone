import PageShell from '../components/shared/PageShell.jsx';
import HeroWords from '../components/shared/HeroWords.jsx';
import AboutIntro from '../components/about/AboutIntro.jsx';
import Team from '../components/about/Team.jsx';
import Process from '../components/about/Process.jsx';
import Products from '../components/about/Products.jsx';
import Partners from '../components/Partners.jsx';
import Blogs from '../components/Blogs.jsx';
import Contact from '../components/Contact.jsx';
import { pages, url } from '../data/content.js';
import { toBlogPost, HOME_BLOG_PLACES } from '../components/shared/mappers.js';
import { usePageMotion, PAGE_REVEALS, initTeamHover } from '../motion';

const about = pages.about;

// §1.4 tile placement at ≥992 (column / justify-self), 6 + 5 + 5 + 5 tiles.
const PLACEMENT = [
  ['1s', '2s', '3s', '4e', '5e', '6e'],
  ['1e', '2e', '3e', '4e', '6s'],
  ['1s', '2s', '4s', '5s', '6e'],
  ['1s', '3s', '4e', '5e', '6e'],
];
const COL = { 1: 'col-start-1', 2: 'col-start-2', 3: 'col-start-3', 4: 'col-start-4', 5: 'col-start-5', 6: 'col-start-6' };
const JUSTIFY = { s: 'justify-self-start', e: 'justify-self-end' };
const NUM = { 'client_name color-white': 'white', 'client_name color-black': 'black' };

const clientRows = about.clients.rows.map((row, r) =>
  row.map((t, i) => {
    const [c, j] = PLACEMENT[r][i];
    return {
      col: COL[c],
      justify: JUSTIFY[j],
      name: t.name,
      num: NUM[t.numClass] ?? null,
      src: url(t.image.src),
      alt: t.image.alt || '',
    };
  }),
);

export default function About() {
  // §1.M: about intro, Lenis, site reveals + team/product rows, team-row hover image
  usePageMotion({ intro: 'about', reveals: { extra: PAGE_REVEALS.about }, setup: [initTeamHover] });
  return (
    <PageShell active="/about">
      <HeroWords sectionClass="section_hero_about" words={about.heroWords} />
      <AboutIntro text={about.intro} />
      <Team heading={about.team.heading} members={about.team.members} />
      <Process heading={about.process.heading} text={about.process.text} />
      <Partners id="clients" rows={clientRows} button={null} />
      <Products heading={about.products.heading} items={about.products.items} />
      <Blogs heading={about.blogs.heading} posts={about.blogs.cards.map((c, i) => toBlogPost(c, HOME_BLOG_PLACES[i]))} />
      <Contact />
    </PageShell>
  );
}
