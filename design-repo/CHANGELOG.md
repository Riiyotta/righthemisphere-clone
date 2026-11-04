# Changelog

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
