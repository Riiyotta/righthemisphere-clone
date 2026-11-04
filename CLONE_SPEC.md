Source: https://www.righthemisphere.studio/

# Right Hemisphere homepage: clone spec (design + motion, placeholder content)

Measured on 2026-11-04 in headless Chrome via Playwright, at viewports 1440, 1280, 991, 767 and 479 (height 900). Values come from `getComputedStyle` and `getBoundingClientRect` after scrolling the whole page so every scroll-triggered animation reached its end state. Motion values were read from the live Webflow IX3/IX2 registration payload in `webflow.817d5eb9…js` and checked against sampled computed styles over time.

**Content rule.** Copy, photography, client and award logos, and the brand mark are not reproduced. Each text slot below lists only a word count (`w`) and character count (`c`) so placeholders wrap onto the same number of lines. Images are listed by size and aspect ratio. See `asset-manifest.json`.

Webflow breakpoints (also used by IX3): `main` ≥992, `medium` 768–991, `small` 480–767, `tiny` ≤479. In this spec "≤991" means medium and below, and so on.

---

## 0. Global tokens

### 0.1 Colour (all values computed)
| Token | Value | Used for |
|---|---|---|
| `ink` | `#000000` | body text, button underline (`button_line`), links at rest |
| `ink-h1` | `#1A1A1A` (rgb 26,26,26) | hero h1 only |
| `grey` | `#7A7A7A` (rgb 122,122,122) | `.color-grey` captions, labels, client names (desktop) |
| `rule` | `#CECECE` (rgb 206,206,206) | every 1px hairline: hero bottom border, list row borders, list top borders, slider mask bottom, FAQ rows, mobile menu bottom |
| `accent` | `#120DF7` (rgb 18,13,247) | hover colour for text, lines and borders; nav hover; current footer link; all icons |
| `accent-alt` | `#211CF7` (rgb 33,28,247) | slider PREV/NEXT text hover only (separate value in IX2) |
| `paper` | `#FFFFFF` | page bg, fixed nav bg, mobile menu bg |
| `white-0` | `rgba(255,255,255,0)` | resting `border-bottom-color` of work-card detail rows (animates to accent) |
| `overlay` | `rgba(0,0,0,0.5)` | footer "partner credits" overlay backdrop |
| Project tile backgrounds (shown behind images, keep them as placeholder fills) | `#000000`, `#0F2844`, `#6165AF`, `#3E7170`, `#FF7136`, `#FB9920`, `#193526`, `#5B5B45`, `#176C77` | see Work section |

No gradients, no shadows (`box-shadow: none` everywhere) and no border radii, except on the hidden Webflow slider dots.

### 0.2 Typography
- **Face.** `PP Mori` Regular 400 (`font-family: Ppmori, Arial, sans-serif`). It is the only text face actually rendered.
  - Karla 300–700 is loaded through the Google WebFont loader (`WebFont.load({google:{families:["Karla:300,400,500,600,700"]}})`), and only the latin 400 file is downloaded. No CSS rule uses Karla. **Confirmed unused.**
  - General Sans is declared in `@font-face` but never applied.
  - Elements with weight 500 (`h2`, `.hero_btn`, `.contact_element_wrapper`) render with the 400 face because the 500 face does not exist. The 600 face is declared but never downloaded.
  - For the replica, use any neutral grotesk with similar metrics, or PP Mori if it is licensed. Use a 400 weight only.
- `html` font-size is 16px. Body is 16px / 120%, colour `#000`, letter-spacing normal.
- **Fluid scale.** The site uses CSS variables with `clamp()` (vw = viewport width). Implement these exactly:

| Var | Formula (px) | 1440 | 1280 | ≤991 override |
|---|---|---|---|---|
| `--t10` | clamp(8, 5.347 + 0.2674vw, 10) | 9.20 | 8.77 | – |
| `--t12` | clamp(10, 4.694 + 0.5348vw, 14) | 12.40 | 11.54 | – |
| `--t14` | clamp(10, 3.986 + 0.607vw, 14) | 12.73 | 11.76 | 14px |
| `--t16` | clamp(12, 5.986 + 0.607vw, 16) | 14.73 | 13.76 | 14.4px (≤991), 14px (≤767) |
| `--t20` | clamp(16, 9.986 + 0.607vw, 20) | 18.73 | 17.76 | 16px |
| `--t24` | clamp(20, 13.986 + 0.607vw, 24) | 22.73 | 21.76 | 20px |
| `--t32` | clamp(24, 11.970 + 1.214vw, 32) | 29.45 | 27.51 | 24px |
| `--display` | ≥992: clamp(52, 0.69 + 5.1724vw, 100); ≤991: clamp(40, 29.485 + 2.6756vw, 56) | 75.17 | 66.90 | 56 (991), 50.01 (767), 42.30 (479) |
| `--hero-sub` | clamp(17, 1.8103vw − 0.958, 33.8) | 25.11 | 22.21 | 17 |

**Type roles.** Line-height is a ratio of font-size. Weight is 400 unless noted.

| Role (class) | Size | Line-height | Letter-spacing | Transform | Colour | Notes |
|---|---|---|---|---|---|---|
| Hero h1 (`.h1`) | `--display` | 1.2 (90.21px at 1440) | −0.9px | uppercase | `#1A1A1A` | three separate h1 words |
| Contact display (`.contact_heading`, h2) | `--display` | 1.2 | −0.4px | uppercase | `#000` | weight 500 → renders 400 |
| Hero subhead (`.hero_subhead`) | `--hero-sub` | 1.0 | 0 | uppercase | `#000` | |
| Section heading (`h2.text-size-h2.caps`) | `--t32` | 1.2 | −0.4px | uppercase | `#000` | `margin-bottom:10px`, weight 500 → renders 400 |
| Caps statement (`div.text-size-h2.caps`, About) | `--t32` | 1.2 | 0 | uppercase | `#000` | |
| Card title (`.text-size-h2` in work cards) | `--t32` | 1.2 | 0 | none | `#000` | |
| Large body (`.text-size-large`) | `--t24` | 1.3 | 0 | none | | |
| Medium body (`.text-size-medium`, `.text-size-medium_hero`) | `--t20` | 1.3 | 0 | none (uppercase inside buttons) | | |
| Regular (`.text-size-regular`) | `--t16` | 1.3 | 0 | `caps` variant: uppercase | | |
| Small (`.text-size-small`, `_hero`, `_hero2`) | `--t14` | 1.3 | 0 | `caps` variant: uppercase | grey variant `#7A7A7A` | |
| Nav link (`.nav_link`) | `--t14` (14px at ≤991) | 1.0 | 0 | uppercase | `#000`, hover `#120DF7` | padding 4px 0 2px |
| Button label (`.button_v2 .text-size-medium`) | `--t20` | 1.3 | 0 | uppercase | `#000` | |
| Brand wordmark (`.brand`) | 14px | 1.0 | 0 | none | `#000` | two lines |
| Year label (vertical) | `--t16` | 0.9 | 0 | none | `#000` | rotated −90° |
| Client name (`.client_name`) | `--t14` (16px at ≤991, line-height 20.8px) | 1.3 | 0 | none | grey (desktop), black (≤991) | |
| Footer lines | `.text-size-small` inside `.footer_detail_block`: wrapper clamp(13, 5.517 + 0.7543vw, 20) is unused because children set their own size | | | | | |

