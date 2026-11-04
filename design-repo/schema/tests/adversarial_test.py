#!/usr/bin/env python3
"""Adversarial suite: every mutation must be REJECTED with its expected rule code; every control must pass.

    python3 schema/tests/adversarial_test.py        # exit 1 if any mutation slips through or a control fails

Three layers:
  MUTATIONS       PageSpec mutations (generated-mode leakage R2/R5 incl. normalisation tricks, schema, structure,
                  words, motion, tokens R10, assets, retrieval R8), validated by schema/semantic_validate.py
  REPO_MUTATIONS  in-memory edits of the registry files (asset availability / policy, contract field roles,
                  retrieval flags in contract / allowlist / template) that the code pins must catch while
                  validating an untouched control
  GATE_MUTATIONS  wrapper-gate inputs (HERO 1900/3100 in flow and fixed, majority share, whitelist defects,
                  missing or wrong-viewport measurements, threshold drift) through extraction/wrapper_gate.py
Controls: every example in schema/ (9 reference + 9 generated, one of each per template) and the wrapper gate on
the real measurements.
"""
import copy, importlib.util, json, sys
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[2]


def mod(name, rel):
    s = importlib.util.spec_from_file_location(name, ROOT / rel); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


sv = mod("sv", "schema/semantic_validate.py")
wg = mod("wg", "extraction/wrapper_gate.py")
EX = {p.stem.replace("example.pagespec", "reference.home"): json.loads(p.read_text()) for p in sv.example_paths(ROOT)}
G, GA, GS, GW, GC, GL, GP, GCS, GNF = ("generated." + x for x in ("home", "about", "services", "work-index", "contact", "blog-list", "blog-post", "case-study", "not-found"))
R, RP, RCS, RNF, RW = "reference.home", "reference.blog-post", "reference.case-study", "reference.not-found", "reference.work-index"


def nd(spec, sid, k=0):
    return [n for n in spec["nodes"] if n["section"] == sid][k]


def C(spec, sid, k=0):
    return nd(spec, sid, k)["content"]


def swap(spec, a, b):
    ia = [i for i, n in enumerate(spec["nodes"]) if n["section"] == a][0]
    ib = [i for i, n in enumerate(spec["nodes"]) if n["section"] == b][0]
    spec["nodes"][ia], spec["nodes"][ib] = spec["nodes"][ib], spec["nodes"][ia]


def drop(spec, sid):
    spec["nodes"] = [n for n in spec["nodes"] if n["section"] != sid]


def seq(*fns):
    def f(s):
        for fn in fns: fn(s)
    return f


LONG = " ".join(["word"] * 130)
M = lambda role, ref: {"assetRole": role, "ref": ref, "alt": ""}
ZW = "​"
CARD = lambda s, i=0, k=0: C(s, "work.card-cluster", k)["cards"][i]

