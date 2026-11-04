#!/usr/bin/env python3
"""Semantic validator for PageSpecs: everything Draft-07 JSON Schema cannot express.

    python3 schema/semantic_validate.py <pagespec.json> [...]      # exit 1 on any error
    python3 schema/semantic_validate.py --examples                 # every example in schema/

Layers, in order:
  1. repo integrity pins (PINNED_AVAILABILITY, PINNED_GENERATION_POLICY, RETRIEVAL_INELIGIBLE): the registry files must
     agree with the tables pinned below, so editing assets/asset-roles.json, a contract, the allowlist or a template
     alone cannot loosen them (PIN_AVAILABILITY, PIN_RETRIEVAL);
  2. Draft-07 schema (SCHEMA);
  3. template cross-reference: the declared template's REAL node list incl. the case-body slot and maxRepeat caps
     (TEMPLATE_SEQUENCE, REQUIRED_SECTION_MISSING), ROUTE_PATTERN, ROUTE_TEMPLATE_MISMATCH;
  4. compatibility graph rules (ids identical to compatibility/graph.json, checked by verify_all.py GRAPH_SYNC);
  5. per-field maxWords from the section contracts (MAX_WORDS);
  6. motion (MOTION_PATTERN_NOT_ALLOWED, MOTION_FALLBACK_MISMATCH);
  7. tokens against tokens/llm/token-catalog.json + token-policy.json (TOKEN_*);
  8. asset roles per field (ASSET_ROLE_NOT_ALLOWED) and, when mode == "generated", the source-identity rules
     GENERATED_MODE_{BRAND,PERSON,CLIENT,CONTACT,AWARD,PRESS,CTA,STORE,RATING,COPY,URL,MEDIA,ASSET}, driven by
     schema/protected-content.json (patterns derived from the real source by extraction/build_protected.py; person,
     client, award, press, place and copy patterns are hashed word n-grams). Text is normalised (NFKC, zero-width
     removed, curly quotes straightened, case folded) before matching.
The repo root is derived from this file's location; no absolute path is used.
"""
import hashlib, json, re, sys, unicodedata
from pathlib import Path
from urllib.parse import urlparse

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent.parent

# R3: availability pinned in code, independent of assets/asset-roles.json.
PINNED_AVAILABILITY = {
    "brand.logo-mark": "blocked-for-generation", "brand.partner-badge": "blocked-for-generation", "client.logo": "blocked-for-generation",
    "award.mark": "blocked-for-generation", "person.portrait": "blocked-for-generation", "case.video-embed": "blocked-for-generation",
    "form.live-endpoint": "blocked-for-generation",
    "work.project-image": "reference-only", "article.image": "reference-only", "case.motion-json": "reference-only", "font.display-original": "reference-only",
    "generated.brand-mark": "generation-safe", "placeholder.brand-mark": "generation-safe", "generated.project-visual": "generation-safe",
    "user.project-media": "generation-safe", "placeholder.client-logo": "generation-safe", "placeholder.award-mark": "generation-safe",
    "fictional.portrait": "generation-safe", "generated.article-image": "generation-safe", "generated.motion-graphic": "generation-safe",
    "placeholder.video": "generation-safe", "placeholder.partner-badge": "generation-safe", "licensed-or-fallback.font": "generation-safe",
    "icon.ui": "generation-safe", "placeholder.url": "generation-safe", "original.copy": "generation-safe", "fictional.person": "generation-safe",
    "placeholder.metric": "generation-safe",
}
# Roles whose generation policy is pinned to one specific value (a real mark/likeness/endpoint is never reusable).
PINNED_GENERATION_POLICY = {"brand.logo-mark": "must-not-reuse", "brand.partner-badge": "must-not-reuse", "client.logo": "must-not-reuse", "award.mark": "must-not-reuse",
                            "person.portrait": "must-not-reuse", "work.project-image": "must-not-reuse", "article.image": "must-not-reuse", "case.video-embed": "must-not-reuse",
                            "form.live-endpoint": "must-not-reuse-live-endpoint", "user.project-media": "user-supplied-only", "placeholder.video": "user-supplied-only"}