### 0.3 Layout grid
- `.padding-global`: horizontal padding **32px** at ≥992, **20px** at 480–991, **16px** at ≤479. No vertical padding.
- `.container`: `max-width: 1648px`, centred. Content width is 1376 at 1440, 1216 at 1280, 951 at 991, 727 at 767 and 447 at 479.
- Almost every section uses a **6-column grid, gap 0**: `repeat(6,1fr)`. Columns are 229.33px at 1440, 202.67 at 1280 and 158.5 at 991. Column lines at 1440 (x from viewport left): 32, 261.3, 490.7, 720, 949.3, 1178.7, 1408.
- The fixed nav uses the same 6 columns, so nav links sit on the content column lines.

### 0.4 Vertical rhythm (section padding top/bottom, px)
| Section | ≥992 | 768–991 | ≤767 |
|---|---|---|---|
| hero header block | 240 / 192 (+40 info block bottom) | 240 / 192 | 160 / 128 |
| about | 112 / 112 | 96 / 96 | 96 / 96 |
| services | 112 / 112 | 96 / 96 | 96 / 96 |
| awards | 112 / 112 | 96 / 96 | 96 / 96 |
| media mentions | 112 / 112 | 96 / 96 | 96 / 96 |
| partners | 112 / 112 | 96 / 96 | 96 / 96 |
| testimonials | 112 / 112 | 96 / 96 | 96 / 96 |
| faq | 160 / 112 | 128 / 96 | 128 / 96 |
| blogs | 112 / 112 | 112 / 112 | 112 / 112 |
| contact | 240 / 80 | 96 / 96 | 96 / 96 |
| footer | 112 / 32 | 96 / 32 | 96 / 32 |

Measured section heights (px):

| Width | hero | work | about | services | awards | media | partners | testim. | faq | blogs | contact | footer | doc |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1440 | 663 | 3786 | 392 | 743 | 1324 | 553 | 879 | 581 | 549 | 1414 | 641 | 375 | 11900 |
| 1280 | 645 | 3463 | 415 | 724 | 1305 | 541 | 828 | 579 | 549 | 1324 | 610 | 365 | 11347 |
| 991 | 638 | 8151 | 376 | 700 | 1328 | 507 | 886 | 464 | 501 | 1297 | 457 | 523 | 15826 |
| 767 | 424 | 8338 | 376 | 700 | 1307 | 635 | 886 | 543 | 580 | 2438 | 475 | 511 | 17213 |
| 479 | 466 | 5555 | 457 | 700 | 1349 | 635 | 886 | 543 | 580 | 1828 | 447 | 776 | 14221 |

### 0.5 Shared components
**`button_v2`** (link with underline and sliding arrow): `display:flex; justify-content:space-between; align-items:center; position:relative; overflow:hidden; padding-bottom:2.4px; text-transform:uppercase`.
- Label: `.text-size-medium`.
- Arrow box `.btn_v2_arrow_wrapper`: 16×16 (14×14 at ≤991), `overflow:hidden`, `justify-content:flex-end`. It holds two arrows in a row:
  - `.arrow_mid.left`: blue right-arrow, sits just outside the box on the left.
  - `.arrow_mid.right`: black right-arrow, visible.
- `.button_line`: `position:absolute; left:0; right:0; bottom:0; height:1px; background:#000; width:100%`.
- Width is set by its grid cell, or by content for the services and contact variants.

**Diagonal-arrow pair** (work cards, awards, media, partner overlay):
- Box is 12px (work cards: `--t14` = 12.72px), `overflow:hidden`.
- `.default`: black NE arrow, in place.
- `.bottom`: blue NE arrow, `position:absolute; left:-100%; bottom:-100%` (outside the box, bottom-left).

**List row**: 1px `#CECECE` top border on the list container, and 1px `#CECECE` bottom border on each row.

---

## 1. Nav (`.nav.w-nav`)

### Layout at ≥992
- `position:fixed; top:0; left:0; right:0; z-index:998; background:#fff; height:44px; padding:0 32px`. No border and no shadow.
- **No scroll behaviour.** Measured at scrollY 0, 3000 (scrolling down) and 2500 (scrolling up): transform, background and opacity never change. It does not hide or show.
- Inner `.nav_wrapper` is a grid, 6 × 229.33 (at 1440), padding 8px 0, row height 28.
  - **Col 1**: `.brand`, a flex row with gap 8px.
    - Logo mark 16×24.875.
    - Wordmark: two lines, 14px / line-height 14px, block 80×28. `w=2, c=15`.
  - **Cols 2–7**: `nav.navigation`, `display:flex; justify-content:space-between; align-items:flex-end`. It holds 5 `.nav_link_wrapper`, each one column wide (229px). The link sits at the wrapper's left (x = 261, 491, 720, 949, 1179). Links 1–4 are single words of 4, 8, 5 and 4 characters.
  - **Link 5** (CONTACT, `c=7`) is different: `a.nav_link.contact` fills the full column width (229px).
    - Text on the left.
    - Arrow box `.contact_link_icon_wrapper` on the right, 12.72px. It holds black right-arrow `.default` and blue right-arrow `.left` (`.left` sits one box-width to the left, hidden).
    - Full-width 1px black `.button_line` at the bottom (y = 35).
- `.menu_button` is `display:none`.

### Tablet and mobile (≤991, Webflow `data-collapse="medium"`)
- No nav padding. `.nav_wrapper` is a flex row, space-between, centred.
- Brand has `margin-left:20px` (16px at ≤479).
- `.menu_button` has `margin-right:20px` (16px). It is a flex row with gap 8: the label "MENU" (14px / 18.2px, `c=4`) and a 10px menu glyph. When open: label `c=5` and a 10px close glyph, swapped with `display:none/flex` instantly.
- Menu panel `nav.navigation`:
  - White background, padding 40px 20px (16px at ≤479), border-bottom 1px `#CECECE`.
  - Full width, 224px tall, placed directly under the bar (top 44).
  - Links are stacked; each wrapper has `margin-bottom:8px`; each link is 14px, uppercase, 20px tall. The contact item includes its arrow and underline (23px tall).