MUTATIONS = [
    # ---- R2/R5 generated-mode leakage: brand / logo / badge
    ("source brand as studio name", G, lambda s: s["brand"].update(studioName="Right Hemisphere"), "GENERATED_MODE_BRAND"),
    ("brand split across wordmark lines", G, lambda s: C(s, "chrome.navbar").update(wordmark=["Right", "Hemisphere"]), "GENERATED_MODE_BRAND"),
    ("brand with a zero-width space", G, lambda s: C(s, "content.studio-statement").update(paragraph="We are proud to be Right" + ZW + " Hemisphere and nothing else."), "GENERATED_MODE_BRAND"),
    ("brand in full-width letters (NFKC)", G, lambda s: C(s, "content.studio-statement").update(paragraph="Ｒight Hemisphere makes interfaces for small teams."), "GENERATED_MODE_BRAND"),
    ("brand in the footer note", G, lambda s: C(s, "chrome.footer").update(note="Copyright Right Hemisphere, 2026"), "GENERATED_MODE_BRAND"),
    ("source social handle", G, lambda s: C(s, "chrome.footer")["socials"].append({"label": "hemisphereco", "href": "#"}), "GENERATED_MODE_BRAND"),
    ("source domain as brand domain", G, lambda s: s["brand"].update(domain="righthemisphere.studio"), "GENERATED_MODE_URL"),
    ("logo mark role reused", G, lambda s: C(s, "chrome.navbar").update(mark=M("brand.logo-mark", "generated://mark")), "GENERATED_MODE_ASSET"),
    ("original logo file under a safe role", G, lambda s: C(s, "chrome.navbar").update(mark=M("generated.brand-mark", "generated://logo.svg")), "GENERATED_MODE_MEDIA"),
    ("vendor partner badge role reused", G, lambda s: C(s, "chrome.footer").update(badge=M("brand.partner-badge", "placeholder://badge")), "GENERATED_MODE_ASSET"),
    ("vendor badge file under a safe role", G, lambda s: C(s, "chrome.footer").update(badge=M("placeholder.partner-badge", "placeholder://certified_partner_badge_white.png")), "GENERATED_MODE_MEDIA"),
    # ---- store marks / store URLs (generic guard)
    ("store mark leak", G, lambda s: C(s, "chrome.footer")["socials"].append({"label": "App Store", "href": "https://shop.example/app"}), "GENERATED_MODE_STORE"),
    ("store URL leak", G, lambda s: C(s, "chrome.footer")["socials"].append({"label": "get it", "href": "https://play.google.com/store/apps/details?id=x"}), "GENERATED_MODE_STORE"),
    # ---- ratings / claims
    ("rating claim", G, lambda s: C(s, "proof.testimonial-slider")["slides"][0].update(quote="Rated 5/5 by everyone we have worked with."), "GENERATED_MODE_RATING"),
    ("star claim", G, lambda s: C(s, "proof.testimonial-slider")["slides"][0].update(quote="A five-star studio from start to finish."), "GENERATED_MODE_RATING"),
    ("client count claim", G, lambda s: C(s, "content.studio-statement").update(paragraph="We have helped 40+ clients ship calmer products."), "GENERATED_MODE_RATING"),
    ("source price", GS, lambda s: C(s, "list.pricing-table")["rows"][0].update(cost="$1000"), "GENERATED_MODE_RATING"),
    ("source maintenance claim", G, lambda s: C(s, "content.faq-accordion")["items"][0].update(answer="Every site includes 2 months of free maintenance."), "GENERATED_MODE_RATING"),
    # ---- people
    ("team member full name", GA, lambda s: C(s, "list.team-roster")["members"][0].update(name="Kaushik Barua"), "GENERATED_MODE_PERSON"),
    ("team member given name only", GA, lambda s: C(s, "list.team-roster")["members"][1].update(name="Uddipta"), "GENERATED_MODE_PERSON"),
    ("blog author name", GP, lambda s: C(s, "hero.article-header").update(author="Rajashri Das"), "GENERATED_MODE_PERSON"),
    ("credit name in capitals", GCS, lambda s: C(s, "hero.case-header")["credit"].update(label="ANUBHABH BORA"), "GENERATED_MODE_PERSON"),
    ("person name with a zero-width space", GA, lambda s: C(s, "list.team-roster")["members"][0].update(name="Chinmoy" + ZW + " Raj Deka"), "GENERATED_MODE_PERSON"),
    ("team portrait role reused", GA, lambda s: C(s, "list.team-roster")["members"][0].update(portrait=M("person.portrait", "generated://x")), "GENERATED_MODE_ASSET"),
    ("team portrait file under a safe role", GA, lambda s: C(s, "list.team-roster")["members"][0].update(portrait=M("fictional.portrait", "generated://6abdeadb0baefae6e8d529a6_image 34.png")), "GENERATED_MODE_MEDIA"),
    # ---- clients, projects, awards, press
    ("real client name", G, lambda s: C(s, "proof.client-logo-grid")["tiles"][0].update(name="Razorpay"), "GENERATED_MODE_CLIENT"),
    ("real multi-word client", GA, lambda s: C(s, "proof.client-logo-grid")["tiles"][0].update(name="Studio Ping Pong"), "GENERATED_MODE_CLIENT"),
    ("real client with a common-word name (exact case)", G, lambda s: C(s, "proof.client-logo-grid")["tiles"][1].update(name="Boon"), "GENERATED_MODE_CLIENT"),
    ("real project title on a work card", G, lambda s: CARD(s).update(title="Moshimbo"), "GENERATED_MODE_CLIENT"),
    ("real project title in capitals", GW, lambda s: CARD(s, 1).update(title="WATCH WITH PAPA"), "GENERATED_MODE_CLIENT"),
    ("testimonial company", G, lambda s: C(s, "proof.testimonial-slider")["slides"][0].update(author="CEO, Lynchpin"), "GENERATED_MODE_CLIENT"),
    ("client logo role reused", G, lambda s: C(s, "proof.client-logo-grid")["tiles"][0].update(logo=M("client.logo", "placeholder://x")), "GENERATED_MODE_ASSET"),
    ("real award name", G, lambda s: C(s, "proof.award-groups")["groups"][0].update(name="Awwwards"), "GENERATED_MODE_AWARD"),
    ("real award level", G, lambda s: C(s, "proof.award-groups")["groups"][0].update(level="Honorable Mention"), "GENERATED_MODE_AWARD"),
    ("award mark role reused", G, lambda s: C(s, "proof.award-groups")["groups"][0].update(mark=M("award.mark", "placeholder://x")), "GENERATED_MODE_ASSET"),
    ("real press publication", G, lambda s: C(s, "proof.press-mentions")["mentions"][0].update(source="Figmacode"), "GENERATED_MODE_PRESS"),
    ("real press domain", G, lambda s: C(s, "proof.press-mentions")["mentions"][0].update(href="https://knowledge.evinced.com/x"), "GENERATED_MODE_URL"),
    # ---- URLs / contact
    ("source social URL", G, lambda s: C(s, "chrome.footer")["socials"].append({"label": "Pics", "href": "https://www.instagram.com/hemisphereco/"}), "GENERATED_MODE_URL"),
    ("client site URL", G, lambda s: CARD(s).update(href="https://www.barebonescollective.com/"), "GENERATED_MODE_URL"),
    ("non-reserved URL", G, lambda s: C(s, "chrome.footer")["products"].append({"label": "Site", "href": "https://latticeroom.com"}), "GENERATED_MODE_URL"),
    ("protocol-relative source URL", GCS, lambda s: C(s, "hero.case-header")["liveLink"].update(href="//righthemisphere.studio/x"), "GENERATED_MODE_URL"),
    ("source email", GC, lambda s: C(s, "cta.contact-details")["items"][0].update(value="hello@righthemisphere.studio", href="mailto:hello@righthemisphere.studio"), "GENERATED_MODE_URL"),
    ("phone link", GC, lambda s: C(s, "cta.contact-details")["items"][1].update(href="tel:+10000000000"), "GENERATED_MODE_CONTACT"),
    ("phone number in text", GC, lambda s: C(s, "cta.contact-details")["items"][1].update(value="+44 20 7946 0958"), "GENERATED_MODE_CONTACT"),
    ("source street", GC, lambda s: C(s, "cta.contact-details")["items"][1].update(value="Peace Enclave, 5th floor"), "GENERATED_MODE_CONTACT"),
    ("source city", GC, lambda s: C(s, "cta.contact-details")["items"][1].update(value="Guwahati, Assam"), "GENERATED_MODE_CONTACT"),
    ("live form endpoint role", GC, lambda s: C(s, "conversion.enquiry-form").update(endpoint=M("form.live-endpoint", "placeholder://x")), "GENERATED_MODE_ASSET"),
    ("form endpoint ref is a source host", GC, lambda s: C(s, "conversion.enquiry-form").update(endpoint=M("placeholder.url", "https://cdn.prod.website-files.com/form")), "GENERATED_MODE_MEDIA"),
    # ---- copy
    ("source statement", G, lambda s: C(s, "content.studio-statement").update(statement="Pretty peculiar about pretty pixels"), "GENERATED_MODE_COPY"),
    ("source FAQ phrase", G, lambda s: C(s, "content.faq-accordion")["items"][0].update(answer="Brands that believe in the intangible value of design hire us."), "GENERATED_MODE_COPY"),
    ("source testimonial 6-word window", G, lambda s: C(s, "proof.testimonial-slider")["slides"][1].update(quote="It was one of our best collaborative work experiences so far."), "GENERATED_MODE_COPY"),
    ("source blog 6-word window", GP, lambda s: C(s, "editorial.article-chapter")["blocks"][0].update(text="Most websites are not designed for how people actually use them."), "GENERATED_MODE_COPY"),
    ("source copy with curly apostrophes and caps", GA, lambda s: C(s, "content.process-note").update(body="SOMETIMES WE START FROM SCRATCH, OTHER TIMES we build on foundations laid."), "GENERATED_MODE_COPY"),
    ("source copy split across list items", GP, lambda s: C(s, "editorial.article-chapter", 1)["blocks"][2].update(listItems=["Most websites are not designed", "for how people actually use them"]), "GENERATED_MODE_COPY"),
    # ---- CTA
    ("source CTA: know us better", G, lambda s: C(s, "content.studio-statement")["button"].update(label="Know us better"), "GENERATED_MODE_CTA"),
    ("source CTA: things we did", G, lambda s: C(s, "hero.home")["button"].update(label="Things we did"), "GENERATED_MODE_CTA"),
    ("source CTA: see all work", G, lambda s: C(s, "work.card-cluster", 1)["seeAll"].update(label="see all work"), "GENERATED_MODE_CTA"),
    ("source CTA: read blog", G, lambda s: C(s, "editorial.blog-card-grid")["posts"][0].update(cta="READ BLOG"), "GENERATED_MODE_CTA"),
    ("source CTA: our partners", G, lambda s: C(s, "chrome.footer").update(creditsLabel="our partners"), "GENERATED_MODE_CTA"),
    ("brand CTA", G, lambda s: C(s, "cta.contact-lines")["button"].update(label="Work with Right Hemisphere"), "GENERATED_MODE_CTA"),
    # ---- proprietary media
    ("source image file", G, lambda s: CARD(s).update(image=M("generated.project-visual", "user://6a8827216cb56caa7e99ca52_bbc.png")), "GENERATED_MODE_MEDIA"),
    ("live CDN image URL", G, lambda s: CARD(s).update(image=M("generated.project-visual", "https://cdn.prod.website-files.com/x.png")), "GENERATED_MODE_MEDIA"),
    ("Lottie file", GCS, lambda s: C(s, "work.case-overview").update(visual=M("generated.motion-graphic", "generated://lottie/6abb83b9a7aa7f9e3c7b4e6c_homepage.json")), "GENERATED_MODE_MEDIA"),
    ("source video id", GCS, lambda s: C(s, "media.case-showcase").update(media=M("placeholder.video", "placeholder://Xkd0TjIPlpM")), "GENERATED_MODE_MEDIA"),
    ("clone-side ref under a generated spec", G, lambda s: CARD(s).update(image=M("generated.project-visual", "clone://work.card-cluster/image")), "GENERATED_MODE_MEDIA"),
    ("reference-only project image role", G, lambda s: CARD(s).update(image=M("work.project-image", "generated://x")), "GENERATED_MODE_ASSET"),
    ("reference-only article image role", GP, lambda s: C(s, "hero.article-header").update(image=M("article.image", "generated://x")), "GENERATED_MODE_ASSET"),
    ("reference-only case animation role", GCS, lambda s: C(s, "work.case-overview").update(visual=M("case.motion-json", "generated://x")), "GENERATED_MODE_ASSET"),
    ("blocked video embed role", GCS, lambda s: C(s, "media.case-showcase").update(media=M("case.video-embed", "placeholder://x")), "GENERATED_MODE_ASSET"),
    ("reference home relabelled generated", R, lambda s: s.update(mode="generated"), "GENERATED_MODE_BRAND"),
    ("reference blog post relabelled generated", RP, lambda s: s.update(mode="generated"), "GENERATED_MODE_BRAND"),
    ("reference case study relabelled generated", RCS, lambda s: s.update(mode="generated"), "GENERATED_MODE_BRAND"),
    # ---- schema layer
    ("mode missing", G, lambda s: s.pop("mode"), "SCHEMA"),
    ("mode not in enum", G, lambda s: s.update(mode="remix"), "SCHEMA"),
    ("theme not in enum", G, lambda s: s.update(theme="dark"), "SCHEMA"),
    ("social tags missing", G, lambda s: s["meta"].pop("social"), "SCHEMA"),
    ("social value outside the enum", G, lambda s: s["meta"].update(social="all"), "SCHEMA"),
    ("home claims the full social set", G, lambda s: s["meta"].update(social="full"), "META_SOCIAL_MATCHES_TEMPLATE"),
    ("blog post claims social tags", GP, lambda s: s["meta"].update(social="full"), "META_SOCIAL_MATCHES_TEMPLATE"),
    ("case study claims the full set", GCS, lambda s: s["meta"].update(social="full"), "META_SOCIAL_MATCHES_TEMPLATE"),
    ("services drops its social tags", GS, lambda s: s["meta"].update(social="none"), "META_SOCIAL_MATCHES_TEMPLATE"),
    ("template not in enum", G, lambda s: s.update(template="pricing"), "SCHEMA"),
    ("invented brand field", G, lambda s: s["brand"].update(ownerName="Someone"), "SCHEMA"),
    ("invented section", G, lambda s: s["nodes"].insert(4, {"section": "hero.invented", "content": {}, "motion": {"pattern": "none", "reducedMotionFallback": "none"}}), "SCHEMA"),
    ("invented content field", G, lambda s: C(s, "hero.home").update(tagline="x"), "SCHEMA"),
    ("missing reducedMotionFallback", G, lambda s: nd(s, "content.faq-accordion")["motion"].pop("reducedMotionFallback"), "SCHEMA"),
    ("invented motion field", G, lambda s: nd(s, "content.faq-accordion")["motion"].update(inventedAnimation="spin"), "SCHEMA"),
    ("invented asset role", G, lambda s: CARD(s).update(image=M("image", "generated://x")), "SCHEMA"),
    ("fill outside the tile enum", G, lambda s: CARD(s).update(fill="hotpink"), "SCHEMA"),
    ("too many cards in a cluster", G, lambda s: C(s, "work.card-cluster")["cards"].extend([dict(CARD(s)) for _ in range(6)]), "SCHEMA"),
    ("hero with two words", G, lambda s: C(s, "hero.home").update(words=["a", "b"]), "SCHEMA"),
    ("article block kind outside the enum", GP, lambda s: C(s, "editorial.article-chapter")["blocks"][0].update(kind="quote"), "SCHEMA"),
    # ---- structure
    ("template/node mismatch", G, lambda s: s.update(template="about"), "REQUIRED_SECTION_MISSING"),
    ("required section removed", G, lambda s: drop(s, "content.faq-accordion"), "REQUIRED_SECTION_MISSING"),
    ("reordered sections", GA, lambda s: swap(s, "list.team-roster", "content.process-note"), "TEMPLATE_SEQUENCE"),
    ("duplicate hero", GA, lambda s: s["nodes"].insert(3, copy.deepcopy(nd(s, "hero.words"))), "ONE_HERO"),
    ("hero in the not-found template", GNF, lambda s: s["nodes"].insert(0, copy.deepcopy(nd(EX[GA], "hero.words"))), "ONE_HERO"),
    ("content before hero", GCS, lambda s: swap(s, "hero.case-header", "work.case-overview"), "HERO_FIRST_CONTENT"),
    ("navbar not first", G, lambda s: swap(s, "chrome.navbar", "hero.home"), "MUST_BE_FIRST"),
    ("overlay not last", G, lambda s: swap(s, "chrome.footer", "overlay.partner-credits"), "MUST_BE_LAST"),
    ("overlay without its footer", GS, lambda s: drop(s, "chrome.footer"), "REQUIRES_SECTION"),
    ("home-only section on about", GA, lambda s: s["nodes"].insert(7, copy.deepcopy(nd(EX[G], "proof.award-groups"))), "TEMPLATE_ONLY"),
    ("three work clusters on home", G, lambda s: s["nodes"].insert(4, copy.deepcopy(nd(s, "work.card-cluster"))), "TEMPLATE_SEQUENCE"),
    ("five work clusters on /work", GW, lambda s: s["nodes"].__setitem__(slice(2, 2), [copy.deepcopy(nd(s, "work.card-cluster")) for _ in range(3)]), "TEMPLATE_SEQUENCE"),
    ("empty case body", GCS, lambda s: s.update(nodes=[n for n in s["nodes"] if n["section"] not in ("media.case-showcase", "work.case-image-text")]), "TEMPLATE_SEQUENCE"),
    ("route bound to another template", RP, lambda s: s.update(route="/blog"), "ROUTE_TEMPLATE_MISMATCH"),
    ("case route that is a site page", GCS, lambda s: s.update(route="/about"), "ROUTE_PATTERN"),
    ("blog post route outside the pattern", GP, lambda s: s.update(route="/journal/x"), "ROUTE_PATTERN"),
    ("404 on a served route", RNF, lambda s: s.update(route="/about"), "ROUTE_TEMPLATE_MISMATCH"),
    ("duplicate onePerPage section", G, lambda s: s["nodes"].insert(11, copy.deepcopy(nd(s, "content.faq-accordion"))), "ONE_PER_PAGE"),
    ("related layout on home", G, lambda s: C(s, "editorial.blog-card-grid").update(layout="related"), "BLOG_CLUSTER_LAYOUT"),
    ("staggered layout on a blog post", GP, lambda s: C(s, "editorial.blog-card-grid").update(layout="staggered"), "BLOG_CLUSTER_LAYOUT"),
    ("related row with three cards", GP, lambda s: C(s, "editorial.blog-card-grid")["posts"].append(copy.deepcopy(C(s, "editorial.blog-card-grid")["posts"][0])), "BLOG_CLUSTER_LAYOUT"),
    ("see-all on the first home cluster", G, lambda s: C(s, "work.card-cluster", 0).update(seeAll={"label": "all projects", "href": "/work"}), "CARD_CLUSTER_LAST_ONLY_SEE_ALL"),
    ("see-all on /work", GW, lambda s: C(s, "work.card-cluster", 1).update(seeAll={"label": "all projects", "href": "/work"}), "CARD_CLUSTER_LAST_ONLY_SEE_ALL"),
    # ---- words / motion / assets
    ("maxWords overflow (generated)", GA, lambda s: C(s, "content.studio-statement").update(paragraph=LONG), "MAX_WORDS"),
    ("maxWords overflow (reference)", R, lambda s: C(s, "content.faq-accordion")["items"][0].update(answer=LONG), "MAX_WORDS"),
    ("maxWords overflow inside an item list", G, lambda s: C(s, "list.service-rows")["rows"][0].update(title="a title that is far too long for a row"), "MAX_WORDS"),
    ("maxWords overflow in a link label", G, lambda s: C(s, "hero.home")["button"].update(label="one two three four five six"), "MAX_WORDS"),
    ("motion not allowed for section", G, lambda s: nd(s, "hero.home").update(motion={"pattern": "accordion-height", "reducedMotionFallback": "instant"}), "MOTION_PATTERN_NOT_ALLOWED"),
    ("motion fallback mismatch", G, lambda s: nd(s, "hero.home").update(motion={"pattern": "load-intro-home", "reducedMotionFallback": "none"}), "MOTION_FALLBACK_MISMATCH"),
    ("asset role not allowed in field (reference)", R, lambda s: CARD(s).update(image=M("client.logo", "clone://x")), "ASSET_ROLE_NOT_ALLOWED"),
    ("reference role in a generated field", G, lambda s: C(s, "proof.client-logo-grid")["tiles"][2].update(logo=M("placeholder.award-mark", "placeholder://x")), "ASSET_ROLE_NOT_ALLOWED"),
    # ---- retrieval eligibility (node level)
    ("node flips the overlay to eligible", G, lambda s: nd(s, "overlay.partner-credits").update(retrievalEligible=True), "RETRIEVAL_INELIGIBLE_SHELL_ONLY"),
    ("node marks content ineligible", G, lambda s: nd(s, "content.faq-accordion").update(retrievalEligible=False), "RETRIEVAL_INELIGIBLE_SHELL_ONLY"),
    ("node marks the navbar ineligible", G, lambda s: nd(s, "chrome.navbar").update(retrievalEligible=False), "RETRIEVAL_INELIGIBLE_SHELL_ONLY"),
    # ---- tokens (R10)
    ("raw hex surface", G, lambda s: nd(s, "hero.home")["tokens"].update(surface="#FFFFFF"), "TOKEN_RAW_COLOR"),
    ("raw rgba text", G, lambda s: nd(s, "hero.home")["tokens"].update(text="rgba(0,0,0,.8)"), "TOKEN_RAW_COLOR"),
    ("named colour text", G, lambda s: nd(s, "hero.home")["tokens"].update(text="blue"), "TOKEN_RAW_COLOR"),
    ("unknown token", G, lambda s: nd(s, "hero.home")["tokens"].update(surface="surface.neon"), "TOKEN_UNKNOWN"),
    ("arbitrary spacing", G, lambda s: nd(s, "hero.home")["tokens"].update(spaceBlock="40px"), "TOKEN_ARBITRARY_SPACING"),
    ("arbitrary clamp spacing", G, lambda s: nd(s, "hero.home")["tokens"].update(spaceBlock="clamp(10px, 5vh, 99px)"), "TOKEN_ARBITRARY_SPACING"),
    ("unsupported font", G, lambda s: nd(s, "hero.home")["tokens"].update(font="Comic Sans MS"), "TOKEN_FONT_UNSUPPORTED"),
    ("original commercial font", G, lambda s: nd(s, "hero.home")["tokens"].update(font="PP Mori"), "TOKEN_FONT_UNSUPPORTED"),
    ("original font token", G, lambda s: nd(s, "hero.home")["tokens"].update(font="font.family.reference"), "TOKEN_FONT_UNSUPPORTED"),
    ("invalid surface/text pair", G, lambda s: nd(s, "media.case-showcase" if False else "hero.home")["tokens"].update(surface="surface.page", text="text.on-dark"), "TOKEN_THEME_COMBINATION"),
    ("surface not allowed for section", G, lambda s: nd(s, "hero.home")["tokens"].update(surface="surface.panel", text="text.primary"), "TOKEN_SURFACE_NOT_ALLOWED"),
    ("token of wrong category", G, lambda s: nd(s, "hero.home")["tokens"].update(surface="text.primary"), "TOKEN_CATEGORY"),
    ("non-referenceable surface", G, lambda s: nd(s, "hero.home")["tokens"].update(surface="surface.error"), "TOKEN_NOT_REFERENCEABLE"),
    ("non-referenceable spacing token", G, lambda s: nd(s, "hero.home")["tokens"].update(spaceBlock="space.2-4"), "TOKEN_NOT_REFERENCEABLE"),
    ("foundation colour as a text token", G, lambda s: nd(s, "hero.home")["tokens"].update(text="color.accent"), "TOKEN_CATEGORY"),
]


