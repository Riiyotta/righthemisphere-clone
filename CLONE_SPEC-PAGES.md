Source: https://www.righthemisphere.studio/

# Right Hemisphere: inner pages clone spec (real content)

Companion to `CLONE_SPEC.md` (homepage). That file defines the tokens (§0), Navbar (§1), hero (§2), work card anatomy (§3), FAQ (§10), blog cards (§11), CTA "contact" section (§12), Footer (§13) and the motion vocabulary (§14). This file records only what is **new or different** on the other routes.

Measured on 2026-11-04 in Chrome (Playwright, `channel:'chrome'`) at 1440, 1280, 991, 767 and 479 (height 900). Every page was scrolled to the bottom so all scroll reveals reached their end state before measuring. Motion comes from the IX3 `register()` payload and the IX2 `init()` payload in each page's own Webflow bundle, and from CSSOM rules read in the browser.

**Content rule for this file.** The site owner is cloning their own site, so copy and images are real. All copy, links and image references live in **`.recon/pages-content.json`** (extracted from `.recon/pages/*.html`). Image `src` values there are local paths, `/images/<decoded original filename>`, pointing at the full-size file. `srcset` arrays list the `-p-500/-p-800/-p-1080` variants exactly as the original serves them, along with the original `sizes` attribute. This spec references content by JSON path, for example `pages.about.team.members[]`.

Fonts: `public/fonts/PPMori-Regular.woff2` (400) and `PPMori-Semibold.woff2` (600). **Correction to CLONE_SPEC §0.2:** the 600 face **is** downloaded on blog-post pages, where it renders `<strong>` (computed weight 600). Weight 500 (h2, form fields) still falls back to the 400 face.

---

## 0. Page inventory and shared shell

| Route | `data-wf-page` | Webflow bundle | Lenis | Page-load intro (≥768) | Sections in order |
|---|---|---|---|---|---|
| `/about` | `…c98f` | `webflow.06457013…` | yes | yes (§1.M) | hero_about · about_us_page · team · our_process · partners_v3 · our_products · blogs · **contact CTA** · footer |
| `/services` | `…c990` | `webflow.c1bb88ce…` | yes | yes (§2.M) | hero_services · services_detail · faq · **contact CTA** · footer |
| `/work` | `…c993` | `webflow.75ba16f2…` | yes | yes (§3.M) | hero_blog · work · **contact CTA** · footer |
| `/contact` | `…c992` | `webflow.0e1e2347…` | yes | yes (§4.M) | contact_hero · contact_info · contact (form) · footer |
| `/blog` | `…c991` | `webflow.be1392aa…` | yes | yes (§5.M) | hero_blog · blogs · footer |
| `/blog/<slug>` ×10 | `…c98d` | `webflow.06467f1f…` + `schunk.945f…` | **no** (native scroll; no Lenis or jsdelivr GSAP script) | **none** | blog_hero · blog_body · more_blogs · footer |
| `/cheggout-sdk`, `/watch-with-papa` | `6abb7a8a…1ab6`, `6ab64b3f…d1dc` | `schunk.945f…` (site-level IX only) | yes | **none** | project_hero · project_subhead · showcase sections… · vew_project · footer |

**Reused from the homepage without changes:**
- **Navbar** (§1). The current page's link gets `.w--current`, styled `color:#120DF7; text-decoration:none`. When the current page is /contact, the CONTACT link's underline is `border-bottom-color:#120DF7`. Case studies and blog posts have no current link.
- **Footer** (§13), including the partner-credits overlay.
- **ButtonV2** (§0.5).
- **Diagonal-arrow pair** (§0.5).
- **Hero** (§2), as the "hero words" variant described below.
- **Work card** (§3).
- **FAQ** (§10), on /services.
- **Blog card** (§11).
- **Clients/partners grid** (§8), on /about.
- **Contact CTA section** (§12), on /about, /services and /work.

**Not present:** the contact CTA on /contact, /blog, blog posts and case studies.

**Correction to CLONE_SPEC §14.5 (nav link hover):** the stylesheet has `.nav_link:hover { color:#120DF7; text-decoration:underline }`. The hover therefore also underlines the link (instantly, with no transition), not just recolours it.

**Page transitions:** none. Every route is a full document load. There are no IX2 page-start or page-finish events and no link-click interception.

### 0.1 "Hero words" variant (about, work, contact, blog)
This is the homepage hero header only (`.hero_header_wrap` → `.hero_heading_contain` → 3 × `h1.h1`). It has no `.hero_subhead_block` and no `.hero_info_block`. The section classes are `section_hero_about`, `section_hero_blog` (used by both /work and /blog) and `section_contact_hero`.
- Paddings and h1 type are the same as CLONE_SPEC §2:
  - padding 240/192 at ≥768 and 160/128 at ≤767
  - h1 uses `--display`, line-height 1.2, letter-spacing −0.9px, uppercase, `#1A1A1A`
  - three words, `justify-content:space-between` at ≥768
  - at ≤767: `flex-start`, column-gap 14, wrapping
- The section has `overflow:hidden` and **no border-bottom** (unlike the homepage hero).
- Words come from `pages.<page>.heroWords`: about `systems / standard / culture`, work `good / work / is here`, contact `work / with / us`, blog `read / our / blogs`.
- Measured h1 boxes (x, width) at 1440:
  - about: 32/345, 515/406, 1060/348
  - work: 32/227, 579/230, 1129/279
  - contact: 32/230, 690/191, 1309/99
  - blog: 32/201, 612/162, 1153/255
- Section heights: 522 (1440), 512 (1280), 499 (991). At 767 and 479 the height is 408/390 for about (the third word wraps to line 2) and 348/339 for work, contact and blog (one line).
- Each of these heroes also contains a `div.hero_navigation_wrapper` (brand plus 10 anchor links, all `href="#"`). It is `display:none` at every breakpoint. **Do not render it.** Its text is kept in `pages.about.heroNavigation_hidden` for reference only.

---

## 1. /about

### Layout
**1.1 `section_about_us_page`** (intro paragraph)
- `.about_us_v2`: 6-column grid. Padding is 0/112 at ≥992 and 0/96 at ≤991 (no top padding).
- One `.text-size-large` (`--t24`, line-height 1.3) at **cols 4/7**:
  - 688×118 at 1440 (4 lines)
  - 608 wide and 141 tall at 1280
  - still cols 4/7 at 991 (x 495.5, 475.5 wide, 130 tall; `--t24` becomes 20px / 26)
- ≤767: flex, full width, 20px / 26px.
- Content: `pages.about.intro`.

