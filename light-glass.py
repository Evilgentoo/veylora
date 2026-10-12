import os, sys, shutil

CSS = os.path.expanduser("~/Downloads/veylora/src/styles.css")
MARK = "VEYLORA_LIGHT_GLASS"

src = open(CSS, encoding="utf-8").read()
if "VEYLORA_THEME_MODE" not in src:
    sys.exit("ABORT: run add-theme.py first")
if MARK in src:
    sys.exit("ABORT: already applied")

css = """
/* VEYLORA_LIGHT_GLASS */
:root[data-theme="light"] .window:not(.yz-window):not(.kr-window) {
  background: rgba(247,246,251,.68);
  backdrop-filter: blur(34px) saturate(140%);
  -webkit-backdrop-filter: blur(34px) saturate(140%);
}
:root[data-theme="light"] .window:not(.yz-window):not(.kr-window) .settings-sidebar { background: rgba(255,255,255,.28); }
:root[data-theme="light"] .window:not(.yz-window):not(.kr-window) .settings-card { background: rgba(255,255,255,.34); }
"""
shutil.copy(CSS, CSS + ".bak-lightglass")
open(CSS, "a", encoding="utf-8").write(css)
print("done. backup: styles.css.bak-lightglass")
