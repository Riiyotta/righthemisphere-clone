import { imgProps } from '../../data/content.js';

// CLONE_SPEC-PAGES §6.1 .blog_righ_text.w-richtext. Inline HTML (strong/em/a/br) comes from
// the original CMS export. U+200D-only blocks are rendered too (they add a line + margin).
// The figure's inline `max-width:…pxpx` is invalid CSS on the original and is dropped.
function Block({ b }) {
  switch (b.type) {
    case 'p':
    case 'h2':
    case 'h3':
    case 'h4': {
      const Tag = b.type;
      return <Tag dangerouslySetInnerHTML={{ __html: b.html }} />;
    }
    case 'ol':
      return (
        <ol role="list">
          {b.items.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: li.html }} />
          ))}
        </ol>
      );
    case 'figure':
      return (
        <figure className={`w-richtext-align-${b.align} w-richtext-figure-type-image`}>
          <div>
            <img {...imgProps(b.image)} />
          </div>
        </figure>
      );
    default:
      return null;
  }
}

export default function RichText({ blocks }) {
  return (
    <div className="blog_righ_text w-richtext">
      {blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
    </div>
  );
}
