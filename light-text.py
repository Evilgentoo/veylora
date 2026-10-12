import os, sys, shutil

CSS = os.path.expanduser("~/Downloads/veylora/src/styles.css")
MARK = "VEYLORA_LIGHT_TEXT"

src = open(CSS, encoding="utf-8").read()
if "VEYLORA_THEME_MODE" not in src:
    sys.exit("ABORT: run add-theme.py first")
if MARK in src:
    sys.exit("ABORT: already applied")

css = """
/* VEYLORA_LIGHT_TEXT */
@L .clock small { color: #5a5465; }
@W .eyebrow { color: #7a6a85; }
@W .content-heading h1 { color: #1d1a26; }
@W .content-heading p { color: #5f5a6c; }
@W .card-heading { color: #2c2836; }
@W .tiny-tag { color: #6b6177; border-color: rgba(0,0,0,.14); }
@W .setting-note { color: #5f5a6c; }
@W .about-version { color: #5f5a6c; }
@W .wallpaper-tile-name { color: #1d1a26; }
@W .wallpaper-tile-category { color: #6b6677; }
@W .accent-option { color: #3a3544; border-color: rgba(0,0,0,.12); background: rgba(255,255,255,.4); }
@W .taskbar-slider-label, @W .sys-label { color: #3a3544; }
@W .taskbar-slider-value { color: color-mix(in srgb, var(--accent) 65%, #000); }
@W .sys-seg-btn { color: #5a5465; background: rgba(0,0,0,.04); }
@W .sys-seg-btn.chosen, @W .theme-option.chosen { color: color-mix(in srgb, var(--accent) 62%, #000); background: color-mix(in srgb, var(--accent) 16%, transparent); }
@W .theme-option { color: #3a3544; }
@W .sidebar-link.active { color: color-mix(in srgb, var(--accent) 62%, #000); }
@W .upload-button, @W .taskbar-reset { color: color-mix(in srgb, var(--accent) 60%, #000); }
"""
css = css.replace("@W", ':root[data-theme="light"] .window:not(.yz-window):not(.kr-window)')
css = css.replace("@L", ':root[data-theme="light"]')

shutil.copy(CSS, CSS + ".bak-lighttext")
open(CSS, "a", encoding="utf-8").write(css)
print("done. backup: styles.css.bak-lighttext")
