import { ArrowRight } from './ui/Icons.jsx';

// §11. 3 staggered cards.
const HEADING = 'Blogs';
const READ_LABEL = 'READ BLOG';
const I = '/images/';
const srcSet = (base) =>
  `${I}${base}-p-500.png 500w, ${I}${base}-p-800.png 800w, ${I}${base}-p-1080.png 1080w, ${I}${base}.png 1200w`;
const SIZES = '(max-width: 991px) 100vw, 1200px';
// The original's home collection list is set to show 3 random posts of 11 (Webflow
// "shuffle"): every uncached render at the origin picks a new 3, and Cloudflare then serves
// whichever render it cached. These are the 3 the live (cached) page currently shows.
const POSTS = [
  {
    title: 'Mobile First Design: Why Most Websites Fail on Phones',
    href: '/blog/mobile-first-design-why-most-websites-fail-on-phones',
    img: '6ab4f948d0271dade656319d_Frame%201244839552',
    place: 'col-start-1 col-end-3 row-start-1',
  },
  {
    title: 'The subtle art of choosing typography and how to approach it.',
    href: '/blog/the-subtle-art-of-choosing-typography-and-how-to-approach-it',
    img: '6ab4feca8c6d1c47e3dca8e0_Frame%201244839559',
    place: 'col-start-2 col-end-4 row-start-2',
  },
  {
    title: 'Why a Button Can Be Patented, But a Heritage Can\u2019t',
    href: '/blog/why-a-button-can-be-patented-but-a-heritage-cant',
    img: '6ab4fa582c8056c528709fc5_Frame%201244839554',
    place: 'col-start-5 col-end-7 row-start-2',
  },
];

// §11 card. Exported for the blog-post "read more" grid (CLONE_SPEC-PAGES §6.1).
// `className` replaces the homepage card classes when given.
export function BlogCard({ p, className }) {
  return (
    <a
      href={p.href}
      className={className ?? `blog_page_card_item_wrapper-copy blog_card flex flex-col gap-24 py-16 ${p.place} md:col-auto md:row-auto`}
      data-motion="blog-card"
    >
      <div className="blog_card_header_wrapper flex flex-col gap-10">
        <div className="blog_image_wrapper overflow-hidden" data-motion="blog-image">
          <img
            src={p.src ?? `${I}${p.img}.png`}
            srcSet={p.srcSet ?? srcSet(p.img)}
            sizes={p.sizes ?? SIZES}
            alt=""
            loading={p.loading}
            className="blog_img h-auto w-full"
          />
        </div>
        <div className="text-size-medium">{p.title}</div>
      </div>
      <div className="button_v2 w-full">
        <span className="text-size-regular">{p.cta ?? READ_LABEL}</span>
        <span className="blog_arrow_wrapper btn_v2_arrow_wrapper">
          <ArrowRight className="arrow_mid left text-accent" />
          <ArrowRight className="arrow_mid default text-ink" />
        </span>
        <span className="button_line" data-motion="button-line" />
      </div>
    </a>
  );
}

// Optional props (CLONE_SPEC-PAGES §1.6, §5): defaults keep the homepage output identical.
// `gridClass` replaces the homepage grid classes; post fields src/srcSet/sizes/cta override
// the homepage image naming.
export default function Blogs({ heading = HEADING, posts = POSTS, gridClass } = {}) {
  return (
    <section id="blogs" className="section_blogs">
      <div className="padding-global">
        <div className="container-main">
          <div className="blog_element_home py-112">
            <div className="pb-24">
              <h2 className="text-size-h2 caps">{heading}</h2>
            </div>
            <div className={gridClass ?? "blog_grid grid grid-cols-six gap-x-0 gap-y-160 md:grid-cols-two md:gap-x-20 md:gap-y-96 sm:grid-cols-one"}>
              {posts.map((p, i) => (
                <BlogCard key={i} p={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
