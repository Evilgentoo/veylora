import os, sys, shutil

ROOT = os.path.expanduser("~/Downloads/veylora/src")

NEW_ACCENTS = [
 ("aurora", "Aurora", "#2dd4bf"),
 ("lagoon", "Lagoon", "#38bdf8"),
 ("citrus", "Citrus", "#c6e23c"),
 ("ember", "Ember", "#ff7a45"),
 ("orchid", "Orchid", "#d16bff"),
 ("frost", "Frost", "#cfe3ff"),
 ("rose-gold", "Rose Gold", "#e8a598"),
 ("ultraviolet", "Ultraviolet", "#6c5cff"),
]

JOBS = {
 "Veylora.jsx": [
  ("  { id: 'amber', name: 'Amber', color: '#f5c16c' },\n",
   "  { id: 'amber', name: 'Amber', color: '#f5c16c' },\n"
   + "".join("  { id: '%s', name: '%s', color: '%s' },\n" % a for a in NEW_ACCENTS)),
 ],
 "kairune.css": [
  ("radial-gradient(circle at 30% 30%, var(--accent), #a0420a)",
   "radial-gradient(circle at 30% 30%, var(--accent), color-mix(in srgb, var(--accent) 45%, black))"),
  (".kr-play:hover { background: #ff8838; }",
   ".kr-play:hover { background: color-mix(in srgb, var(--accent) 85%, white); }"),
  ("linear-gradient(135deg, #2a1a0a, #0a0a0a)",
   "linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, #0a0a0a), #0a0a0a)"),
 ],
}

new_texts = {}
for fn, pairs in JOBS.items():
    p = os.path.join(ROOT, fn)
    t = open(p, encoding="utf-8").read()
    for old, new in pairs:
        if t.count(old) != 1:
            sys.exit("ABORT: anchor not found exactly once in %s:\n%s" % (fn, old))
        t = t.replace(old, new)
    new_texts[p] = t

jsx = os.path.join(ROOT, "Veylora.jsx")
if "id: 'aurora'" in open(jsx, encoding="utf-8").read():
    sys.exit("ABORT: new accents already added")

for p, t in new_texts.items():
    shutil.copy(p, p + ".bak-accents")
    open(p, "w", encoding="utf-8").write(t)
print("done. backups: *.bak-accents")
print("added:", ", ".join(a[1] for a in NEW_ACCENTS))
