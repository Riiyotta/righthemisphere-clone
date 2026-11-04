#!/usr/bin/env python3
"""Derive schema/protected-content.json (the generated-mode source-identity registry) from the clone source.

    python3 extraction/build_protected.py            # write schema/protected-content.json (needs the source tree)
    python3 extraction/build_protected.py --check    # exit 1 if the file differs from what the source derives

Person, client, award, press, place and copy patterns are stored as truncated SHA-1 hashes of normalised word
n-grams, so this repo never ships a plain list of the real studio's staff, clients or copy; only the brand name,
CTA labels and the third-party mark vocabulary below are plain text (they are the strings a generator must refuse).
Hashing: normalise (NFKC, strip zero-width, curly quotes -> straight, lowercase, runs of non [a-z0-9 accented '] ->
space), split into words, sha1(" ".join(window)).hexdigest()[:12]. Case-sensitive sets hash the exact-case word run.
verify_all.py (PROTECTED_SYNC) re-derives the file when the source tree is present and fails on any difference;
standalone copies skip that case (reported, never passed).
"""
import hashlib, html, json, re, sys, unicodedata
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent
OUT = ROOT / "schema/protected-content.json"
H = 12
SHINGLE = 6
NGRAMS = 4
COMMON = {"boon", "mocha", "anomaly", "mattered", "enter", "bootcamp", "medium", "lynchpin", "features", "sato", "figma", "github", "esah"}


def norm_tokens(s):
    s = unicodedata.normalize("NFKC", s)
    s = re.sub("[​-‍⁠﻿]", "", s)
    s = s.lower().replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.sub(r"[^a-z0-9à-öø-ÿ']+", " ", s).strip().split()


def hh(words):
    return hashlib.sha1(" ".join(words).encode()).hexdigest()[:H]


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", " ", s))


def strings(o, key=""):
    if isinstance(o, str):
        yield key, o
    elif isinstance(o, dict):
        for k, v in o.items():
            yield from strings(v, k)
    elif isinstance(o, list):
        for v in o:
            yield from strings(v, key)


SKIP_KEYS = {"src", "href", "srcset", "sizes", "class", "target", "loading", "fillClass", "numClass", "detailClass", "elementClass", "section", "type", "slug", "route",
             "tag", "dataName", "iframeSrc", "data-src", "data-loop", "data-autoplay", "data-renderer", "data-loading", "turnstileSitekey", "method", "redirect", "align", "w", "name_attr"}


def read(rel):
    return (SRC / rel).read_text(errors="ignore")


def content():
    return json.loads(read("src/data/pages-content.json"))


def jsx_files():
    return sorted((SRC / "src/components").rglob("*.jsx")) + sorted((SRC / "src/pages").glob("*.jsx")) + [SRC / "src/data/content.js"]


def corpus():
    out = []
    for k, s in strings(content()):
        if k in SKIP_KEYS:
            continue
        s = strip_tags(s)
        if s.startswith(("/", "http")) or re.fullmatch(r"[\w./%&-]+", s):
            continue
        out.append(s)
    for f in jsx_files():
        for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", f.read_text()):
            s = next(g for g in m.groups() if g is not None)
            s = s.replace("\\u00a0", " ").replace("\\u2019", "'").replace("\\u2018", "'").replace("\\'", "'")
            if not (re.search(r"[A-Za-z]{3}", s) and " " in s.strip()):
                continue
            if re.match(r"^[\w.:/#@%&?=-]+$", s) or (re.search(r"(className|flex |grid |col-|items-|px-|py-|md:|sm:|xs:|w-\[|h-\[)", s)):
                continue
            out.append(s)
    return out


def names():
    c = content(); jx = {f.name: f.read_text() for f in jsx_files()}
    team = [m["name"] for m in c["pages"]["about"]["team"]["members"]]
    authors = {p["meta"]["author"] for p in c["blogPosts"] if p["meta"]["author"]}
    credits = [cs["credit"]["link"]["text"] for cs in c["caseStudies"].values()]
    people = sorted(set(team) | authors | set(credits), key=str.lower)
    work = [x["title"] for w in c["pages"]["work"]["wrappers"] for x in w["cards"]]
    clients = [t["name"] for r in c["pages"]["about"]["clients"]["rows"] for t in r]
    clients += [i["name"] for i in c["pages"]["about"]["products"]["items"]]
    clients += re.findall(r"project: '([^']+)'", jx["Awards.jsx"]) + re.findall(r"name: '([^']+)'", jx["Footer.jsx"])
    clients += [m.split(",", 1)[1].strip() for m in re.findall(r"author: '([^']+)'", jx["Testimonials.jsx"])]
    clients += re.findall(r"name: '([^']+)'", jx["Partners.jsx"])
    clients = sorted({re.sub(r"\s+", " ", x.replace(" ", " ").replace("\n", " ")).strip() for x in clients + work}, key=str.lower)
    awards = sorted(set(re.findall(r"name: '([^']+)', sub:", jx["Awards.jsx"])) | set(re.findall(r"sub: '([^']+)'", jx["Awards.jsx"])), key=str.lower)
    press = sorted(set(re.findall(r"source: '([^']+)'", jx["MediaMentions.jsx"])), key=str.lower)
    places = ["Guwahati", "Ulubari", "Assam", "Peace Enclave", "781007", "GS Road"]
    return people, clients, awards, press, places


