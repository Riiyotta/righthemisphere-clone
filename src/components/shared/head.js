// Per-route <title>, meta description and social tags (values from the original's server HTML).
// `description: null` removes the tag: blog posts and case studies ship without one.
// `social` mirrors which Open Graph / Twitter tags the original emits on that route:
//   'full'  → og/twitter title + description, og:type, twitter:card (about, services, work, contact, blog)
//   'title' → og/twitter title only (case studies)
//   null    → none (blog posts, 404)
// Only "/" carries og:image, and it is set in index.html, so every routed page drops it.
const SOCIAL = [
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['property', 'og:type'],
  ['name', 'twitter:card'],
  ['property', 'og:image'],
];

function setMeta(attr, key, content) {
  let meta = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (content == null) {
    if (meta) meta.remove();
    return;
  }
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function applyHead({ title, description, social = null }) {
  document.title = title;
  setMeta('name', 'description', description);

  const full = social === 'full';
  const values = {
    'og:title': social ? title : null,
    'twitter:title': social ? title : null,
    'og:description': full ? description : null,
    'twitter:description': full ? description : null,
    'og:type': full ? 'website' : null,
    'twitter:card': full ? 'summary_large_image' : null,
    'og:image': null,
  };
  for (const [attr, key] of SOCIAL) setMeta(attr, key, values[key]);
}