- **Open animation** (Webflow nav "default", 400ms `ease`): the panel slides from `translateY(-224px)` to `0`. Samples:

  | t (ms) | translateY (px) |
  |---|---|
  | 100 | −232 |
  | 200 | −95 |
  | 300 | −26 |
  | 450 | 0 |

  `.w-nav-overlay` is transparent. Close is the reverse.

---

## 2. `section_hero`
`overflow:hidden; border-bottom:1px solid #CECECE`. Height is 663 at 1440 and 645 at 1280. It is not 100vh: height comes from content, but the intro animates from 90vh (see Motion).

### Structure at 1440
`.hero-element` is a flex column with two parts.

**`.hero_header_wrap`**: flex column, centred, padding 240px 0 192px. Height 547.
- `.hero_heading_contain`: flex row, `space-between`, `align-items:center`, width 100%, z-index 5. It holds **3 h1 words**:
  - `w1 c=8` at x 32, 346 wide
  - `w1 c=3` at x 555, 166 wide
  - `w1 c=11` at x 898, 510 wide
  - All 90px tall, so the three words span the full 1376 width.
- `.hero_subhead_block`: flex, `justify-content:flex-end`, directly under the h1 line (y 330). Subhead `w3 c=21`, right-aligned, 343×25.

**`.hero_info_block`**: flex row, space-between, `align-items:flex-end`, padding-bottom 40. Height 114.
- **Left**: `a.hero_btn` (flex, gap 8, align end). Label `.text-size-medium_hero` `w3 c=11` sets as 2 lines, 71×49. Then the NE arrow (16px source) rendered at 12.72px and rotated 90° (`matrix(0,1,-1,0,…)`, so it points down-right), `margin-bottom:3.36px`.
- **Right**: `.hero_address_wrapper`, flex column, `align-items:flex-end`, gap 4, text-align right.
  - Grey uppercase label `w2 c=22`, 2 lines, 91 wide.
  - Email link `c=28`.
  - Phone link `w2 c=13`.
  - All `.text-size-small_hero` (`--t14`).

### Breakpoints
- **991**: same structure. h1 is 56px. The three words are at x 20 / 373 / 594 (still space-between, `flex-wrap:wrap`). Subhead is 17px, right-aligned. Hero button text is 16px; arrow is 10px with `margin-bottom:4.8px`.
- **767**: header padding 160/128.
  - h1 is 50px, `justify-content:flex-start`, column-gap 14px, wrapping: word 1 and word 2 on line 1, word 3 starts line 1 at x 385 (fits). At 479 word 3 wraps to line 2.
  - Subhead is left-aligned.
  - `.hero_info_block` becomes `flex-direction:column-reverse`, gap 16.
  - `.hero_btn` is `display:none`.
  - The address wrapper becomes a row, space-between: email left, phone right. The grey label is hidden.
- **479**: h1 is 42.3px, lines at y 160 and 211. Hero height 466.

---

## 3. `section_work`
`position:relative; overflow:hidden`. Two grids, `.work_element_content_wrapper` (padding-top 40) and `.work_element_content_wrapper._2` (padding-top 24). Both are 6-column grids with gap 0, and the cards are placed explicitly. **10 cards plus a "see all" button.**

### Card anatomy (identical for all 10)
`a.work_card_*` is a flex column with three parts.

1. **Header** `.work_card_header_wrapper`: flex row, space-between, `align-items:flex-end`, gap 14, padding-bottom 10, `overflow:hidden`.
   - Title `.text-size-h2` (`--t32`).
   - Optional detail `.work_card_header_detail_wrapper`: right-aligned, `max-width:160px` (112px on the `.kulfi` variant), `.text-size-regular`, 2–3 lines.
2. **Image wrapper** `.work_card_image_wrapper` (`position:relative`).
   - `.project_image_wrap`: background colour fill, `overflow:hidden`.
   - Image inside at `width:100%; height:auto` (no object-fit; the box ratio comes from the image).
   - **Vertical year label** `.work_year_wrapper`: `position:absolute`, at the image's top-right outside edge. Inside it, `.proj_card_year_wrapper` is `position:absolute; top:10px; transform:rotate(-90deg)` and holds a 4-character year (`--t16`, line-height 0.9). It reads bottom-to-top, about 11px to the right of the image edge.
3. **Detail row** `.work_card_detail_wrapper`: flex row, space-between, `align-items:flex-end`, padding-top 10, `border-bottom:1px solid rgba(255,255,255,0)` (turns accent on hover).
   - Left: caption `.text-size-regular`, usually `.caps`.
   - Right: `.view_wrapper` with "VIEW" (`c=4`).
   - `.work_arrow_wrapper`: `position:absolute`, about 13px to the right of the row's right edge (outside the card column, `right:-23.5px`). Holds the 12.72px diagonal-arrow pair.

### Placement at 1440 (grid 1 row heights: 836.5 / 679.2 / 695.0 / 662.1)

| # | Class | Grid column / row | Offset | margin-bottom | Card box (x, y in section, w × h) | Title | Detail | Image (w×h, ratio) | Fill | Caption |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `work_card_portrait_hero` | 1/3 · 1 | – | 160 | 32, 40, 459×677 | w3 c19 | – | 459×601 (0.763) | #000 | caps w3 c20 |
| 2 | `work_card_landscape_right_hero` | 4/7 · 1, align start | – | 160 | 720, 40, 688×466 | w1 c9 | w6 c36 (2 lines) | 688×387 (16:9) | #0F2844 | caps w6 c48 |
| 3 | `work_card_landscape_left` | span 2 (auto → 1/3 · 2) | – | 192 | 32, 877, 459×487 | w2 c14 (2 lines, title wrapper 192px wide) | w3 c16 | 459×376 (1.219) | #000 | caps w1 c11 |
| 4 | `work_card_landscape_right` | 4/7 · 2 | `top:-192px` (relative) | 160 | 720, 685, 585×468 (width 85%) | w1 c8 | w8 c42 (2 lines) | 585×389 (1.503) | #6165AF | not caps, w1 c11 |
| 5 | `work_card_landscape_left` | 1/4 · 3 | – | 160 | 32, 1556, 688×422 | w2 c16 | w4 c26, max-width 112 | 688×344 (2:1) | #3E7170 | caps w1 c11 |
| 6 | `work_card_portrait` | 5/7 · 3 | `top:-280px` | 0 | 949, 1276, 459×695 | w3 c19 | w5 c40 (3 lines, max-width 112) | 459×597 (0.768) | #FF7136 | caps w1 c11 |
| 7 | `work_card_landscape_left` | 1/4 · 4 | `top:-80px` | 0 | 32, 2171, 688×476 | w2 c14 | w4 c21 | 688×400 (1.718) | #FB9920 | caps w1 c11 |
| 8 | `work_card_landscape_right` | 5/7 · 4 | `top:-96px` | 128 | 949, 2155, 459×534 | w3 c15 | none | 459×459 (1:1) | #193526 | caps w3 c19 |
| 9 | `work_card_portrait` (grid 2) | 1/3 · 1 | – | 80 | 32, 2937, 459×630 | w2 c12 | w6 c52 (3 lines) | 459×533 (0.861) | #193526 in #5B5B45 | caps w2 c12 |
| 10 | `work_card_landscape_right` (grid 2) | 4/7 · 1 | – | 160 | 720, 2937, 688×438 | w3 c14 | w7 c50 (3 lines) | 688×340 (2.022) | #176C77 | caps w1 c11 |
| – | `see_all_work_wrapper` | 4/5 · 2 | – | padding-bottom 112 | 720, 3647, 229 wide | `button_v2` label w3 c12 | | | | |