# R8: runtime/utility UI that is not retrievable, pinned in code.
RETRIEVAL_INELIGIBLE = {"overlay.partner-credits"}
RUNTIME_ID = re.compile(r"(^shell\.|^utility\.|^overlay\.|overlay|modal|dialog|drawer|loader|preloader|toast|hud|cookie|consent|cursor|lightbox)")
NON_CONTENT = {"SHELL", "UTILITY"}
NO_HERO_TEMPLATES = {"not-found"}
RESERVED_HOST = re.compile(r"(^|\.)(example|invalid)$|^example\.(com|org|net)$")
MEDIA_SCHEMES = ("generated://", "placeholder://", "user://")

RULES = {  # graph rule ids -> severity; verify_all.py checks equality with compatibility/graph.json
    "ONE_HERO": "error", "HERO_FIRST_CONTENT": "error", "MUST_BE_FIRST": "error", "MUST_BE_LAST": "error", "ONE_PER_PAGE": "error",
    "REQUIRES_SECTION": "error", "TEMPLATE_ONLY": "error", "ROUTE_PATTERN": "error", "ROUTE_TEMPLATE_MISMATCH": "error",
    "RETRIEVAL_INELIGIBLE_SHELL_ONLY": "error", "BLOG_CLUSTER_LAYOUT": "error", "CARD_CLUSTER_LAST_ONLY_SEE_ALL": "error",
    "NO_ADJACENT_SAME_CATEGORY": "warn", "NO_CONSECUTIVE_DUPLICATE": "warn", "ARTICLE_HAS_HEADED_CHAPTER": "warn", "MOTION_BUDGET": "warn",
}


def _j(p):
    return json.loads(Path(p).read_text())


def load_repo(root=ROOT):
    root = Path(root)
    return {
        "root": root,
        "schema": _j(root / "schema/pagespec.schema.json"),
        "contracts": {p.stem: _j(p) for p in sorted((root / "sections").glob("*.json"))},
        "templates": _j(root / "templates/templates.json")["templates"],
        "routes": _j(root / "templates/routes.json")["routes"],
        "graph": _j(root / "compatibility/graph.json"),
        "catalog": _j(root / "tokens/llm/token-catalog.json")["tokens"],
        "policy": _j(root / "tokens/llm/token-policy.json"),
        "allowlist": _j(root / "tokens/llm/component-allowlist.json"),
        "roles": _j(root / "assets/asset-roles.json")["roles"],
        "protected": _j(root / "schema/protected-content.json"),
        "motion": _j(root / "tokens/00-foundation/motion-patterns.json")["patterns"],
    }