**1.2 `section_team`**: `.about_element` padding-top 112 (96 at ≤991), no bottom padding.
- Header `.about_us_element` (padding-bottom 32; 40 at ≤991) holds `h2.text-size-h2.caps` "team" (homepage section-heading role).
- `.team_detail_grid`:
  - Cols 1/3 of a 6-column grid. Inside it, `.team_list.w-dyn-items` holds 12 `.team_item`.
  - Each `.team_item` is **itself a 6-column grid** (229.33 columns at 1440):
    - `.team_list_item` spans **cols 1–2** (459 wide; 4 columns at 991 = 634; 6 columns at ≤767 = full)
    - hidden `.team_image_grid` sits at **col 4/5**
  - `.team_list_item`: flex, space-between, `align-items:center`, padding 16/16, gap 10, `border-bottom:1px #CECECE`. Row height 54.5 at 1440, 53.4 at 1280 and 52.2 at ≤991. **No top border on the list.**
    - Left `.team_name_element`: flex, gap 8, `align-items:flex-end`.
      - Name: `.text-size-medium.lh-115` (`--t20`, **line-height 1.15**: 18.73/21.54 at 1440, 16/18.4 at ≤991)
      - Role: `.text-size-small` (`--t14`, line-height 1.3; weight 500 renders 400)
      - `a.team_social_link`: flex, gap 6.4, `border-bottom:1px #000`, black. Holds a `.text-size-small` label and a `.team_arrow_icon` (`/images/6a8827216cb56caa7e99ca4e_arrow_icon.svg`, `--t10` square = 9.19 at 1440), `target=_blank`.
    - Right `.team_number_element`: 32 wide, text-align right, `.text-size-medium.lh-115` (`01`–`12`).
  - ≤479: `.team_item` becomes flex. `.team_name_element` is a column with gap 4 (name / role / link stacked). Row height 96.8.
- **Hover image** (desktop only):
  - `.team_image_grid`: `display:none`, `position:relative`, `height:100%`. It is hidden by CSS at ≤991.
  - On hover it becomes `display:flex` in col 4 (x 720, 229.3 wide, row height).
  - The `img.team_img` inside (`position:absolute`, `filter:grayscale(1)`, flex-shrink) renders as a **229.3 × 229.3 square at top −87.4px**. It is vertically centred on the 54.5px row and overflows above and below.
  - Source images are 250×250 (`pages.about.team.members[].image`).
  - **Missing locally:** member 12's `6abdeadb0baefae6e8d529a6_image 34.png` (it is not in public/images). The original URL is `https://cdn.prod.website-files.com/6a8827216cb56caa7e99c99e/6abdeadb0baefae6e8d529a6_image%2034.png`.
- Section height: 844 (1440), 828 (1280), 801 (991/767), 1337 (479).

**1.3 `section_our_process`**
- `.our_process_element`: 6-column grid, padding **224**/112 at ≥992, 96/96 at ≤991.
- `.our_process_header` (padding-bottom 32; 40 at ≤991) and the paragraph (`.text-size-medium`, 4 lines at 1440) both sit at **cols 5/7** (x 949, 459 wide). At 991 they sit at cols 3/7 (x 337, 634 wide).
- ≤767: flex column, full width.
- Content: `pages.about.process`.

**1.4 `section_partners_v3` "Clients"**: the homepage §8 component with these differences:
- **4 rows** (`.partner_list_image_grid`), holding 6 + 5 + 5 + 5 = **21 tiles**.
- **No button.**
- Header block 480 wide, padding-bottom 40.
- Tile placement at ≥992 (column / justify-self, x at 1440):

  | Row | Tiles |
  |---|---|
  | 1 | c1 start (32) · c2 start (261) · c3 start (491) · c4 **end** (835) · c5 end (1064) · c6 end (1293) |
  | 2 | c1 end (147) · c2 end (376) · c3 end (605) · c4 end (835) · c6 **start** (1179) — c5 empty |
  | 3 | c1 start (32) · c2 start (261) · c4 start (720) · c5 start (949) · c6 end (1293) — c3 empty |
  | 4 | c1 start (32) · c3 start (491) · c4 end (835) · c5 end (1064) · c6 end (1293) — c2 empty |

- The number overlay class varies per tile: `client_name color-white` (white), `color-black`, or plain `client_name` (grey `#7A7A7A`; row 1 tile 4 only). Per tile it is in `pages.about.clients.rows[r][t].numClass`.
- ≤991: same as homepage §8 (images hidden, 3-column and then 2-column text rows).
- Section height: 964 (1440), 899 (1280), 1044 (≤991).

**1.5 `section_our_products`** (new list)
- `.our_products_element`: 6-column grid, padding 112/112 (96/96 at ≤991).
- Header `.our_products_header` (padding-bottom 32; 40 at ≤991): `h2.caps` "products we have developed" at **cols 4/7** (x 720, 688 wide; cols 3/7 at 991).
- `.our_products_list` at cols 4/7: `border-top:1px #CECECE`. It holds 3 × `a.product_link` (`target=_blank`):
  - Each row is a **3-column grid** (229.3 each at 1440; 211.3 at 991; 242.3 at 767; 149 at 479), padding 16/16, `border-bottom:1px #CECECE`, `align-items:start`.
  - Col 1: name, `.text-size-medium`.
  - Col 2: description, `.text-size-regular` (wraps to 2 lines for item 2).
  - Col 3: `.our_products_arrow_wrapper`, 12×12, `justify-self:end`, `overflow:hidden`. It holds `products_arrow_icon.default` (black NE, `6abc97dc85b7ff62d127e274_black test.svg`) and `.bottom` (blue NE, `6abc97ef7fd03917579eefd1_blue test.svg`, absolute at left −100% / bottom −100%).
  - Row heights at 1440: 57.3 / 71.3 / 57.3.
- ≤767: flex column, list full width.
- Content: `pages.about.products.items`.

**1.6 `section_blogs`**: the homepage §11 component, unchanged (3 cards, staggered). Content: `pages.about.blogs.cards`.

**1.7 Contact CTA and Footer**: homepage §12 and §13.

### 1.M Motion (about)
- **Load timeline** (IX3 `wf:load`, ≥768). It follows the homepage §14.3 structure, with these differences:

  | Pos | Target | From → To | Dur | Ease | Split |
  |---|---|---|---|---|---|
  | 0 | `.hero_heading_contain` | opacity 0 → 1 | 0.5 | none | chars, mask chars, stagger amount 0.5, from random |
  | 1.25 | `.hero_heading_contain` | **width 92% → 100%** | 0.8 | circ.out | – |
  | 1.27 | `.hero_header_wrap` | height 90vh → auto | **1.17** | circ.out | – |
  | 1.27 | `.about_us_v2` (intro paragraph) | opacity 0 → 1, **y 150% → 0** | 1.21 | circ.out | **SplitText words** (no stagger set → all words together) |
  | 1.59 | `.nav` (`.hero_info_block` is absent) | opacity 0 → 1 | 0.68 | power1.out | chars, mask chars, amount 0.5, random |
  | 1.91 | `.logo_img` | opacity 0 → 1 | 0.5 | circ.out | – |
  | 2.22 | every `.button_line` | width 0% → 100% (origin 0 50%) | 1.0 | circ.out | – |
  | 2.93 | `.contact_link_icon` | opacity 0 → 1, x −100% → 0 | 0.64 | circ.out | – |

  The timeline's `.section_hero` opacity tween is a **no-op** here, because the class is `section_hero_about`.