Notes:
- All titles are `--t32` regular. Header heights: 45 for one line, 48 when the detail runs 2 lines, 67 for 3 lines.
- At 1280 the layout is identical, with columns of 202.67 (cards 405 / 608 / 517 wide).

### Breakpoints
- **991**: both wrappers become `display:flex; flex-direction:column; gap:160px`. Work wrapper padding-top 40; grid 2 padding 24 / 80. Cards in order:
  - #1: 476 wide with `margin-left:449.5px` (pushed right)
  - #2: 713
  - #3: 496 (capped by image intrinsic width)
  - #4: 808
  - #5: 951
  - #6: 479 (intrinsic cap)
  - #7: 951
  - #8: 951 (image 951 square)
  - #9: 476 with `margin-left:449.5px`
  - #10: 713
  - Titles 24px, regular text 14.4px, header layout unchanged.
  - "See all" button: inside a 3-column grid, 317 wide.
- **767**: same column flow with gap 160; wrapper starts at padding-top 160 with padding-bottom 160.
  - Card widths: 701 (= content − 26 to leave room for the year label), except #3 at 496, #4 at 618, #6 at 479.
  - Header becomes `flex-direction:column; align-items:flex-start; gap:4px; padding-bottom:12px`. The detail drops under the title and is left-aligned. Detail row padding-top 12, caption left-aligned.
- **479**: `.work_element` padding-top 80. Wrappers: gap 80, padding-bottom 80.
  - Every card is 421 wide (447 − 26).
  - Header padding 12px 12px 12px 0, column layout.
  - Year labels and arrows stay visible.
  - "See all" button is full width (447).

---

## 4. `section_about_us`
`.about_us_v2.on_home`: 6-column grid, padding 112/112, `align-items:start`. Row heights at 1440: 141.4 / 26.7.

| Slot | Grid | Size at 1440 | Text |
|---|---|---|---|
| Caps statement (`div.text-size-h2.caps`) | col 1 | 229 × 141 (4 lines) | w5 c35 |
| Paragraph `.text-size-large.long_para` | 4/7 · row 1 | 688 × 59 (2 lines) | w19 c125 |
| `.about-btn_wrapper` → `button_v2` | 4/5 · row 2, align-self end | 229 × 27 | label w3 c14 |

- **≤991**: flex column, gap 40, padding 96/96. The statement is one line (24px), the paragraph is full width (20px). The button wrapper is a 3-column grid with gap 16, so the button is 306 wide at 991.
- **479**: the statement runs 2 lines and the button is full width (447).

---

## 5. `section_services_v2`
`.services_element_v2`: 6-column grid, padding 112/112. **Only `.services_block` (cols 1/3, 459 wide) is filled; cols 3–6 are empty.**
- `.services_block` is a flex column with gap 40:
  1. `h2.caps`, w3 c12.
  2. `.services_detail_wrapper_v2`, with `border-top:1px #CECECE`:
     - **4 `.service_wrapper` rows**. Each row: flex, space-between, `align-items:flex-start`, padding 12/12, `border-bottom:1px #CECECE`, 91px tall.
       - Left: `.service_item_wrap`, `max-width:208px`, flex column, gap 3.2px. Holds a title (`.text-size-large`, w2 c12) and a grey `.text-size-small` line (w8 c43, 2 lines).
       - Right: index number (`.text-size-large`, `c=2`).
     - `a.button_v2.services`: content-width (211 at 1440), `margin-top:40px`, padding 2.4px 0, label w2 c10.
- **991**: block is 476 wide (still cols 1/3 of the 6-column grid). **≤767**: flex column, block full width.

---

## 6. `section_awards`
`.awards_element_v2`: padding 112/112.

1. **`.awards_info_header`**: 6-column grid, padding-bottom 112. `.text-size-medium.long-para` sits in col 1 (229 wide, 4 lines), about w13 c70.
2. **`.awards_list_detail_grid`**: 6-column grid.
   - `.awards_header_element`: span 2, 320 wide, padding-bottom 80. Holds `h2.caps` w1 c8.
   - `.awards_list`: span 4 (cols 3–6, 917 wide), flex column, **gap 112**. It holds **4 `.awards_list_item_v2` groups**.
     - Each group: 4-column grid, padding-bottom 24.
       - `.award_wrapper` (col 1, 229 wide): flex row, gap 8. Holds a 40×40 logo slot and a name block: `.text-size-medium` (w1 c8) over grey `.text-size-small` (w2 c17).
       - `.award_winner_list` (span 3, 688 wide): `border-top:1px #CECECE`, flex column.
         - Rows `a.award_winner_item`: 3-column grid (229 each), `align-items:center`, padding 8/8, `border-bottom:1px #CECECE`, **41px tall**.
           - Col 1: `.text-size-medium` black, w2 c14.
           - Col 2: `.text-size-medium.color-grey`, `justify-self:end`, w3 c13.
           - Col 3: 12px diagonal-arrow pair, `justify-self:end`.
     - **Row counts per group: 5, 2, 3, 1 (11 rows total).**

Breakpoints:
- **991**: `.awards_info_header` padding-bottom 40; the paragraph spans 476 (2 lines). The detail grid becomes a flex column: header (padding-bottom 40), then `.awards_list` (476 wide, gap 40). Each group is a flex column, gap 40: the award name block on top, then the list (rows 38px, columns 158.5).
- **767 / 479**: same, at full width (727 / 447).

---

## 7. `section_media_mentions`
`.media_mentions_wrapper`: 6-column grid, padding 112/112. `.media_mentions_element` sits at **cols 3/7** (917 wide) and is a 4-column grid:
- **Header** `.media_mentions_header_wrapper` (span 2, `max-width:288px`): flex column, gap 8. Holds `h2.caps` (w2 c14) and `.text-size-medium` (w9 c53, 2 lines).
- **List** `.media_mention_list` (span 2, 459 wide): `border-top:1px #CECECE`.
  - **4 `a.media_mention_item` rows**: flex, space-between, padding 12/12, `border-bottom:1px #CECECE`. Row heights 70, 70, 94, 94.
    - Content column (gap 4): title `.text-size-medium` (w4 c36; items 3–4 wrap to 2 lines) and grey `.text-size-small` (w1 c11).
    - 12px arrow pair on the right.