def repo_mut(fn):
    def run():
        repo = sv.load_repo(ROOT); fn(repo); return repo
    return run


def _flip(r, sid, v):
    r["contracts"][sid].update(retrievalEligible=v)


REPO_MUTATIONS = [
    ("registry loosens logo availability", repo_mut(lambda r: r["roles"]["brand.logo-mark"].update(availability="generation-safe")), "PIN_AVAILABILITY"),
    ("registry loosens client logo availability", repo_mut(lambda r: r["roles"]["client.logo"].update(availability="reference-only")), "PIN_AVAILABILITY"),
    ("registry sets client logo policy to a different valid value", repo_mut(lambda r: r["roles"]["client.logo"].update(generationPolicy="may-generate-new")), "PIN_AVAILABILITY"),
    ("registry sets the form endpoint policy to a different valid value", repo_mut(lambda r: r["roles"]["form.live-endpoint"].update(generationPolicy="must-not-reuse")), "PIN_AVAILABILITY"),
    ("registry makes project images reusable", repo_mut(lambda r: r["roles"]["work.project-image"].update(generationPolicy="may-reuse-licensed")), "PIN_AVAILABILITY"),
    ("registry tightens a safe role", repo_mut(lambda r: r["roles"]["generated.project-visual"].update(availability="reference-only")), "PIN_AVAILABILITY"),
    ("registry drops substitutes", repo_mut(lambda r: r["roles"]["award.mark"].pop("generationSafeSubstitutes")), "PIN_AVAILABILITY"),
    ("registry adds an unpinned role", repo_mut(lambda r: r["roles"].update({"brand.extra": {"availability": "generation-safe"}})), "PIN_AVAILABILITY"),
    ("contract field allows the real mark in generated mode", repo_mut(lambda r: r["contracts"]["chrome.navbar"]["content"]["mark"]["generatedAssetRoles"].append("brand.logo-mark")), "PIN_AVAILABILITY"),
    ("contract field allows real portraits in generated mode", repo_mut(lambda r: r["contracts"]["list.team-roster"]["content"]["members"]["fields"]["portrait"]["generatedAssetRoles"].append("person.portrait")), "PIN_AVAILABILITY"),
    ("contract flips the overlay to eligible", repo_mut(lambda r: _flip(r, "overlay.partner-credits", True)), "PIN_RETRIEVAL"),
    ("allowlist flips the overlay to eligible", repo_mut(lambda r: r["allowlist"]["sections"]["overlay.partner-credits"].update(retrievalEligible=True)), "PIN_RETRIEVAL"),
    ("contract+allowlist flip the overlay together", repo_mut(lambda r: (_flip(r, "overlay.partner-credits", True), r["allowlist"]["sections"]["overlay.partner-credits"].update(retrievalEligible=True))), "PIN_RETRIEVAL"),
    ("contract+allowlist+template flip the overlay together", repo_mut(lambda r: (_flip(r, "overlay.partner-credits", True), r["allowlist"]["sections"]["overlay.partner-credits"].update(retrievalEligible=True), [n.update(retrievalEligible=True) for t in r["templates"].values() for n in t["nodes"] if n.get("section") == "overlay.partner-credits"])), "PIN_RETRIEVAL"),
    ("contract marks content ineligible", repo_mut(lambda r: r["contracts"]["conversion.enquiry-form"].update(retrievalEligible=False, retrievalReason="x" * 40)), "PIN_RETRIEVAL"),
    ("template node flips eligibility", repo_mut(lambda r: r["templates"]["case-study"]["nodes"][1].update(retrievalEligible=False)), "PIN_RETRIEVAL"),
]


