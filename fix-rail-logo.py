import os, sys, shutil

CSS = os.path.expanduser("~/Downloads/veylora/src/styles.css")
MARK = "VEYLORA_RAIL_LOGO_FIX"

src = open(CSS, encoding="utf-8").read()
if "VEYLORA_BRAND_MARKS" not in src:
    sys.exit("ABORT: run add-logo-marks.py first")
if MARK in src:
    sys.exit("ABORT: already applied")

css = """
/* VEYLORA_RAIL_LOGO_FIX */
.yz-rail-logo {
  background: transparent !important;
  box-shadow: none !important;
  border: 0 !important;
  display: grid !important;
  place-items: center !important;
}
.yz-rail-logo .brand-mark {
  display: block !important;
  width: 34px !important;
  height: 34px !important;
  margin: 0 !important;
  background-color: var(--accent) !important;
}
"""

shutil.copy(CSS, CSS + ".bak-rail")
open(CSS, "a", encoding="utf-8").write(css)
print("done. backup: styles.css.bak-rail")
