import os, sys, shutil

ROOT = os.path.expanduser("~/Downloads/veylora")
CSS = os.path.join(ROOT, "src/styles.css")
BRAND = os.path.join(ROOT, "public/brand")
MARK = "VEYLORA_BRAND_LOGOS"

if not os.path.isfile(CSS) or not os.path.isdir(os.path.join(ROOT, "public")):
    sys.exit("ABORT: styles.css or public/ not found")
src = open(CSS, encoding="utf-8").read()
if MARK in src:
    sys.exit("ABORT: already applied")

def svg(body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
            + body + '</svg>\n')

LOGOS = {
 "yozune.svg": svg(
  '<path d="M47.43 13.62A24 24 0 1 0 47.43 50.38A20.63 20.63 0 1 1 47.43 13.62Z"/>'
  '<path d="M53 24.5L54.6 30.4L60.5 32L54.6 33.6L53 39.5L51.4 33.6L45.5 32L51.4 30.4Z"/>'),
 "kairune.svg": svg(
  '<path fill-rule="evenodd" d="M32 5L39.5 24.5L59 32L39.5 39.5L32 59L24.5 39.5L5 32L24.5 24.5Z '
  'M26 32a6 6 0 1 0 12 0a6 6 0 1 0-12 0Z"/>'),
 "saved/y3-night-pulse.svg": svg(
  "".join('<rect x="%s" y="%s" width="7" height="%s" rx="3.5"/>' % (x, 32 - h / 2, h)
          for x, h in [(8, 16), (18.5, 32), (29, 48), (39.5, 28), (50, 14)])),
}

css = """
/* VEYLORA_BRAND_LOGOS */
.yozune-dock, .kairune-dock { position: relative; }
.yozune-dock svg, .kairune-dock svg { display: none !important; }
.yozune-dock::before, .kairune-dock::before {
  content: ""; display: block; width: 100%; height: 100%;
  background-color: var(--accent);
  -webkit-mask: var(--brand-logo) center / 62% no-repeat;
  mask: var(--brand-logo) center / 62% no-repeat;
  transition: background-color .2s;
}
.yozune-dock  { --brand-logo: url(/brand/yozune.svg); }
.kairune-dock { --brand-logo: url(/brand/kairune.svg); }
"""

shutil.copy(CSS, CSS + ".bak-logos")
os.makedirs(os.path.join(BRAND, "saved"), exist_ok=True)
for name, body in LOGOS.items():
    open(os.path.join(BRAND, name), "w").write(body)
open(CSS, "a", encoding="utf-8").write(css)
print("done. backup: styles.css.bak-logos")
print("wrote:", ", ".join(LOGOS))
