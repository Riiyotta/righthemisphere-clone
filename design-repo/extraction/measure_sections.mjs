// Re-measure semantic section geometry of the running clone.
//
//   CHROME_PATH=<optional path to a Chromium / Chrome binary> \
//   PLAYWRIGHT_MODULE=<path to playwright(-core)'s index.mjs, or "playwright" if resolvable> \
//   BASE_URL=http://localhost:5761 \
//   VIEWPORT=1440x900            # also run at 768x1024 and 390x844 for the responsive record
//   MODE=sections                # sections | styles
//   node extraction/measure_sections.mjs > out.json
//
// No absolute path is stored in this repo: the browser binary and the playwright module come from
// environment variables. Routes come from templates/routes.json (+ the catch-all 404 probe).
//
// MODE=sections  every route: each semantic section's rect, whether it is in normal flow (an element or
//                ancestor with position fixed/sticky, or display:none, takes no page height) and the
//                document height. Before measuring, the page is scrolled to the bottom in steps so every
//                scroll-triggered reveal reaches its end state (the layout is measured at rest, not
//                mid-animation), then returned to the top.
//                Two sections are not single DOM elements and are measured by rule:
//                  - editorial.article-chapter: the children of .blog_righ_text grouped at each <h2>
//                    (a leading group without a heading is its own chapter); rect = union of the group.
//                  - editorial.blog-card-grid on /blog: the 10 cards grouped by the placement pattern that
//                    repeats every 3 cards (CLONE_SPEC-PAGES section 5); rect = union of the group's
//                    cards (the first group also includes the section heading).
// MODE=styles    computed-style samples (token ledger) at the given viewport on '/', /about, a blog post.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE_URL || 'http://localhost:5761';
const [VW, VH] = (process.env.VIEWPORT || '1440x900').split('x').map(Number);
const MODE = process.env.MODE || 'sections';
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;
const routes = JSON.parse(readFileSync(join(ROOT, 'templates/routes.json'), 'utf8')).routes;
const catchAll = JSON.parse(readFileSync(join(ROOT, 'templates/routes.json'), 'utf8')).catchAll;

// DOM selector -> semantic section id (the same selectors the contracts cite in source.needle).
const LIST = [
  ['.nav', 'chrome.navbar'],
  ['footer.section_footer', 'chrome.footer'],
  ['.partners_list_wrapper-copy', 'overlay.partner-credits'],
  ['section.section_hero', 'hero.home'],
  ['.section_hero_about, .section_hero_blog, .section_contact_hero', 'hero.words'],
  ['.section_hero_services', 'hero.services'],
  ['.section_blog_hero', 'hero.article-header'],
  ['.section_project_hero', 'hero.case-header'],
  ['.work_element_content_wrapper', 'work.card-cluster'],
  ['.section_about_us, .section_about_us_page', 'content.studio-statement'],
  ['.section_our_process', 'content.process-note'],
  ['.section_services_v2', 'list.service-rows'],
  ['.section_services_detail', 'list.pricing-table'],
  ['.section_team', 'list.team-roster'],
  ['.section_our_products', 'list.product-links'],
  ['.section_awards', 'proof.award-groups'],
  ['.section_media_mentions', 'proof.press-mentions'],
  ['.section_partners_v3', 'proof.client-logo-grid'],
  ['.section_testimonials', 'proof.testimonial-slider'],
  ['.section_faq', 'content.faq-accordion'],
  ['.section_more_blogs', 'editorial.blog-card-grid'],
  ['.section_contact:has(.contact_element)', 'cta.contact-lines'],
  ['.section_contact_info', 'cta.contact-details'],
  ['.section_contact:has(.contact_page_form_element)', 'conversion.enquiry-form'],
  ['.section_project_subhead', 'work.case-overview'],
  ['.section_project_showcase_full_width_image', 'media.case-showcase'],
  ['.section_project_showcase_image-text, .section_project_showcase_2_images', 'work.case-image-text'],
  ['.section_project_showcase_vew_project', 'cta.case-more-work'],
  ['.utility-wrapper', 'system.not-found'],
];

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

async function open(path) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(VW >= 768 ? 5500 : 1200); // load intro ends ~3.6 s on the timeline
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h + 900; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
}

