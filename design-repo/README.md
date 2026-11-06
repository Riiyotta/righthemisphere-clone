# righthemisphere portfolio design-repo

A machine-validated PageSpec system extracted from the clone next to this folder (a React/Vite rebuild of the
Webflow site https://www.righthemisphere.studio/, a creative studio's portfolio). An AI can compose new pages in
the same design language (`mode: "generated"`) without inventing colours, copy or structure, and without reusing
anything that identifies the source. Status: **design-reviewed** (reviewed by the repository owner on 2026-11-06; `registry.manifest.json` `designReview`), `productionApproved: false` (not production-approved).
**Read `docs/sensitivity-and-licensing.md` first**: the clone ships the studio's real content.

## Layout

| path | what |
|---|---|
| `tokens/00-foundation` | colour, typography, spacing, radius, elevation, breakpoint, motion, `motion-patterns.json` |
| `tokens/10-semantic`, `themes/light.json` | surface / text / border roles resolving to foundation tokens (one light theme) |
| `tokens/20-component`, `30-layout` | component measurements, grid and section rhythm |
| `tokens/llm` | `token-catalog.json` (derived), `token-policy.json`, `component-allowlist.json` (derived) |
| `primitives/`, `components/` | button, arrow pairs, hairline row, work card, blog card, ... |
| `sections/` | one closed contract per semantic section (`source` provenance + `semantic` taxonomy, `retrievalEligible`, content budgets, motion, tokens, responsive, asset roles, measured heights) |
| `templates/` | `templates.json` (9 templates), `routes.json` (18 routes, each once, plus the catch-all 404) |
| `compatibility/graph.json` | rhythm / structure rules with severities (same ids as the validator) |
| `schema/` | `pagespec.schema.json` + `section-contract.schema.json` (both derived), `semantic_validate.py`, `protected-content.json`, 18 examples, `tests/adversarial_test.py` |
| `assets/asset-roles.json` | three-way availability per role, substitutes, licensing |
| `policy/design-policy.json` | portfolio policy: local extension of the bound common design policy |
| `extraction/` | `measured-values.json`, `measure_sections.mjs`, `wrapper_gate.py`, `verify_all.py`, `prove_drift.py`, `build_derived.py`, `build_protected.py`, `policy_hash.py`, and the parity record: `parity_capture.mjs`, `parity_compare.py`, `parity_geometry.py`, `parity_record.py`, `parity-results.json`, `parity-geometry/` (text-free dumps) |

## Templates and routes

`home` (/), `about`, `services`, `work-index` (/work), `contact`, `blog-list` (/blog), `blog-post` (10 routes),
`case-study` (2 routes) and `not-found` (any unmatched path: a template, not a counted route). The route list is
enumerated from `src/Router.jsx` and `src/data/pages-content.json` and re-derived by `verify_all.py` when the
source tree is present.

Sections are semantic units, never whole pages: a blog post is a header plus one `editorial.article-chapter` per
h2-bounded chapter plus a related row; the 25-card /work grid is four `work.card-cluster` wrappers; the 10-card
/blog index is four 3-card clusters. Measured as one block each, /work (86% of its page) and /blog (83%) would
fail the wrapper gate.

Each template also records `head.social`, which Open Graph / Twitter tags the clone's `head.js` emits for it; a
PageSpec's `meta.social` must match (`META_SOCIAL_MATCHES_TEMPLATE`). The `og:image` exists only on the home page.

## Design policy

`registry.manifest.json` has `category: "portfolio"` and binds the generic common design policy
`n0-design-constraints-common` 0.1.0 (Common IR 0.5, hard-and-soft, domain `portfolio`). The `contentHash` is
computed by `extraction/policy_hash.py` over `tokens/llm/token-policy.json`, `compatibility/graph.json`,
`schema/pagespec.schema.json` and `schema/semantic_validate.py`; `verify_all.py` (POLICY) recomputes it. Editing
any of those four files requires `python3 extraction/policy_hash.py --write`. The portfolio generation rules are
in `policy/design-policy.json`. The policy binding's architecture decision is a separate decision that is still open (`policy/design-policy.json` `approval`).

## Counts

<!-- counts:start (written by extraction/verify_all.py --write-counts) -->
| item | count |
|---|---|
| tokens | 165 |
| pageSpecReferenceableTokens | 25 |
| primitives | 11 |
| components | 11 |
| sections | 30 |
| retrievalIneligibleSections | 1 |
| templates | 9 |
| routes | 18 |
| assetRoles | 28 |
| generationSafeAssetRoles | 17 |
| motionPatterns | 24 |
| graphRules | 17 |
| examples | 18 |
| referenceExamples | 9 |
| generatedExamples | 9 |
| adversarialMutations | 177 |
| adversarialControls | 19 |
| driftCases | 87 |
<!-- counts:end -->

## Run

```bash
pip install jsonschema                         # the only dependency
python3 extraction/verify_all.py               # everything, exit 1 on any failure
python3 schema/semantic_validate.py --examples
python3 schema/tests/adversarial_test.py
python3 extraction/prove_drift.py [--scratch DIR]  # copies the repo to a temp dir and injects each defect
python3 extraction/wrapper_gate.py
python3 extraction/build_derived.py            # after editing a contract / token / role / pattern
python3 extraction/build_protected.py          # after the source copy or names change (needs the clone source)
python3 extraction/policy_hash.py --write      # after editing a policy-hashed file
```

Re-measure (needs the clone served, e.g. `npx vite build --outDir <dir>` then `npx vite preview --outDir <dir>
--port 5761`, and a Chromium; nothing machine-specific is stored):

```bash
PLAYWRIGHT_MODULE="$(npm root -g)/playwright/index.mjs" BASE_URL=http://localhost:5761 VIEWPORT=1440x900 MODE=sections node extraction/measure_sections.mjs
```

Run it at 1440x900, 768x1024 and 390x844 and store the three results under `sectionHeights` and
`responsiveHeights` in `extraction/measured-values.json`.

## Parity evidence (live site vs clone, R12)

Recorded in `extraction/parity-results.json` (version 1.1.0; summarised in `extraction/measured-values.json` under `parity`).
Live captures were taken on the date in `capturedAt`; no live screenshot is committed, only text-free geometry dumps
(`extraction/parity-geometry/`) and sha256 pins.

**What is being compared.** The clone ships the studio's REAL copy, logos and photos (see `docs/sensitivity-and-licensing.md`),
so a raw pixel comparison is meaningful: it shows the clone reproduces the live rendering. It proves nothing about
generated-mode output, which must never reuse that content.

**Method** (`parity_capture.mjs`, `parity_compare.py`): 1440x900 for all 18 routes plus the 404 probe; 390x844 for the home
page, one blog post and one case study. Each section (the semantic selectors of `measure_sections.mjs`) is captured in
viewport-high tiles reached by stepped scrolling after the load intro, fonts and images awaited, `<video>` paused on a fixed
frame (none exists), animated GIFs frozen on their first frame on both sides, consent / cookie overlays hidden by a stylesheet
on both sides (the live site has none; nothing is ever clicked). Pixel threshold 24/255 per channel; gate: every section
>= 80 and every page average >= 80. Only Lottie players and third-party iframes are masked; masked pixels leave the counts on
both sides and are reported as `maskedPct`.

**Three numbers per section, and what each proves.**
- `rawPct` (gated): share of the live section's pixels that match within 24/255. Proves the pixels agree, content included. A
  sub-pixel vertical offset in text lowers it without any visible layout difference.
- `inkPct` (reported): Dice of blurred ink block-maps from the screenshots. Proves ink (text, art, controls) sits in the same
  places; does not compare glyphs. Needs the screenshots, so it is not recomputable from the repo.
- `geoPct` (reported): Dice of rasterised text-row, media and control rects from the DOM. Proves box / text-row / image positions
  agree and is recomputed by `verify_all.py` from the tracked dumps. It does not prove pixels or image content match, and it
  counts DOM roles (a `<button>` is a control, a `<div>` is not).

**Results** (run 1; run 2 agreed within 1.9 points on any section, mean 0.0).

| viewport | routes | sections | mean raw | mean ink | mean geo | min raw | below 80 |
|---|---|---|---|---|---|---|---|
| 1440x900 | 19 | 154 | 98.8 | 99.3 | 98.2 | 82.5 | 0 |
| 390x844 | 3 | 30 | 96.6 | 99.2 | 98.5 | 62.1 | 1 |

Per-route and per-section numbers: `extraction/parity-results.json`. Route page averages are 97.2 to 99.9 at 1440 and
96.2 to 97.7 at 390.

**Reproducibility.** Two full runs on the final clone build agree (max section delta 1.9, mean 0.0 at 1440; 0.0 at 390).
A live-vs-live control (the live site captured twice, about an hour apart) gives mean 99.99 and min 98.1 at 1440 and 100.0 at
390, so the harness noise floor is about 2 points on one section.

**Exception (approved as deliberate by the owner, 2026-11-06).** `/` at 390x844, section 11 `editorial.blog-card-grid`: raw 62.1. The live home blog
strip shows 3 random posts, CDN-cached; the clone pins a different three. Layout matches (geo 100.0 at 390, 99.2 at 1440, ink
96.9) and the live site returned the same three on every capture, so this is live content and not noise. The clone was not
pinned to one random draw. The same section passes at 1440 (82.5, mostly white area). The owner decided on 2026-11-06 that
this difference is deliberate and the clone must not be adapted to it (`extraction/parity-approvals.json`); the recorded
result file keeps the status `recorded exception`, the recorder's neutral default (it records and never decides); the owner's decision is in `extraction/parity-approvals.json`.

**Masked regions** (percent of the section area masked): `/cheggout-sdk` media.case-showcase 90.6 (390: 87.0) and two
work.case-image-text 33.0 (390: 37.4 and 44.3); `/watch-with-papa` media.case-showcase 85.7. Their raw score covers only the
unmasked remainder, so those sections are largely unmeasured by pixels (listed under `mostlyMasked`).

**Observations, not gated.** The 404 probe has ink 89.7 / geo 83.8 (raw 99.1). The home testimonial quote wraps one word
differently (ink 83.8, geo 85.4; the clone's SplitText lines are 449 px wide against 458 on live). The FAQ accordion's geo is
53.3 at 1440 because the clone renders its headers as `<button>` elements and live as `<div>`; pixels agree (raw 99.9). Blog
article chapters score 87 to 95 raw from sub-pixel vertical text offsets (doc heights differ by 1 px).

**Clone fixes found by this measurement** (`src/`): case-study copy was right-aligned where live is start-aligned; wrapped FAQ
questions on narrow viewports were clipped to a 32 px row (now `auto` rows, shrinkable number box). The FAQ at 390 / 768 is now
599 / 520 px; `responsiveHeights` and the contract heights were re-measured.

Re-run (paths and the browser come from environment variables, nothing machine-specific is stored; the clone is built from a fresh
`npm ci` and served with `npx vite preview --outDir <dir> --port 5782`):

```bash
export CHROME_PATH=<chromium binary> PLAYWRIGHT_MODULE=<path to playwright(-core)/index.mjs>
node extraction/parity_capture.mjs --base https://www.righthemisphere.studio --out <live_dir> --geometry-out <live.geo.json>
node extraction/parity_capture.mjs --base http://localhost:5782 --out <clone_dir> --geometry-out <clone.geo.json>
python3 extraction/parity_compare.py <live_dir> <clone_dir> <cmp.json> [--sheets <dir>]   # needs numpy and Pillow
# then, for two runs and both viewports: python3 extraction/parity_record.py (see its docstring)
```

## Honest limits

- The pinned patterns (availability, retrieval, token rules), the protected registry, the whitelists and the classification were reviewed by the owner on 2026-11-06. The wrapper whitelist convention still requires an agent reviewer to write "agent attestation, not a human sign-off"; there are no whitelist entries.
- Leakage detection is string based (normalised text, regexes, hashed word n-grams). It will miss a paraphrase,
  a logo drawn into an image, or an identity expressed only visually. Hashing names and copy keeps this repo from
  shipping them in plain text; it is not encryption and short names can be guessed by brute force.
- One-word client names that are ordinary English words are matched case-sensitively only.
- Visual parity was measured (see "Parity evidence"), but only on the dates and at the viewports recorded there, and the owner reviewed the result on 2026-11-06. Two things the numbers do not cover: the Lottie / iframe regions (masked, percentages below) and the home blog strip, which shows a random draw on the live site.
- The clone has no `prefers-reduced-motion` handling. The reduced-motion fallbacks are rules for generated pages.
- Section heights were measured on the production build of the clone (`sectionHeights`, `responsiveHeights`); the live heights are in the parity record (`liveH` per section).
- `list.pricing-table` exists because the clone has a real rate card on /services; the policy forbids other
  pricing, feature-matrix, integration, dashboard or demo-booking sections.
