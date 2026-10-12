import os, sys, shutil

ROOT = os.path.expanduser("~/Downloads/veylora/src")
JSX = os.path.join(ROOT, "Veylora.jsx")
CSS = os.path.join(ROOT, "styles.css")
MARK = "VEYLORA_DOCK_UNIFIED"

anchor = "  { id: 'ultraviolet', name: 'Ultraviolet', color: '#6c5cff' },\n"
jsx = open(JSX, encoding="utf-8").read()
css_src = open(CSS, encoding="utf-8").read()

if MARK in css_src:
    sys.exit("ABORT: already applied")
if jsx.count(anchor) != 1:
    sys.exit("ABORT: Ultraviolet line not found exactly once (run more-accents.py first?)")
if "id: 'cobalt'" in jsx:
    sys.exit("ABORT: cobalt already added")

new_jsx = jsx.replace(anchor, anchor + "  { id: 'cobalt', name: 'Cobalt', color: '#3b6cff' },\n")

css = """
/* VEYLORA_DOCK_UNIFIED */
:root, [data-theme="dark"] {
  --dock-bg: color-mix(in srgb, var(--accent) 22%, #241d2d);
  --dock-fg: var(--accent);
  --dock-border: color-mix(in srgb, var(--accent) 38%, transparent);
}
[data-theme="light"] {
  --dock-bg: color-mix(in srgb, var(--accent) 30%, #ffffff);
  --dock-fg: color-mix(in srgb, var(--accent) 62%, #000000);
  --dock-border: color-mix(in srgb, var(--accent) 45%, transparent);
}
.dock-icon {
  color: var(--dock-fg) !important;
  background: var(--dock-bg) !important;
  border-color: var(--dock-border) !important;
}
.yozune-dock::before, .kairune-dock::before { background-color: var(--dock-fg); }
.yozune-dock.running, .kairune-dock.running {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent) 60%, transparent), inset 0 1px 0 rgba(255,255,255,.14);
}
"""

shutil.copy(JSX, JSX + ".bak-dock")
shutil.copy(CSS, CSS + ".bak-dock")
open(JSX, "w", encoding="utf-8").write(new_jsx)
open(CSS, "a", encoding="utf-8").write(css)
print("done. backups: *.bak-dock")