Breakpoints:
- **991**: the wrapper is flex; the element spans the full 951 width as a 4-column grid. Header at cols 1–2, list at x 496 (476 wide).
- **≤767**: element is a flex column, gap 40.

---

## 8. `section_partners_v3`
`.partners_element_v2`: padding 112/112.
1. Header: `h2.caps`, w1 c7. Block is 480 wide, padding-bottom 40.
2. **3 rows** `.partner_list_image_grid`: 6-column grid, padding-bottom 16, `align-items:start`. Each row has **5 tiles (15 total)**.
   - Tile `.partner_image_item_wrapper`: flex column, `align-items:center`, gap 4, text-align center, 114.66 wide (half a column).
     - `.partner_image_item`: square 114.66 × 114.66, relative, `overflow:hidden`. Holds the 1:1 logo image and a number overlay `.partner_image_number_wrapper` (`position:absolute; top:0; left:0; padding:4px 0 0 4px`) with a white `.client_name` (`c=2`).
     - Under the square: grey `.client_name`, 2–5 words, about 11 chars (some wrap to 2 lines, making the tile 152 tall instead of 135).
   - Tile placement (column / justify-self):

     | Row | Tiles |
     |---|---|
     | 1 | c1 start, c2 start, c3 start, c5 **end**, c6 **end** (c4 empty) |
     | 2 | c1 end, c2 end, c3 end, c4 end, c6 **start** (c5 empty) |
     | 3 | c1 start, c2 start, c4 start, c5 start, c6 end (c3 empty) |

3. `.partner_list_detail_grid`: 6-column grid. `.clients_btn_wrapper` sits at **col 5 / row 2**, padding-top 40, and holds a `button_v2` (229 wide, label w3 c15).

Breakpoints (≤991):
- Images are `display:none`.
- Each row grid (3 columns at 991, 2 at ≤767) stacks tiles as full-width text rows: each tile is a flex row, `align-items:center`, gap 4, padding 8, 37px tall.
  - Number box is 24px wide, static, black.
  - Name is black, 16px, line-height 20.8.
- The button cell is the first column (317 wide at 991; 224 at 479).

At 1280 the squares are 101.33px.

---

## 9. `section_testimonials`
`.testimonial_element`: 6-column grid, padding 112/112.
- `.testimonial_header` (cols 1/3, padding-bottom 40): `h2.caps`, w1 c12.
- `.testimonails_wrapper` (cols 1/3, row 2, 459 × 272): Webflow slider `.w-slider` with a transparent background.
  - Mask: `overflow:hidden`, `border-bottom:1px #CECECE`, 272 tall.
  - **6 slides**, laid out side by side at 459px each.
    - Slide content: flex column, gap 32, padding-bottom 4.
    - Quote: `.text-size-medium.long-para`, about w44 c272–277. That is 7 lines at 459 wide (170px), 4 lines at 634 wide.
    - Author: grey `.text-size-small`, w4 c23.
  - **Arrows** are absolutely positioned below the mask (`top:300.9px`). Each is 61 × 19, flex, gap 8, uppercase, `overflow:hidden`:
    - Left `PREV`: 14px icon box, then the label.
    - Right `NEXT`: label, then the icon box.
    - Labels are `.text-size-regular.caps` (`c=4`).
    - The prev icons are the right-arrow rotated 180°.
  - Dots: `.w-slider-nav` is `display:none`.
- Slider settings: `data-animation="outin"`, `data-duration="500"`, `data-easing="ease"`, `data-autoplay="false"`, `data-infinite="true"`, swipe enabled, arrows shown.

Breakpoints:
- **991**: the slider moves to the right, at x 337 (cols 3/7, 634 wide), on the same row as the header.
- **≤767**: flex column.

---

## 10. `section_faq`
`.faq_element`: padding 160/112. `.faq_detail_grid` is a 6-column grid:
- `.faq_header`: col 3/4, padding-bottom 80. Holds `h2.caps`, w1 c5.
- `.faq_items_wrapper`: span 3 (cols 4–6, 688 wide), flex column, gap 8. **5 `.faq_item`s.**
  - Each item: padding-bottom 16, `border-bottom:1px #CECECE`, `cursor:pointer`. Closed height 49.
  - `.faq_item_header`: 4-column grid, 32px row.
    - `.faq_item_header_wrapper` (span 3): flex, `align-items:center`. Holds the index `.text-size-medium` (`c=2`, in a 40px-wide box) and the question `.text-size-medium` (w4–7, c16–38, single line).
    - `.faq-toggle`: 32×32, `justify-self:end`, flex centre. Two stacked icons at `--t20` (18.73px): the minus icon is absolute underneath, the plus icon is on top.
  - `.faq_item_detail`: `height:0; overflow:hidden`. Inner padding 8px 40px 0 40px. Answer is `.text-size-regular`: item 1 w22 c140, the others w26–38 (2–3 lines at 608 wide).

Breakpoints:
- **991**: header at col 1 (476 wide), items at x 496 (476 wide). Icons 16px.
- **≤767**: flex column; header padding-bottom 40.

---

## 11. `section_blogs`
`.blog_element_home`: padding 112/112.
- Header: `h2.caps`, w1 c5, padding-bottom 24.
- Collection grid: 6 columns, **row-gap 160**, column-gap 0, rows 480.2 each. **3 cards**, placed in a staggered layout:
  - Card 1: col 1/3, row 1 (x 32)
  - Card 2: col 2/4, row 2 (x 261)
  - Card 3: col 5/7, row 2 (x 949)
  - Row 1 cols 3–6 are empty.
- Card `a.blog_page_card_item_wrapper-copy`: flex column, gap 24, padding 16/16, 459 × 480.
  1. `.blog_card_header_wrapper` (flex column, gap 10):
     - `.blog_image_wrapper` 459 × 344 (4:3), `overflow:hidden`.
     - Heading `.text-size-medium`, w9 c53 (2 lines).
  2. A `button_v2`-styled row (not a link of its own; the whole card is the link), full card width: `.text-size-regular` label (w2 c9) plus a 16px right-arrow pair in `.blog_arrow_wrapper`, with a 1px underline.

Breakpoints:
- **991**: 2 columns of 465.5, column-gap 20, row-gap 96. Cards 1 and 2 on row 1, card 3 on row 2, col 1.
- **≤767**: 1 column, row-gap 96. Cards are 653 tall at 767 and about 443 tall at 479.

