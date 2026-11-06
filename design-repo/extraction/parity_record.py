#!/usr/bin/env python3
"""Assemble extraction/parity-results.json (the tracked parity record) from two capture runs.

    python3 extraction/parity_record.py --out extraction/parity-results.json --geometry-dir extraction/parity-geometry \
        --causes causes.json \
        --run 1440x900 <cmp_run1.json> <cmp_run2.json> <live_run1.geo.json> <clone_run1.geo.json> <live_run1_meta.json> <clone_run1_meta.json> \
        --run 390x844  <cmp_run1.json> <cmp_run2.json> <live_run1.geo.json> <clone_run1.geo.json> <live_run1_meta.json> <clone_run1_meta.json>

cmp_runN.json are parity_compare.py outputs. Run 1 numbers are the recorded ones; run 2 is kept per section (rawPct2) to show
reproducibility. causes.json maps "<width>|<route>|<section index>" to the real cause of any section below the gate; those
sections become exceptions with status "pending human approval" and approvedBy null. The recorder never approves anything.
The geometry dumps are copied into --geometry-dir and pinned by sha256."""
import hashlib, json, shutil, sys
from pathlib import Path

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import parity_geometry  # noqa: E402

THRESH, GATE = 24, 80.0
arg = lambda k, d=None: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
avg = lambda xs: round(sum(xs) / max(1, len(xs)), 1)


CAPTURE_STATE = {
    "viewports": "1440x900 for all 18 routes + the catch-all 404 probe; 390x844 for the home page, one blog post and one case study",
    "arrival": "full-page stepped scroll (400 px) after the load intro (5.5 s at 1440, 4.5 s at 390), then each section tile reached by stepped scroll with a 1.2 s settle",
    "fontsAndImages": "document.fonts.ready awaited; every <img> forced eager, loaded and decoded; images still incomplete after that are counted (must be 0)",
    "video": "every <video> is paused at 0.5 s after the seek; neither side has a <video> on any measured route",
    "animations": "finite CSS/WAAPI animations finished, infinite ones paused at 0 (none were found on either side); GSAP/IX3 reveals reach their end state during the arrival scroll",
    "consentBanners": "no consent banner exists on the live site; a stylesheet that hides cookie/consent overlays and the partner-credits overlay is injected on BOTH sides, nothing is ever clicked",
    "masked": "only (a) autoplaying looping Lottie players (time-based, cannot be paused on the same frame on both sides) and (b) third-party iframes; masked pixels leave the counts on both sides and are reported per section as maskedPct",
    "liveSiteState": "the live site was captured on the date in measuredAt; its home-page blog strip is 3 random posts of 10 chosen at origin render and CDN-cached, so it can differ from the clone's fixed three",
}


def summary(res, measured_at=None):
    vps = {}
    below, masked, exc = [], [], []
    for vp, v in res["viewports"].items():
        routes = {}
        for r, rv in v["routes"].items():
            routes[r] = {"template": rv["template"], "rawAvg": rv["rawAvg"], "rawMin": rv["rawMin"], "inkAvg": rv["inkAvg"], "geoAvg": rv["geoAvg"],
                         "sections": [[s["id"], s["rawPct"], s["inkPct"], s["geoPct"], s["maskedPct"]] for s in rv["sections"]]}
            for s in rv["sections"]:
                if s["rawPct"] < GATE: below.append({"viewport": vp, "route": r, "index": s["i"], "section": s["id"], "rawPct": s["rawPct"]})
                if s["maskedPct"] > 50: masked.append({"viewport": vp, "route": r, "index": s["i"], "section": s["id"], "maskedPct": s["maskedPct"]})
        vps[vp] = {"overall": v["overall"], "routes": routes}
    for e in res["exceptions"]:
        exc.append({k: e[k] for k in ("viewport", "route", "index", "section", "rawPct", "status", "approvedBy")})
    return {"measured": True, "resultsFile": "extraction/parity-results.json", "pixelThreshold": res["pixelThreshold"], "gate": res["gate"],
            "metrics": {"rawPct": "GATED: share of live-section pixels whose RGB channels all differ by <= 24/255 (clone padded as non-matching)",
                        "inkPct": "layout parity from pixels: ink block-map Dice (attio method); reported, not gated",
                        "geoPct": "layout parity from text-free DOM geometry (text rows, media, controls on an 8 px grid) Dice; recomputed by verify_all from the tracked dumps"},
            "captureState": CAPTURE_STATE, "viewports": vps, "belowGate": below, "mostlyMasked": masked, "exceptions": exc}


