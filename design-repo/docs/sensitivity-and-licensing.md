# Sensitivity and licensing

**What the source is.** The site this design-repo describes is the real, live portfolio of a working creative
studio (https://www.righthemisphere.studio/). The clone is the owner's own rebuild.

**The clone is not placeholder-only.** `CLONE_SPEC.md` says copy, photography, logos and the brand mark are not
reproduced, and `CLONE_SPEC-PAGES.md` says the inner pages use real content. In fact the clone's home components
and `src/data/pages-content.json` contain the studio's real brand name, address, phone, email, team names, client
and project names, awards, press mentions, testimonials and ten full blog posts, and `public/` ships real client
logos, project images, team portraits, the commercial PP Mori font files and three Lottie animations. Treat the
clone, and this design-repo, as sensitive. Do not publish either.

**What this repo does about it.**

- Contracts and examples contain only structure, budgets and original (fictional) copy. Reference examples use
  the source's short UI vocabulary (navigation labels, hero words, button labels) and placeholder text for
  everything else; they contain no real names, client work or articles.
- `schema/protected-content.json` stores person, client, award, press, place and copy patterns as truncated
  hashes of normalised word n-grams (derived by `extraction/build_protected.py`), so the repo does not ship a
  plain list of the studio's staff, clients or copy. Plain text is limited to the brand name, CTA labels and
  generic store and rating guards.
- Asset roles: real marks, client and award logos, portraits, the vendor partner badge, the client video and the
  live form endpoint are `blocked-for-generation`; client project imagery, article imagery, case animations and
  the commercial font are `reference-only`. Generated pages use only the generation-safe roles (placeholder
  marks, fictional portraits, generated visuals, reserved `.example` / `.invalid` URLs, original copy).
- Generated pages never include phone links or numbers, real addresses, or social profiles.

**Must-not-fabricate in generation mode:** real client names and logos, award and press marks, testimonials,
team members and their photographs, personal contact details, vendor partner badges, the live enquiry endpoint.

**Fonts.** PP Mori is commercial: `font.family.reference`, never referenceable. Generated pages use
`font.family.sans` (Inter, OFL) or a font the operator licenses.

**Open approvals** (see `registry.manifest.json approvalFlags`): architecture review of the policy binding,
asset-licensing review, legal-content sign-off, human review of the pinned patterns. All are pending.
