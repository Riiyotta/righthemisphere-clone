import PageShell from '../components/shared/PageShell.jsx';
import RichText from '../components/blog/RichText.jsx';
import { BlogCard } from '../components/Blogs.jsx';
import { imgProps } from '../data/content.js';
import { toBlogPost } from '../components/shared/mappers.js';
import { usePageMotion } from '../motion';

// CLONE_SPEC-PAGES §6: one template for all 10 posts. No load intro and no Lenis on the
// original (native scroll). Empty CMS date/author (how-to-create-good-web-design-everytime)
// render as empty values, like Webflow's w-dyn-bind-empty. The share link is display:none
// on the original and is not rendered.
const MORE_CARD =
  'blog_page_card_item_wrapper-copy more_blogs blog_card flex h-full w-full flex-col justify-between gap-24 py-16';

export default function BlogPost({ post }) {
  // §6.2: no load intro, native scroll (no Lenis on the original), site reveals only
  usePageMotion({ intro: null, smooth: false });
  const { meta } = post;
  return (
    <PageShell active={null}>
      <section className="section_blog_hero">
        <div className="padding-global">
          <div className="blog_container">
            <div className="blog_hero_element">
              <div className="blog_hero_image_wrapper">
                <img {...imgProps(post.heroImage)} className="blog_hero_image" />
              </div>
              <div className="blog_hero_header">
                <h1 className="blog_heading">{post.title}</h1>
                <p className="text-size-regular">{post.subtitle}</p>
              </div>
              <div className="blog_info_element">
                <div className="blog_date_wrapper">
                  <div className="text-size-small color-grey">{meta.publishedLabel}</div>
                  <div className={`text-size-small${meta.date ? '' : ' w-dyn-bind-empty'}`}>{meta.date}</div>
                </div>
                <div className="blog_author_wrapper">
                  <div className="text-size-small color-grey">{meta.authorLabel}</div>
                  <div className={`text-size-small${meta.author ? '' : ' w-dyn-bind-empty'}`}>{meta.author}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section_blog_body">
        <div className="padding-global">
          <div className="blog_container">
            <div className="blog_body_element">
              <RichText blocks={post.body} />
            </div>
          </div>
        </div>
      </section>

      <section className="section_more_blogs">
        <div className="padding-global">
          <div className="blog_container">
            <div className="more-blogs_element">
              <h1 className="text-size-h2 caps">{post.readMore.heading}</h1>
              <div className="blog_collection_list_wrapper">
                <div role="list" className="blog_page_collection_list more_blogs">
                  {post.readMore.cards.map((c) => (
                    <div role="listitem" key={c.href} className="blog_page_item more_blogs">
                      <div className="blog_page_card more_blogs flex h-full">
                        <BlogCard p={toBlogPost(c)} className={MORE_CARD} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
