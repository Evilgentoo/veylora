import os, re, sys

ROOT = os.path.expanduser("~/Downloads/veylora")
GN = os.path.join(ROOT, "public/gn-math")
ASSETS = os.path.join(GN, "assets")
HTML = os.path.join(GN, "html")
GI = os.path.join(ROOT, ".gitignore")
MARK = "# gn-math: only referenced assets"
APPLY = "--apply" in sys.argv
BIG = 95 * 1024 * 1024

if not (os.path.isdir(ASSETS) and os.path.isdir(HTML)):
    sys.exit("ABORT: public/gn-math/assets or html not found")

pat = re.compile(r"assets/([^/\"'\s)\\?#<>]+)")
used = set()
for dp, _, fns in os.walk(HTML):
    for fn in fns:
        try:
            with open(os.path.join(dp, fn), "r", encoding="utf-8", errors="ignore") as f:
                for m in pat.finditer(f.read()):
                    used.add(m.group(1))
        except OSError:
            pass

keep = sorted(n for n in used if os.path.exists(os.path.join(ASSETS, n)))

def size_of(p):
    if os.path.isfile(p):
        return os.path.getsize(p)
    t = 0
    for dp, _, fns in os.walk(p):
        for fn in fns:
            try: t += os.path.getsize(os.path.join(dp, fn))
            except OSError: pass
    return t

big = []
total = 0
for n in keep:
    p = os.path.join(ASSETS, n)
    total += size_of(p)
    if os.path.isdir(p):
        for dp, _, fns in os.walk(p):
            for fn in fns:
                fp = os.path.join(dp, fn)
                try:
                    if os.path.getsize(fp) > BIG: big.append(fp)
                except OSError: pass
    elif os.path.getsize(p) > BIG:
        big.append(p)

total_assets = sum(size_of(os.path.join(ASSETS, n)) for n in os.listdir(ASSETS))
print("asset entries in folder:", len(os.listdir(ASSETS)))
print("referenced by game pages:", len(keep))
print("size of referenced:  %.1f MB" % (total / 1048576))
print("size of everything:  %.1f MB" % (total_assets / 1048576))
for n in keep[:40]:
    print("  keep", n, "%.1f MB" % (size_of(os.path.join(ASSETS, n)) / 1048576))
if len(keep) > 40:
    print("  ... and", len(keep) - 40, "more")
for b in big:
    print("  OVER 95 MB, will be left out:", os.path.relpath(b, ROOT))

lines = ["", MARK, "public/gn-math/assets/*"]
lines += ["!public/gn-math/assets/" + n + ("/" if os.path.isdir(os.path.join(ASSETS, n)) else "") for n in keep]
lines += [os.path.relpath(b, ROOT) for b in big]

if not APPLY:
    print("\nDry run only. Nothing changed. Run again with --apply to write .gitignore.")
    sys.exit(0)

cur = open(GI, encoding="utf-8").read().splitlines() if os.path.exists(GI) else []
if MARK in cur:
    sys.exit("ABORT: already applied")
cur = [l for l in cur if l.strip() != "public/gn-math"]
open(GI + ".bak-gn", "w", encoding="utf-8").write("\n".join(cur) + "\n")
open(GI, "w", encoding="utf-8").write("\n".join(cur + lines) + "\n")
print("\n.gitignore updated (backup .gitignore.bak-gn). Now run: git add -A")