def repo_integrity(repo):
    """Pins that every validation run re-asserts against the registry files."""
    errs = []
    roles = repo["roles"]
    if set(roles) != set(PINNED_AVAILABILITY):
        errs.append(("PIN_AVAILABILITY", f"asset roles {sorted(set(roles) ^ set(PINNED_AVAILABILITY))} differ from the pinned table"))
    for r, av in PINNED_AVAILABILITY.items():
        if r in roles and roles[r].get("availability") != av:
            errs.append(("PIN_AVAILABILITY", f"{r}: registry says {roles[r].get('availability')!r}, pinned {av!r}"))
    for r, pol in PINNED_GENERATION_POLICY.items():
        if r in roles and roles[r].get("generationPolicy") != pol:
            errs.append(("PIN_AVAILABILITY", f"{r}: generationPolicy {roles[r].get('generationPolicy')!r}, pinned {pol!r}"))
    for r, d in roles.items():
        if d.get("availability") != "generation-safe":
            subs = d.get("generationSafeSubstitutes") or []
            if not subs or any(PINNED_AVAILABILITY.get(s) != "generation-safe" for s in subs):
                errs.append(("PIN_AVAILABILITY", f"{r}: needs generationSafeSubstitutes that are generation-safe"))
    for sid, c in repo["contracts"].items():
        for name, role in _field_gen_roles(c["content"]):
            if PINNED_AVAILABILITY.get(role) != "generation-safe":
                errs.append(("PIN_AVAILABILITY", f"{sid}.{name}: generatedAssetRoles lists {role} which is not generation-safe"))
    false_set = {sid for sid, c in repo["contracts"].items() if c.get("retrievalEligible") is False}
    if false_set != RETRIEVAL_INELIGIBLE:
        errs.append(("PIN_RETRIEVAL", f"contracts with retrievalEligible:false {sorted(false_set)} != pinned {sorted(RETRIEVAL_INELIGIBLE)}"))
    for sid, c in repo["contracts"].items():
        if RUNTIME_ID.search(sid) and sid not in RETRIEVAL_INELIGIBLE:
            errs.append(("PIN_RETRIEVAL", f"{sid} looks like runtime UI but is not in RETRIEVAL_INELIGIBLE"))
        if c.get("retrievalEligible") is False and len(c.get("retrievalReason", "")) < 30:
            errs.append(("PIN_RETRIEVAL", f"{sid}: retrievalReason must be >= 30 chars"))
        if c.get("retrievalEligible") is False and c["semantic"]["category"] not in NON_CONTENT:
            errs.append(("RETRIEVAL_INELIGIBLE_SHELL_ONLY", f"{sid}: content category {c['semantic']['category']} cannot be ineligible"))
        a = repo["allowlist"]["sections"].get(sid)
        if a is not None and a.get("retrievalEligible") != (sid not in RETRIEVAL_INELIGIBLE):
            errs.append(("PIN_RETRIEVAL", f"allowlist {sid}.retrievalEligible disagrees with the pin"))
    for t, tpl in repo["templates"].items():
        for n in tpl["nodes"]:
            if "section" in n and n.get("retrievalEligible") != (n["section"] not in RETRIEVAL_INELIGIBLE):
                errs.append(("PIN_RETRIEVAL", f"template {t} node {n['section']} retrievalEligible disagrees with the pin"))
    return errs


# ------------------------------------------------------------------ helpers
def _field_gen_roles(fields, prefix=""):
    for name, f in fields.items():
        for r in f.get("generatedAssetRoles", []):
            yield prefix + name, r
        if f["kind"] in ("items", "group"):
            yield from _field_gen_roles(f["fields"], prefix + name + ".")


def words(s):
    return len(re.findall(r"\S+", s))


