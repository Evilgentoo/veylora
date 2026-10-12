import os, shutil, sys

D = os.path.expanduser("~/Downloads/veylora/src/")
J, C = D + "Startup.jsx", D + "startup.css"
for f in (J, C):
    if not os.path.exists(f):
        sys.exit("ABORT: missing " + f)

s = open(J, encoding="utf-8").read()
c = open(C, encoding="utf-8").read()
if "vs-octo" in s or "vs-octo" in c:
    sys.exit("ABORT: already applied")

imp = "import { useEffect, useRef, useState } from 'react';\n"
i = s.find("function Mark(")
j = s.find("function Boot(")
cssa = ".vs-bar { display: flex;"
if s.count(imp) != 1 or i < 0 or j < i or c.count(cssa) != 1:
    sys.exit("ABORT: anchors did not match")

new = """function Mark({ size = 52 }) {
  const dx = Math.round(size * 0.1), dy = Math.round(size * 0.06);
  return (
    <span className="vs-octo" style={{ transform: 'translate(-' + dx + 'px,-' + dy + 'px) scale(' + size / 16 + ')' }} aria-hidden="true">
      <span className="brand-mark"><Star size={18} fill="currentColor" /></span>
    </span>
  );
}

"""
shutil.copy(J, J + ".bak-octo")
shutil.copy(C, C + ".bak-octo")
s = s.replace(imp, imp + "import { Star } from 'lucide-react';\n", 1)
i = s.find("function Mark("); j = s.find("function Boot(")
s = s[:i] + new + s[j:]
c = c.replace(cssa, ".vs-octo { font-size: 12px; display: grid; place-items: center; }\n.vs-octo .brand-mark { margin: 0; vertical-align: baseline; }\n" + cssa, 1)
open(J, "w", encoding="utf-8").write(s)
open(C, "w", encoding="utf-8").write(c)
print("done. backups: Startup.jsx.bak-octo, startup.css.bak-octo")
