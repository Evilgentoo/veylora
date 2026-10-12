import os, sys, shutil

ROOT = os.path.expanduser("~/Downloads/veylora/src")
CSS = os.path.join(ROOT, "styles.css")
MARK = "VEYLORA_BRAND_MARKS"

EDITS = {
 "Yozune.jsx": [
  ('<span className="yz-hero-logo">YOZUNE</span>',
   '<span className="yz-hero-logo"><i className="brand-mark" />YOZUNE</span>'),
  ('<div className="yz-rail-logo">Y</div>',
   '<div className="yz-rail-logo"><i className="brand-mark" /></div>'),
 ],
 "Kairune.jsx": [
  ('<span className="kr-brand"><span className="kr-brand-dot" />Kairune</span>',
   '<span className="kr-brand"><i className="brand-mark" />Kairune</span>'),
 ],
}

css = """
/* VEYLORA_BRAND_MARKS */
.brand-mark {
  display: inline-block; width: 1.15em; height: 1.15em;
  vertical-align: -0.2em; margin-right: .4em;
  background-color: var(--accent);
  -webkit-mask: var(--brand-logo) center / contain no-repeat;
  mask: var(--brand-logo) center / contain no-repeat;
  transition: background-color .2s;
}
.yz-hero-logo .brand-mark, .yz-rail-logo .brand-mark { --brand-logo: url(/brand/yozune.svg); }
.kr-brand .brand-mark { --brand-logo: url(/brand/kairune.svg); }
.yz-rail-logo .brand-mark { width: 1.5em; height: 1.5em; margin: 0; vertical-align: middle; }
"""

texts = {}
for fn, pairs in EDITS.items():
    p = os.path.join(ROOT, fn)
    t = open(p, encoding="utf-8").read()
    for old, new in pairs:
        if t.count(old) != 1:
            sys.exit("ABORT: anchor not found exactly once in %s: %s" % (fn, old))
        t = t.replace(old, new)
    texts[p] = t

css_src = open(CSS, encoding="utf-8").read()
if MARK in css_src:
    sys.exit("ABORT: already applied")

for p, t in texts.items():
    shutil.copy(p, p + ".bak-marks")
    open(p, "w", encoding="utf-8").write(t)
shutil.copy(CSS, CSS + ".bak-marks")
open(CSS, "a", encoding="utf-8").write(css)
print("done. backups: *.bak-marks")
