import os, sys, shutil

BASE = os.path.expanduser("~/Downloads/veylora")
SRC = os.path.join(BASE, "src")
JSX = os.path.join(SRC, "Veylora.jsx")
SAVED = os.path.join(BASE, "public/brand/saved/y3-night-pulse.svg")

for p in (JSX, SAVED, os.path.join(SRC, "Tunekai.jsx"), os.path.join(SRC, "tunekai.css")):
    if not os.path.isfile(p):
        sys.exit("ABORT: missing " + p)

jsx = open(JSX, encoding="utf-8").read()
if "Tunekai" in jsx:
    sys.exit("ABORT: Veylora.jsx already mentions Tunekai")

A_IMPORT = "import Kairune from './Kairune';\n"
A_CSS = "import './kairune.css';\n"
A_STATE = "  const kairuneDragOrigin = useRef(null);\n"
A_DOCK = "<Film size={22} strokeWidth={1.8} /></button>\n"
A_RENDER = "      {kairuneOpen && (\n"
for a in (A_IMPORT, A_CSS, A_STATE, A_DOCK, A_RENDER):
    if jsx.count(a) != 1:
        sys.exit("ABORT: anchor not found exactly once:\n" + a)

DOCK = ("        <button className={`dock-icon tunekai-dock ${tunekaiOpen ? 'running' : ''}`} "
        "aria-label=\"Open Tunekai\" title=\"Tunekai\" onClick={() => setTunekaiOpen(true)}><span aria-hidden=\"true\" /></button>\n")
STATE = ("  const [tunekaiOpen, setTunekaiOpen] = useState(false);\n"
         "  const [tunekaiMaximized, setTunekaiMaximized] = useState(false);\n")
RENDER = """      {tunekaiOpen && (
        <Tunekai
          maximized={tunekaiMaximized}
          onClose={() => { setTunekaiOpen(false); setTunekaiMaximized(false); }}
          onMinimize={() => { setTunekaiOpen(false); setTunekaiMaximized(false); }}
          onToggleMaximize={() => setTunekaiMaximized(v => !v)}
        />
      )}
"""

new_jsx = (jsx.replace(A_IMPORT, A_IMPORT + "import Tunekai from './Tunekai';\n")
              .replace(A_CSS, A_CSS + "import './tunekai.css';\n")
              .replace(A_STATE, A_STATE + STATE)
              .replace(A_DOCK, A_DOCK + DOCK)
              .replace(A_RENDER, RENDER + A_RENDER))

shutil.copy(JSX, JSX + ".bak-tunekai")
os.makedirs(os.path.join(BASE, "public/brand"), exist_ok=True)
shutil.copy(SAVED, os.path.join(BASE, "public/brand/tunekai.svg"))
open(JSX, "w", encoding="utf-8").write(new_jsx)
print("done. backup: Veylora.jsx.bak-tunekai")
print("wired Tunekai into the dock and window. logo: public/brand/tunekai.svg")
