// Live-vs-clone parity capture (R12). Captures ONE side (live or clone) per run; parity_compare.py compares two
// capture directories. Live screenshots are written to a scratch directory and are never committed; only the
// text-free geometry dump (--geometry-out) and the result JSON produced by parity_compare.py are tracked.
//
//   CHROME_PATH=<chromium binary> PLAYWRIGHT_MODULE=<playwright(-core) index> \
//   node extraction/parity_capture.mjs --base https://www.righthemisphere.studio --out <dir> \
//        [--routes /,/about] [--width 1440 --height 900] [--all]        (default routes: all of templates/routes.json,
//                                                                          at 390 only the mobile subset)
//
// Method (what makes the number deterministic, same on both sides):
//  * per route: load, wait for fonts + the ~3.6 s page-load intro, then scroll the whole page in 400 px steps so every
//    scroll-triggered reveal fires and every lazy image loads (arrival by scrolling), await every <img> decode, pause every
//    <video> on the same frame (0.5 s, waits for the seek), freeze animated GIFs on their first frame, settle CSS/WAAPI animations (finite: finish; infinite: pause at 0),
//    inject the identical overlay-hiding stylesheet (consent/cookie banners are hidden, NEVER clicked), then re-measure.
//  * sections come from the semantic selector list below (same list as measure_sections.mjs), found independently on each
//    side (both sides share the Webflow class names). Each section is captured in viewport-height tiles: the page is scrolled
//    to sectionTop + k*viewport (arrival by stepped scrolling from the previous offset), a 1.2 s settle, then a clipped
//    screenshot of the section slice. Fixed sections (navbar) are captured in place at scroll 0.
//  * text-free geometry (section rect, text-row rects from Range client rects, image/svg/video rects, control rects) is dumped
//    per section in section-relative px so the geometry parity can be recomputed from tracked files alone.
// Only the Lottie/iframe masks above are applied. No consent banner is clicked.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'http://localhost:5782').replace(/\/$/, '');
const OUT = arg('--out');
const VW = +arg('--width', 1440), VH = +arg('--height', 900);
const GEOM_OUT = arg('--geometry-out', null);
if (!OUT) throw new Error('--out <dir> required');
const routesJson = JSON.parse(readFileSync(join(ROOT, 'templates/routes.json'), 'utf8'));
const MOBILE_SUBSET = ['/', '/blog/mobile-first-design-why-most-websites-fail-on-phones', '/cheggout-sdk'];
let ROUTES = arg('--routes', null)?.split(',') ?? [...routesJson.routes.map((r) => r.path), routesJson.catchAll.probe];
if (VW < 768 && !arg('--routes', null)) ROUTES = MOBILE_SUBSET;
const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const chromium = pw.chromium || pw.default.chromium;

const LIST = [
  ['.nav', 'chrome.navbar'], ['.section_footer', 'chrome.footer'],
  ['section.section_hero', 'hero.home'],
  ['.section_hero_about, .section_hero_blog, .section_contact_hero', 'hero.words'],
  ['.section_hero_services', 'hero.services'], ['.section_blog_hero', 'hero.article-header'],
  ['.section_project_hero', 'hero.case-header'], ['.work_element_content_wrapper', 'work.card-cluster'],
  ['.section_about_us, .section_about_us_page', 'content.studio-statement'], ['.section_our_process', 'content.process-note'],
  ['.section_services_v2', 'list.service-rows'], ['.section_services_detail', 'list.pricing-table'],
  ['.section_team', 'list.team-roster'], ['.section_our_products', 'list.product-links'],
  ['.section_awards', 'proof.award-groups'], ['.section_media_mentions', 'proof.press-mentions'],
  ['.section_partners_v3', 'proof.client-logo-grid'], ['.section_testimonials', 'proof.testimonial-slider'],
  ['.section_faq', 'content.faq-accordion'], ['.section_more_blogs', 'editorial.blog-card-grid'],
  ['.section_contact:has(.contact_element)', 'cta.contact-lines'], ['.section_contact_info', 'cta.contact-details'],
  ['.section_contact:has(.contact_page_form_element)', 'conversion.enquiry-form'],
  ['.section_project_subhead', 'work.case-overview'], ['.section_project_showcase_full_width_image', 'media.case-showcase'],
  ['.section_project_showcase_image-text, .section_project_showcase_2_images', 'work.case-image-text'],
  ['.section_project_showcase_vew_project', 'cta.case-more-work'], ['.utility-wrapper', 'system.not-found'],
];
// Overlays hidden on BOTH sides (position-fixed, so no layout change). Consent banners are never clicked.
const HIDE_CSS = `[class*="cookie" i],[id*="cookie" i],[class*="consent" i],[id*="consent" i],#onetrust-banner-sdk,.fs-cc-banner,.partners_list_wrapper-copy,.w-webflow-badge{display:none!important}
html{scroll-behavior:auto!important}*{caret-color:transparent!important}
[data-animation-type="lottie"] svg,iframe{visibility:hidden!important}`;
// The only masked regions: autoplaying looping Lottie players (time-based, cannot be paused identically on the original
// and on the clone) and third-party iframes (embed content the machine does not control). The element boxes keep their
// layout; the region is recorded per section as 'masks' and excluded from the pixel counts by parity_compare.py.

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
mkdirSync(OUT, { recursive: true });
const meta = { base: BASE.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, 'clone'), viewport: [VW, VH], capturedAt: new Date().toISOString(), captureState: {}, routes: {} };

