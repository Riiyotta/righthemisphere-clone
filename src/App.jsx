import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import About from './components/About.jsx';
import Services from './components/Services.jsx';
import Awards from './components/Awards.jsx';
import MediaMentions from './components/MediaMentions.jsx';
import Partners from './components/Partners.jsx';
import Testimonials from './components/Testimonials.jsx';
import Faq from './components/Faq.jsx';
import Blogs from './components/Blogs.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { usePageMotion } from './motion/index.js';

// section_cta is display:none on the original and is intentionally skipped.
export default function App() {
  // Lenis + home load intro (§14.3) + scroll-reveal registry (§14.4); ≤767 stays static.
  usePageMotion({ intro: 'home' });
  return (
    <div className="page-wrapper">
      <Navbar />
      <main>
        <Hero />
        <Work />
        <About />
        <Services />
        <Awards />
        <MediaMentions />
        <Partners />
        <Testimonials />
        <Faq />
        <Blogs />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
