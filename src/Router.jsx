import App from './App.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import WorkPage from './pages/Work.jsx';
import ContactPage from './pages/Contact.jsx';
import BlogList from './pages/BlogList.jsx';
import BlogPost from './pages/BlogPost.jsx';
import CaseStudy from './pages/CaseStudy.jsx';
import NotFound from './pages/NotFound.jsx';
import { applyHead } from './components/shared/head.js';
import { pages, blogPosts, caseStudies } from './data/content.js';

// Every route is a full document load on the original (no page transitions), so routing is
// a one-shot lookup on window.location.pathname. Links are plain <a href>.
// Titles and descriptions are the original's server HTML values.
const HOME = null; // "/" keeps index.html's own <title>/<meta>; App renders unchanged.

const STATIC = {
  '/about': {
    head: { title: pages.about.title, description: 'Meet the minds behind Right Hemisphere.' },
    render: () => <About />,
  },
  '/services': {
    head: {
      title: pages.services.title,
      description: 'Bringing form to function. Interface Design | Webflow Development | Creative Design',
    },
    render: () => <Services />,
  },
  '/work': {
    head: {
      title: pages.work.title,
      description:
        'See what Right Hemisphere can do for you. Explore our recent projects and get your next one started.',
    },
    render: () => <WorkPage />,
  },
  '/contact': {
    head: { title: pages.contact.title, description: 'Connect with Right Hemisphere for your next project.' },
    render: () => <ContactPage />,
  },
  '/blog': {
    head: { title: pages.blog.title, description: 'Read our Blogs' },
    render: () => <BlogList />,
  },
};

function resolve(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === '/') return HOME;
  if (STATIC[path]) return STATIC[path];

  const post = blogPosts.find((p) => p.route === path);
  if (post) {
    // Blog posts ship the site default title and no description.
    return { head: { title: post.documentTitle, description: post.metaDescription }, render: () => <BlogPost post={post} /> };
  }

  const study = Object.values(caseStudies).find((c) => c.route === path);
  if (study) {
    return { head: { title: study.title, description: null }, render: () => <CaseStudy study={study} /> };
  }

  // Webflow's hosting-level 404 (checked live: /does-not-exist).
  return {
    head: { title: '404 - Page not found', description: "The page you are looking for doesn't exist or has been moved." },
    render: () => <NotFound />,
  };
}

export default function Router() {
  const route = resolve(window.location.pathname);
  if (route === HOME) return <App />;
  applyHead(route.head);
  return route.render();
}