- **Page-scoped scroll reveals** (≥768, `top bottom`, play once):
  - `.team_item` (12 triggers): self, opacity 0 → 1 **and width 20% → 100%**, 1.0s, circ.out.
  - `.product_link` (3 triggers): the target is **every** `.product_link` (not just the trigger itself). Opacity 0 → 1 and width 50% → 100%, 1.0s, circ.out, stagger amount 0.5. The first trigger to enter plays all three rows staggered. Implement it as one reveal on the list with stagger 0.25s per row.
- **Site-level reveals that hit this page** (definitions in CLONE_SPEC §14.4): `.text-size-h2.caps` (5 headings), `.text-size-medium` (team names and numbers, products, the process paragraph, blog titles), `.partner_list_image_grid` (4 rows), `.blog_image_wrapper`, `.button_v2`, `.contact_element_wrapper`, `.footer_block`.
  - The intro `.text-size-large` has **no** scroll reveal; it animates only in the load timeline.
- **Hovers** (IX2; easeOutQuart = `cubic-bezier(.165,.84,.44,1)`):

  | Element | Hover in | Hover out |
  |---|---|---|
  | `.team_list_item` (a-10/a-11) | Sibling `.team_image_grid` goes `display:flex`, then scale 0 → 1 over **800ms** easeOutQuart (measured scale 0.99 at 100ms, 1.0 at 300ms). The row's `border-bottom-color` goes `#CECECE` → `#000000` over 500ms. | Grid scale → 0 over **100ms** `cubic-bezier(.6,.04,.98,.335)`. Border → `#CECECE` 500ms easeOutQuart. `display:none` after an 800ms delay. |
  | `a.product_link` (a-31/a-32) | Row `border-bottom-color` `#CECECE` → `#120DF7` 500ms. `.products_arrow_icon.default` translate (0,0) → (100%, −100%) **500ms**. `.bottom` the same, **500ms with delay 200ms** (measured end translate (12px, −12px)). Text colour does not change. | Border → `#CECECE` 500ms; arrows snap back (0ms). |
  | `a.team_social_link` | none (static black text and black underline) | – |
  | Blog cards | as homepage (a-27/a-28) | – |

---

## 2. /services

### Layout
**2.1 `section_hero_services`** (new hero)
- `overflow:hidden`, no border.
- `.services_hero_element` (flex column) contains:
  - `.services_hero_header_wrap`: padding **240/112** at ≥768, **160/40** at ≤767.
    - `.services_heading_contain`: **6-column grid**, z-index 5. It holds two `h1.h1` (homepage hero h1 role):
      - "our" in **col 1**
      - "services" inside `.services_hero_header_wrapper` at **cols 3/5**, `justify-self:start` (x 491 at 1440, x 437 at 1280, x 337 at 991)
    - ≤767: flex, `flex-start`, column-gap 14 (one line: "our" at x 20, "services" at x 140.5 at 767).
  - `.services_in_detail_element`: 6-column grid, padding-bottom 112.
    - `.services_in-detail_description` at **cols 3/5** (459 wide at 1440, 405 at 1280). At 991 it spans cols 3/6 (475.5 wide) with padding-bottom 96.
    - It holds `p.text-size-medium_services_hero` (`--t20`, line-height 1.3; 16/20.8 at ≤991; `margin-bottom:10px`).
    - ≤767: flex `wrap-reverse`, full width, padding-bottom 128.
  - Content: `pages.services.heroWords` and `.intro`.
- Section height: 686 (1440), 670 (1280), 720 (991), 460 (767), 472 (479).

**2.2 `section_services_detail`** (new pricing table)
- `.services_in_detail_list_element`: 6-column grid, padding-bottom 112 (≤767: flex, padding 0).
- `.services_in_detail_wrapper` spans **cols 1/6** (1146.7 wide at 1440, 1013 at 1280, 792.5 at 991). At ≤767 it is full width.
  - Header `.services_in_detail_header`: 5-column grid, padding-bottom 16, uppercase. Three grey `.text-size-small.color-grey` labels "service" (span 2), "deliverables" (span 2), "cost" (the last column, right edge). Hidden (`display:none`) at ≤479.
  - `.services_in_detail_list`: `border-top:1px #CECECE`. It holds 4 × `.service_in_detail_item`:
    - 5-column grid, padding 16/16, `border-bottom:1px #CECECE`.
    - `.service_in_detail_name` (span 2, flex): `.service_in_detail_number`, 32 wide (40 at ≤479), `--t20`, line-height 1.3; then name `.text-size-medium`.
    - `.service_in_detail_deliverable` (span 2): `.text-size-regular` paragraph (5–6 lines at 1440).
    - `.service_in_detail_cost` (span 1, flex `justify-content:flex-end`, text-align right): `.service_cost_wrapper` (padding-right 8) holding grey "Starts at:", then black price.
    - Row heights at 1440: 147.8 / 147.8 / 128.7 / 167.0.
  - ≤479: each item is a flex column with gap 16: name row, then deliverables, then cost (left-aligned).
  - Content: `pages.services.tableHeader` and `.services[]`.
- Section height: 737 (1440), 723 (1280), 934 (991), 879 (767), 854 (479).

**2.3 `section_faq`**: homepage §10 unchanged (5 items, header at col 3, items at cols 4–6). Content: `pages.services.faq`.

**2.4 Contact CTA and Footer**: homepage.

### 2.M Motion (services)
- **Load timeline** (≥768):

  | Pos | Target | From → To | Dur | Ease | Split |
  |---|---|---|---|---|---|
  | 0 | `.section_hero_services` | opacity 0 → 1 | 0.5 | circ.out | – |
  | 0 | `.services_heading_contain` | opacity 0 → 1 | 0.5 | none | chars, mask chars, amount 0.5, from random |
  | 1.25 | `.services_hero_header_wrapper` ("services") | **x −50% → 0** | 0.99 | circ.out | – |
  | 1.27 | `.services_in-detail_description` | opacity 0 → 1, **y 200px → 0** | 1.27 | circ.out | **SplitText words** |
  | 1.51 | `.services_in_detail_list_element` (the whole table) | opacity 0 → 1, y 200px → 0 | 1.24 | circ.out | – |
  | 1.59 | `.nav` | opacity 0 → 1 | 0.68 | power1.out | chars, mask chars, 0.5 random |
  | 1.91 / 2.22 / 2.93 | `.logo_img` / `.button_line` / `.contact_link_icon` | as about | | | |

  The timeline also targets `.hero_header_wrap` (height 90vh → auto, 1.2s @1.27), but that element does not exist on this page, so the tween is a no-op. Do not apply a height intro here.
- **Page-scoped scroll interactions** on `.service_in_detail_item` and `.services_in_detail_header` (opacity and width 50% → 100%) are set to `dont-animate` on **all four** breakpoints. They never run, so the rows are static.
- Site-level reveals: `.text-size-medium` (service names, FAQ), `.text-size-h2.caps`, `.faq_item`, `.contact_element_wrapper`, `.button_v2`, `.footer_block`.
- **Hovers:** none on service rows. FAQ click as homepage (a-4/a-5).

