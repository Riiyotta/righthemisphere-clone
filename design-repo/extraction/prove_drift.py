#!/usr/bin/env python3
"""Prove that verify_all.py's checks catch drift: for each case, copy the repo to a fresh OS temp directory,
inject one defect, run verify_all.py there and require exit 1 plus a FAIL line for the expected check.
The untouched copy must pass (control).

    python3 extraction/prove_drift.py [--scratch DIR]

When the source evidence tree (src/, CLONE_SPEC.md, CLONE_SPEC-PAGES.md, asset-manifest.json, tailwind.config.js,
index.html, ia/ next to design-repo/) is present it is linked read-only into the temp project so the citation / source-tag / slug /
ia cases run; otherwise those cases are reported as SKIP (never as a pass).
"""
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent
SOURCE_ENTRIES = ["src", "CLONE_SPEC.md", "CLONE_SPEC-PAGES.md", "asset-manifest.json", "tailwind.config.js", "index.html", "ia"]
SCRATCH = sys.argv[sys.argv.index("--scratch") + 1] if "--scratch" in sys.argv else None  # parent dir for the temp copies (default: OS temp)
HAS_SOURCE = all((SRC / e).exists() for e in SOURCE_ENTRIES)


def jedit(rel, fn):
    def run(repo):
        p = repo / rel; d = json.loads(p.read_text()); fn(d); p.write_text(json.dumps(d, indent=1, ensure_ascii=False) + "\n")
    return run


def tedit(rel, old, new, count=1):
    def run(repo):
        p = repo / rel; t = p.read_text()
        assert old in t, f"{rel}: pattern not found: {old!r}"
        p.write_text(t.replace(old, new, count))
    return run


def both(*fns):
    def run(repo):
        for f in fns: f(repo)
    return run


def orphan(repo):
    shutil.copy(repo / "sections/content.process-note.json", repo / "sections/content.process-note-copy.json")


