# Right Hemisphere replica (https://www.righthemisphere.studio/)

Source: Right Hemisphere replica (https://www.righthemisphere.studio/)
Status: **measured-from-codebase**
18 routes · 9 templates · 34 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Blog post, Case study, Home) account for 13 of 18 routes (72%). The remaining 5 routes span 6 templates.

| template | routes | share |
|---|---:|---:|
| Blog post | 10 | 56% |
| Case study | 2 | 11% |
| Home | 1 | 6% |
| About | 1 | 6% |
| Services | 1 | 6% |
| Work index | 1 | 6% |
| Contact | 1 | 6% |
| Blog list | 1 | 6% |
| 404 | 0 | 0% |

## Page chrome

**18 routes carry chrome = `full`** — Home, About, Services, Work index, Contact, Blog list, Blog post, Case study.

**0 routes carry chrome = `none`** — 404.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.navbar` | SHELL | 8 | 18 | `Navbar.jsx` | Every template except the 404. |
| `shell.footer` | SHELL | 8 | 18 | `Footer.jsx` | Every template except the 404. |
| `shell.partner-credits` | SHELL | 8 | 18 | `Footer.jsx > PartnerCredits` | Every template except the 404, mounted inside the footer. |
| `hero.blog-post` | HERO | 1 | 10 | `pages/BlogPost.jsx` | Blog post template (10 routes). |
| `content.blog-body` | CONTENT | 1 | 10 | `blog/RichText.jsx` | Blog post template (10 routes). |
| `content.more-blogs` | CONTENT | 1 | 10 | `pages/BlogPost.jsx (BlogCard from Blogs.jsx)` | Blog post template (10 routes). |
| `hero.words` | HERO | 4 | 4 | `shared/HeroWords.jsx` | About, Work, Contact and Blog list templates. |
| `cta.contact-lines` | CTA | 4 | 4 | `Contact.jsx` | Home, About, Services and Work. |
| `content.blog-cards` | CONTENT | 3 | 3 | `Blogs.jsx` | Home, About and Blog list. |
| `content.faq` | CONTENT | 2 | 2 | `Faq.jsx` | Home and Services. |
| `proof.partners` | PROOF | 2 | 2 | `Partners.jsx` | Home and About. |
| `hero.case-study` | HERO | 1 | 2 | `pages/CaseStudy.jsx > Hero` | Case study template (2 routes). |
| `work.case-subhead` | WORK | 1 | 2 | `pages/CaseStudy.jsx > Subhead` | Case study template, first section. |
| `work.case-full-width` | WORK | 1 | 2 | `case-study/Showcase.jsx > Media` | Case study template; appears 1–2 times per study. |
| `work.case-image-text` | WORK | 1 | 2 | `case-study/Showcase.jsx > ShowcaseText + Media` | Case study template; repeats 2–4 times per study. |
| `work.case-two-images` | WORK | 1 | 2 | `pages/CaseStudy.jsx > Section` | Case study template; Cheggout only in the current data. |
| `work.case-view-project` | WORK | 1 | 2 | `pages/CaseStudy.jsx > Section (ButtonV2)` | Case study template, last section. |
| `hero.home` | HERO | 1 | 1 | `Hero.jsx` | Home only. |
| `hero.services` | HERO | 1 | 1 | `services/ServicesHero.jsx` | Services only. |
| `work.home-grid` | WORK | 1 | 1 | `Work.jsx` | Home only. |
| `work.full-grid` | WORK | 1 | 1 | `work/WorkGrid.jsx (WorkCard from Work.jsx)` | Work only. |
| `content.home-about` | CONTENT | 1 | 1 | `About.jsx` | Home only. |
| `content.about-intro` | CONTENT | 1 | 1 | `about/AboutIntro.jsx` | About only. |
| `content.process` | CONTENT | 1 | 1 | `about/Process.jsx` | About only. |
| `list.services` | LIST | 1 | 1 | `Services.jsx` | Home only. |
| `list.awards` | LIST | 1 | 1 | `Awards.jsx` | Home only. |
| `list.media-mentions` | LIST | 1 | 1 | `MediaMentions.jsx` | Home only. |
| `list.team` | LIST | 1 | 1 | `about/Team.jsx` | About only. |
| `list.products` | LIST | 1 | 1 | `about/Products.jsx` | About only. |
| `list.pricing` | LIST | 1 | 1 | `services/ServicesTable.jsx` | Services only. |
| `proof.testimonials` | PROOF | 1 | 1 | `Testimonials.jsx` | Home only. |
| `cta.contact-info` | CTA | 1 | 1 | `contact/ContactInfo.jsx` | Contact only. |
| `cta.contact-form` | CTA | 1 | 1 | `contact/ContactForm.jsx` | Contact only. |
| `system.not-found` | SYSTEM | 1 | 0 | `pages/NotFound.jsx` | Any unmatched path. |

**8 shared sections** appear in more than one template and belong in a component library.

**26 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Home — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.home` | page-local |
| 3 | WORK | `work.home-grid` | page-local |
| 4 | CONTENT | `content.home-about` | page-local |
| 5 | LIST | `list.services` | page-local |
| 6 | LIST | `list.awards` | page-local |
| 7 | LIST | `list.media-mentions` | page-local |
| 8 | PROOF | `proof.partners` | shared ×2 |
| 9 | PROOF | `proof.testimonials` | page-local |
| 10 | CONTENT | `content.faq` | shared ×2 |
| 11 | CONTENT | `content.blog-cards` | shared ×3 |
| 12 | CTA | `cta.contact-lines` | shared ×4 |
| 13 | SHELL | `shell.footer` | shared ×8 |
| 14 | SHELL | `shell.partner-credits` | shared ×8 |