---

## 12. `section_contact`
`.contact_element`: 6-column grid, padding 240/80.
- `.contact_element_wrapper` spans all 6 columns: flex column, `align-items:center`, gap 24, text-align center.
  - `.contact_heading_wrapper`: 676 wide. Holds **3 stacked display lines** (`h2.contact_heading`, `--display`), each 90 tall: `c=15` (about 3 words), `c=9` (1 word), `c=6` (1 word).
  - `a.button_v2.contact`: 192 wide, label w3 c12.
- **≤991**: padding 96/96, gap 40.

---

## 13. `section_footer`
`.footer_element`: 6-column grid, padding 112/32, `align-items:end`.

| Block | Grid | Contents |
|---|---|---|
| `.footer_block.brand` | span 2 (459 × 231) | flex column, `justify-content:space-between`. **Top**: "partner credits" trigger `.partners_element_v3` (flex, gap 16, uppercase): `.text-size-small` label (w2 c11), 16px plus icon in an arrow box, 1px black underline; 131 wide. **Bottom**: `.brang_wrapper_footer` (flex column, gap 8): brand (logo and wordmark, 104 × 28, margin-bottom 4), badge image 128 × 26, grey `.text-size-small` (w4 c21). |
| `.footer_block` (address) | span 2 (cols 3–4) | `.footer_detail_block` (flex column, gap 8): grey label (w1 c8), then 3 `.text-size-small` lines (w10 c59 over 2 lines, about c35, c20). |
| `.footer_block.products` | col 5 | grey label (w2 c12) and 3 uppercase `nav_link`s (c9, c14, c9), gap 4. |
| `.footer_block.right_align` | col 6 | flex column, `align-items:flex-end`, gap 16, text-align right. **Group 1**: grey label (c8) and 6 nav links (c4, c4, c8, c5, c4, c7). The first is the current page, coloured `#120DF7`. **Group 2**: grey label (c8) and 2 links (c9, c8). Inside groups, gap 4. |

Links use the `.nav_link` style (`--t14`, uppercase, padding 4/2), with the same hover to `#120DF7`.

Breakpoints:
- **991 and 767**: 2 rows.
  - Row 1: address (cols 1–3) and the right block (cols 4–6, right-aligned).
  - Row 2: brand block (`margin-top:40px`, cols 1–3) and products (right-aligned, `align-items:flex-end`).
- **479**: single column. Order: address, sitemap/socials (left-aligned, padding-top 24), products (left-aligned, padding-top 24), brand block (margin-top 40).

**Partner credits overlay** (opens from the footer trigger):
- Hidden `.partners_list_wrapper-copy`: `position:fixed; inset:0; z-index:999; background:rgba(0,0,0,.5); display:none`, then flex when open.
- Inner `.partners_list_element`: a white panel, 917 wide at 1440, anchored bottom-left (x 32, y 169, h 698), revealed by a white `.partner_white_cover` that scales from the top-right.
- Contents:
  - Heading `.text-size-h2` (w2 c11) and a paragraph (w16 c88).
  - A list of **4 `a.partner_link` rows**. Each row: padding 16/16, `border-bottom:1px #CECECE`. Holds a 64px logo, a name block (`.text-size-medium` w1 c8 plus grey `.text-size-regular` w7 c50, `max-width:70%`) and a 12px arrow pair.
  - A blue X close button at the top-right of the panel.
- Motion is in §14.4.

`section_cta` exists but has `display:none` (`.section_cta.hide`). It is skipped.

---

## 14. Motion

### 14.1 Libraries and smooth scroll
- Loaded libraries:
  - Webflow's GSAP 3.15.0, ScrollTrigger and SplitText (used by IX3)
  - jsdelivr `gsap@3.12.5` and `ScrollTrigger@3.12.5` (overwrite `window.gsap`; `gsap.version` reports 3.12.5)
  - `lenis@1.1.18`
  - jQuery 3.5.1 and Webflow IX2 (hovers and clicks)
- IX3's ScrollTriggers register on the global `ScrollTrigger` (`ScrollTrigger.getAll()` returns them all, about 190 at 1440). There are no custom GSAP tweens beyond IX3.
- **Lenis init**, verbatim options from the inline script. No `lerp`, so duration-mode applies.
  ```js
  const lenis = new Lenis({ duration: 1.5, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ```
  In Lenis 1.1.x `smoothTouch` is ignored; the equivalent is `syncTouch:false`, which is the default. `html` gets class `lenis`, and `scroll-behavior` is `auto`. wheelMultiplier, orientation and the other options are defaults.
- **None found**: no marquee or infinite scroll, no custom cursor, no pinning, no scrub, no parallax, no CSS `@keyframes`, no `document.getAnimations()` at rest, no video.

### 14.2 IX3 conventions (apply to every row in the table)
- **Easing codes**:
  - `0` = `none`
  - `2` = `power1.out`
  - `20` = `circ.out`
  - Unspecified ease = GSAP default `power1.out` (IX3 does not apply an ease when none is set)
- Default duration when unspecified: **0.5s**. Every tween is `fromTo`.
- **ScrollTrigger**: `start`/`end` are wrapped in `clamp()`. `toggleActions: "play none none none"`, so the tween plays once on enter and never reverses or replays. No scrub, no pin. `end` has no effect with these actions.
- **One trigger per element**: each element with the trigger class gets its own ScrollTrigger and its own timeline. "self" in the table means the trigger element itself; "child X" means descendants of the trigger with class X.
- **Breakpoint gating**: every scroll interaction and the load timeline are `dont-animate` on **small (480–767) and tiny (≤479)**. Below 768 everything renders statically in its end state, with no SplitText.
  - Exception: `work_card_header_wrapper` is disabled on `small` only, so it still fades in on tiny (≤479).
- **SplitText** (IX3 → GSAP SplitText). Generated classes:
  - `gsap_split_word` (inline-block)
  - `gsap_split_letter` inside `gsap_split_letter-mask` (inline-block, `overflow:clip`) when `mask:"chars"`
  - `gsap_split_line` inside `gsap_split_line-mask` when `mask:"lines"`
- **Stagger**: `{amount}` is the total spread across all targets; `from:"random"` where noted.

### 14.3 Page-load intro (IX3 `wf:load`, home page only, ≥768)
Positions are seconds on the timeline. On the live site the timeline starts about 1.35–1.45s after navigation, once IX3 initialises.
- **Original FOUC**: from about 0.45s to 1.4s the page shows fully rendered, then IX3 sets every from-state and the intro plays. For the replica, apply from-states before first paint and keep the same timeline.