---

## 3. /work

### Layout
- Hero: §0.1 (`good / work / is here`).
- **`section_work`**: the homepage §3 card system with **25 cards** in **4 grid wrappers**:
  - W1 (`.work_element_content_wrapper`, padding-top 40) holds cards 1–8.
  - W2, W3 and W4 (`._2`, padding-top 24) hold cards 9–16, 17–24 and 25.
- There is **no "see all" button**.
- Card anatomy, year label, arrows, caption row and the `≤767` header stacking are identical to homepage §3.
- Cards 1–2 are the `_hero` variants (`work_card_portrait_hero`, `work_card_landscape_right_hero`, with `.text-size-h2.hero` titles and `project_img_hero`). They animate in the load timeline.
- Per-card content (title, detail, caption, year, href/target, image, fill class) is in `pages.work.wrappers[w].cards[c]`.
- Placement at ≥992 (1440 measurements; at 1280 the same with 202.67 columns). The offset is `position:relative; top`. The "≤991" column gives the card width and left margin in the flex column (gap 160): R = pushed right (`margin-left:449.5px`, width 475.5), L = left-aligned width 713.25.

| # | Wrap | Card classes (`work_card_…`) | grid col · row | top | margin-bottom | Box at 1440 (x, y in section, w×h) | Image rendered (intrinsic) | Fill | ≤991 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | W1 | `portrait_hero bare_bones` | 1/3 · 1 | – | 160 | 32, 40, 458.7×676.5 | 458.7×601 (496×650) | #000000 | R |
| 2 | W1 | `landscape_right_hero rise_india` | 4/7 · 1, align start | – | 160 | 720, 40, 688×465.6 | 688×387.2 (741×417) | #0F2844 | L |
| 3 | W1 | `landscape_left anomaly left` | span 2 (auto) | – | 192 | 32, 876.5, 458.7×487.2 | 458.7×376.3 (496×407) | #000000 | R |
| 4 | W1 | `landscape_right moshimbo right` | 4/7 · 2 | −192 | 160 | 720, 684.5, 584.8×467.5 | 584.8×389.1 (756×503) | #6165AF | L |
| 5 | W1 | `landscape_left kulfi left` | 1/4 · 3 | – | 160 | 32, 1555.7, 688×422.4 | 688×344 (764×382) | #3E7170 | L |
| 6 | W1 | `portrait post_office_studios right` | 5/7 · 3 | −280 | 0 | 949.3, 1275.7, 458.7×708.3 | 458.7×597.5 (479×624) | #FF7136 | R |
| 7 | W1 | `landscape_left supari_studios left` | 1/4 · 4 | −80 | 0 | 32, 2184, 688×475.9 | 688×400.4 (756×440) | #FB9920 | L |
| 8 | W1 | `landscape_right tinker_labs right` | 5/7 · 4 | −96 | 128 | 949.3, 2168, 458.7×534.1 | 458.7×458.7 (940×940) | #193526 | R |
| 9 | W2 | `portrait jungle left` | 1/3 · 1 | – | 208 | 32, 2950.2, 458.7×630.2 | 458.7×532.6 (688×799) | #193526 | R |
| 10 | W2 | `landscape_right right` | 4/7 · 1 | – | 160 | 720, 2950.2, 688×415.7 | 688×340.2 (724×358) | #176C77 | L |
| 11 | W2 | `landscape_left mocha left` | span 2 (auto, row 2) | – | 0 | 32, 3788.4, 458.7×746.8 | 458.7×463.3 (495×500) | #FB9920 | R |
| 12 | W2 | `landscape_right moshimbo right` | 4/7 · 2 | −192 | 160 | 720, 3596.4, 584.8×465 | 584.8×389.5 (614×409) | #E1D327 | L |
| 13 | W2 | `landscape_left passion_films` | span 3 (auto, row 3) | – | 0 | 32, 4535.1, 688×625.7 | 688×387.3 (940×529) | #DFD9C4 | L |
| 14 | W2 | `portrait moshimbo right` | 5/7 · 3 | −192 | 0 | 949.3, 4343.1, 458.7×831.7 | 458.7×596.3 (480×624) | #DFD9C4 | R |
| 15 | W2 | `landscape_left supari_studios left` | 1/4 · 4 | −80 | 0 | 32, 5286.9, 688×464.3 | 688×385.8 (756×424) | #363638 | L |
| 16 | W2 | `landscape_right tinker_labs right` | 5/7 · 4 | −96 | 128 | 949.3, 5270.9, 458.7×451.8 | 458.7×376.3 (496×407) | #000000 | R |
| 17 | W3 | `portrait jungle left` | 1/3 · 1 | – | 208 | 32, 5970.7, 458.7×676.5 | 458.7×601 (496×650) | #193526 | R |
| 18 | W3 | `landscape_right right` | 4/7 · 1 | – | 160 | 720, 5970.7, 688×462.7 | 688×387.2 (741×417) | #176C77 | L |
| 19 | W3 | `landscape_left anomaly left` | span 2 (auto) | – | 192 | 32, 6855.2, 458.7×454.8 | 458.7×376.3 (496×407) | #000000 | R |
| 20 | W3 | `landscape_right moshimbo right` | 4/7 · 2 | −192 | 160 | 720, 6663.2, 584.8×496.9 | 584.8×399.4 (615×420) | #6165AF | L |
| 21 | W3 | `portrait moshimbo right` | 5/7 · 3 | −192 | 0 | 949.3, 7320.1, 458.7×768.1 | 458.7×532.6 (496×576) | #193526 | R |
| 22 | W3 | `landscape_right right` | **1/4 · 3** | – | 160 | 32, 7512.1, 688×415.7 | 688×340.2 (724×358) | #F0F3F6 | L |
| 23 | W3 | `landscape_left supari_studios left` | 1/4 · 4 | −80 | 0 | 32, 8200.3, 688×461.3 | 688×385.8 (756×424) | #363638 | L |
| 24 | W3 | `landscape_right tinker_labs right` | 5/7 · 4 | −96 | 128 | 949.3, 8184.3, 458.7×451.6 | 458.7×376.1 (1440×1180) | #000000 | R |
| 25 | W4 | `portrait jungle left` | **3/5** · 1 | – | 208 | 490.7, 8883.9, 458.7×676.6 | 458.7×601.1 (496×650) | #193526 | R |

