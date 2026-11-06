"""Live-vs-clone parity numbers from two parity_capture.mjs directories (R12).

usage: python3 extraction/parity_compare.py <live_dir> <clone_dir> <out.json> [--sheets <dir>] [--routes r1,r2]
       python3 extraction/parity_compare.py --geometry <live_geometry.json> <clone_geometry.json> <out.json>

Three numbers per section (each says something different, see README "Parity evidence"):
  rawPct  GATED. Pixel match: share of pixels of the LIVE section window whose every RGB channel differs by <= 24/255.
          The clone tile is aligned at its own section top; the window is the live section height and a shorter clone
          section is padded with non-matching pixels, so a height deficit counts against the clone.
  inkPct  Layout parity from pixels (attio 'ink map' method): grayscale, background = median live value, ink = |px-bg| > 30,
          ink mask box-blurred (r=12), downsampled 4x, thresholded at 25/255 -> block map of where text, artwork and
          controls sit; Dice(live, clone). Glyph identity is not compared.
  geoPct  Layout parity from text-free DOM geometry (text-row rects, media rects, control rects, section-relative px)
          rasterised on an 8 px grid inside the live section window; Dice(live, clone). Recomputable from the tracked
          geometry dump alone (--geometry mode), no screenshots needed.
Section score for the gate is rawPct (the R12 measure). Only the masks recorded by the capture (Lottie players, third-party iframes) are excluded from the counts."""
import json, os, sys
sys.dont_write_bytecode = True
import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import parity_geometry

THRESH, GATE = 24, 0.80

def geo_score(ls, cs):
    return parity_geometry.geo_score(ls, cs)