| Pos | Target | From → To | Dur | Ease | Stagger / split |
|---|---|---|---|---|---|
| 0 | `.section_hero` | opacity 0 → 1 | 0.5 | circ.out | – |
| 0 | `.hero_heading_contain` (the 3 h1s) | opacity 0 → 1 | 0.5 | none | **SplitText chars, mask chars**; stagger amount 0.5, from random |
| 1.25 | `.hero_heading_contain` | width 86% → 100% (scale 1 → 1) | 0.8 | circ.out | – (measured 1183 → 1376px) |
| 1.27 | `.hero_header_wrap` | height 90vh → auto (810 → 547px at 1440×900) | 0.8 | circ.out | – |
| 1.59 | `.nav` **and** `.hero_info_block` | opacity 0 → 1 | 0.68 | power1.out (default) | SplitText chars, mask chars; amount 0.5, random. This affects every text node in the nav: logo wordmark, links, menu label. |
| 1.75 | `.hero_subhead` | opacity 0 → 1 | 0.41 | circ.out | SplitText chars, mask chars; amount 0.5, random |
| 1.86 | `.work_card_header_wrapper_hero` (both hero cards) | opacity 0 → 1 | 0.5 | power1.out | SplitText chars, mask chars; amount 0.5, random |
| 1.88 | `.work_card_portrait_hero` (card 1) | opacity 0 → 1, y 8rem → 0 (128px) | 1.0 | circ.out | – |
| 1.88 | `.work_card_landscape_right_hero` (card 2) | opacity 0 → 1, x 5rem → 0 (80px) | 1.0 | circ.out | – |
| 1.88 | `.project_img_hero` | opacity 0 → 1, scale 1.1 → 1 | 1.01 | circ.out | – |
| 1.89 | `.proj_card_year_wrapper_hero` | opacity 0 → 1, y 200% → 0 (in rotated space) | 0.99 | circ.out | – |
| 1.91 | `.logo_img` | opacity 0 → 1 | 0.5 | circ.out | – |
| 2.20 | `.hero_btn_arrow_icon` | opacity 0 → 1, x −100% → 0, y −100% → 0 | 0.64 | circ.out | – |
| 2.22 | **every** `.button_line` on the page (`transformOrigin: 0% 50%`) | width 0% → 100% | 1.0 | circ.out | – |
| 2.93 | `.contact_link_icon` (nav CONTACT arrows) | opacity 0 → 1, x −100% → 0 | 0.64 | circ.out | – |

The intro finishes at about t = 3.57s (about 5.0s wall clock on the original). The sampled curves match the table: hero bg opacity reaches 1 at 0.5s, the wrap height eases 810 → 547 over 0.8s, and the line width grows 0 → 229 over 1s.

### 14.4 Scroll-triggered reveals (IX3 `wf:scroll`, ≥768)
| Trigger (each instance) | Count on home | start / end | Tweens (target: from → to, dur, ease, position) |
|---|---|---|---|
| `.work_card_image_wrapper` | 8 | top 95% / top 70% | self: opacity 0 → 1, 0.5, none, @0. Child `.project_img`: opacity 0 → 1 and scale 1.1 → 1, 0.8, none, @0.2 |
| `.work_card_portrait` | 2 | top bottom / bottom top | self: y 8rem → 0, 1.0, circ.out |
| `.work_card_landscape_left` | 3 | top bottom / bottom top | self: x −5rem → 0, 1.0, circ.out (no opacity) |
| `.work_card_landscape_right` | 3 | top bottom / bottom top | self: x 5rem → 0, 1.0, circ.out (no opacity) |
| `.work_card_header_wrapper` | 8 | top 100% / top 70% | self: opacity 0 → 1, 1.0, none (runs on tiny too) |
| `.work_card_detail_wrapper` | 10 | top 100% / top 70% | self: opacity 0 → 1, 1.0, none. Child `.work_arrow_icon` (both): opacity 0 → 1, x −100% → 0, y 100% → 0, 1.0, circ.out |
| `.proj_card_year_wrapper` | 8 | top bottom / top 70% | self: opacity 0 → 1, y 200% → 0, 1.0, none |
| `.text-size-large.long_para` (about) | 1 | top bottom / top 70% | self: opacity 0 → 1, 1.0, circ.out |
| `.text-size-h2.caps` | 8 | top bottom / top 70% | self: opacity 0 → 1, 1.0, circ.out |
| `.text-size-medium` (every instance, incl. inside buttons, lists, FAQ) | 48 | top bottom / bottom top | self: opacity 0 → 1, 1.0, none |
| `.text-size-medium.long-para` (awards intro, testimonial quotes) | 4 | top bottom / bottom top | **SplitText lines** (no mask): opacity 0 → 1, 1.0, none, stagger amount 0.5 |
| `.button_v2` | 9 | top bottom / top 70% | button: opacity 0 → 1 and width 50% → 100%, 1.0, circ.out. Child `.button_line`: width 0% → 100%, 1.0, circ.out. Child `.btn_v2_arrow_wrapper`: opacity 0 → 1, x −200% → 0, 1.0, circ.out |
| `.service_wrapper` | 4 | top bottom / top 70% | self: opacity 0 → 1, 1.0, none; plus width 20% → 100%, 1.0, circ.out (both @0) |
| `.award_wrapper` | 4 | top bottom / bottom top | child `.award_image_wrapper`: scale 0 → 1, 0.8, circ.out, @0. Child `.text-size-medium`: opacity, 1.0, none, @0.14. Child `.text-size-small.color-grey`: opacity, 1.0, none, @0.34 |
| `.award_winner_item` | 11 | top bottom / bottom top | self: opacity 0 → 1 and width 50% → 100%, 1.0, circ.out |
| `.media_mention_item` | 4 | top bottom / bottom top | self: opacity 0 → 1 and width 50% → 100%, 1.0, circ.out |
| `.partner_list_image_grid` (each row) | 3 | top bottom / bottom top | child `.partner_image_item`: opacity 0 → 1 and scale 0 → 1, 0.5, circ.out, stagger amount 1 from random. Child `.client_name`: opacity 0 → 1, 0.49, none, stagger amount 1, @0 |
| `.testimonial_left_arrow` | 1 | top bottom / bottom top | self: opacity 0 → 1, x 200% → 0, 1.0, circ.out |
| `.testimonial_right_arrow` | 1 | top bottom / bottom top | self: opacity 0 → 1, x −200% → 0, 1.0, **power1.out** |
| `.faq_item` | 5 | top bottom / bottom top | self: opacity 0 → 1 and width 50% → 100%, 1.0, circ.out |
| `.blog_image_wrapper` | 3 | top bottom / bottom top | self: opacity 0 → 1, 0.8, none, @0. Child `.blog_img`: opacity 0 → 1 and scale 1.25 → 1, 0.8, circ.out, @0.11 |
| `.contact_element_wrapper` | 1 | **top 90% / top 60%** | `.contact_heading.lets_create` (line 1): **SplitText lines, mask lines**; opacity 0 → 1, x 5rem → 0, y 200% → 0; 1.01, circ.out, @0.1, stagger amount 1. `.contact_heading.something` (line 2): same but x **−5rem** → 0, 1.01. `.contact_heading.pretty` (line 3): same as line 1, 1.0 |
| `.footer_block` | 4 | top bottom / bottom top | self: **SplitText chars** (no mask): opacity 0 → 1, 1.0, none, stagger amount 0.5 from random |