def main():
    out = Path(arg("--out")); gdir = Path(arg("--geometry-dir")); gdir.mkdir(parents=True, exist_ok=True)
    causes = json.loads(Path(arg("--causes")).read_text()) if arg("--causes") else {}
    routes_json = json.loads((HERE.parent / "templates/routes.json").read_text())
    tpl = {r["path"]: r["template"] for r in routes_json["routes"]}; tpl[routes_json["catchAll"]["probe"]] = routes_json["catchAll"]["template"]
    res = {"tool": {"capture": "extraction/parity_capture.mjs", "compare": "extraction/parity_compare.py", "geometry": "extraction/parity_geometry.py", "record": "extraction/parity_record.py"},
           "pixelThreshold": THRESH, "gate": {"perSectionMinPct": GATE, "pageAverageMinPct": GATE}, "viewports": {}, "exceptions": [], "files": {}}
    argv = sys.argv; i = 0
    while i < len(argv):
        if argv[i] == "--run":
            vp, c1, c2, lg, cg, lm, cm = argv[i + 1:i + 8]; i += 8
            r1, r2 = json.loads(Path(c1).read_text()), json.loads(Path(c2).read_text())
            lgeo, cgeo = json.loads(Path(lg).read_text()), json.loads(Path(cg).read_text())
            geo = parity_geometry.compute(lgeo, cgeo)
            meta_l, meta_c = json.loads(Path(lm).read_text()), json.loads(Path(cm).read_text())
            w = vp.split("x")[0]
            routes = {}
            for route, v in r1.items():
                secs = []
                for s in v["sections"]:
                    s2 = r2[route]["sections"][s["i"]]
                    assert s2["id"] == s["id"], f"run 2 section order differs at {route} {s['i']}"
                    g = next(x for x in geo[route] if x["id"] == s["id"] and x["instance"] == s["instance"])
                    secs.append({"i": s["i"], "id": s["id"], "instance": s["instance"], "liveH": s["liveH"], "cloneH": s["cloneH"], "tiles": s["tiles"], "maskedPct": s["maskedPct"],
                                 "rawPct": s["rawPct"], "rawPct2": s2["rawPct"], "inkPct": s["inkPct"], "geoPct": g["geoPct"]})
                    if s["rawPct"] < GATE:
                        key = f"{w}|{route}|{s['i']}"
                        res["exceptions"].append({"viewport": vp, "route": route, "section": s["id"], "index": s["i"], "rawPct": s["rawPct"], "rawPct2": s2["rawPct"], "inkPct": s["inkPct"], "geoPct": g["geoPct"],
                                                  "cause": causes.get(key, "UNDIAGNOSED"), "status": "pending human approval", "approvedBy": None})
                routes[route] = {"template": tpl.get(route), "liveDoc": v["liveDoc"], "cloneDoc": v["cloneDoc"], "sectionCount": len(secs), "cloneOnlySections": v["cloneOnlySections"],
                                 "rawAvg": avg([x["rawPct"] for x in secs]), "rawMin": min(x["rawPct"] for x in secs), "inkAvg": avg([x["inkPct"] for x in secs]), "geoAvg": avg([x["geoPct"] for x in secs]),
                                 "rawAvg2": avg([x["rawPct2"] for x in secs]), "sections": secs}
            allsec = [s for r in routes.values() for s in r["sections"]]
            for kind, d in (("live", lgeo), ("clone", cgeo)):
                dst = gdir / f"{kind}-{vp}.json"; dst.write_text(json.dumps(d, separators=(",", ":"))); res["files"][f"extraction/parity-geometry/{kind}-{vp}.json"] = sha(dst)
            res["viewports"][vp] = {"capturedAt": meta_l["capturedAt"][:10], "routes": routes, "captureState": {"live": meta_l["captureState"], "clone": meta_c["captureState"]},
                                    "overall": {"routes": len(routes), "sections": len(allsec), "meanRawPct": avg([s["rawPct"] for s in allsec]), "meanRawPct2": avg([s["rawPct2"] for s in allsec]),
                                                "meanInkPct": avg([s["inkPct"] for s in allsec]), "meanGeoPct": avg([s["geoPct"] for s in allsec]),
                                                "minRawPct": min(s["rawPct"] for s in allsec), "sectionsBelowGate": sum(1 for s in allsec if s["rawPct"] < GATE),
                                                "routesBelowAverageGate": [r for r, v in routes.items() if v["rawAvg"] < GATE],
                                                "maxAbsRunDeltaRawPct": round(max(abs(s["rawPct"] - s["rawPct2"]) for s in allsec), 1),
                                                "meanAbsRunDeltaRawPct": avg([abs(s["rawPct"] - s["rawPct2"]) for s in allsec])}}
        else:
            i += 1
    for f in ("parity_capture.mjs", "parity_compare.py", "parity_geometry.py", "parity_record.py"):
        res["files"][f"extraction/{f}"] = sha(HERE / f)
    out.write_text(json.dumps(res, indent=1) + "\n")
    mv = arg("--measured-values")
    if mv:
        mp = Path(mv); d = json.loads(mp.read_text()); d["parity"] = summary(res); mp.write_text(json.dumps(d, indent=1, ensure_ascii=False) + "\n")
    print(json.dumps({vp: v["overall"] for vp, v in res["viewports"].items()}, indent=1)); print("exceptions:", len(res["exceptions"]))


if __name__ == "__main__":
    main()