def name_hashes(items, unigram_min=None):
    """(ci hashes, cs hashes): single common-word names are case-sensitive; others are case-insensitive n-grams."""
    ci, cs = set(), set()
    variants = []
    for it in items:
        it = it.replace("\u00a0", " ")
        variants += [it, re.sub(r"\.(com|health|io|app|co|in|studio)\b", "", it)]
    for it in dict.fromkeys(variants):
        t = norm_tokens(it)
        if not t:
            continue
        if len(t) == 1 and t[0] in COMMON:
            cs.add(hh(re.findall(r"[A-Za-z0-9']+", it)))
        elif len(t) <= NGRAMS:
            ci.add(hh(t))
        if unigram_min:
            for w in t:
                if len(w) >= unigram_min and w not in COMMON:
                    ci.add(hh([w]))
    return sorted(ci), sorted(cs)


def hosts():
    t = "".join(f.read_text(errors="ignore") for f in jsx_files()) + read("src/data/pages-content.json")
    hs = {h.lower().removeprefix("www.") for h in re.findall(r"https?://([a-z0-9.-]+\.[a-z]{2,})", t, re.I)}
    return sorted(h for h in hs if "w3.org" not in h)


def find(rel, needle):
    for i, l in enumerate(read(rel).split("\n"), 1):
        if needle in l:
            return {"cite": f"{rel}:{i}", "needle": needle}
    raise SystemExit(f"needle not found in {rel}: {needle!r}")