### About — `template.about`

1 route · `/about` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.words` | shared ×4 |
| 3 | CONTENT | `content.about-intro` | page-local |
| 4 | LIST | `list.team` | page-local |
| 5 | CONTENT | `content.process` | page-local |
| 6 | PROOF | `proof.partners` | shared ×2 |
| 7 | LIST | `list.products` | page-local |
| 8 | CONTENT | `content.blog-cards` | shared ×3 |
| 9 | CTA | `cta.contact-lines` | shared ×4 |
| 10 | SHELL | `shell.footer` | shared ×8 |
| 11 | SHELL | `shell.partner-credits` | shared ×8 |

### Services — `template.services`

1 route · `/services` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.services` | page-local |
| 3 | LIST | `list.pricing` | page-local |
| 4 | CONTENT | `content.faq` | shared ×2 |
| 5 | CTA | `cta.contact-lines` | shared ×4 |
| 6 | SHELL | `shell.footer` | shared ×8 |
| 7 | SHELL | `shell.partner-credits` | shared ×8 |

### Work index — `template.work`

1 route · `/work` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.words` | shared ×4 |
| 3 | WORK | `work.full-grid` | page-local |
| 4 | CTA | `cta.contact-lines` | shared ×4 |
| 5 | SHELL | `shell.footer` | shared ×8 |
| 6 | SHELL | `shell.partner-credits` | shared ×8 |

### Contact — `template.contact`

1 route · `/contact` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.words` | shared ×4 |
| 3 | CTA | `cta.contact-info` | page-local |
| 4 | CTA | `cta.contact-form` | page-local |
| 5 | SHELL | `shell.footer` | shared ×8 |
| 6 | SHELL | `shell.partner-credits` | shared ×8 |

### Blog list — `template.blog-list`

1 route · `/blog` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.words` | shared ×4 |
| 3 | CONTENT | `content.blog-cards` | shared ×3 |
| 4 | SHELL | `shell.footer` | shared ×8 |
| 5 | SHELL | `shell.partner-credits` | shared ×8 |

### Blog post — `template.blog-post`

10 routes · `/blog/are-designers-just-copycats-the-truth-about-ux-originality`, `/blog/design-and-the-question-of-authority`, `/blog/how-to-create-good-web-design-everytime`, `/blog/mobile-first-design-why-most-websites-fail-on-phones`, `/blog/on-webflow-right-hemisphere-and-how-we-work`, `/blog/the-subtle-art-of-choosing-typography-and-how-to-approach-it`, `/blog/watching-movies-and-how-it-helped-me-become-a-better-designer`, `/blog/what-is-px-what-is-a-pt-what-is-dp`, `/blog/why-a-button-can-be-patented-but-a-heritage-cant`, `/blog/what-should-be-the-size-of-an-icon-button` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.blog-post` | page-local |
| 3 | CONTENT | `content.blog-body` | page-local |
| 4 | CONTENT | `content.more-blogs` | page-local |
| 5 | SHELL | `shell.footer` | shared ×8 |
| 6 | SHELL | `shell.partner-credits` | shared ×8 |

### Case study — `template.case-study`