Defined but not present on the home page: `partner_list_item`, `blog_card_item_wrapper`, `contact_form_block`, `work_card_portrait.bare_bones`.

### 14.5 Hover and click interactions (Webflow IX2; run at every breakpoint)
All IX2 eases are `cubic-bezier(0.165, 0.84, 0.44, 1)` (easeOutQuart). On hover-out, the "snap" steps jump instantly (0ms) to the reset state. The sampled timings below confirm the config.

| Element | Hover in | Hover out |
|---|---|---|
| `.nav_link` (all nav and footer links) | CSS `:hover { color:#120DF7 }`, **instant** (no transition) | instant back to `#000` |
| Nav CONTACT link (a-33) | Text goes accent instantly (CSS). `.button_line` bg `#000` → `#120DF7` 500ms. `.contact_link_icon.default` translateX 0 → 100% 500ms. `.contact_link_icon.left` translateX 0 → 100% 500ms, delay 200ms (the blue arrow slides in from the left as the black one exits right). | line back to `#000` 500ms; icons snap to 0 |
| `.button_v2` links (a-12/13) | Label colour `#000` → `#120DF7` 500ms. `.button_line` bg → `#120DF7` 500ms. `.arrow_mid.right` (black) translateX 0 → 100% **300ms**. `.arrow_mid.left` (blue) translateX 0 → 100% **300ms, delay 250ms**. | colours back to `#000` 500ms; arrows snap to 0 |
| Blog card (a-27/28), whole card | Same as `button_v2` on its inner row: `.button_line` and `.text-size-regular` → accent 500ms; `.arrow_mid.default` 0 → 100% 300ms; `.arrow_mid.left` 0 → 100% 300ms, delay 250. **No image zoom.** | same as button |
| Work card (a-14/15) | `.work_card_detail_wrapper` border-bottom-color `rgba(255,255,255,0)` → `#120DF7` 500ms. `.work_arrow_icon.default` translate(0,0) → (100%, −100%) 300ms (exits top-right). `.work_arrow_icon.bottom` (blue, parked at −100%/−100% bottom-left) translate → (100%, −100%) 300ms, delay 250ms. No image or card transform. | border → transparent 500ms; arrows snap |
| `.award_winner_item` (a-16/17), `.media_mention_item` (same list), `.partner_link` in the overlay (a-29/30) | Row border-bottom `#CECECE` → `#120DF7` 500ms. NE arrow pair as the work card (300ms, then 300ms with delay 250ms). | border → `#CECECE` 500ms; arrows snap |
| Slider NEXT (a-23/24) | Label colour → `#211CF7` 500ms. `.slider_icon.default` translateX 0 → 100% 300ms. `.slider_icon.left` (blue) 0 → 100% 300ms, delay 250. | colour → `#000` 500ms; icons snap |
| Slider PREV (a-25/26) | Icons are rotated 180°. Label → `#211CF7` 500ms. `.prev.default` translateX 0 → −100% 300ms. `.prev.right` 0 → −100% 300ms, delay 250. | **Quirk in the original**: the hover-out sets the label to `#211CF7` again, so PREV stays blue after the first hover (measured). Icons snap. Reproduce or fix as you prefer. |
| Hero "things we did" button, partner-credits trigger | no hover effect | – |

Clicks:
- **FAQ** (a-4 open / a-5 close, first and second click on `.faq_item_header`):
  - Open: `.faq_item_detail` height 0 → auto **500ms** easeOutQuart, and `.faq_add_icon` scaleY 1 → 0 500ms. The plus collapses into the minus that sits underneath.
  - Close: height → 0 and scaleY → 1, 500ms.
  - Items are independent; several can be open at once (verified).
  - Measured open heights: 0 → 28 → 39 → 44 → 46px at 0/100/200/300/500ms.
  - All items start closed.
- **Testimonial slider** (Webflow `outin`, 500ms `ease`):
  - On NEXT, the current slide's opacity goes 1 → 0 over about 250ms (`transition: opacity .25s`).
  - Then the incoming slide (already translated into place, x −459px) fades 0 → 1 over the next about 250ms (opacity 0.05 at 300ms, 0.99 at 500ms).
  - No horizontal sliding is visible.
  - Infinite loop, no autoplay.
- **Mobile menu**: see §1. Open/close label and icon swap instantly.
- **Footer partner credits** (a-18 open / a-22 close):
  - On click, the overlay becomes `display:flex` (backdrop `rgba(0,0,0,.5)`, appears instantly).
  - `.partner_white_cover` scale 0 → 1 over 800ms, origin top-right.
  - The 4 `.partner_link` rows animate width 50% → 100%: row 1 over 800ms; rows 2–4 over 1000ms with delays 200, 400 and 600ms.
  - `.partners_items_wrapper` opacity 0 → 1 over 400ms, delay 600ms.
  - All eases are easeOutQuart.
  - Close is instant: everything resets and the overlay hides.

### 14.6 Not present / not applicable
- Nav hide/show on scroll: none.
- Sticky or pinned sections: none.
- Scrubbed or parallax motion: none.
- Marquee: none.
- Cursor follower: none.
- Image hover zoom: none.
- Lottie, video, canvas: none.

---

## 15. Could not measure / caveats
- Lenis runtime options cannot be read from the live instance: it is a `const` inside a `DOMContentLoaded` closure and is not on `window`. The options above are taken verbatim from the page's inline script, which is what that instance receives.
- IX3 timelines are not exposed through `ScrollTrigger.getAll()[i].animation` (that returns `null`, because IX3 drives its own timelines). From/to/duration/ease/stagger come from the IX3 registration JSON in the Webflow bundle and were spot-checked by sampling computed styles: the intro table and the hover/FAQ/slider/overlay timings were all measured.
- Exact per-character random stagger order is not reproducible; it is `from:"random"`.
- The mobile menu panel's internal link layout was measured at 767 only. The 991 and 479 values are identical apart from the gutters (20 vs 16).
- Text counts for SplitText-processed slots (awards intro, testimonial quotes, contact lines) are character counts. Word counts for those were taken at ≤767, where splitting does not run.
- Partner tile names at ≤991 render black. That colour was derived from inheritance (the computed value equals the parent's), not from an explicit rule.