def build():
    people, clients, awards, press, places = names()
    p_ci, _ = name_hashes(people, unigram_min=5)
    c_ci, c_cs = name_hashes(clients)
    a_ci, a_cs = name_hashes(awards)
    pr_ci, pr_cs = name_hashes(press)
    pl_ci, _ = name_hashes(places)
    sh = set()
    for s in corpus():
        w = norm_tokens(s)
        for i in range(0, len(w) - SHINGLE + 1):
            sh.add(hh(w[i:i + SHINGLE]))
    phrases = ["Pretty peculiar about pretty pixels", "Click-clack, ring-ring", "Things we do", "building web experiences for design-first brands",
               "beauty meets utility", "Brands that believe in the intangible value of design", "Everybody needs somebody"]
    pats = {
        "BRAND": {"terms": ["Right Hemisphere", "RightHemisphere", "Right-Hemisphere", "righthemisphere", "righthemisphere.studio", "hemisphereco", "Right Hemisphere Studio"],
                  "regex": [r"(?i)\bright\s*[- ]?\s*hemisphere\b", r"(?i)\bRH\s+(studio|labs?)\b"],
                  "evidence": [find("src/components/Footer.jsx", "Right Hemisphere, 2026"), find("src/components/ui/Parts.jsx", "Hemisphere"), find("src/components/Hero.jsx", "hello@righthemisphere.studio"), find("src/components/Footer.jsx", "hemisphereco")]},
        "PERSON": {"hashes": p_ci, "method": "ci n-gram hashes of team member, blog author and credit names plus each name word of 5+ letters", "count": len(people),
                   "evidence": [find("src/data/pages-content.json", '"team": {'), find("src/data/pages-content.json", '"author": '), find("src/data/pages-content.json", '"credit": {')]},
        "CLIENT": {"hashes": c_ci, "caseSensitiveHashes": c_cs, "method": "ci n-gram hashes of work card titles, client tiles, products, award subjects, partner-overlay names and testimonial companies; single common-word names are case-sensitive", "count": len(clients),
                   "evidence": [find("src/components/Work.jsx", "const GRID_1 = ["), find("src/components/Partners.jsx", "const ROWS = ["), find("src/components/Footer.jsx", "partners: ["), find("src/components/Testimonials.jsx", "const SLIDES = [")]},
        "CONTACT": {"hashes": pl_ci, "method": "ci hashes of the studio's address words (place names, street, postcode)", "regex": [r"\+?\d(?:[\s().-]?\d){8,}"],
                    "evidence": [find("src/components/Footer.jsx", "const ADDRESS = {"), find("src/components/Hero.jsx", "const ADDRESS = {")]},
        "AWARD": {"hashes": a_ci, "caseSensitiveHashes": a_cs, "method": "ci n-gram hashes of the third-party award names and levels shown in the awards list",
                  "evidence": [find("src/components/Awards.jsx", "const GROUPS = [")]},
        "PRESS": {"hashes": pr_ci, "caseSensitiveHashes": pr_cs, "method": "ci n-gram hashes of the publication names in the media-mentions list",
                  "evidence": [find("src/components/MediaMentions.jsx", "const MENTIONS = [")]},
        "CTA": {"terms": ["Know us better", "Things we did", "See all work", "See all clients", "Work with us", "Read blog", "Partner credits", "Our partners"],
                "regex": [r"(?i)\b(work|talk|connect|hire|contact|partner)\s+(with\s+)?right\s*hemisphere\b", r"(?i)\bready to create something pretty\b"],
                "evidence": [find("src/components/About.jsx", "KNOW US BETTER"), find("src/components/Hero.jsx", "const BUTTON = { lines"), find("src/components/Contact.jsx", "wORK wITH US"), find("src/components/Work.jsx", "see all work"), find("src/components/Partners.jsx", "see all clients"), find("src/components/Blogs.jsx", "READ BLOG")]},
        "RATING": {"terms": ["$1000", "$1500", "$3000", "$5000", "2 months of free maintenance", "within a day"], "regex": [],
                   "evidence": [find("src/data/pages-content.json", '"costLabel": "Starts at:"'), find("src/components/Faq.jsx", "2 months of free maintenance"), find("src/data/pages-content.json", "within a day")]},
        "COPY": {"phrases": phrases, "shingleSize": SHINGLE, "shingleHex": H, "shingleCount": len(sh), "shingleHashes": "".join(sorted(sh)),
                 "shingleCorpus": "every string in src/data/pages-content.json (HTML stripped, non-text keys skipped) plus every multi-word string literal in src/components/**/*.jsx, src/pages/*.jsx and src/data/content.js (extraction/build_protected.py corpus())",
                 "evidence": [find("src/components/About.jsx", "Pretty peculiar about pretty pixels"), find("src/components/Faq.jsx", "Brands that believe in the intangible value of design"), find("src/components/Footer.jsx", "Everybody needs somebody")]},
        "URL": {"domains": hosts(), "evidence": [find("src/components/Footer.jsx", "https://www.instagram.com/hemisphereco/"), find("src/components/Footer.jsx", "https://www.linkedin.com/company/righthemisphere/"), find("src/components/Work.jsx", "https://www.barebonescollective.com/"), find("src/components/Footer.jsx", "https://skara.app/")]},
        "MEDIA": {"regex": [r"(?i)righthemisphere", r"(?i)\b6a[0-9a-f]{22}_", r"(?i)website-files\.com", r"(?i)/images/", r"(?i)/lottie/", r"(?i)xkd0tjiplpm", r"(?i)ppmori", r"(?i)certified_partner", r"(?i)logo\.svg", r"(?i)\.(png|jpe?g|gif|webp|svg|json)\b.*\b(bbc|kulfi|moshimbo|cheggout|borno)\b"],
                  "evidence": [find("src/components/Work.jsx", "const IMG = '/images/';"), find("src/components/Footer.jsx", "certified_partner_badge"), find("src/components/case-study/Showcase.jsx", "Xkd0TjIPlpM")]},
    }
    return {"version": "1.0.0", "note": "Derived by extraction/build_protected.py from the clone source; verify_all.py PROTECTED_SYNC re-derives it. Hashes are sha1(normalised word n-gram)[:12]; see that script for the exact normalisation.",
            "sourceBrand": {"patterns": pats},
            "genericGuards": {"STORE": {"terms": ["App Store", "Google Play", "Play Store", "TestFlight", "Mac App Store", "apps.apple.com", "play.google.com"], "regex": []},
                              "RATING": {"terms": [], "regex": [r"(?i)\b\d(\.\d)?\s*(/|out of)\s*5\b", r"(?i)\b(rated|five[- ]star|\d[- ]star)\b", r"(?i)\b\d[\d,]*\+?\s+(happy )?(clients|customers|projects|brands)\b"]}}}


def main():
    want = json.dumps(build(), indent=1, ensure_ascii=False) + "\n"
    if "--check" in sys.argv:
        ok = OUT.read_text() == want
        print("protected-content.json " + ("matches the source" if ok else "DIFFERS from what the source derives"))
        return 0 if ok else 1
    OUT.write_text(want)
    print("wrote", OUT.relative_to(ROOT))
    return 0


if __name__ == "__main__":
    sys.exit(main())
