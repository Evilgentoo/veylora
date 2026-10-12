import os, re, shutil, sys

P = os.path.expanduser("~/Downloads/veylora/src/Veylora.jsx")
if not os.path.exists(P):
    sys.exit("ABORT: src/Veylora.jsx not found")

s = open(P, encoding="utf-8").read()
lines = s.split("\n")
pat = re.compile(r"^\s*\{ id: '[^']+', name: .*type: 'video' \},?\s*$")
gone = [l for l in lines if pat.match(l)]
if not gone:
    sys.exit("ABORT: no video wallpaper entries found (already removed?)")

old = "try { return localStorage.getItem('veylora.wallpaper') || ''; } catch { return ''; }"
if s.count(old) != 1:
    sys.exit("ABORT: saved-wallpaper line not found exactly once")

shutil.copy(P, P + ".bak-novideo")
keep = [l for l in lines if not pat.match(l)]
s = "\n".join(keep)
new = "try { const w = localStorage.getItem('veylora.wallpaper') || ''; return /\\.(mp4|webm|mov)$/i.test(w) ? '' : w; } catch { return ''; }"
s = s.replace(old, new, 1)
open(P, "w", encoding="utf-8").write(s)

print("removed %d video wallpapers:" % len(gone))
for l in gone:
    m = re.search(r"name: '([^']+)'", l)
    print("  -", m.group(1) if m else l.strip())
print("backup: src/Veylora.jsx.bak-novideo")
