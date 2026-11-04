import { imgProps } from '../../data/content.js';
import Lottie from './Lottie.jsx';

// One showcase block (image | lottie | video) from caseStudies.<slug>.sections[].blocks[].
export function Media({ block, imgClass = 'project_showcase_image' }) {
  if (block.lottie) {
    return block.lottie.map((l) => (
      <Lottie
        key={l['data-src']}
        className={l.class}
        src={l['data-src']}
        loop={l['data-loop'] === '1'}
        autoplay={l['data-autoplay'] === '1'}
        renderer={l['data-renderer']}
        lazy={l['data-loading'] === 'lazy'}
      />
    ));
  }
  if (block.video) {
    // Direct YouTube embed, equivalent to the original's embedly wrapper (spec §9).
    return (
      <div className="w-video w-embed">
        <iframe
          className="embedly-embed"
          src="https://www.youtube.com/embed/Xkd0TjIPlpM?start=2"
          title={block.video.title}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (block.image) return <img {...imgProps(block.image)} className={imgClass} />;
  return null;
}

// Text half: label + paragraphs/lists. Content with lists sits in
// .showcase_card_content_description with p.para (margin-bottom 16), as on the original.
export function ShowcaseText({ content, side }) {
  const hasList = content.blocks.some((b) => b.type === 'ul');
  const blocks = content.blocks.map((b, i) =>
    b.type === 'ul' ? (
      <ul key={i} role="list" className="project_showcase_list">
        {b.items.map((it) => (
          <li key={it} className="project_showcase_list_item">
            <div className="text-size-regular">{it}</div>
          </li>
        ))}
      </ul>
    ) : (
      <p key={i} className={`text-size-regular${hasList ? ' para' : ''}`}>
        {b.text}
      </p>
    ),
  );
  return (
    <div className={`project_showcase_text_wrapper text-${side}`}>
      <div className="project_showcase_content_wrapper">
        <div className="text-size-medium caps">{content.label}</div>
        {hasList ? <div className="showcase_card_content_description">{blocks}</div> : blocks}
      </div>
    </div>
  );
}