def walk_strings(obj, path=""):
    if isinstance(obj, str):
        yield path, obj
    elif isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk_strings(v, f"{path}.{k}" if path else k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_strings(v, f"{path}[{i}]")


def walk_media(obj, path=""):
    if isinstance(obj, dict):
        if "assetRole" in obj and "ref" in obj:
            yield path, obj
        for k, v in obj.items():
            yield from walk_media(v, f"{path}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_media(v, f"{path}[{i}]")


def check_words(fields, content, path, errs):
    for name, f in fields.items():
        if name not in content:
            continue
        v, k, p = content[name], f["kind"], f"{path}.{name}"
        if k == "text" and isinstance(v, str) and words(v) > f["maxWords"]:
            errs.append(("MAX_WORDS", f"{p}: {words(v)} words > {f['maxWords']}"))
        elif k == "textList" and isinstance(v, list):
            for i, s in enumerate(v):
                if isinstance(s, str) and words(s) > f["maxWords"]:
                    errs.append(("MAX_WORDS", f"{p}[{i}]: {words(s)} words > {f['maxWords']}"))
        elif k == "link" and isinstance(v, dict) and words(v.get("label", "")) > f["maxWords"]:
            errs.append(("MAX_WORDS", f"{p}.label: {words(v['label'])} words > {f['maxWords']}"))
        elif k == "linkList" and isinstance(v, list):
            for i, l in enumerate(v):
                if isinstance(l, dict) and words(l.get("label", "")) > f["maxWords"]:
                    errs.append(("MAX_WORDS", f"{p}[{i}].label: {words(l['label'])} words > {f['maxWords']}"))
        elif k in ("media", "mediaList"):
            for i, m in enumerate(v if isinstance(v, list) else [v]):
                if isinstance(m, dict) and words(m.get("alt", "")) > 40:
                    errs.append(("MAX_WORDS", f"{p}[{i}].alt: {words(m['alt'])} words > 40"))
        elif k == "items" and isinstance(v, list):
            for i, it in enumerate(v):
                if isinstance(it, dict):
                    check_words(f["fields"], it, f"{p}[{i}]", errs)
        elif k == "group" and isinstance(v, dict):
            check_words(f["fields"], v, p, errs)


def field_roles(fields, content, out, path=""):
    """(field path, media object, reference roles, generated roles) for every media value, by contract field kind."""
    for name, f in fields.items():
        if name not in content:
            continue
        v = content[name]
        if f["kind"] in ("media", "mediaList"):
            for m in (v if isinstance(v, list) else [v]):
                if isinstance(m, dict):
                    out.append((path + name, m, f["assetRoles"], f["generatedAssetRoles"]))
        elif f["kind"] == "items" and isinstance(v, list):
            for it in v:
                if isinstance(it, dict):
                    field_roles(f["fields"], it, out, path + name + ".")
        elif f["kind"] == "group" and isinstance(v, dict):
            field_roles(f["fields"], v, out, path + name + ".")


def term_re(term, cs=False):
    return re.compile(r"(?<![\w])" + re.escape(term) + r"(?![\w])", 0 if cs else re.I)


def norm_text(s):
    s = unicodedata.normalize("NFKC", s)
    s = re.sub("[​-‍⁠﻿]", "", s)
    return s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')


def norm(s):
    return re.sub(r"[^a-z0-9à-öø-ÿ']+", " ", norm_text(s).lower()).strip()


def _h(ws, hexlen):
    return hashlib.sha1(" ".join(ws).encode()).hexdigest()[:hexlen]


_cache = {}


def compiled(repo):
    key = id(repo["protected"])
    if key in _cache:
        return _cache[key]
    pats = repo["protected"]["sourceBrand"]["patterns"]
    c = {}
    for g, d in pats.items():
        if g in ("COPY", "URL", "MEDIA", "PERSON", "CLIENT", "AWARD", "PRESS"):
            continue
        c[g] = [term_re(t) for t in d.get("terms", [])] + [re.compile(r) for r in d.get("regex", [])]
    for g, d in repo["protected"].get("genericGuards", {}).items():
        c.setdefault(g, [])
        c[g] += [term_re(t) for t in d.get("terms", [])] + [re.compile(r) for r in d.get("regex", [])]
    # CONTACT also carries hashed place words
    c["HASHED"] = {g: (set(pats[g].get("hashes", [])), set(pats[g].get("caseSensitiveHashes", []))) for g in ("PERSON", "CLIENT", "AWARD", "PRESS", "CONTACT") if g in pats}
    cp = pats["COPY"]
    c["COPY_PHRASES"] = [term_re(p) for p in cp["phrases"]]
    hx = cp["shingleHex"]
    c["SHINGLES"] = {cp["shingleHashes"][i:i + hx] for i in range(0, len(cp["shingleHashes"]), hx)}
    c["SH"], c["HX"] = cp["shingleSize"], hx
    c["URL_DOMAINS"] = [d.lower() for d in pats["URL"]["domains"]]
    c["MEDIA"] = [re.compile(r) for r in pats["MEDIA"]["regex"]]
    _cache[key] = c
    return c


def hashed_hit(s, ci, cs, hexlen=12, n=4):
    """First normalised word window (1..n words) whose hash is in the case-insensitive set, or an exact-case 1-2 word run in the cs set."""
    w = norm(s).split()
    for size in range(1, n + 1):
        for i in range(0, len(w) - size + 1):
            if _h(w[i:i + size], hexlen) in ci:
                return " ".join(w[i:i + size])
    raw = re.findall(r"[A-Za-z0-9']+", norm_text(s))
    for size in (1, 2):
        for i in range(0, len(raw) - size + 1):
            if _h(raw[i:i + size], hexlen) in cs:
                return " ".join(raw[i:i + size])
    return None


def url_strings(spec):
    for p, s in walk_strings({"brand": spec.get("brand"), "nodes": spec.get("nodes")}):
        if re.match(r"(?i)^(https?://|mailto:|tel:|www\.|//)", s.strip()) or p.endswith(".href") or p == "brand.domain":
            yield p, s.strip()


GROUP_RULE = (("BRAND", "GENERATED_MODE_BRAND"), ("CTA", "GENERATED_MODE_CTA"), ("STORE", "GENERATED_MODE_STORE"), ("RATING", "GENERATED_MODE_RATING"), ("CONTACT", "GENERATED_MODE_CONTACT"))
HASH_RULE = (("PERSON", "GENERATED_MODE_PERSON"), ("CLIENT", "GENERATED_MODE_CLIENT"), ("AWARD", "GENERATED_MODE_AWARD"), ("PRESS", "GENERATED_MODE_PRESS"), ("CONTACT", "GENERATED_MODE_CONTACT"))
# enum-valued and structural fields carry no free text
SKIP_PATH = re.compile(r"(\.section|\.pattern|\.reducedMotionFallback|\.assetRole|\.ref|\.layout|\.fill|\.kind|\.side|\.panel|\.numberTone|\.hero)$")


def generated_mode(spec, repo, errs):
    c = compiled(repo)
    texts = [(p, norm_text(s)) for p, s in walk_strings({"meta": spec.get("meta"), "brand": spec.get("brand"), "nodes": spec.get("nodes")}) if not SKIP_PATH.search(p) and ".tokens." not in p]

    def joined(o, path):  # copy split across list items (wordmark lines, hero words, contact lines) is also checked joined
        if isinstance(o, list):
            if len(o) > 1 and all(isinstance(x, str) for x in o):
                yield path + "[joined]", norm_text(" ".join(o))
            for i, x in enumerate(o):
                yield from joined(x, f"{path}[{i}]")
        elif isinstance(o, dict):
            for k, v in o.items():
                yield from joined(v, f"{path}.{k}")
    texts += list(joined(spec.get("nodes", []), "nodes"))
    for p, s in texts:
        for group, code in GROUP_RULE:
            hit = next((r.pattern for r in c.get(group, []) if r.search(s)), None)
            if hit:
                errs.append((code, f"{p}: source {group.lower()} pattern {hit!r} in {s[:60]!r}"))
        for group, code in HASH_RULE:
            ci, cs = c["HASHED"].get(group, (set(), set()))
            hit = hashed_hit(s, ci, cs, c["HX"])
            if hit:
                errs.append((code, f"{p}: matches a protected {group.lower()} name ({'hashed' if group != 'CONTACT' else 'place'}) in {s[:60]!r}"))
        if any(r.search(s) for r in c["COPY_PHRASES"]):
            errs.append(("GENERATED_MODE_COPY", f"{p}: source phrase in {s[:60]!r}"))
        else:
            w = norm(s).split()
            for i in range(0, len(w) - c["SH"] + 1):
                if _h(w[i:i + c["SH"]], c["HX"]) in c["SHINGLES"]:
                    errs.append(("GENERATED_MODE_COPY", f"{p}: shares a {c['SH']}-word window with source copy"))
                    break
        low = s.lower()
        for d in c["URL_DOMAINS"]:
            if d in low:
                errs.append(("GENERATED_MODE_URL", f"{p}: source URL/domain {d!r}"))
                break
    for p, s in url_strings(spec):
        low = s.lower()
        if low.startswith(("#", "?")) or (low.startswith("/") and not low.startswith("//")):
            continue
        if low.startswith("tel:"):
            errs.append(("GENERATED_MODE_CONTACT", f"{p}: phone links are not part of a generated page's vocabulary")); continue
        if low.startswith("mailto:"):
            host = low.split("@")[-1].split("?")[0]
        elif p == "brand.domain":
            host = low
        else:
            host = urlparse(s if "://" in s else "https://" + s.lstrip("/")).hostname or ""
        if not RESERVED_HOST.search(host):
            errs.append(("GENERATED_MODE_URL", f"{p}: {s!r} is not on a reserved domain (.example/.invalid/example.com)"))
    for p, m in walk_media(spec.get("nodes", [])):
        role, ref = m.get("assetRole"), m.get("ref", "")
        if PINNED_AVAILABILITY.get(role) != "generation-safe":
            errs.append(("GENERATED_MODE_ASSET", f"nodes{p}: role {role!r} is {PINNED_AVAILABILITY.get(role)} (not generation-safe)"))
        if not ref.startswith(MEDIA_SCHEMES) or any(r.search(ref) for r in c["MEDIA"]):
            errs.append(("GENERATED_MODE_MEDIA", f"nodes{p}: ref {ref!r} must be generated://, placeholder:// or user:// and not a source asset"))


def match_template(spec, repo, errs):
    tpl = repo["templates"].get(spec["template"])
    nodes = spec["nodes"]; i = 0
    for t in tpl["nodes"]:
        if "slot" in t:
            n0 = i
            while i < len(nodes) and nodes[i]["section"] in t["allowed"]:
                i += 1
            cnt = i - n0
            if cnt < t.get("minItems", 0) or cnt > t.get("maxItems", 10 ** 6):
                errs.append(("TEMPLATE_SEQUENCE", f"slot {t['slot']}: {cnt} nodes, allowed {t.get('minItems', 0)}-{t.get('maxItems')}"))
            continue
        if i < len(nodes) and nodes[i]["section"] == t["section"]:
            i += 1; run = 1
            while t.get("repeatable") and i < len(nodes) and nodes[i]["section"] == t["section"]:
                i += 1; run += 1
            if run > t.get("maxRepeat", 10 ** 6):
                errs.append(("TEMPLATE_SEQUENCE", f"{t['section']} repeats {run} times, template {spec['template']} allows {t['maxRepeat']}"))
        elif t.get("required"):
            errs.append(("REQUIRED_SECTION_MISSING", f"template {spec['template']} requires {t['section']} at this position (found {nodes[i]['section'] if i < len(nodes) else 'end of page'})"))
    if i < len(nodes):
        errs.append(("TEMPLATE_SEQUENCE", f"node[{i}] {nodes[i]['section']} is not allowed at this position by template {spec['template']}"))


def check_tokens(i, n, spec, repo, errs):
    cat, pol, con = repo["catalog"], repo["policy"], repo["contracts"][n["section"]]
    t = n.get("tokens") or {}
    raw_color = re.compile(pol["rawValueRestrictions"]["color"]["regex"])
    raw_space = re.compile(pol["rawValueRestrictions"]["spacing"]["regex"])
    for field, v in t.items():
        want = pol["pageSpecTokenFields"][field]["category"]
        p = f"nodes[{i}].tokens.{field}"
        if raw_color.search(v) and v not in cat:
            errs.append(("TOKEN_RAW_COLOR", f"{p}: raw colour {v!r}; use a catalog token")); continue
        if field == "spaceBlock" and raw_space.match(v):
            errs.append(("TOKEN_ARBITRARY_SPACING", f"{p}: arbitrary spacing {v!r}; use a space.* token")); continue
        if field == "font" and v not in pol["fontFamilyAllowed"]:
            errs.append(("TOKEN_FONT_UNSUPPORTED", f"{p}: font {v!r} not in {pol['fontFamilyAllowed']}")); continue
        if v not in cat:
            errs.append(("TOKEN_UNKNOWN", f"{p}: {v!r} not in token-catalog")); continue
        if cat[v]["category"] != want:
            errs.append(("TOKEN_CATEGORY", f"{p}: {v!r} is {cat[v]['category']}, field needs {want}")); continue
        if not cat[v].get("pageSpecReferenceable"):
            errs.append(("TOKEN_NOT_REFERENCEABLE", f"{p}: {v!r} is not PageSpec-referenceable"))
    surf, text = t.get("surface"), t.get("text")
    if surf and surf in cat:
        if surf not in pol["themes"].get(spec["theme"], []):
            errs.append(("TOKEN_THEME_COMBINATION", f"nodes[{i}]: surface {surf!r} not defined in theme {spec['theme']!r}"))
        if surf not in con["tokens"]["surfaces"]:
            errs.append(("TOKEN_SURFACE_NOT_ALLOWED", f"nodes[{i}] {n['section']}: surface {surf!r} not in {con['tokens']['surfaces']}"))
    eff = surf or (con["tokens"]["surfaces"][0] if con["tokens"]["surfaces"] else None)
    if text and text in cat and eff and text not in pol["surfaceTextPairs"].get(eff, []):
        errs.append(("TOKEN_THEME_COMBINATION", f"nodes[{i}]: text {text!r} on {eff!r} is not an approved pair"))


def validate(spec, repo=None):
    """Return (errors, warnings); each a list of (code, message)."""
    repo = repo or load_repo()
    errs, warns = list(repo_integrity(repo)), []
    try:
        from jsonschema import Draft7Validator
    except ImportError:
        return errs + [("SCHEMA", "jsonschema is required (pip install jsonschema)")], warns
    se = sorted(Draft7Validator(repo["schema"]).iter_errors(spec), key=lambda e: list(e.absolute_path))
    for e in se:
        errs.append(("SCHEMA", f"{'/'.join(map(str, e.absolute_path))}: {e.message[:160]}"))
    if se:
        return errs, warns
    C, nodes, mode = repo["contracts"], spec["nodes"], spec["mode"]
    tpl = repo["templates"][spec["template"]]
    if not re.match(tpl["routePattern"], spec["route"]):
        errs.append(("ROUTE_PATTERN", f"route {spec['route']} does not match {tpl['routePattern']} of {spec['template']}"))
    routes = {r["path"]: r for r in repo["routes"]}
    if mode == "reference":
        r = routes.get(spec["route"])
        if tpl.get("catchAll"):
            if r:
                errs.append(("ROUTE_TEMPLATE_MISMATCH", f"{spec['route']} is a served route ({r['template']}), not a 404"))
        elif not r or r["template"] != spec["template"]:
            errs.append(("ROUTE_TEMPLATE_MISMATCH", f"route {spec['route']} is mapped to {r['template'] if r else 'nothing'}, spec says {spec['template']}"))
    match_template(spec, repo, errs)
    cats = [C[n["section"]]["semantic"]["category"] for n in nodes]
    present = [n["section"] for n in nodes]
    if spec["template"] not in NO_HERO_TEMPLATES:
        if cats.count("HERO") != 1:
            errs.append(("ONE_HERO", f"{cats.count('HERO')} HERO nodes"))
        content_idx = [k for k, c in enumerate(cats) if c not in NON_CONTENT]
        if content_idx and cats[content_idx[0]] != "HERO":
            errs.append(("HERO_FIRST_CONTENT", f"first content node is {nodes[content_idx[0]]['section']}"))
    elif "HERO" in cats:
        errs.append(("ONE_HERO", f"template {spec['template']} has no hero"))
    counts = {}
    for k, n in enumerate(nodes):
        sid, con = n["section"], C[n["section"]]
        counts[sid] = counts.get(sid, 0) + 1
        cs = con.get("constraints", {})
        if cs.get("mustBeFirst") and k != 0:
            errs.append(("MUST_BE_FIRST", f"{sid} must be the first node"))
        if cs.get("mustBeLast") and k != len(nodes) - 1:
            errs.append(("MUST_BE_LAST", f"{sid} must be the last node"))
        if cs.get("templates") and spec["template"] not in cs["templates"]:
            errs.append(("TEMPLATE_ONLY", f"{sid} only allowed in {cs['templates']}"))
        for req in cs.get("requires", []):
            if req not in present:
                errs.append(("REQUIRES_SECTION", f"{sid} requires {req}"))
        if "retrievalEligible" in n and n["retrievalEligible"] != con["retrievalEligible"]:
            errs.append(("RETRIEVAL_INELIGIBLE_SHELL_ONLY", f"nodes[{k}] {sid}: retrievalEligible {n['retrievalEligible']} contradicts the contract/pin"))
        if n.get("retrievalEligible") is False and sid not in RETRIEVAL_INELIGIBLE:
            errs.append(("RETRIEVAL_INELIGIBLE_SHELL_ONLY", f"nodes[{k}] {sid}: a content section cannot be marked ineligible"))
        check_words(con["content"], n["content"], f"nodes[{k}].content", errs)
        m = n["motion"]
        if m["pattern"] not in con["motion"]["allowed"]:
            errs.append(("MOTION_PATTERN_NOT_ALLOWED", f"nodes[{k}] {sid}: {m['pattern']!r} not in {con['motion']['allowed']}"))
        exp = repo["motion"].get(m["pattern"], {}).get("reducedMotionFallback")
        if m["reducedMotionFallback"] != exp:
            errs.append(("MOTION_FALLBACK_MISMATCH", f"nodes[{k}] {sid}: fallback for {m['pattern']} must be {exp!r}"))
        check_tokens(k, n, spec, repo, errs)
        pairs = []
        field_roles(con["content"], n["content"], pairs)
        for name, mobj, ref_roles, gen_roles in pairs:
            role = mobj.get("assetRole")
            allowed = set(gen_roles) if mode == "generated" else set(ref_roles) | set(gen_roles)
            if role not in allowed:
                errs.append(("ASSET_ROLE_NOT_ALLOWED", f"nodes[{k}] {sid}.{name}: role {role!r} not allowed here in {mode} mode (allowed {sorted(allowed)})"))
        if sid == "editorial.blog-card-grid":
            lay = n["content"]["layout"]
            if (lay == "related") != (spec["template"] == "blog-post") or (lay == "related" and len(n["content"]["posts"]) != 2):
                errs.append(("BLOG_CLUSTER_LAYOUT", f"nodes[{k}]: layout {lay!r} with {len(n['content']['posts'])} cards on template {spec['template']}"))
        if sid == "work.card-cluster" and n["content"].get("seeAll"):
            last = max(i for i, x in enumerate(nodes) if x["section"] == sid)
            if spec["template"] != "home" or k != last:
                errs.append(("CARD_CLUSTER_LAST_ONLY_SEE_ALL", f"nodes[{k}]: seeAll only on the last work cluster of the home template"))
    for sid, cnt in counts.items():
        cs = C[sid].get("constraints", {})
        if (cs.get("onePerPage") and cnt > 1) or ("maxPerPage" in cs and cnt > cs["maxPerPage"]):
            errs.append(("ONE_PER_PAGE", f"{sid} appears {cnt} times"))
    g = {r["id"]: r for r in repo["graph"]["rules"]}
    exc = g["NO_ADJACENT_SAME_CATEGORY"].get("exceptions", [])
    exempt = set(g["NO_CONSECUTIVE_DUPLICATE"].get("exemptSections", []))
    for k in range(1, len(nodes)):
        a, b = nodes[k - 1], nodes[k]
        if cats[k - 1] == cats[k] and not any(e.get("categories") == [cats[k - 1], cats[k]] for e in exc):
            warns.append(("NO_ADJACENT_SAME_CATEGORY", f"{a['section']} -> {b['section']} ({cats[k]})"))
        if a["section"] == b["section"] and a["section"] not in exempt:
            warns.append(("NO_CONSECUTIVE_DUPLICATE", f"{a['section']} twice in a row"))
    chapters = [n for n in nodes if n["section"] == "editorial.article-chapter"]
    if any("heading" not in c["content"] for c in chapters[1:]):
        warns.append(("ARTICLE_HAS_HEADED_CHAPTER", "a chapter after the first has no heading"))
    amb = g["MOTION_BUDGET"]
    n_amb = sum(1 for n in nodes if n["motion"]["pattern"] in amb["ambient"])
    if n_amb > amb["max"]:
        warns.append(("MOTION_BUDGET", f"{n_amb} ambient-loop nodes > {amb['max']}"))
    if mode == "generated":
        generated_mode(spec, repo, errs)
    return errs, warns


def example_paths(root=ROOT):
    return [Path(root) / "schema/example.pagespec.json"] + sorted((Path(root) / "schema/examples").glob("*.json"))


def main(argv):
    paths = example_paths() if argv[1:] == ["--examples"] else [Path(a) for a in argv[1:]]
    if not paths:
        print(__doc__); return 2
    repo = load_repo(); bad = 0
    for p in paths:
        spec = json.loads(Path(p).read_text())
        e, w = validate(spec, repo)
        try:
            name = Path(p).resolve().relative_to(ROOT)
        except ValueError:
            name = p
        print(f"{'PASS' if not e else 'FAIL'}  {name}  mode={spec.get('mode')} template={spec.get('template')}  errors={len(e)} warnings={len(w)}")
        for code, msg in e:
            print(f"   ERROR {code}: {msg}")
        for code, msg in w:
            print(f"   warn  {code}: {msg}")
        bad += bool(e)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
