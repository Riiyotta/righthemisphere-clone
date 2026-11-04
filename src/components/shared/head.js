// Per-route <title> and meta description (values from the original's server HTML).
// `description: null` removes the tag: blog posts and case studies ship without one.
export function applyHead({ title, description }) {
  document.title = title;
  let meta = document.head.querySelector('meta[name="description"]');
  if (description == null) {
    if (meta) meta.remove();
    return;
  }
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', description);
}
