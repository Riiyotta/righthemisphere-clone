// Real content for the inner routes (CLONE_SPEC-PAGES.md: ".recon/pages-content.json").
import data from './pages-content.json';

export default data;
export const pages = data.pages;
export const caseStudies = data.caseStudies;
export const blogPosts = data.blogPosts;

// Local image paths keep decoded filenames. Spaces are URL-encoded; a literal `&`
// is kept because %26 breaks the Vite dev server.
export const url = (src) => (src ? src.replace(/ /g, '%20') : src);

export const srcSetOf = (image) =>
  image && image.srcset ? image.srcset.map((s) => `${url(s.src)} ${s.w}`).join(', ') : undefined;

// Spread onto <img>: src, srcSet, sizes, alt, loading.
export const imgProps = (image) => ({
  src: url(image.src),
  srcSet: srcSetOf(image),
  sizes: image.srcset ? image.sizes : undefined,
  alt: image.alt || '',
  loading: image.loading || undefined,
});
