# Information architecture: Right Hemisphere replica

`ia.json` is the only file to edit by hand. `IA.md` and `matrix.csv` are generated from it, and any manual edit to them is overwritten on the next build.

```bash
cd ia
node validate.mjs   # hard checks: route totals, section references, categories
node build.mjs      # regenerates IA.md and matrix.csv
```

Each section's `implementedBy` field names the component that renders it. Paths are relative to `src/components/` unless they start with `pages/`.

## What the data shows

- **The site has 18 routes built from 8 templates, and two of those templates cover 12 of the routes.** The blog-post template accounts for 10 routes (56% of the site) and the case-study template for 2. Both are rendered from `src/data/pages-content.json`. The other 6 routes (home, about, services, work, contact, blog list) are each a separate page.
- **8 of the 34 sections are shared across templates and 26 are used on one template only.** Navbar, footer and the partner-credits overlay appear on all 18 routes. The contact CTA and the words-only hero each appear on 4 templates, the blog cards on 3, and partners and the FAQ on 2.
- **About and the blog list reuse homepage components rather than having their own copies.** `Partners.jsx` renders both the 15-tile homepage grid and the 21-tile "Clients" grid on /about. `Blogs.jsx` renders both the 3-card homepage strip and the 10-card blog list. The differences between pages are passed in as props.
- **The case-study template has no fixed section order.** Each study's data sets the order and how often each showcase section repeats. Cheggout has 6 sections and Watch with Papa has 8. The template lists each section type once, in the order it first appears.

## Remaining warnings and fixed values

- `validate.mjs` reports 5 notes and no hard failures. All 5 are false alarms. Three come from the word "404" in "every template except the 404", which the checker reads as a route count. Two come from the per-study counts in the case-study section descriptions ("1–2", "2–4").
- The 404 template has `routeCount: 0`. It catches any path that doesn't match a route, so it is not counted as one of the 18.