Notes:
- Width rules at ≥992: portrait cards and `landscape_left` cards with span 2 = 2 columns; span 3 or 1/4 = 3 columns; `landscape_right` at 4/7 = 3 columns, or **85% (584.8)** for the `moshimbo` variant; at 5/7 = 2 columns.
- Cards stretch to their grid row height, which leaves empty space under short cards (for example #11 and #14). Reproduce this with grid `align-items: stretch`, which is the default.
- Section height: 9768 (1440), 8957 (1280).
- Wrapper rows at 1440: W1 836.5 / 679.2 / 708.3 / 662.1; W2 838.2 / 746.8 / 831.7 / 579.8. Wrapper tops: 0, 2926, 5947, 8860.
- ≤991: same flex rules as homepage §3 (991: gap 160, W2+ padding 24/80; 767: `.work_element` padding-top 160, wrappers gap 160 and padding-bottom 160, cards 701 wide; 479: padding-top 80, gap 80, padding-bottom 80, cards 421 wide).
- Section heights measured at ≤991 (15464 / 17059 / 12818) are **unreliable**: lazy images below the fold had not loaded during the scroll pass. Derive heights from image aspect ratios instead.

### 3.M Motion (work)
- **Load timeline** (≥768): identical to the homepage intro, with these differences:
  - `.hero_heading_contain` width runs **65% → 100%** (0.8s, circ.out, @1.25).
  - `.hero_header_wrap` height 90vh → auto, 0.8s @1.27.
  - There are no `.hero_subhead` and no `.hero_btn_arrow_icon` tweens.
  - The hero-card tweens are kept unchanged: `work_card_portrait_hero.bare_bones` y 8rem, `work_card_landscape_right_hero.rise_india` x 5rem, `work_card_header_wrapper_hero` chars, `project_img_hero` scale 1.1, `proj_card_year_wrapper_hero` y 200%, all @1.86–1.89.
  - `.section_hero` opacity is a no-op (the section is `section_hero_blog`).
- Scroll reveals: all homepage work-card reveals apply to all 23 non-hero cards. That covers `work_card_image_wrapper`, `work_card_portrait` y 8rem, `landscape_left` x −5rem, `landscape_right` x 5rem, `header_wrapper`, `detail_wrapper`, `proj_card_year_wrapper` (CLONE_SPEC §14.4). The homepage-only `work_card_portrait.bare_bones` y 2rem interaction does **not** exist here.
- Hover: work card a-14/a-15 (homepage §14.5) on all 25 cards.

---

## 4. /contact

### Layout
- Hero: §0.1 (`work / with / us`).

**4.1 `section_contact_info`**
- `border-bottom:1px #CECECE`.
- `.contact_info_wrapper`: 6-column grid, `align-items:end`, padding-bottom 40 (96 at ≤991).
  - `.contact_phone_info` (col 1) and `.contact_email_info` (col 3): flex columns, gap 4. Each holds a grey `.text-size-small` label and an `a.text-size-regular` that keeps the browser **underline** (`tel:` and `mailto:` links, black).
  - `.contact_address_info` (cols 5/7): `align-items:flex-end`, text-align right; label and 3-line address.
- ≤991: flex column, gap 40, everything left-aligned.
- Content: `pages.contact.info`.
- Section height: 119 (1440), 114 (1280), 337 (991/767), 335 (479).

**4.2 `section_contact` (form page variant; NOT the homepage CTA)**
- `.contact_page_form_element`: 6-column grid (3 columns at ≤991), padding 112/112.
- `.contact_form_block.w-form` sits at **cols 1/4** (688 wide at 1440, 608 at 1280, full width at ≤991). `form.contact_form` is a flex column with gap 40 and padding-bottom 4.
  1. `.contact_form_lement_title_wrap`: `max-width:288px`, padding-bottom 80. Holds `.text-size-large` (`--t24`, 4 lines at 1440; 20/26 at ≤991).
  2. `.contact_foem_block_1` #1: grid `1fr 1fr`, gap 16, relative. It holds the **Name** and **Email** inputs, then a `div.line` (`position:absolute; inset:auto 0 0; height:1px; background:#120DF7`). The line is one blue rule under the whole row (at top 47).
  3. `.contact_foem_block_1` #2: the **budget `<select>`** (spans 2 columns, 38 tall), then a `div.line` at the bottom.
  4. `.contact_foem_block_2`: grid 4 × 1fr, gap 16, `align-items:end`, `pointer-events:none` (re-enabled on the textarea and button). It holds the **textarea** (span 3, `margin-right:40px`), the **submit** (col 4), then a `div.line` under the full width.
  - ≤479: both blocks become flex columns. Inputs stack (each 48 tall, gap 16). Name and textarea also get `border-bottom-color:#120DF7` (`.mobile_ul`), on top of the block-level line. Submit is 93.7 wide, left-aligned.
- **Field styling**:

  | Field | Box | Type |
  |---|---|---|
  | `input.text_field.contact` (text, email) | height 48 (`3rem`), padding 8 / 12 / 2.4 / 0, `border:1px solid transparent`, background `#FFF` | `--t20` (18.73 at 1440, 17.76 at 1280, 16 at ≤991), **weight 500** (renders 400), line-height 26.75 at 1440, colour `#000`; placeholder `#000` |
  | `select.select_field` | height 38, padding 0, `border:0`, background `#FFF`, native appearance (system arrow) | `--t20`, weight 400, `#000` |
  | `textarea.text_area` | height 65.9 at 1440 (58.1 at ≤991), same padding and transparent border, `resize:both`, `display:flex; align-items:flex-end` | `--t20` weight 500; **text colour `#333333`**, placeholder `#000` |
  | `input.btn_submit` | 160 × 48 at 1440 (one grid column; 225.75 at 991, 169.75 at 767), padding 8 / 40 / 0 / 0, transparent background, **background-image `/images/6a8827216cb56caa7e99ca4e_arrow_icon.svg` at `100% 58%`, size 12px, no-repeat**, text-align center | `--t20`, weight 500, line-height 0.9, `#000`, value "Submit" |

- **States** (measured):
  - Focus on input or textarea: border becomes `#3898EC` 1px on all four sides (Webflow `.w-input:focus`), instant, `outline:0`.
  - Focus on the select: no visible change (border width 0, `outline:0`).
  - Hover on submit: no change.
  - No CSS transitions on any field.
- **Validation**: native HTML5 only. All four fields are `required`, the email is `type=email`, `maxlength` is 256 (inputs) and 5000 (textarea). The browser shows its default bubble ("Please fill in this field.").
- **Submit behaviour** (Webflow forms):
  - The form posts by AJAX to Webflow (`data-name="Email Form"`, `method=get` attribute).
  - Cloudflare **Turnstile** runs invisibly (`data-turnstile-sitekey="0x4AAAAAAAQTptj2So4dx43e"`, hidden `cf-turnstile-response` input).
  - **On success the form has `data-redirect="/"`, so the browser navigates to the homepage.** The `.w-form-done` success block is in the markup but is effectively never shown.
  - Success block styling if you show it: `display:none` → block, text-align left, transparent background, padding 0. Text is `.text-size-large`, "Thank you! We've received / your message.".
  - The error block `.w-form-fail` (`display:none` → block) has `background:#FFDEDE`, `margin-top:10px`, `padding:10px`, 16px / 19.2 `#000` text: "Oops! Something went wrong while submitting the form.".
  - I did not submit the live form, so as not to send a message.
- Field names and options are in `pages.contact.form.fields`. Budget options: Estimated Budget (empty value), `<$1500`, `$1500-$3000`, `$3000-$5000`, `>$5000`.
- Section height: 708 (1440), 702 (1280), 690 (991/767), 818 (479).

### 4.M Motion (contact)
- **Load** (≥768):
  - The homepage structure, with `.hero_heading_contain` width **60% → 100%** and `hero_header_wrap` height over **1.17s**.
  - Plus `.contact_info_wrapper` opacity 0 → 1, 1.21s circ.out @1.27.
  - The rest (nav chars @1.59, logo @1.91, lines @2.22, contact icon @2.93) is the same as about.
- Scroll (≥768):
  - `.contact_form_block` (site-level): opacity 0 → 1 and width 50% → 100%, 1.0s, circ.out, `top bottom`.
  - Page-scoped `.text-size-large`: opacity 0 → 1, 1.0s, none (the form title).
  - Quirk: the hidden success text also carries `.text-size-large` and is left at opacity 0. If you show the success state, fade it in (1s).
- Hovers: footer and nav only. `wf:custom` interaction `i-ba9b8d96` has no timeline (inert).

---

## 5. /blog (list)

- Hero: §0.1 (`read / our / blogs`).
- **`section_blogs`**: the homepage §11 component with **all 10 cards** (`pages.blog.cards`, in list order).
  - Heading `h2.caps` "Blogs".
  - Grid at ≥992: 6 columns, row-gap 160. The placement pattern repeats every 3 cards:

    | Card | Placement |
    |---|---|
    | 3n+1 | cols 1/3, its own row |
    | 3n+2 | cols 2/4, next row |
    | 3n+3 | cols 5/7, same row as 3n+2 |

  - That gives 7 rows. Rows at 1440: 480.2 / 455.9 / 480.2 / 480.2 / 480.2 / 455.9 / 455.9 (the height follows 1-line vs 2-line titles). Card x positions: 32, 261, 949, 32, 261, 949, 32, 261, 949, 32.
  - 991: 2 columns of 465.5, column-gap 20, row-gap 96, filled in order.
  - ≤767: 1 column, row-gap 96. Card height 653 at 767 (image 727×545) and 443–463 at 479.
- Section height: 4542 (1440), 4260 (1280), 2977 (991), 7682 (767), 5640 (479). There is no contact CTA on this page.
- **Motion:**
  - Load as contact, but without `contact_info_wrapper`: heading width **60% → 100%**, height intro 1.17s.
  - The timeline lists `.about_us_v2` (words, y 150%), which does not exist on this page (no-op).
  - Scroll: `.blog_image_wrapper` (opacity, then `.blog_img` scale 1.25 → 1), `.text-size-medium`, `.button_v2`, `.text-size-h2.caps`, `.footer_block`.
  - Hover: blog card a-27/a-28 (homepage §14.5) on all 10.

---

## 6. Blog post template (`/blog/<slug>` ×10)

Data: `blogPosts[]` in `.recon/pages-content.json`, sorted by list order. Each post has:
- `title`, `subtitle`, `heroImage`
- `meta` {date, author}
- `body[]`: structured blocks (`p | h2 | h3 | h4 | ol | figure`)
- `readMore.cards` (2)

Inline HTML in `html` keeps `<strong>`, `<em>`, `<a>` and `<br>`. Blocks whose text is only U+200D carry `empty:true`; render them anyway, because they add a 24px + 10px gap.

Across all 10 posts the body contains: p ×137, h2 ×35, h3 ×12, h4 ×3, ol ×1, figure ×34 (28 `fullwidth`, 6 `center`). There are no ul, blockquote, figcaption, links or video in the bodies. Post `how-to-create-good-web-design-everytime` has **empty date and author** fields in the CMS (`w-dyn-bind-empty`), so its labels render with empty values.

### 6.1 Layout
`.blog_container`: `max-width:688px`, centred, inside `.padding-global` (32 / 20 / 16).
- At 1440 it sits at x 376; at 767 it is 688 wide at x 39.5; at 479 it is 447 wide.

**`section_blog_hero`**: `border-bottom:1px #CECECE`, `overflow:hidden`. `.blog_hero_element` padding 64/32.
1. `.blog_hero_image_wrapper` → `img.blog_hero_image`: full container width at **4:3** (688×516; 447×335 at 479).
2. `.blog_hero_header`: flex column, gap 8, padding 24/24.
   - `h1.blog_heading`: **40px / 48px (line-height 1.2), letter-spacing −0.9px, weight 400, `#1A1A1A`, no transform**, `margin-bottom:10px`. Fixed size at all widths: 2 lines at 688, 4 lines at 447.
   - `p.text-size-regular` subtitle.
3. `.blog_info_element`: 3-column grid (229.3 each). At ≤767 it is a flex column with gap 16.
   - `.blog_date_wrapper` and `.blog_author_wrapper`: flex columns, gap 4. Each has a grey uppercase `.text-size-small` label ("published on:", "author:") over an uppercase `.text-size-small` value.
   - `.blog_share_link_wrapper` ("share" plus arrow) is `display:none`. Do not render it.
- Hero height: 802–850 at 1440 (depends on the title's line count), 683–842 at 479.

**`section_blog_body`**: `.blog_body_element` padding 32/32. `.blog_righ_text.w-richtext` has `font-size: clamp(12px, 5.986px + 0.607vw, 16px)` (the `--t16` formula **without** the ≤991 override), giving **14.73 at 1440, 13.76 at 1280, 12.00 at ≤991**, and `line-height:140%`.

| Block | Style (computed) |
|---|---|
| `p` | inherits the size above, line-height 1.4 (20.62 at 1440, 16.8 at ≤991), `margin:0 0 10px`, `#000` |
| `h2` | 24px / 28.8, letter-spacing −0.4px, weight 500 (renders 400), `margin:0 0 10px` |
| `h3` | 20px / 24, weight 400, `margin:0 0 10px` |
| `h4` | 18px / 21.6, weight 400, `margin:10px 0 10px` |
| `ol` | `padding-left:20px; margin-bottom:10px`, decimal, `overflow:hidden`; `li` same size and line-height as p, no extra margin |
| `strong` | weight **600** (PP Mori Semibold), inline; inside h2 it stays 24px |
| `em` | italic (synthetic; no italic face is loaded) |
| `figure.w-richtext-align-fullwidth` | `display:block; width:100%; max-width:100%; text-align:center; margin:0 0 10px`. The inner `div` is `inline-block` and the `img` renders at its **intrinsic width, capped at 100%** (for example 560×342 centred in 688, or 1536-wide images shown at 688). The inline `max-width:…pxpx` on the figure is invalid CSS in the original and is ignored. |
| `figure.w-richtext-align-center` | `display:table; max-width:60%; margin:0 auto 10px` (412.8 wide at 688; 268 at 447). The image fills it. |
| figure inner `div` | `font-size:0; color:transparent` (Webflow) |

Fixed sizes (h2, h3, h4, h1) do not scale. Only p, li and the meta text follow the fluid `--t` variables.

**`section_more_blogs`**: `border-top:1px #CECECE`. `.more-blogs_element` padding 112/112 (at ≤767 also padding-right 64, so the content is 624 wide at 767).
- Heading: **`h1.text-size-h2.caps`** "read more". This is an h1 tag: `--t32`, line-height 1.2, **letter-spacing −0.9px, colour `#1A1A1A`**, `margin-bottom:10px`.
- Grid `.more_blogs`: 2 × 328 columns, column-gap 32, padding-top 40. At ≤767: 1 column, row-gap 96.
- Two homepage blog cards (`.more_blogs` variant: `justify-content:space-between`). Image 328×246 (4:3), title `.text-size-medium`, "READ BLOG" `button_v2` row.
- Section height 693 (1440), 686 (1280), 678 (991), 1552 (767), 1285 (479).

### 6.2 Motion (blog post)
- **No load timeline, no Lenis** (native scroll), no rich-text animation.
- Site-level scroll reveals that apply here:
  - `.text-size-h2.caps` (the read-more heading): opacity 0 → 1, 1s circ.out, `top bottom / top 70%`
  - `.blog_image_wrapper` and `.blog_img`, `.text-size-medium`, `.button_v2` (card rows)
  - `.footer_block`
  - All at ≥768 only.
- Hover: read-more cards a-27/a-28.

---

## 7. Case-study template (`/cheggout-sdk`, `/watch-with-papa`)

Data: `caseStudies.<slug>`:
- `h1`, `brief`, `scope`, `liveLink`, `credit`
- `sections[]` with ordered `blocks[]`: `stack`, `content`, `image`, `video`, `lottie`, `button`

Section order:
- Cheggout: subhead → full-width **Lottie** → image-text (image left) → `2_images` (text left, Lottie right) → image-text (Lottie left) → view project.
- Watch with Papa: subhead → full-width **YouTube embed** → 4 × image-text (alternating image left / text left; GIFs) → full-width image → view project.

### 7.1 Layout
**`section_project_hero`**: `border-bottom:1px #CECECE`, `overflow:hidden`.
- `.project_hero_element`: padding 240/56 at ≥992, 240/96 at 991–768, 112/96 at ≤479.
1. `.project_header_element`: 6-column grid.
   - `h1.h1` (homepage hero role, `--display` uppercase `#1A1A1A`) at **cols 1/4**. It wraps to 2 lines at 991 (475.5 wide).
   - `.project_brief_element` at **cols 5/7**: flex column, gap 16.
     - `h2.text-size-medium.caps` "project brief": `--t20`, letter-spacing −0.4px, `margin-bottom:10px`.
     - `p.text-size-regular` (3 lines at 1440).
   - ≤767: flex column, gap 48.
2. `.project_detail_element`: 6-column grid, `align-items:end`, padding-top 112 (96 at 991, 48 at ≤767).
   - `.project_scope` (col 1): uppercase `.text-size-regular`, wraps in the column.
   - `.project_live_link_wrapper` (cols 3/5, `justify-self:start`): `a.project_live_link`, `inline-flex`, gap 8, `border-bottom:1px #000`, `target=_blank`. Label `.text-size-regular`, then arrow icon `6a8827216cb56caa7e99ca4e_arrow_icon.svg` at `--t10` square, `top:-0.8px`.
   - `.project_credit` (cols 5/7): flex column, gap 2.4. Grey label, then a `project_live_link` (`href="#"`).
   - ≤767: flex column, gap 16, left-aligned.
   - No hover styles on these links.
- Height 558 (1440), 551 (1280), 596–642 (991), 690 (767), 567 (479).

**`section_project_subhead`**: `.project_subhead_element` is a grid `1fr 1fr` (688 + 688), padding 56/44. At ≤991 it is a flex column with padding 96/96 (96/0 at 767; 96/16 at 479).
- Left `.project_stack_overview_wrapper`: flex column, **`justify-content:flex-end`** (content sits at the bottom of the 688 square), gap 40, padding-right 40.
  - `.project_stack_overview`: `border-top:1px #CECECE`, margin-right 24.
    - 2–3 `.project_stack_overview_item` rows. Each row is a 3-column grid (216 each), padding 16/16, `border-bottom:1px #CECECE`: label (col 1), value (col 2; Watch-with-Papa's "Highlights" value sits in `.project_showcase_highlights_item`), number `01…` (`justify-self:end`). All text `.text-size-regular`.
  - Cheggout only: `.project_showcase_content_wrapper` under the stack (flex column, gap 16) with a `.text-size-medium.caps` label "THE IDEA" and a paragraph.
- Right `.project_showcase_image_wrapper` (flex centre): a square image 688×688 (`project_showcase_image`; sources 800² and 1440²). At ≤991 it is full width with `margin-top:96px` at 991 and 0 at ≤767.

**`section_project_showcase_full_width_image`**: `.project_showcase_full_width_image_element` is a centred flex, padding 44/44 (16/16 at ≤767).
- Watch with Papa, first instance: `.project_showcase_video > .w-video.w-embed`, `padding-top:56.17%`, holding an absolute 100% iframe (embedly → YouTube `Xkd0TjIPlpM`, start 2s; `caseStudies['watch-with-papa'].sections[1].blocks[0].video.iframeSrc`). 1376×772.9 at 1440.
- Watch with Papa, second instance: `img.project_showcase_full_width_image`, `min-width:100%` (1376×977, intrinsic 940×667).
- Cheggout: `.project_cheggout_lottie_wrapper` (flex centre, **background `#171717`**, `overflow` visible) holds the Lottie `div.cheggout_json`.
  - The Lottie is `min-width:110%`, 16:9: 1513.6×851.4 at 1440, centred, overhanging the wrapper by 5% on each side. The section clips nothing: the overhang reaches x −36.8, so add `overflow-x:hidden` on body if needed.
  - Lottie settings: `data-src …6abb83b9a7aa7f9e3c7b4e6c_homepage.json`, svg renderer, autoplay, loop, lazy.

**`section_project_showcase_image-text`** (also `section_project_showcase_2_images`, which uses `.project_showcase_image-text_element-copy` with identical styles):
- Grid `1fr 1fr`, padding 44/44 (16/16 at ≤767).
- Image half `.project_showcase_image_wrapper`: flex centre, image full half-width.
  - Watch-with-Papa GIFs are 500×667, shown at 688×917.8.
  - Cheggout PNG: 800² → 688².
  - `.bg_color_grey` variant: background `#F3F4F6`, holding `.project_showcase_square_json.scale_80`, a Lottie square at **80% width** (550.4 at 1440). Sources: `…6abb88d1dedc5ac37d6f92cc_performance%20marketing.json` and `…6abb892c27e21f49c7556137_monetize%20hero.json`, eager, autoplay, loop.
- Text half `.project_showcase_text_wrapper`: 3-column grid (229.3), `align-items:end` (content bottom-aligned).
  - `.project_showcase_content_wrapper` (flex column, gap 16): **cols 2/4** when the text half is on the right, **cols 1/3** when it is on the left (459 wide).
    - `.text-size-medium.caps` label.
    - Paragraphs `p.text-size-regular`; inside `.showcase_card_content_description` they are `p.para` with `margin-bottom:16px`.
    - `ul.project_showcase_list`: `padding-left:20px; margin-bottom:16px`, disc. `li` is 16px / 19.2 with `margin-bottom:4px`, holding a `.text-size-regular` div.
- 991: columns 475.5. The image wrapper gets `margin-top:96px`. The text grid is 4 columns with content at cols 2/5 (356.6 wide).
- ≤767: flex column in **DOM order** (no reordering; text-first sections stay text-first). The text wrapper has padding 16/16 and content up to 544.5 wide at 767 (full width at 479).
- Heights at 1440: Watch-with-Papa 1006 each; Cheggout 776 and 643.

**`section_project_showcase_vew_project`**: centred flex, padding 112/112.
- `a.button_v2.wide` "see more work" (`href="/about"` in the original; probably intended to be `/work`). Content-width (188.7 at 1440), gap 16.

**Inert scripts.** Both case studies load Swiper 8 and init `new Swiper('.swiper.showcase', {speed:400, spaceBetween:24, slidesPerView:'auto', rewind:true, grabCursor:true, navigation:{nextEl:'.swiper-navigation.next', prevEl:'.swiper-navigation.prev'}})`. **No `.swiper` element exists, so it does nothing.** Do not build a slider.

### 7.2 Motion (case study)
- No load timeline. Lenis is on (homepage settings).
- Site-level scroll reveals that apply here:
  - `.text-size-medium` (brief label, section labels)
  - `.button_v2` (see more work)
  - `.footer_block`
  - `.text-size-medium.caps` inherits the `.text-size-medium` reveal (opacity 1s none, `top bottom`)
- Images, video and paragraphs do not animate.
- Lotties: autoplay and loop from load (lazy for the full-width one). `data-duration` is 0 / 6.5 (monetize) and `data-default-duration` is 0 / 9; with autoplay, the native Lottie duration applies.
- Hover: "see more work" is `button_v2` a-12/a-13 (homepage).

---

## 8. New-motion summary (beyond CLONE_SPEC §14)

| Page | Trigger | What | Timing |
|---|---|---|---|
| about | load @1.25 | `.hero_heading_contain` width 92% → 100% | 0.8s circ.out |
| about, blog, contact | load @1.27 | `.hero_header_wrap` height 90vh → auto | **1.17s** circ.out (home and work: 0.8s) |
| about | load @1.27 | intro `.about_us_v2` opacity 0 → 1, y 150% → 0, SplitText **words** | 1.21s circ.out |
| blog, contact | load @1.25 | heading width 60% → 100% | 0.8s circ.out |
| work | load @1.25 | heading width 65% → 100%; hero cards as home | 0.8s circ.out |
| contact | load @1.27 | `.contact_info_wrapper` opacity 0 → 1 | 1.21s circ.out |
| services | load @0 / @1.25 / @1.27 / @1.51 | heading chars (mask, random, 0.5); "services" word x −50% → 0; intro words y 200px → 0 + fade; table y 200px → 0 + fade | 0.5 none / 0.99 / 1.27 / 1.24 circ.out |
| about | scroll `top bottom` | `.team_item` opacity + width 20% → 100% | 1.0s circ.out |
| about | scroll `top bottom` | all `.product_link` opacity + width 50% → 100%, stagger amount 0.5 | 1.0s circ.out |
| contact | scroll `top bottom` | `.contact_form_block` opacity + width 50% → 100%; `.text-size-large` opacity | 1.0s circ.out / 1.0s none |
| about | hover | team row: grayscale square image scales in at col 4; row border `#CECECE` → `#000` | 800ms easeOutQuart in, 100ms easeInCirc-like out (then hidden after 800ms); border 500ms |
| about | hover | product row: border → `#120DF7`; NE arrows (100%, −100%) | 500ms; second arrow delay 200ms; out snaps |
| contact | focus | input/textarea border → `#3898EC` (1px, all sides) | instant |
| all | hover | `.nav_link` → `#120DF7` **plus underline** (correction) | instant |
| blog posts, case studies | – | no load intro, no rich-text or image reveals; blog posts have no Lenis | – |
| services | – | service-row scroll interactions disabled on every breakpoint | – |

All load and scroll interactions are `dont-animate` at ≤767 (static end state), as on the homepage. No SplitText runs below 768.

---

## 9. Assets
- All images used on these routes are in `public/images/` under decoded filenames. JSON paths point at the full-size file and list the srcset variants.
- **Missing locally** (1 file): `6abdeadb0baefae6e8d529a6_image 34.png` (about team member 12, Prachuryya Das). Original: `https://cdn.prod.website-files.com/6a8827216cb56caa7e99c99e/6abdeadb0baefae6e8d529a6_image%2034.png`.
- **Lottie JSON, not downloaded** (fetched live as `application/json`):
  - `https://cdn.prod.website-files.com/6a8827216cb56caa7e99c99d/6abb83b9a7aa7f9e3c7b4e6c_homepage.json`
  - `https://cdn.prod.website-files.com/6a8827216cb56caa7e99c99d/6abb88d1dedc5ac37d6f92cc_performance%20marketing.json`
  - `https://cdn.prod.website-files.com/6a8827216cb56caa7e99c99d/6abb892c27e21f49c7556137_monetize%20hero.json`
  - Render them with `lottie-web` (svg renderer, loop, autoplay).
- Video: YouTube `Xkd0TjIPlpM` (start 2s) through embedly. A direct `https://www.youtube.com/embed/Xkd0TjIPlpM?start=2` iframe in a 16:9 box (`padding-top:56.17%`) is equivalent.
- Icons reused from the homepage set:
  - arrow_icon.svg (links, submit, team links)
  - black/blue "test" NE arrows (products, work cards)
  - black/blue "test foward" right arrows (button_v2, blog cards)
  - add.svg and subtract.svg (FAQ)

## 10. Could not measure / caveats
- **Form submission and success/error states were not triggered.** The live form would send a real enquiry. Styles come from CSSOM; behaviour comes from form attributes (`data-redirect="/"`, Turnstile site key).
- Turnstile's widget is invisible; there was no challenge UI to measure.
- **Lottie and YouTube content** is rendered from JSON or an iframe; only the container sizes were measured.
- **/work heights at ≤991**: lazy images below the fold had not loaded during the scroll pass, so some cards measured with 0-height images. The layout rules (widths and margins) are reliable; the heights are not.
- Page-load intros for the inner pages were taken from the IX3 config and not re-sampled frame by frame. The homepage samples (CLONE_SPEC §14.3) validate the same engine and eases.
- Team hover at ≤991: CSS hides `.team_image_grid`, but IX2 sets inline `display:flex` on hover. On a narrow desktop window, hovering would still reveal it. Touch devices never trigger it.
- The `.text-size-large` success message stays at opacity 0 because of the page's scroll reveal (an original quirk; see §4.M).