CASES = [
    # allowlist / manifest / counts
    ("phantom allowlist entry", jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"].update({"hero.phantom": d["sections"]["hero.home"]})), "ALLOWLIST", False),
    ("orphan contract file", orphan, "ALLOWLIST", False),
    ("manifest count hand-bumped", jedit("registry.manifest.json", lambda d: d["counts"].update(sections=40)), "MANIFEST", False),
    ("allowlistVersion drift", jedit("registry.manifest.json", lambda d: d.update(allowlistVersion="9.9.9")), "MANIFEST", False),
    ("entry point outside the package", jedit("registry.manifest.json", lambda d: d["entryPoints"].update(spec="../CLONE_SPEC.md")), "MANIFEST", False),
    ("README count edited", tedit("README.md", "| sections | ", "| sections | 9"), "README_COUNTS", False),
    # citations / source tags / protected registry / ia (need the source tree)
    ("citation out of range", jedit("tokens/00-foundation/color.json", lambda d: d["tokens"]["color.ink"]["evidence"][0].update(cite="tailwind.config.js:999999")), "CITATIONS", True),
    ("citation in range, wrong content", jedit("tokens/00-foundation/color.json", lambda d: d["tokens"]["color.ink"]["evidence"][0].update(needle="ink: '#123456'")), "CITATIONS", True),
    ("source tag moved", jedit("sections/hero.home.json", lambda d: d["source"].update(lines="1")), "SOURCE_TAGS", True),
    ("route not served by the router", jedit("templates/routes.json", lambda d: d["routes"][-1].update(path="/watch-with-mama")), "TEMPLATES", True),
    ("ia section lost its contract", jedit("sections/hero.home.json", lambda d: d.update(iaSectionIds=[])), "IA_SYNC", True),
    ("protected registry hash edited", jedit("schema/protected-content.json", lambda d: d["sourceBrand"]["patterns"]["CLIENT"]["hashes"].pop()), "PROTECTED_SYNC", True),
    ("protected copy shingles truncated", jedit("schema/protected-content.json", lambda d: d["sourceBrand"]["patterns"]["COPY"].update(shingleHashes=d["sourceBrand"]["patterns"]["COPY"]["shingleHashes"][:-12])), "PROTECTED_SYNC", True),
    ("contract measured height edited", jedit("sections/hero.home.json", lambda d: d["measured"].update(heightAt1440=[100, 100])), "MEASURED_SYNC", False),
    # R3 pins
    ("registry availability loosened", jedit("assets/asset-roles.json", lambda d: d["roles"]["brand.logo-mark"].update(availability="generation-safe")), "PINS", False),
    ("registry policy set to a different valid value", jedit("assets/asset-roles.json", lambda d: d["roles"]["client.logo"].update(generationPolicy="may-generate-new")), "PINS", False),
    ("pin removed from verify_all", tedit("extraction/verify_all.py", '"case.motion-json": "reference-only",', ""), "PINS", False),
    ("pin removed from semantic_validate", tedit("schema/semantic_validate.py", '"case.motion-json": "reference-only", ', ""), "PINS", False),
    ("contract + registry availability flipped together", both(jedit("assets/asset-roles.json", lambda d: d["roles"]["work.project-image"].update(availability="generation-safe")),
                                                               jedit("sections/work.card-cluster.json", lambda d: d["content"]["cards"]["fields"]["image"]["generatedAssetRoles"].append("work.project-image"))), "PINS", False),
    # R8 retrieval
    ("contract + allowlist retrieval flipped together", both(jedit("sections/overlay.partner-credits.json", lambda d: d.update(retrievalEligible=True)),
                                                            jedit("tokens/llm/component-allowlist.json", lambda d: d["sections"]["overlay.partner-credits"].update(retrievalEligible=True))), "RETRIEVAL", False),
    ("content section marked ineligible", jedit("sections/content.faq-accordion.json", lambda d: d.update(retrievalEligible=False, retrievalReason="an attempt to hide a real content section")), "RETRIEVAL", False),
    ("retrieval pin removed from semantic_validate", tedit("schema/semantic_validate.py", 'RETRIEVAL_INELIGIBLE = {"overlay.partner-credits"}', "RETRIEVAL_INELIGIBLE = set()"), "RETRIEVAL", False),
    ("retrieval pin removed from verify_all", tedit("extraction/verify_all.py", 'RETRIEVAL_INELIGIBLE = {"overlay.partner-credits"}', "RETRIEVAL_INELIGIBLE = set()"), "RETRIEVAL", False),
    ("runtime-looking section left eligible", both(lambda r: shutil.copy(r / "sections/chrome.footer.json", r / "sections/utility.cursor.json"),
                                                   jedit("sections/utility.cursor.json", lambda d: d.update(id="utility.cursor", semantic={"id": "utility.cursor", "category": "UTILITY"}, iaSectionIds=[]))), "RETRIEVAL", False),
    # R10 tokens / derived files
    ("token value edited in catalog only", jedit("tokens/llm/token-catalog.json", lambda d: d["tokens"]["color.ink"].update(value="#ffffff")), "DERIVED", False),
    ("token added to a token file only", jedit("tokens/00-foundation/color.json", lambda d: d["tokens"].update({"color.new": {"$type": "color", "$value": "#000001", "category": "color", "evidence": []}})), "DERIVED", False),
    ("policy category is a human label", jedit("tokens/llm/token-policy.json", lambda d: d["rawValueRestrictions"].update(typography={"rule": "x"})), "TOKENS", False),
    ("policy lists an unknown referenceable token", jedit("tokens/llm/token-policy.json", lambda d: d["pageSpecReferenceable"].append("surface.neon")), "TOKENS", False),
    ("theme resolves to the wrong foundation token", jedit("tokens/themes/light.json", lambda d: d["resolves"].update({"surface.page": "color.panel-grey"})), "TOKENS", False),
    ("primitive uses an unknown token", jedit("primitives/button-v2.json", lambda d: d["tokens"].append("color.neon")), "TOKENS", False),
    ("schema section enum drift", jedit("schema/pagespec.schema.json", lambda d: d["definitions"]["node"]["properties"]["section"]["enum"].remove("media.case-showcase")), "DERIVED", False),
    ("contract field added without re-deriving", jedit("sections/chrome.footer.json", lambda d: d["content"].update(extra={"kind": "text", "maxWords": 2, "required": False})), "DERIVED", False),
    ("contract schema loosened by hand", jedit("schema/section-contract.schema.json", lambda d: d.update(additionalProperties=True)), "DERIVED", False),
    ("motion fallback outside the closed enum", jedit("tokens/00-foundation/motion-patterns.json", lambda d: d["patterns"]["scroll-fade"].update(reducedMotionFallback="spin")), "MOTION", False),
    # graph / templates / examples / gate / hygiene
    ("template head.social edited", jedit("templates/templates.json", lambda d: d["templates"]["blog-post"]["head"].update(social="full")), "EXAMPLES", False),
    ("graph rule severity drift", jedit("compatibility/graph.json", lambda d: d["rules"][0].update(severity="warn")), "GRAPH_SYNC", False),
    ("route removed", jedit("templates/routes.json", lambda d: d["routes"].pop()), "TEMPLATES", False),
    ("route mapped twice", jedit("templates/routes.json", lambda d: d["routes"].append(d["routes"][0])), "TEMPLATES", False),
    ("example drifts from its template", jedit("schema/examples/generated.home.json", lambda d: d["nodes"].pop(4)), "EXAMPLES", False),
    ("generated example removed", lambda r: (r / "schema/examples/generated.blog-post.json").unlink(), "EXAMPLES", False),
    ("measured heights removed", jedit("extraction/measured-values.json", lambda d: d.pop("sectionHeights")), "WRAPPER_GATE", False),
    ("responsive heights removed", jedit("extraction/measured-values.json", lambda d: d.pop("responsiveHeights")), "WRAPPER_GATE", False),
    ("gate thresholds loosened in JSON", jedit("extraction/measured-values.json", lambda d: d.update(thresholds={"heroWarnPx": 9000, "heroErrorPx": 9999, "shareWarn": 0.9, "shareError": 0.99})), "WRAPPER_GATE", False),
    ("gate threshold loosened in code", tedit("extraction/wrapper_gate.py", "HERO_ERROR_PX = 3000", "HERO_ERROR_PX = 30000"), "WRAPPER_GATE", False),
    ("work grid measured as one block", jedit("extraction/measured-values.json", lambda d: d["sectionHeights"]["routes"]["/work"]["sections"].append({"id": "work.card-cluster", "top": 600, "h": 9768, "inFlow": True, "position": "static"})), "WRAPPER_GATE", False),
    # R12 parity record
    ("parity: a section score lowered (no exception)", jedit("extraction/parity-results.json", lambda d: d["viewports"]["1440x900"]["routes"]["/about"]["sections"][1].update(rawPct=40.0)), "PARITY", False),
    ("parity: exception approved by an agent", jedit("extraction/parity-results.json", lambda d: d["exceptions"][0].update(approvedBy="agent", status="approved")), "PARITY", False),
    ("parity: owner approval by an agent", jedit("extraction/parity-approvals.json", lambda d: d["approvals"][0].update(approvedBy="Claude")), "PARITY", False),
    ("parity: owner approval without a date", jedit("extraction/parity-approvals.json", lambda d: d["approvals"][0].pop("approvedOn")), "PARITY", False),
    ("parity: owner approval for an exception that does not exist", jedit("extraction/parity-approvals.json", lambda d: d["approvals"][0].update(index=3)), "PARITY", False),
    ("parity: approvals file missing", lambda root: (root / "extraction/parity-approvals.json").unlink(), "PARITY", False),
    ("parity: exception removed, section still below the gate", jedit("extraction/parity-results.json", lambda d: d["exceptions"].pop(0)), "PARITY", False),
    ("parity: exception added for a section that passes the gate", jedit("extraction/parity-results.json", lambda d: d["exceptions"].append({"viewport": "1440x900", "route": "/about", "index": 1, "section": "hero.words", "rawPct": 97.6, "cause": "an invented exception added to bypass the gate for a passing section", "status": "pending human approval", "approvedBy": None})), "PARITY", False),
    ("parity: exception cause blanked", jedit("extraction/parity-results.json", lambda d: d["exceptions"][0].update(cause="UNDIAGNOSED")), "PARITY", False),
    ("parity: pixel threshold loosened in the results", jedit("extraction/parity-results.json", lambda d: d.update(pixelThreshold=40)), "PARITY", False),
    ("parity: pixel threshold loosened in parity_compare.py", tedit("extraction/parity_compare.py", "THRESH, GATE = 24, 0.80", "THRESH, GATE = 40, 0.80"), "PARITY", False),
    ("parity: gate loosened in parity_compare.py", tedit("extraction/parity_compare.py", "THRESH, GATE = 24, 0.80", "THRESH, GATE = 24, 0.50"), "PARITY", False),
    ("parity: gate loosened in the results", jedit("extraction/parity-results.json", lambda d: d.update(gate={"perSectionMinPct": 50.0, "pageAverageMinPct": 50.0})), "PARITY", False),
    ("parity: geometry dump edited", jedit("extraction/parity-geometry/clone-1440x900.json", lambda d: d["routes"]["/about"]["sections"][1]["rows"].pop()), "PARITY", False),
    ("parity: geoPct edited", jedit("extraction/parity-results.json", lambda d: next(s for s in d["viewports"]["1440x900"]["routes"]["/"]["sections"] if s["geoPct"] < 99).update(geoPct=100.0)), "PARITY", False),
    ("parity: harness script edited after recording", tedit("extraction/parity_geometry.py", "CELL = 8", "CELL = 8  # edited"), "PARITY", False),
    ("parity: route removed from the results", jedit("extraction/parity-results.json", lambda d: d["viewports"]["1440x900"]["routes"].pop("/work")), "PARITY", False),
    ("parity: mobile case study dropped", jedit("extraction/parity-results.json", lambda d: d["viewports"]["390x844"]["routes"].pop("/cheggout-sdk")), "PARITY", False),
    ("parity: two runs disagree", jedit("extraction/parity-results.json", lambda d: d["viewports"]["1440x900"]["routes"]["/about"]["sections"][2].update(rawPct2=60.0)), "PARITY", False),
    ("parity: capture state with incomplete images", jedit("extraction/parity-results.json", lambda d: d["viewports"]["1440x900"]["captureState"]["clone"]["/"].update(imagesIncomplete=3)), "PARITY", False),
    ("parity: measured-values says not measured", jedit("extraction/measured-values.json", lambda d: d["parity"].update(measured=False)), "PARITY", False),
    ("parity: measured-values mean edited", jedit("extraction/measured-values.json", lambda d: d["parity"]["viewports"]["1440x900"]["overall"].update(meanRawPct=99.9)), "PARITY", False),
    ("parity: live screenshot committed", lambda r: (r / "extraction/live-home.png").write_bytes(b"\x89PNG"), "PARITY", False),
    ("parity: browser-tool citation added", tedit("README.md", "# ", "# .playwright" + "-mcp/shot.png ", 1), "PARITY", False),
    ("absolute machine path", tedit("README.md", "# ", "# " + "/" + "Users/someone/project ", 1), "HYGIENE", False),
    ("junk file", lambda r: (r / "sections/.DS_Store").write_text("x"), "HYGIENE", False),
    # design policy binding
    ("category changed in the manifest", jedit("registry.manifest.json", lambda d: d.update(category="marketing-site")), "POLICY", False),
    ("bound policy version changed", jedit("registry.manifest.json", lambda d: d["designPolicy"].update(policyVersion="0.2.0")), "POLICY", False),
    ("bound policy id changed", jedit("registry.manifest.json", lambda d: d["designPolicy"].update(policyId="n0-design-constraints-custom")), "POLICY", False),
    ("policy content hash stale (token policy edited)", jedit("tokens/llm/token-policy.json", lambda d: d.update(version="1.0.1")), "POLICY", False),
    ("policy content hash stale (validator edited)", tedit("schema/semantic_validate.py", "NO_HERO_TEMPLATES = {", "NO_HERO_TEMPLATES = {  # edited\n    "), "POLICY", False),
    ("policy content hash edited by hand", jedit("registry.manifest.json", lambda d: d["designPolicy"].update(contentHash="sha256:" + "0" * 64)), "POLICY", False),
    ("policy file removed", lambda r: (r / "policy/design-policy.json").unlink(), "POLICY", False),
    ("policy enforcedBy file missing", jedit("policy/design-policy.json", lambda d: d["enforcedBy"].append("docs/missing.md")), "POLICY", False),
    ("policy classification changed", jedit("policy/design-policy.json", lambda d: d["classification"].update(productCategory="marketing-site")), "POLICY", False),
    ("approval flipped to ratified", jedit("policy/design-policy.json", lambda d: d["approval"].update(policyDecision="ratified", architectureDecisionRecorded=True)), "POLICY", False),
    ("productionApproved flipped", jedit("registry.manifest.json", lambda d: d.update(productionApproved=True)), "POLICY", False),
]


def make_copy():
    tmp = Path(tempfile.mkdtemp(prefix="drift-", dir=SCRATCH))
    proj = tmp / "project"; proj.mkdir()
    shutil.copytree(ROOT, proj / "design-repo", ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
    if HAS_SOURCE:
        for e in SOURCE_ENTRIES:
            os.symlink(SRC / e, proj / e)
    return tmp, proj / "design-repo"


def run_verify(repo):
    r = subprocess.run([sys.executable, "-B", str(repo / "extraction/verify_all.py")], cwd=repo, capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def main():
    tmp, repo = make_copy()
    code, out = run_verify(repo); shutil.rmtree(tmp)
    print(f"{'PASS' if code == 0 else 'FAIL'}  control: untouched copy passes verify_all (exit {code}); source tree {'linked' if HAS_SOURCE else 'absent'}")
    control_ok = code == 0; bad = 0 if control_ok else 1
    if code: print(out[-1500:])
    caught = skipped = 0
    for name, fn, check, needs_src in CASES:
        if needs_src and not HAS_SOURCE:
            print(f"SKIP  {name}: needs the source evidence tree"); skipped += 1; continue
        tmp, repo = make_copy()
        fn(repo)
        code, out = run_verify(repo); shutil.rmtree(tmp)
        hit = code == 1 and re.search(rf"^FAIL  {check}", out, re.M)
        caught += bool(hit)
        print(f"{'CAUGHT' if hit else 'MISSED'}  [{check}] {name}")
        if not hit:
            bad += 1; print(out[-800:])
    print(f"\nprove_drift: {caught}/{len(CASES) - skipped} drift cases caught, {skipped} skipped; control {'passed' if control_ok else 'FAILED'}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
