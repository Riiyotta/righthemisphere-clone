# Changelog

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