2 routes · `/cheggout-sdk`, `/watch-with-papa` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.navbar` | shared ×8 |
| 2 | HERO | `hero.case-study` | page-local |
| 3 | WORK | `work.case-subhead` | page-local |
| 4 | WORK | `work.case-full-width` | page-local |
| 5 | WORK | `work.case-image-text` | page-local |
| 6 | WORK | `work.case-two-images` | page-local |
| 7 | WORK | `work.case-view-project` | page-local |
| 8 | SHELL | `shell.footer` | shared ×8 |
| 9 | SHELL | `shell.partner-credits` | shared ×8 |

### 404 — `template.not-found`

0 route ·  · chrome: **none**

| # | category | section | |
|---:|---|---|---|
| 1 | SYSTEM | `system.not-found` | page-local |

## Section reference

### SHELL

_Site chrome present on every designed page: fixed nav, footer, footer overlays._

**`shell.navbar`** — Fixed 44px nav: two-line wordmark, LABS/PROJECTS/INDEX/NEWS links, underlined CONTACT link with arrow; collapses to a slide-down menu at ≤991. Marks the current route's link #120DF7.

· Every template except the 404. · appears on 18 routes · implemented by `Navbar.jsx`

**`shell.footer`** — Four footer blocks (brand + certified-partner badge, address, products, sitemap/socials) with char-split reveal; includes the partner-credits trigger.

· Every template except the 404. · appears on 18 routes · implemented by `Footer.jsx`

**`shell.partner-credits`** — Hidden full-screen overlay opened from the footer: white cover scales in, then a 4-column list of partner credit rows with logos and diagonal arrows.

· Every template except the 404, mounted inside the footer. · appears on 18 routes · implemented by `Footer.jsx > PartnerCredits`

### HERO

_First block under the nav that names the page; each variant has its own load intro._

**`hero.home`** — Homepage hero: three-word display h1 with random char fade, subhead, info block (address/email/phone), 'Things we did' button, plus two hero work cards; runs the full ~2.9s load intro.

· Home only. · appears on 1 routes · implemented by `Hero.jsx`

**`hero.words`** — Words-only display hero: the h1 words spread across the 6-column grid, no subhead or cards; intro widens the heading (92/65/60%→100%) and shrinks the header from 90vh.

· About, Work, Contact and Blog list templates. · appears on 4 routes · implemented by `shared/HeroWords.jsx`

**`hero.services`** — Services hero: 'our' in column 1, 'services' in columns 3–4 sliding in from x −50%, and an intro paragraph rising word by word.

· Services only. · appears on 1 routes · implemented by `services/ServicesHero.jsx`

**`hero.blog-post`** — Article header in the 688px column: 4:3 hero image, 40px h1, subtitle, date and author (empty values hidden).

· Blog post template (10 routes). · appears on 10 routes · implemented by `pages/BlogPost.jsx`

**`hero.case-study`** — Case-study header: h1, project brief, scope list, credits and live-link buttons.

· Case study template (2 routes). · appears on 2 routes · implemented by `pages/CaseStudy.jsx > Hero`

### WORK

_Project showcase blocks: work cards, case-study media and copy._

**`work.home-grid`** — Homepage selected-work grid: 10 work cards placed on a 6-column grid with negative offsets, year labels, diagonal-arrow detail rows, and a 'see all' button.

· Home only. · appears on 1 routes · implemented by `Work.jsx`

**`work.full-grid`** — Full project index: 25 work cards in 4 grid wrappers, same card component as the homepage grid, no 'see all' button.

· Work only. · appears on 1 routes · implemented by `work/WorkGrid.jsx (WorkCard from Work.jsx)`

**`work.case-subhead`** — Stack overview with numbered items beside a square image (Lottie on Cheggout).

· Case study template, first section. · appears on 2 routes · implemented by `pages/CaseStudy.jsx > Subhead`

**`work.case-full-width`** — Full-width showcase media: image, GIF, Lottie, or the YouTube embed (56.17% box) on Watch with Papa.

· Case study template; appears 1–2 times per study. · appears on 2 routes · implemented by `case-study/Showcase.jsx > Media`

**`work.case-image-text`** — Alternating image/text showcase row with highlights list.

· Case study template; repeats 2–4 times per study. · appears on 2 routes · implemented by `case-study/Showcase.jsx > ShowcaseText + Media`

**`work.case-two-images`** — Two showcase images side by side.

· Case study template; Cheggout only in the current data. · appears on 2 routes · implemented by `pages/CaseStudy.jsx > Section`

**`work.case-view-project`** — Closing wide 'see more work' ButtonV2 (links to /about, as on the original).

· Case study template, last section. · appears on 2 routes · implemented by `pages/CaseStudy.jsx > Section (ButtonV2)`

### LIST

_Hairline-ruled row lists (services, awards, mentions, team, products, pricing)._

**`list.services`** — Homepage services: 4 rows that widen 20→100% on reveal, plus a 46%-wide button.

· Home only. · appears on 1 routes · implemented by `Services.jsx`

**`list.awards`** — 4 award groups (11 rows) with award logo scale-in, winner name and label; rows turn accent on hover.

· Home only. · appears on 1 routes · implemented by `Awards.jsx`

**`list.media-mentions`** — 4 media-mention rows with diagonal arrows; border to accent on hover.

· Home only. · appears on 1 routes · implemented by `MediaMentions.jsx`

**`list.team`** — 12 team rows; hovering shows a grayscale 229px portrait at column 4 and turns the border black.

· About only. · appears on 1 routes · implemented by `about/Team.jsx`

**`list.products`** — 3 product rows with double up-right arrows (second delayed 200ms) and accent border on hover.

· About only. · appears on 1 routes · implemented by `about/Products.jsx`

**`list.pricing`** — Services pricing table: 5-column grid, 4 rows rising from 200px on load; no row interactions.

· Services only. · appears on 1 routes · implemented by `services/ServicesTable.jsx`

### PROOF

_Social proof: client/partner logos and testimonials._

**`proof.partners`** — Partner/client logo tiles in rows of 5 with deliberate empty columns, random-stagger scale-in; 15 tiles + button on Home, 21 tiles in 4 rows and no button on About ('Clients').

· Home and About. · appears on 2 routes · implemented by `Partners.jsx`

**`proof.testimonials`** — 6-slide testimonial slider, 'outin' crossfade, PREV/NEXT text arrows, loops, no autoplay.

· Home only. · appears on 1 routes · implemented by `Testimonials.jsx`

### CONTENT

_Editorial blocks: statements, process copy, FAQ, blog cards, article body._

**`content.home-about`** — Homepage about statement and long paragraph with a button.

· Home only. · appears on 1 routes · implemented by `About.jsx`

**`content.about-intro`** — About page intro paragraph in columns 4–6, word-split rise on load.

· About only. · appears on 1 routes · implemented by `about/AboutIntro.jsx`

**`content.process`** — 'Our process' heading and copy in columns 5–6.

· About only. · appears on 1 routes · implemented by `about/Process.jsx`

**`content.faq`** — Five-item accordion; items open independently, height 0↔auto and plus icon scaleY over 0.5s.

· Home and Services. · appears on 2 routes · implemented by `Faq.jsx`

**`content.blog-cards`** — Staggered blog card grid with image-scale reveal and arrow-swap hover; 3 cards on Home/About, all 10 on the blog list.

· Home, About and Blog list. · appears on 3 routes · implemented by `Blogs.jsx`

**`content.blog-body`** — Rich-text article body rendered from structured blocks (p/h2/h3/h4/ol/figure), PP Mori Semibold for bold.

· Blog post template (10 routes). · appears on 10 routes · implemented by `blog/RichText.jsx`

**`content.more-blogs`** — 'Read more' row of 2 BlogCards at the end of an article.

· Blog post template (10 routes). · appears on 10 routes · implemented by `pages/BlogPost.jsx (BlogCard from Blogs.jsx)`

### CTA

_Blocks whose job is to get the visitor to make contact._

**`cta.contact-lines`** — Three huge masked display lines that slide in alternately, plus a 192px contact button.

· Home, About, Services and Work. · appears on 4 routes · implemented by `Contact.jsx`

**`cta.contact-info`** — Contact page info row: phone, email and address.

· Contact only. · appears on 1 routes · implemented by `contact/ContactInfo.jsx`

**`cta.contact-form`** — Enquiry form: name, email, required 5-option budget select, project description, submit; native validation, #FFDEDE error box. Local stub — does not post to Webflow.

· Contact only. · appears on 1 routes · implemented by `contact/ContactForm.jsx`

### SYSTEM

_Host-level pages outside the site's design system._

**`system.not-found`** — Webflow's hosting-level 'Page not found' on #f5f5f5, no site chrome; system fonts stand in for Graphik/Roboto Mono.

· Any unmatched path. · appears on 0 routes · implemented by `pages/NotFound.jsx`
