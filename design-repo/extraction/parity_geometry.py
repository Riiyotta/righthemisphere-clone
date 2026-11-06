"""Geometry (ink-map) parity from text-free geometry dumps. Standard library only, so verify_all.py can recompute it.

A dump is {"viewport": [w, h], "routes": {route: {"doc": px, "sections": [{id, instance, top, left, w, h, rows, media,
controls, masks}]}}} written by extraction/parity_capture.mjs --geometry-out. rows = text-line rects (from Range client
rects; no text is stored), media = image / svg / video / canvas / background-image rects, controls = links, buttons and
inputs; all in px relative to the section origin. Each section is rasterised on an 8 px grid inside the LIVE section window
(rows | media | controls); score = Dice(live, clone). The clone is clipped to the live window, so a clone that is shorter or
narrower loses cells; a section the clone does not have scores 0.
This proves box / text-row / image positions agree. It does NOT prove that the pixels, glyphs or image content match."""
CELL = 8


def raster(sec, h, w):
    gh, gw = max(1, -(-int(h) // CELL)), max(1, -(-int(w) // CELL))
    rows = [0] * gh
    for k in ("rows", "media", "controls"):
        for x, y, ww, hh in sec.get(k, []):
            x0, y0 = max(0, int(x // CELL)), max(0, int(y // CELL))
            x1, y1 = min(gw, int(-(-(x + ww) // CELL))), min(gh, int(-(-(y + hh) // CELL)))
            if x1 > x0 and y1 > y0:
                bits = ((1 << (x1 - x0)) - 1) << x0
                for yy in range(y0, y1):
                    rows[yy] |= bits
    return rows


def dice(a, b):
    n = sum(bin(x).count("1") for x in a) + sum(bin(x).count("1") for x in b)
    if n == 0:
        return 1.0
    return 2 * sum(bin(x & y).count("1") for x, y in zip(a, b)) / n


def geo_score(live_sec, clone_sec):
    if clone_sec is None:
        return 0.0
    h, w = live_sec["h"], live_sec["w"]
    return dice(raster(live_sec, h, w), raster(clone_sec, h, w))


def compute(live, clone):
    """{route: [{id, instance, geoPct}]} for every live section."""
    out = {}
    for r, lv in live["routes"].items():
        cv = clone["routes"].get(r)
        cmap = {(s["id"], s["instance"]): s for s in (cv["sections"] if cv else [])}
        out[r] = [{"id": s["id"], "instance": s["instance"], "geoPct": round(100 * geo_score(s, cmap.get((s["id"], s["instance"]))), 1)} for s in lv["sections"]]
    return out
