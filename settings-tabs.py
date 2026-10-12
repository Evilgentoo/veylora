import os, re, shutil, sys

D = os.path.expanduser("~/Downloads/veylora/src/")
V, S = D + "Veylora.jsx", D + "styles.css"
for f in (V, S, D + "SettingsProfile.jsx"):
    if not os.path.exists(f):
        sys.exit("ABORT: missing " + f)

v = open(V, encoding="utf-8").read()
c = open(S, encoding="utf-8").read()
if "SettingsProfile" in v or "VEYLORA_SETTINGS_TABS" in c:
    sys.exit("ABORT: already applied")

# 1. sections list
m = re.search(r"const settingsSections = \[(.*?)\n\];", v, re.S)
if not m:
    sys.exit("ABORT: settingsSections array not found")
ent = re.findall(r"\{[^{}]*\}", m.group(1))
pat = re.compile(r"^\{\s*id:\s*'([^']+)',\s*label:\s*'([^']+)'\s*\}$")
items = []
for e in ent:
    mm = pat.match(e)
    if not mm:
        sys.exit("ABORT: unexpected entry in settingsSections: " + e)
    items.append((mm.group(1), mm.group(2)))
ids = [i for i, _ in items]
if "appearance" not in ids:
    sys.exit("ABORT: no 'appearance' section to split")
out = []
for i, l in items:
    if i == "appearance":
        out += [("profile", "Profile"), ("wallpaper", "Wallpaper"), ("theme", "Theme & Colors"), ("widgets", "Widgets")]
    else:
        out.append((i, l))
arr = "const settingsSections = [\n" + "".join("  { id: '%s', label: '%s' },\n" % t for t in out) + "];"

# 2. anchors in the JSX
imp = "import { useEffect, useRef, useState, useLayoutEffect } from 'react';\n"
st = "useState('appearance')"
start_re = re.compile(r"\{activeSection === 'appearance' && \(\n(\s*)<div className=\"appearance-stack\">")
acc_re = re.compile(r"(\n)(\s*)<div className=\"settings-card\">(\s*)<div className=\"card-heading\">ACCENT COLOR")
wid_re = re.compile(r"(\n)(\s*)<div className=\"settings-card widgets-card\">")
checks = [v.count(imp) == 1, v.count(st) == 1, len(start_re.findall(v)) == 1,
          len(acc_re.findall(v)) == 1, len(wid_re.findall(v)) == 1]
if not all(checks):
    sys.exit("ABORT: anchors did not match exactly once " + str(checks))

shutil.copy(V, V + ".bak-tabs")
shutil.copy(S, S + ".bak-tabs")

v = v[:m.start()] + arr + v[m.end():]
v = v.replace(imp, imp + "import SettingsProfile from './SettingsProfile.jsx';\n", 1)
v = v.replace(st, "useState('wallpaper')", 1)
v = start_re.sub(lambda mm: "{activeSection === 'profile' && <SettingsProfile />}\n              {activeSection === 'wallpaper' && (\n" + mm.group(1) + "<div className=\"appearance-stack\">", v, 1)
v = acc_re.sub(lambda mm: "\n                </div>\n              )}\n              {activeSection === 'theme' && (\n                <div className=\"appearance-stack\">" + "\n" + mm.group(2) + "<div className=\"settings-card\">" + mm.group(3) + "<div className=\"card-heading\">ACCENT COLOR", v, 1)
v = wid_re.sub(lambda mm: "\n                </div>\n              )}\n              {activeSection === 'widgets' && (\n                <div className=\"appearance-stack\">" + "\n" + mm.group(2) + "<div className=\"settings-card widgets-card\">", v, 1)

css = """
/* VEYLORA_SETTINGS_TABS */
:root:not([data-theme="light"]) .window:has(.settings-layout) {
  background: rgba(18,17,24,.5);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
}
:root:not([data-theme="light"]) .window:has(.settings-layout) .settings-sidebar { background: rgba(0,0,0,.18); }
:root:not([data-theme="light"]) .window:has(.settings-layout) .settings-card { background: rgba(255,255,255,.045); }
.sp-card { display: grid; gap: 14px; }
.sp-top { display: flex; gap: 18px; align-items: center; }
.sp-avatar { width: 84px; height: 84px; flex: 0 0 84px; border-radius: 50%; overflow: hidden; padding: 0; display: grid; place-items: center; cursor: pointer; background: rgba(128,128,140,.25); border: 2px solid var(--accent); color: inherit; font-size: 30px; font-weight: 700; }
.sp-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sp-fields { display: grid; gap: 10px; flex: 1; min-width: 0; }
.sp-fields label, .sp-pass { display: grid; gap: 6px; }
.sp-label { font-size: 10px; letter-spacing: 1px; opacity: .6; }
.sp-input { width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 9px; border: 1px solid rgba(128,128,140,.35); background: rgba(128,128,140,.12); color: inherit; font: inherit; font-size: 13px; outline: none; }
.sp-input:focus { border-color: var(--accent); }
.sp-photo-row, .sp-actions { display: flex; gap: 8px; flex-wrap: wrap; }
"""
open(V, "w", encoding="utf-8").write(v)
open(S, "w", encoding="utf-8").write(c.rstrip("\n") + "\n" + css)
print("done. tabs:", ", ".join(l for _, l in out))
print("backups: Veylora.jsx.bak-tabs, styles.css.bak-tabs")