def blocks(a, bg):
    m = Image.fromarray(((np.abs(a - bg) > 30) * 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(12))
    return np.asarray(m.resize((m.size[0] // 4, max(1, m.size[1] // 4))), np.float64) > 25

def load_rgb(d, f, h, w, pad):
    a = np.full((h, w, 3), pad, np.int16)
    src = np.asarray(Image.open(os.path.join(d, f)).convert('RGB'), np.int16)[:h, :w]
    a[:src.shape[0], :src.shape[1]] = src
    return a

def main():
    a = sys.argv[1:]
    if a and a[0] == '--geometry':
        L = json.load(open(a[1])); C = json.load(open(a[2])); out = a[3]
        res = {r: {'sections': v} for r, v in parity_geometry.compute(L, C).items()}
        json.dump(res, open(out, 'w'), indent=1)
        for r, v in res.items(): print(r, round(sum(x['geoPct'] for x in v['sections']) / max(1, len(v['sections'])), 1))
        return
    live, clone, outp = a[:3]
    sheets = a[a.index('--sheets') + 1] if '--sheets' in a else None
    only = a[a.index('--routes') + 1].split(',') if '--routes' in a else None
    if sheets: os.makedirs(sheets, exist_ok=True)
    L = json.load(open(os.path.join(live, 'meta.json'))); C = json.load(open(os.path.join(clone, 'meta.json')))
    res = {}
    for r, lv in L['routes'].items():
        if only and r not in only: continue
        cv = C['routes'].get(r)
        cmap = {(s['id'], s['instance']): s for s in (cv['sections'] if cv else [])}
        rows = []
        for i, ls in enumerate(lv['sections']):
            cs = cmap.get((ls['id'], ls['instance']))
            m = n = im = inn = mk = tot = 0
            for t in ls['tiles']:
                tw = Image.open(os.path.join(live, lv['slug'], t['file'])).size[0]
                la = load_rgb(os.path.join(live, lv['slug']), t['file'], t['height'], tw, 0)
                ct = next((x for x in (cs or {}).get('tiles', []) if x['off'] == t['off']), None)
                keep = np.ones((t['height'], tw), bool)
                for mx, my, mw, mh in ls.get('masks', []):
                    y0 = int(my - t['off']); y1 = int(my + mh - t['off']); x0 = max(0, int(mx)); x1 = int(mx + mw)
                    keep[max(0, y0):max(0, y1), x0:x1] = False
                if ct:
                    ca = load_rgb(os.path.join(clone, cv['slug']), ct['file'], t['height'], tw, 0)
                    # pixels beyond the clone tile's own extent are padding -> forced non-matching
                    valid = np.zeros((t['height'], tw), bool)
                    cim = Image.open(os.path.join(clone, cv['slug'], ct['file'])).size
                    valid[:min(cim[1], t['height']), :min(cim[0], tw)] = True
                    ok = (np.abs(la - ca).max(axis=2) <= THRESH) & valid
                else:
                    ca = np.zeros_like(la); ok = np.zeros(la.shape[:2], bool)
                m += int((ok & keep).sum()); n += int(keep.sum()); mk += int((~keep).sum()); tot += keep.size
                lg = np.asarray(Image.fromarray(la.astype(np.uint8)).convert('L'), np.float64)
                bg = float(np.median(lg))
                cg = np.full_like(lg, bg)
                if ct:
                    cg = np.asarray(Image.fromarray(ca.astype(np.uint8)).convert('L'), np.float64).copy()
                    cg[~valid] = bg
                lg[~keep] = bg; cg[~keep] = bg   # masked (time-based) regions carry no ink on either side
                A, B = blocks(lg, bg), blocks(cg, bg)
                inn += int(A.sum() + B.sum()); im += 2 * int((A & B).sum())
                if sheets:
                    sh = Image.new('RGB', (tw * 2 + 10, t['height']), (128, 128, 128))
                    sh.paste(Image.fromarray(la.astype(np.uint8)), (0, 0)); sh.paste(Image.fromarray(ca.astype(np.uint8)), (tw + 10, 0))
                    d = Image.fromarray((np.abs(la - ca).max(axis=2) > THRESH).astype(np.uint8) * 255).convert('RGB')
                    sheet = Image.new('RGB', (tw * 3 + 20, t['height']), (128, 128, 128)); sheet.paste(sh, (0, 0)); sheet.paste(d, (tw * 2 + 20, 0))
                    sheet.resize((sheet.size[0] // 3, max(1, sheet.size[1] // 3))).save(os.path.join(sheets, f"{lv['slug']}__{i}_{ls['id']}__{t['off']}.jpg"), quality=70)
            rows.append({'i': i, 'id': ls['id'], 'instance': ls['instance'], 'liveTop': ls['top'], 'liveH': ls['h'], 'cloneH': cs['h'] if cs else None,
                         'tiles': len(ls['tiles']), 'maskedPct': round(100 * mk / max(tot, 1), 1), 'rawPct': round(100 * m / n, 1) if n else 0.0, 'inkPct': round(100 * im / inn, 1) if inn else 100.0,
                         'geoPct': round(100 * geo_score(ls, cs), 1)})
        extra = [f"{k[0]}#{k[1]}" for k in cmap if k not in {(s['id'], s['instance']) for s in lv['sections']}]
        res[r] = {'liveDoc': lv['doc'], 'cloneDoc': cv['doc'] if cv else None, 'liveSections': len(lv['sections']), 'cloneSections': len(cv['sections']) if cv else 0,
                  'cloneOnlySections': extra, 'sections': rows,
                  'rawAvg': round(sum(x['rawPct'] for x in rows) / max(1, len(rows)), 1), 'rawMin': min([x['rawPct'] for x in rows] or [0]),
                  'inkAvg': round(sum(x['inkPct'] for x in rows) / max(1, len(rows)), 1), 'geoAvg': round(sum(x['geoPct'] for x in rows) / max(1, len(rows)), 1)}
    json.dump(res, open(outp, 'w'), indent=1)
    for r, v in res.items():
        print(f"{r}: sections {v['liveSections']}/{v['cloneSections']} doc {v['liveDoc']}/{v['cloneDoc']} rawAvg {v['rawAvg']} rawMin {v['rawMin']} ink {v['inkAvg']} geo {v['geoAvg']}")
        for x in v['sections']:
            print(f"   [{x['i']}] {x['id']:28s} raw {x['rawPct']:5.1f} ink {x['inkPct']:5.1f} geo {x['geoPct']:5.1f} h {x['liveH']}/{x['cloneH']}{'  <80' if x['rawPct'] < 80 else ''}")

main()