async function prepare(page, path) {
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 90000 });
  await page.addStyleTag({ content: HIDE_CSS });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForTimeout(VW >= 768 ? 5500 : 4500);
  let h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h + VH; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(110); h = await page.evaluate(() => document.documentElement.scrollHeight); }
  await page.waitForTimeout(1500);
  const state = await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((i) => { i.loading = 'eager'; });
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); }))));
    await Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : null)));
    await document.fonts.ready;
    // animated GIFs are time-based: replace each by its first frame (same natural size, so layout is unchanged), same on both sides
    let gifs = 0, gifFail = 0;
    for (const i of imgs.filter((x) => /\.gif(\?|$)/i.test(x.currentSrc))) {
      try {
        const bmp = await createImageBitmap(await (await fetch(i.currentSrc)).blob());
        const cv = document.createElement('canvas'); cv.width = bmp.width; cv.height = bmp.height; cv.getContext('2d').drawImage(bmp, 0, 0);
        i.removeAttribute('srcset'); i.src = cv.toDataURL('image/png'); await i.decode().catch(() => {}); gifs++;
      } catch (e) { gifFail++; }
    }
    const vids = [...document.querySelectorAll('video')];
    for (const v of vids) { v.pause(); await new Promise((r) => { v.onseeked = r; v.currentTime = 0.5; setTimeout(r, 4000); }); v.pause(); }
    let fin = 0, inf = 0;
    for (const a of document.getAnimations()) {
      const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
      if (t && t.iterations === Infinity) { a.pause(); a.currentTime = 0; inf++; } else { try { a.finish(); fin++; } catch (e) { a.cancel(); } }
    }
    return { images: imgs.length, imagesIncomplete: imgs.filter((i) => !i.complete || !i.naturalWidth).length, gifsFrozenAtFrame0: gifs, gifFreezeFailed: gifFail, videos: vids.length, wapiFinished: fin, wapiInfinitePausedAt0: inf };
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  return state;
}

function measureFn(LIST) {
  const r1 = (v) => Math.round(v * 10) / 10;
  const posOf = (el) => { for (let n = el; n && n !== document.documentElement; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'fixed') return 'fixed'; } return 'static'; };
  const out = [];
  const union = (els) => { const rs = els.map((e) => e.getBoundingClientRect()); const top = Math.min(...rs.map((r) => r.top)), bottom = Math.max(...rs.map((r) => r.bottom)), left = Math.min(...rs.map((r) => r.left)), right = Math.max(...rs.map((r) => r.right)); return { top, left, width: right - left, height: bottom - top }; };
  const add = (id, rect, el, els) => { if (getComputedStyle(el).display === 'none') return; const o = { id, top: rect.top + scrollY, left: rect.left, w: rect.width, h: rect.height, fixed: posOf(el) === 'fixed' }; if (o.h < 1 || o.w < 1) return; o._els = els || [el]; out.push(o); };
  for (const [sel, id] of LIST) for (const el of document.querySelectorAll(sel)) { if (id === 'editorial.blog-card-grid' && !el.closest('.section_more_blogs')) continue; add(id, el.getBoundingClientRect(), el); }
  for (const sec of document.querySelectorAll('.section_blogs')) {
    const cards = [...sec.querySelectorAll('a.blog_card, a.blog_page_card_item_wrapper-copy')]; const head = sec.querySelector('h2');
    for (let i = 0; i < cards.length; i += 3) { const els = [...(i === 0 && head ? [head] : []), ...cards.slice(i, i + 3)]; add('editorial.blog-card-grid', union(els), sec, els); }
  }
  const rt = document.querySelector('.blog_righ_text');
  if (rt) { const groups = []; let cur = []; for (const c of rt.children) { if (c.tagName === 'H2' && cur.length) { groups.push(cur); cur = []; } cur.push(c); } if (cur.length) groups.push(cur); for (const g of groups) add('editorial.article-chapter', union(g), rt, g); }
  out.sort((a, b) => a.top - b.top || a.left - b.left);
  const inst = {};
  // text-free geometry: text rows (Range rects), media rects, control rects, relative to the section origin
  return out.map((s) => {
    inst[s.id] = (inst[s.id] ?? -1) + 1;
    const ox = s.left, oy = s.top; const rows = [], media = [], controls = [], masks = [];
    const inRect = (r) => r.width >= 1 && r.height >= 1 && r.bottom + scrollY > oy - 1 && r.top + scrollY < oy + s.h + 1 && r.right > ox - 1 && r.left < ox + s.w + 1;
    const rel = (r) => [r1(r.left - ox), r1(r.top + scrollY - oy), r1(r.width), r1(r.height)];
    // a rect clipped away by an overflow:hidden/clip ancestor (collapsed accordion answers, off-canvas slides) is not ink
    const clipped = (e, r) => { for (let n = e.parentElement; n && n !== document.documentElement; n = n.parentElement) { const o = getComputedStyle(n); if (o.overflowX === 'visible' && o.overflowY === 'visible') continue; const b = n.getBoundingClientRect(); if (r.bottom <= b.top + 0.5 || r.top >= b.bottom - 0.5 || r.right <= b.left + 0.5 || r.left >= b.right - 0.5) return true; } return false; };
    const visible = (e) => { const cs = getComputedStyle(e); return cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.02; };
    for (const root of s._els) {
      for (const m of root.querySelectorAll('[data-animation-type="lottie"], iframe')) { const r = m.getBoundingClientRect(); if (inRect(r)) masks.push(rel(r)); }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.nodeValue.trim() || !n.parentElement || !visible(n.parentElement)) continue;
        const rg = document.createRange(); rg.selectNodeContents(n);
        for (const r of rg.getClientRects()) if (inRect(r) && !clipped(n.parentElement, r)) rows.push(rel(r));
      }
      for (const e of [root, ...root.querySelectorAll('img,svg,video,canvas,[class*="image"],a,button,input,textarea')]) {
        if (!visible(e)) continue; const r = e.getBoundingClientRect(); if (!inRect(r) || clipped(e, r)) continue;
        const tag = e.tagName.toLowerCase();
        if (['img', 'video', 'canvas'].includes(tag) || (tag === 'svg' && r.width > 12 && r.height > 12)) media.push(rel(r));
        else if (['a', 'button', 'input', 'textarea'].includes(tag) && (r.height > 18 && r.width > 30)) controls.push(rel(r));
        else if (getComputedStyle(e).backgroundImage !== 'none' && r.width > 12 && r.height > 12) media.push(rel(r));
      }
    }
    return { id: s.id, instance: inst[s.id], top: r1(s.top), left: r1(s.left), w: r1(s.w), h: r1(s.h), fixed: s.fixed, rows, media, controls, masks };
  });
}

