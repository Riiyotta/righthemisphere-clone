# Changelog

## 1.1.0 (design-review-pending): live-vs-clone parity measured

Added the missing R12 evidence. Approval is a human decision based on it; nothing here is approved.

- Harness: `extraction/parity_capture.mjs`, `parity_compare.py`, `parity_geometry.py`, `parity_record.py`. Record: `extraction/parity-results.json` (per route and section `rawPct` gated at 80 with pixel threshold 24/255, `inkPct`, `geoPct`, `maskedPct`, run-2 value, capture state, sha256 pins) and `extraction/parity-geometry/` (four text-free geometry dumps; no screenshot is committed). `measured-values.json` `parity` is now the real summary (measured true) instead of `measured: false`.
- Measured 18 routes plus the 404 probe at 1440x900 (154 sections) and home / one blog post / one case study at 390x844 (30 sections), twice. Mean raw 98.8 (1440) and 96.6 (390); every section is at or above 80 except one (below). Run-to-run max delta 1.9, live-vs-live control min 98.1.
- One exception: `/` 390x844 `editorial.blog-card-grid` raw 62.1 (recorded pending; approved as deliberate by the owner on 2026-11-06 in extraction/parity-approvals.json). The live site shows 3 random CDN-cached posts; the clone pins a different three. Layout matches (geo 100.0 / 99.2). Not pinned to one draw.
- Lottie players and iframes are masked on both sides (up to 90.6% of a section; see README); animated GIFs frozen on frame 0.
- The clone ships the studio's REAL copy, logos and photos, so raw parity is meaningful and proves nothing about generated-mode output. The real-studio-branding, sensitivity and generated-mode protections are unchanged.
- Real clone mismatches fixed in `src/`: case-study copy alignment (`pages.css`), wrapped FAQ rows on narrow viewports (`tailwind.config.js` `gridTemplateRows.faq`, `Faq.jsx`). FAQ heights at 768 / 390 re-measured (501 -> 520, 580 -> 599); `responsiveHeights` and `content.faq-accordion` contract heights updated; the 1440 heights are unchanged. Three citations re-pointed (the `faq` token now cites `Faq.jsx`); `protected-content.json` re-derived (one shingle fewer).
- `verify_all.py` PARITY check (pins threshold 24 and gate 80 in code and results, sha256 of scripts and dumps, geoPct recomputed from the dumps, averages and means recomputed, route coverage, exception rules, measured-values summary equality, no screenshots, no browser-tool citations); 20 drift cases in `prove_drift.py`.
- IR left untouched by request; no IR file or schema was edited.

Still not done: no human review or approval of the parity result or the exception; Lottie / iframe regions are not pixel-measured; pixel and ink numbers cannot be recomputed from the repo (live screenshots are not committed); one capture date.

## 1.0.1 (design-review-pending): reconciled with clone commit 7335551

The clone moved on one commit ("Match original social tags and heading weights": `index.html`, `src/Router.jsx`,
`src/components/shared/head.js`, `src/index.css`, `src/pages/pages.css`). Source of truth is the updated clone.

- 21 citations had drifted (line shifts in `Router.jsx`, `index.css`, `pages.css`); all were re-pointed to the real current lines by re-running the builders, whose cites are found by needle search. The citation check was not weakened.
- Heading weights: `h2` is now declared weight 500 and `h5`/`h6` 600 (`src/index.css`); only the 400 and 600 faces exist, so 500 renders with the 400 face. Added token `font.weight.medium` (500) and updated the `section-heading` primitive; token catalog re-derived (165 tokens).
- Social tags: `head.js` now emits Open Graph / Twitter tags per route (`full` on about, services, work, contact and blog; `title` on case studies; none on blog posts and the 404; the home page keeps the `index.html` tags, including the only `og:image`). New required `meta.social` (`site|full|title|none`) in the PageSpec (pageSpecVersion 1.1.0), `head.social` per template, graph rule `META_SOCIAL_MATCHES_TEMPLATE`, 6 adversarial mutations, a drift case, all 18 examples updated.
- Section heights re-measured at 1440, 768 and 390 from a fresh production build: identical to the first measurement (no height moved); computed styles re-sampled (h2 and `.contact_heading` now report weight 500).
- `schema/protected-content.json` re-derived with `build_protected.py`: unchanged (the commit added no copy or names). Policy content hash recomputed with `policy_hash.py --write`; counts recomputed.

Still not done: no human review; no live-vs-clone visual parity measurement.

## 1.0.0 (design-review-pending)

First build of this design-repo, from scratch (no earlier design-repo existed), from the clone at commit f852099.

- Tokens derived from `tailwind.config.js`, `src/index.css`, `src/pages/pages.css` and the computed styles measured in the browser; every token cites a file line and a needle that `verify_all.py` re-reads.
- 11 primitives, 11 components, 30 section contracts (provenance `source` + taxonomy `semantic`, `retrievalEligible`, measured heights at 1440, 768 and 390), 9 templates, 18 routes + the catch-all 404, 16 graph rules, 24 motion patterns with reduced-motion fallbacks.
- PageSpec `mode` (`reference` | `generated`), 18 examples (9 reference, 9 generated), `GENERATED_MODE_*` rules (brand, person, client, award, press, contact, CTA, store, rating, copy, URL, media, asset) driven by `schema/protected-content.json`, derived by `extraction/build_protected.py` (names and copy as hashes).
- Asset roles with three-way availability (28 roles, 17 generation-safe), pinned in code in `verify_all.py` and `semantic_validate.py`.
- Wrapper gate with measured heights; `/work`, `/blog` and article bodies decomposed so that no in-flow section exceeds 50% of a page.
- Token catalog and policy, component allowlist, closed contract schema, all derived by `extraction/build_derived.py`.
- `category: portfolio`; designPolicy bound to `n0-design-constraints-common` 0.1.0 with a content hash from `extraction/policy_hash.py`; approval pending architecture review.
- Adversarial suite (every mutation rejected, every control passes) and `prove_drift.py` (each injected defect makes `verify_all.py` fail; the clean copy passes).

Not done: no human review; no live-vs-clone visual parity measurement; clone measured on its production build only.
