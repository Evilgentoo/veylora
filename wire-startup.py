import os, shutil, sys

P = os.path.expanduser("~/Downloads/veylora/src/main.jsx")
for f in ("Startup.jsx", "startup.css"):
    if not os.path.exists(os.path.expanduser("~/Downloads/veylora/src/" + f)):
        sys.exit("ABORT: missing src/" + f)
if not os.path.exists(P):
    sys.exit("ABORT: src/main.jsx not found")

s = open(P, encoding="utf-8").read()
if "Startup" in s:
    sys.exit("ABORT: already wired")

a1 = "import Veylora from './Veylora.jsx';\n"
a2 = "<React.StrictMode><Veylora /></React.StrictMode>"
if s.count(a1) != 1 or s.count(a2) != 1:
    sys.exit("ABORT: anchors did not match exactly once")

shutil.copy(P, P + ".bak-startup")
s = s.replace(a1, a1 + "import Startup from './Startup.jsx';\n")
s = s.replace(a2, "<React.StrictMode><Startup><Veylora /></Startup></React.StrictMode>")
open(P, "w", encoding="utf-8").write(s)
print("wired. backup: src/main.jsx.bak-startup")