async function scrollArrive(page, from, to) {
  const step = to >= from ? 400 : -400;
  for (let v = from + step; step > 0 ? v < to : v > to; v += step) { await page.evaluate((v) => window.scrollTo(0, v), v); await page.waitForTimeout(60); }
  await page.evaluate((y) => window.scrollTo(0, y), to);
}

const slug = (r) => (r === '/' ? 'home' : r.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '_'));
for (const route of ROUTES) {
  const page = await ctx.newPage();
  const state = await prepare(page, route);
  meta.captureState[route] = state;
  const geo = await page.evaluate(measureFn, LIST);
  const doc = await page.evaluate(() => document.documentElement.scrollHeight);
  const dir = join(OUT, slug(route)); mkdirSync(dir, { recursive: true });
  let y = 0;
  const secs = [];
  for (let i = 0; i < geo.length; i++) {
    const s = geo[i]; s.tiles = [];
    const x0 = Math.max(0, Math.round(s.left)), cw = Math.min(VW - x0, Math.round(s.w));
    if (s.fixed) {
      await scrollArrive(page, y, 0); y = 0; await page.waitForTimeout(900);
      const file = `${i}_0.png`; await page.screenshot({ path: join(dir, file), clip: { x: x0, y: Math.round(s.top), width: cw, height: Math.min(VH, Math.round(s.h)) } });
      s.tiles.push({ off: 0, height: Math.min(VH, Math.round(s.h)), file }); secs.push(s); continue;
    }
    for (let off = 0; off < s.h; off += VH) {
      const target = Math.min(Math.round(s.top + off), Math.max(0, doc - VH));
      await scrollArrive(page, y, target); y = target; await page.waitForTimeout(1200);
      const sy = await page.evaluate(() => scrollY);
      const vy = Math.round(s.top + off - sy);
      const hgt = Math.min(VH - Math.max(0, vy), Math.round(s.h - off));
      const cy = Math.max(0, vy); const ch = vy < 0 ? Math.min(VH, hgt + vy) : hgt;
      if (ch < 1) continue;
      const file = `${i}_${off}.png`; await page.screenshot({ path: join(dir, file), clip: { x: x0, y: cy, width: cw, height: ch } });
      s.tiles.push({ off: off + (vy < 0 ? -vy : 0), height: ch, file });
    }
    secs.push(s);
  }
  meta.routes[route] = { doc, slug: slug(route), sections: secs };
  process.stderr.write(`${route} doc ${doc} sections ${secs.length}\n`);
  await page.close();
}
writeFileSync(join(OUT, 'meta.json'), JSON.stringify(meta));
if (GEOM_OUT) {
  const g = { viewport: meta.viewport, routes: Object.fromEntries(Object.entries(meta.routes).map(([r, v]) => [r, { doc: v.doc, sections: v.sections.map(({ tiles, ...s }) => s) }])) };
  writeFileSync(GEOM_OUT, JSON.stringify(g));
}
await browser.close();