async function measure() {
  return page.evaluate((LIST) => {
    const pos = (el) => { for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed' || p === 'sticky') return p; } return 'static'; };
    const r1 = (v) => Math.round(v * 10) / 10;
    const hits = [];
    const push = (id, rect, el, extra = {}) => {
      const cs = getComputedStyle(el); const position = pos(el); const hidden = cs.display === 'none';
      hits.push({ id, top: r1(rect.top + scrollY), left: r1(rect.left), w: r1(rect.width), h: r1(rect.height), position, inFlow: !hidden && position === 'static', ...(hidden ? { hidden: true } : {}), ...extra });
    };
    const union = (els) => { const rs = els.map((e) => e.getBoundingClientRect()); const top = Math.min(...rs.map((r) => r.top)), bottom = Math.max(...rs.map((r) => r.bottom)), left = Math.min(...rs.map((r) => r.left)), right = Math.max(...rs.map((r) => r.right)); return { top, left, width: right - left, height: bottom - top }; };
    for (const [sel, id] of LIST) {
      for (const el of document.querySelectorAll(sel)) {
        if (id === 'editorial.blog-card-grid' && el.closest('.section_more_blogs') === null) continue;
        push(id, el.getBoundingClientRect(), el);
      }
    }
    // blog card grids (home / about strip, /blog index): grouped by the 3-card placement pattern
    for (const sec of document.querySelectorAll('.section_blogs')) {
      const cards = [...sec.querySelectorAll('a.blog_card')]; const head = sec.querySelector('h2');
      for (let i = 0; i < cards.length; i += 3) push('editorial.blog-card-grid', union([...(i === 0 && head ? [head] : []), ...cards.slice(i, i + 3)]), sec, { cards: cards.slice(i, i + 3).length });
    }
    // article chapters: children of the rich text grouped at every h2
    const rt = document.querySelector('.blog_righ_text');
    if (rt) {
      const groups = []; let cur = [];
      for (const c of rt.children) { if (c.tagName === 'H2' && cur.length) { groups.push(cur); cur = []; } cur.push(c); }
      if (cur.length) groups.push(cur);
      for (const g of groups) push('editorial.article-chapter', union(g), rt, { blocks: g.length, heading: g[0].tagName === 'H2' });
    }
    const de = document.documentElement;
    return { pageHeight: de.scrollHeight, viewportHeight: innerHeight, hits };
  }, LIST);
}

const out = { viewport: `${VW}x${VH}`, baseUrl: BASE, measuredAt: new Date().toISOString(), mode: MODE };

if (MODE === 'sections') {
  out.routes = {};
  const targets = [...routes.map((r) => [r.path, r.template]), [catchAll.probe, catchAll.template]];
  for (const [path, template] of targets) {
    await open(path);
    const res = await measure();
    const sections = res.hits.sort((a, b) => a.top - b.top || a.left - b.left);
    out.routes[path] = { template, pageHeight: res.pageHeight, inFlowSections: sections.filter((s) => s.inFlow).length, sections };
    process.stderr.write(`${path} page ${res.pageHeight} sections ${sections.length}\n`);
  }
} else if (MODE === 'styles') {
  const PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform', 'color', 'backgroundColor', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'maxWidth'];
  const grab = (sels) => page.evaluate(([sels, PROPS]) => Object.fromEntries(sels.map((s) => { const e = document.querySelector(s); if (!e) return [s, null]; const cs = getComputedStyle(e); const b = e.getBoundingClientRect(); return [s, { ...Object.fromEntries(PROPS.map((p) => [p, cs[p]])), rect: [b.left, b.top, b.width, b.height].map((v) => Math.round(v * 10) / 10) }]; })), [sels, PROPS]);
  out.samples = {};
  await open('/');
  out.samples['/'] = await grab(['body', '.nav', '.nav_link', '.padding-global', '.container-main', 'h1.h1', '.hero_subhead', 'h2.text-size-h2', '.text-size-large', '.text-size-medium', '.text-size-regular', '.text-size-small', '.button_v2 .text-size-medium', '.contact_heading', '.work_card_detail_wrapper', '.faq_item']);
  await open('/blog/' + 'mobile-first-design-why-most-websites-fail-on-phones');
  out.samples['blog-post'] = await grab(['.blog_heading', '.blog_righ_text p', '.blog_righ_text h2', '.blog_righ_text h3', '.blog_container']);
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
