# Generation guide

How to compose a new page from this design-repo (`mode: "generated"`).

## 1. Pick a template

| template | routePattern | shape |
|---|---|---|
| `home` | `^/$` | navbar, hero, 1-2 work clusters, statement, services, awards, press, clients, testimonials, FAQ, blog strip, contact call to action, footer, overlay |
| `about` | `^/about$` | words hero, statement, team, process, clients, products, blog strip, call to action |
| `services` | `^/services$` | services hero, rate table, FAQ, call to action |
| `work-index` | `^/work$` | words hero, 1-4 work clusters, call to action |
| `contact` | `^/contact$` | words hero, contact details, enquiry form |
| `blog-list` | `^/blog$` | words hero, 1-4 blog card clusters of up to three |
| `blog-post` | `^/blog/<slug>$` | article header, 1-12 chapters, two-card read-more row |
| `case-study` | any slug except the site pages | case header, overview, a body of 2-8 showcase media / image-text rows, more-work link |
| `not-found` | any unmatched path | the 404 block only (no navbar, footer or hero) |

The node sequence must follow `templates/templates.json` exactly (required nodes, `maxRepeat` caps, the
`case-body` slot). `semantic_validate.py` cross-references the declared template against its real node list.

## 2. Fill each node from its section contract

`sections/<id>.json -> content` lists every field, its kind and its `maxWords` budget. Media fields take
`{assetRole, ref, alt}`; in generated mode the role must be in the field's `generatedAssetRoles` and the ref must
start with `generated://`, `placeholder://` or `user://`. `overlay.partner-credits` is runtime UI
(`retrievalEligible: false`): it still appears as the last node but is not retrievable content.

## 3. Tokens and motion

Optional `tokens` per node (`surface`, `text`, `spaceBlock`, `font`) come from `tokens/llm/token-catalog.json`
entries with `pageSpecReferenceable: true`; the theme is `light`; the font is `font.family.sans`. Every node
declares one `motion.pattern` from its contract with the `reducedMotionFallback` listed in
`tokens/00-foundation/motion-patterns.json`.

## 4. What generated pages must not contain

The source's brand, people, client and project names, award and press marks, testimonials, copy, prices, claims,
URLs, phone numbers, addresses, photography, logos and live endpoints (`GENERATED_MODE_*` rules). Use fictional
names, reserved `.example` URLs and original copy. No pricing table, feature matrix, integrations, dashboard or
demo-booking section is generated; the only rate list is `list.pricing-table` on `services`.
