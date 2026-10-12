import os, shutil, sys

SRC = os.path.expanduser("~/Downloads/veylora/src")
JSX = os.path.join(SRC, "Veylora.jsx")

jsx = open(JSX).read()

if "VEYLORA_YOZUNE" in jsx:
    sys.exit("ABORT: already patched")

if "import { useEffect, useRef, useState } from 'react';" not in jsx:
    sys.exit("ABORT: react import not found")

# --- 1. import lines (after the react import) ---
IMPORT_ANCHOR = "import { useEffect, useRef, useState } from 'react';"
IMPORT_BLOCK = IMPORT_ANCHOR + "\nimport Yozune from './Yozune';\nimport './yozune.css';\n"
jsx = jsx.replace(IMPORT_ANCHOR, IMPORT_BLOCK.rstrip("\n"), 1)

# --- 2. state var (next to settingsOpen) ---
STATE_ANCHOR = "const [settingsOpen, setSettingsOpen] = useState(false);"
STATE_NEW = STATE_ANCHOR + "\n  const [yozuneOpen, setYozuneOpen] = useState(false);\n  const [yozuneMaximized, setYozuneMaximized] = useState(false); // VEYLORA_YOZUNE"
if jsx.count(STATE_ANCHOR) != 1:
    sys.exit("ABORT: settingsOpen state line not found exactly once")
jsx = jsx.replace(STATE_ANCHOR, STATE_NEW, 1)

# --- 3. dock icon (next to the settings dock icon) ---
DOCK_ANCHOR = "<button className={`dock-icon settings-dock ${settingsOpen ? 'running' : ''}`} aria-label=\"Open Settings\" title=\"Settings\" onClick={() => setSettingsOpen(true)}><SettingsIcon size={23} strokeWidth={1.8} /></button>"
if jsx.count(DOCK_ANCHOR) != 1:
    sys.exit("ABORT: settings dock button not found exactly once")

DOCK_NEW = DOCK_ANCHOR + "\n        <button className={`dock-icon yozune-dock ${yozuneOpen ? 'running' : ''}`} aria-label=\"Open Yozune\" title=\"Yozune\" onClick={() => setYozuneOpen(true)}><Play size={22} strokeWidth={1.8} /></button>"
jsx = jsx.replace(DOCK_ANCHOR, DOCK_NEW, 1)

# make sure Play is imported
if "Play" not in jsx.split("\n")[0:5].__str__():
    # search for the lucide-react import line and add Play if missing
    import re
    m = re.search(r"import \{([^}]*)\} from 'lucide-react';", jsx)
    if m and " Play" not in m.group(1) and ",Play" not in m.group(1) and "Play," not in m.group(1):
        new_imports = m.group(1).rstrip()
        if not new_imports.endswith(","): new_imports += ","
        new_imports += " Play"
        jsx = jsx.replace(m.group(0), "import {" + new_imports + " } from 'lucide-react';", 1)

# --- 4. render block (before the settings section, or right after it) ---
# Insert right before the closing footer tag of taskbar? No — before </main>.
CLOSE_ANCHOR = "\n    </main>"
if jsx.count(CLOSE_ANCHOR) != 1:
    sys.exit("ABORT: </main> not found exactly once")

RENDER_BLOCK = """
      {yozuneOpen && (
        <Yozune
          maximized={yozuneMaximized}
          onClose={() => { setYozuneOpen(false); setYozuneMaximized(false); }}
          onMinimize={() => setYozuneOpen(false)}
          onToggleMaximize={() => setYozuneMaximized(v => !v)}
        />
      )}
"""
jsx = jsx.replace(CLOSE_ANCHOR, RENDER_BLOCK + CLOSE_ANCHOR, 1)

shutil.copy(JSX, JSX + ".bak-yozune")
open(JSX, "w").write(jsx)
print("patched OK (backup: Veylora.jsx.bak-yozune)")
