# righthemisphere portfolio design-repo

A machine-validated PageSpec system extracted from the clone next to this folder (a React/Vite rebuild of the
Webflow site https://www.righthemisphere.studio/, a creative studio's portfolio). An AI can compose new pages in
the same design language (`mode: "generated"`) without inventing colours, copy or structure, and without reusing
anything that identifies the source. Status: **design-review-pending**, `productionApproved: false`.
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
| `extraction/` | `measured-values.json`, `measure_sections.mjs`, `wrapper_gate.py`, `verify_all.py`, `prove_drift.py`, `build_derived.py`, `build_protected.py`, `policy_hash.py` |

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
in `policy/design-policy.json`. **Approval is pending architecture review**: no human has confirmed the binding.

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
| driftCases | 58 |
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

## Honest limits

- No human has reviewed the pinned patterns (availability, retrieval, token rules) or the protected registry.
  The wrapper whitelist convention says "agent attestation, not a human sign-off" for agent reviewers; there are
  no whitelist entries.
- Leakage detection is string based (normalised text, regexes, hashed word n-grams). It will miss a paraphrase,
  a logo drawn into an image, or an identity expressed only visually. Hashing names and copy keeps this repo from
  shipping them in plain text; it is not encryption and short names can be guessed by brute force.
- One-word client names that are ordinary English words are matched case-sensitively only.
- Visual parity between the clone and the live site was **not measured** here; no percentage is claimed.
- The clone has no `prefers-reduced-motion` handling. The reduced-motion fallbacks are rules for generated pages.
- Section heights were measured on the production build of the clone, not on the live site.
- `list.pricing-table` exists because the clone has a real rate card on /services; the policy forbids other
  pricing, feature-matrix, integration, dashboard or demo-booking sections.
