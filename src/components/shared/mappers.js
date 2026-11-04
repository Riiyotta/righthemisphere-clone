import { url, srcSetOf } from '../../data/content.js';

// JSON blog card → homepage Blogs/BlogCard post shape.
export const toBlogPost = (card, place = '') => ({
  href: card.href,
  title: card.title,
  src: url(card.image.src),
  srcSet: srcSetOf(card.image),
  sizes: card.image.sizes,
  loading: card.image.loading,
  cta: card.cta,
  place,
});

// Homepage §11 stagger (cards 1–3), also used on /about.
export const HOME_BLOG_PLACES = [
  'col-start-1 col-end-3 row-start-1',
  'col-start-2 col-end-4 row-start-2',
  'col-start-5 col-end-7 row-start-2',
];