def gate_mut(fn):
    def run():
        m = json.loads((ROOT / "extraction/measured-values.json").read_text())
        w = json.loads((ROOT / "extraction/wrapper-whitelist.json").read_text())
        fn(m, w); return wg.check(ROOT, measured=m, whitelist=w)
    return run


def sec(m, route, sid, k=0):
    return [s for s in m["sectionHeights"]["routes"][route]["sections"] if s["id"] == sid][k]


AB, CT = "/about", "/contact"
PH = lambda m, r=CT: m["sectionHeights"]["routes"][r]["pageHeight"]
GOOD_WL = lambda h, route=AB, sid="hero.words": {"route": route, "section": sid, "reviewedBy": "design lead (human)", "justification": "Adversarial fixture: a deliberately tall hero used to prove the whitelist path.", "maxHeightPx": h}
GATE_MUTATIONS = [
    ("HERO 1900px warns", gate_mut(lambda m, w: sec(m, AB, "hero.words").update(h=1900)), "warn:GATE_HERO_TALL"),
    ("HERO 3100px fails", gate_mut(lambda m, w: sec(m, AB, "hero.words").update(h=3100)), "GATE_HERO_TOO_TALL"),
    ("article HERO 3100px fails", gate_mut(lambda m, w: sec(m, "/blog/design-and-the-question-of-authority", "hero.article-header").update(h=3100)), "GATE_HERO_TOO_TALL"),
    ("HERO 3100px whitelisted still warns", gate_mut(lambda m, w: (sec(m, AB, "hero.words").update(h=3100), w["entries"].append(GOOD_WL(3200)))), "warn-only:GATE_HERO_TOO_TALL"),
    ("majority section fails", gate_mut(lambda m, w: sec(m, CT, "conversion.enquiry-form").update(h=0.7 * PH(m))), "GATE_MAJORITY_SECTION"),
    ("55% section warns", gate_mut(lambda m, w: sec(m, CT, "conversion.enquiry-form").update(h=0.55 * PH(m))), "warn:GATE_LARGE_SECTION"),
    ("whole /work grid as one block fails", gate_mut(lambda m, w: (m["sectionHeights"]["routes"]["/work"]["sections"].__setitem__(slice(None), [s for s in m["sectionHeights"]["routes"]["/work"]["sections"] if s["id"] != "work.card-cluster"] + [{"id": "work.card-cluster", "top": 600, "h": 9768, "inFlow": True, "position": "static"}]))), "GATE_MAJORITY_SECTION"),
    ("whitelist without justification", gate_mut(lambda m, w: (sec(m, AB, "hero.words").update(h=3100), w["entries"].append({**GOOD_WL(3200), "justification": "short"}))), "GATE_WHITELIST_INVALID"),
    ("whitelist agent posing as human review", gate_mut(lambda m, w: (sec(m, AB, "hero.words").update(h=3100), w["entries"].append({**GOOD_WL(3200), "reviewedBy": "design-repo agent"}))), "GATE_WHITELIST_INVALID"),
    ("stale whitelist entry", gate_mut(lambda m, w: w["entries"].append(GOOD_WL(3200))), "GATE_WHITELIST_STALE"),
    ("whitelist over cap", gate_mut(lambda m, w: (sec(m, AB, "hero.words").update(h=3100), w["entries"].append(GOOD_WL(3050)))), "GATE_WHITELIST_OVER_CAP"),
    ("missing route measurement", gate_mut(lambda m, w: m["sectionHeights"]["routes"].pop("/blog")), "GATE_MISSING_MEASUREMENT"),
    ("measured section without contract", gate_mut(lambda m, w: m["sectionHeights"]["routes"][AB]["sections"].append({"id": "hero.ghost", "top": 0, "h": 10, "inFlow": True, "position": "static"})), "GATE_UNKNOWN_SECTION"),
    ("template section never measured", gate_mut(lambda m, w: [r.update(sections=[s for s in r["sections"] if s["id"] != "list.product-links"]) for r in m["sectionHeights"]["routes"].values()]), "GATE_MISSING_MEASUREMENT"),
    ("HERO not measured on a page that has one", gate_mut(lambda m, w: m["sectionHeights"]["routes"][AB].update(sections=[s for s in m["sectionHeights"]["routes"][AB]["sections"] if s["id"] != "hero.words"])), "GATE_MISSING_MEASUREMENT"),
    ("no sectionHeights at all", gate_mut(lambda m, w: m.pop("sectionHeights")), "GATE_MISSING_MEASUREMENT"),
    ("measured at the wrong viewport", gate_mut(lambda m, w: m["sectionHeights"].update(viewport="390x844")), "GATE_WRONG_VIEWPORT"),
    ("thresholds loosened in JSON only", gate_mut(lambda m, w: m.update(thresholds={"heroWarnPx": 5000, "heroErrorPx": 9000, "shareWarn": 0.9, "shareError": 0.95})), "GATE_THRESHOLD_DRIFT"),
    ("responsive measurement missing (390)", gate_mut(lambda m, w: m["responsiveHeights"].pop("390x844")), "GATE_RESPONSIVE_MISSING"),
    ("responsive measurement missing for a route (768)", gate_mut(lambda m, w: m["responsiveHeights"]["768x1024"]["routes"].pop("/services")), "GATE_RESPONSIVE_MISSING"),
]


