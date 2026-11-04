import PageShell from '../components/shared/PageShell.jsx';
import ArrowIcon from '../components/shared/ArrowIcon.jsx';
import { ButtonV2 } from '../components/ui/Parts.jsx';
import { Media, ShowcaseText } from '../components/case-study/Showcase.jsx';
import { usePageMotion } from '../motion';

// CLONE_SPEC-PAGES §7: one template for /cheggout-sdk and /watch-with-papa, rendered from
// caseStudies.<slug>. No load intro; Lenis is on (Animation wires it). The Swiper init on
// the original targets a non-existent .swiper and is intentionally not built.
function Hero({ study }) {
  return (
    <section className="section_project_hero">
      <div className="padding-global">
        <div className="container-main">
          <div className="project_hero_element">
            <div className="project_header_element">
              <h1 className="h1 text-display uppercase tracking-h1 text-ink-h1">{study.h1}</h1>
              <div className="project_brief_element">
                <h2 className="text-size-medium caps">{study.brief.label}</h2>
                <p className="text-size-regular">{study.brief.text}</p>
              </div>
            </div>
            <div className="project_detail_element">
              <div className="project_scope">
                <div className="text-size-regular">{study.scope}</div>
              </div>
              <div className="project_live_link_wrapper">
                <a href={study.liveLink.href} target={study.liveLink.target} className="project_live_link">
                  <div className="text-size-regular">{study.liveLink.text}</div>
                  <ArrowIcon className="project_live_link_arrow_icon" />
                </a>
              </div>
              <div className="project_credit">
                <div className="text-size-regular color-grey">{study.credit.label}</div>
                <a href={study.credit.link.href} target={study.credit.link.target} className="project_live_link">
                  <div className="text-size-regular">{study.credit.link.text}</div>
                  <ArrowIcon className="project_live_link_arrow_icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Subhead({ blocks }) {
  const [stack, image] = blocks;
  return (
    <div className="project_subhead_element">
      <div className="project_stack_overview_wrapper">
        <div className="project_stack_overview">
          {stack.stack.map((row) => (
            <div key={row.num} className="project_stack_overview_item">
              <div className="text-size-regular">{row.cells[0]}</div>
              {row.cells[0] === 'Highlights' ? (
                <div className="project_showcase_highlights_wrapper">
                  <div className="project_showcase_highlights_item">
                    <div className="text-size-regular">{row.cells[1]}</div>
                  </div>
                </div>
              ) : (
                <div className="text-size-regular">{row.cells[1]}</div>
              )}
              <div className="project_stack_overview_item_number_wrapper">
                <div className="text-size-regular">{row.num}</div>
              </div>
            </div>
          ))}
        </div>
        {stack.content && (
          <div className="project_showcase_content_wrapper">
            <div className="text-size-medium caps">{stack.content.label}</div>
            {stack.content.paragraphs.map((p, i) => (
              <p key={i} className="text-size-regular">
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="project_showcase_image_wrapper">
        <Media block={image} />
      </div>
    </div>
  );
}

function Section({ s }) {
  let inner;
  if (s.section === 'section_project_subhead') {
    inner = <Subhead blocks={s.blocks} />;
  } else if (s.section === 'section_project_showcase_full_width_image') {
    const b = s.blocks[0];
    inner = (
      <div className={s.elementClass}>
        <div className={b.class}>
          <Media block={b} imgClass="project_showcase_full_width_image" />
        </div>
      </div>
    );
  } else if (s.section === 'section_project_showcase_vew_project') {
    const { button } = s.blocks[0];
    // Original quirk: "see more work" links to /about.
    inner = (
      <div className={s.elementClass}>
        <ButtonV2 label={button.text} href={button.href} className="wide gap-16" />
      </div>
    );
  } else {
    // image-text / 2_images: blocks in DOM order (no reordering at ≤767).
    inner = (
      <div className={s.elementClass}>
        {s.blocks.map((b, i) =>
          b.content ? (
            <ShowcaseText key={i} content={b.content} side={i === 0 ? 'left' : 'right'} />
          ) : (
            <div key={i} className={b.class}>
              <Media block={b} />
            </div>
          ),
        )}
      </div>
    );
  }
  return (
    <section className={s.section}>
      <div className="padding-global">
        <div className="container-main">{inner}</div>
      </div>
    </section>
  );
}

export default function CaseStudy({ study }) {
  // §7.2: no load intro; Lenis is on (verified: the page loads lenis@1.1.18); site reveals only
  usePageMotion({ intro: null });
  return (
    <PageShell active={null}>
      <Hero study={study} />
      {study.sections.map((s, i) => (
        <Section key={i} s={s} />
      ))}
    </PageShell>
  );
}
