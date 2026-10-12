import os, re, shutil, sys

P = os.path.expanduser("~/Downloads/veylora/src/Veylora.jsx")
if not os.path.exists(P):
    sys.exit("ABORT: src/Veylora.jsx not found")

s = open(P, encoding="utf-8").read()
pat = re.compile(r"file: '/wallpapers/([^']*)'")
n = len(pat.findall(s))
if n == 0:
    sys.exit("ABORT: no file: '/wallpapers/...' entries found (already patched?)")

shutil.copy(P, P + ".bak-basepath")
s = pat.sub(lambda m: "file: import.meta.env.BASE_URL + 'wallpapers/" + m.group(1) + "'", s)
open(P, "w", encoding="utf-8").write(s)

left = len(re.findall(r"/wallpapers/", s))
print("patched entries:", n)
print("other '/wallpapers/' mentions left:", left)
print("backup: src/Veylora.jsx.bak-basepath")