def main():
    repo = sv.load_repo(ROOT); ok = 0; bad = []
    print("controls")
    for name, spec in EX.items():
        e, w = sv.validate(copy.deepcopy(spec), repo)
        print(f"  {'PASS' if not e else 'FAIL'}  control {name} ({spec['mode']}) errors={len(e)} warnings={len(w)}")
        if e: bad.append(f"control {name}: {e[:3]}")
    e, w = wg.check(ROOT)
    print(f"  {'PASS' if not e else 'FAIL'}  control wrapper gate on real measurements errors={len(e)} warnings={len(w)}")
    if e: bad.append(f"gate control: {e[:3]}")
    print("mutations")
    for name, base, fn, code in MUTATIONS:
        s = copy.deepcopy(EX[base]); fn(s)
        e, _ = sv.validate(s, repo)
        hit = code in [c for c, _ in e]
        ok += hit
        print(f"  {'REJECTED' if hit else 'MISSED  '}  [{code}] {name} ({base})")
        if not hit: bad.append(f"{name}: expected {code}, got {[c for c, _ in e][:4]}")
    for name, mk, code in REPO_MUTATIONS:
        e, _ = sv.validate(copy.deepcopy(EX[G]), mk())
        hit = code in [c for c, _ in e]; ok += hit
        print(f"  {'REJECTED' if hit else 'MISSED  '}  [{code}] {name} (repo)")
        if not hit: bad.append(f"{name}: expected {code}")
    for name, run, code in GATE_MUTATIONS:
        e, w = run(); ec, wc = [c for c, _ in e], [c for c, _ in w]
        if code.startswith("warn-only:"):
            c = code.split(":")[1]; hit = c in wc and not e
        elif code.startswith("warn:"):
            c = code.split(":")[1]; hit = c in wc
        else:
            hit = code in ec
        ok += hit
        print(f"  {'CAUGHT  ' if hit else 'MISSED  '}  [{code}] {name} (gate)")
        if not hit: bad.append(f"{name}: expected {code}, errors {ec[:3]} warnings {wc[:3]}")
    total = len(MUTATIONS) + len(REPO_MUTATIONS) + len(GATE_MUTATIONS)
    print(f"\nadversarial: {ok}/{total} mutations rejected; {len(EX) + 1} controls; failures: {len(bad)}")
    for b in bad: print("  FAIL", b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
