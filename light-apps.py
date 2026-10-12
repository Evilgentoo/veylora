import os, sys, shutil

CSS = os.path.expanduser("~/Downloads/veylora/src/styles.css")
MARK = "VEYLORA_LIGHT_APPS"

src = open(CSS, encoding="utf-8").read()
if "VEYLORA_THEME_MODE" not in src:
    sys.exit("ABORT: run add-theme.py first")
if MARK in src:
    sys.exit("ABORT: already applied")

css = """
/* VEYLORA_LIGHT_APPS */
@L {
  --app-bg: #f4f2f8; --app-bg2: #ffffff; --app-card: #e4e1ea; --app-panel: #f0eef5;
  --app-fg: #16131d; --app-dim: rgba(22,19,29,.62); --app-line: rgba(0,0,0,.1);
}
@L .yz-window, @L .kr-window { background: var(--app-bg); border-color: rgba(0,0,0,.14); }
@L .yz-window .window-titlebar, @L .kr-window .window-titlebar { background: var(--app-bg2); border-bottom-color: var(--app-line); }
@L .yz-window .window-title, @L .kr-window .window-title { color: #3a3544; }
@L .yz-body, @L .yz-main, @L .yz-search, @L .kr-body, @L .kr-main, @L .kr-search { background: var(--app-bg); }

/* scrollbars */
@L .yz-scroll, @L .yz-search, @L .yz-picker-body, @L .kr-scroll, @L .kr-search, @L .kr-picker-body { scrollbar-color: rgba(0,0,0,.25) transparent; }
@L .yz-scroll::-webkit-scrollbar-thumb, @L .yz-search::-webkit-scrollbar-thumb, @L .yz-picker-body::-webkit-scrollbar-thumb,
@L .kr-scroll::-webkit-scrollbar-thumb, @L .kr-search::-webkit-scrollbar-thumb, @L .kr-picker-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,.25); }

/* Yozune rail */
@L .yz-rail { background: var(--app-bg2); border-right-color: var(--app-line); }
@L .yz-rail-btn { color: var(--app-dim); }
@L .yz-rail-btn:hover { color: var(--app-fg); background: rgba(0,0,0,.06); }
@L .yz-rail-btn.is-active { color: var(--app-fg); background: color-mix(in srgb, var(--accent) 18%, transparent); }

/* Kairune nav */
@L .kr-nav { background: var(--app-bg2); border-bottom-color: var(--app-line); }
@L .kr-nav-link { color: var(--app-dim); }
@L .kr-nav-link:hover, @L .kr-nav-link.is-active { color: var(--app-fg); }
@L .kr-nav-avatar { border-color: rgba(0,0,0,.2); }

/* heroes: fade to the light background, dark text */
@L .yz-hero { background: var(--app-card); }
@L .yz-hero-shade {
  background:
    linear-gradient(90deg, var(--app-bg) 0%, color-mix(in srgb, var(--app-bg) 72%, transparent) 45%, transparent 75%),
    linear-gradient(0deg, var(--app-bg) 0%, transparent 45%);
}
@L .kr-hero-shade {
  background:
    linear-gradient(90deg, var(--app-bg) 0%, color-mix(in srgb, var(--app-bg) 60%, transparent) 40%, transparent 70%),
    linear-gradient(0deg, var(--app-bg) 0%, transparent 55%);
}
@L .yz-hero-title, @L .kr-hero-title { color: var(--app-fg); text-shadow: none; }
@L .yz-hero-meta, @L .kr-hero-sub { color: rgba(22,19,29,.8); }
@L .kr-hero-meta { color: var(--app-dim); }
@L .yz-hero-desc { color: rgba(22,19,29,.85); text-shadow: none; }
@L .kr-hero-desc { color: rgba(22,19,29,.78); }
@L .yz-year { border-color: rgba(0,0,0,.3); }
@L .kr-hero-badge { background: rgba(0,0,0,.06); color: var(--app-fg); border-color: rgba(0,0,0,.12); }

/* buttons */
@L .yz-play { background: #16131d; color: #fff; }
@L .yz-play:hover { background: rgba(22,19,29,.82); }
@L .kr-watch { color: var(--app-fg); border-color: rgba(0,0,0,.3); }
@L .kr-watch:hover { background: rgba(0,0,0,.06); }

/* rows and tiles */
@L .yz-row-title, @L .kr-row-title { color: var(--app-fg); }
@L .kr-row-sub, @L .yz-row-loading, @L .kr-row-loading { color: var(--app-dim); }
@L .yz-tile, @L .kr-card { background: var(--app-card); }
@L .yz-tile img { background: linear-gradient(155deg, #e4e1ea, #cfcbd8); }

/* search */
@L .yz-search-input, @L .kr-search-input { background: #fff; color: var(--app-fg); border-color: rgba(0,0,0,.14); }
@L .yz-search-input::placeholder, @L .kr-search-input::placeholder { color: rgba(22,19,29,.45); }
@L .yz-search-input:focus, @L .kr-search-input:focus { background: #fff; border-color: var(--accent); }
@L .yz-search-title, @L .kr-search-title { color: var(--app-fg); }
@L .yz-search-hint, @L .kr-hint, @L .yz-hint { color: var(--app-dim); }

/* episode picker */
@L .yz-picker, @L .kr-picker { background: #fff; border-color: var(--app-line); box-shadow: 0 30px 80px rgba(0,0,0,.28); }
@L .yz-picker-bar, @L .kr-picker-bar { background: var(--app-panel); border-bottom-color: var(--app-line); }
@L .yz-picker-title, @L .kr-picker-title { color: var(--app-fg); }
@L .yz-picker .yz-picker-close, @L .kr-picker .kr-picker-close { background: rgba(0,0,0,.05); color: var(--app-fg); border-color: rgba(0,0,0,.14); }
@L .yz-picker .yz-picker-close:hover { background: color-mix(in srgb, var(--accent) 85%, transparent); border-color: color-mix(in srgb, var(--accent) 85%, transparent); }
@L .kr-picker .kr-picker-close:hover { background: var(--accent); border-color: var(--accent); color: #000; }
@L .yz-season-row label, @L .kr-season-row label { color: var(--app-dim); }
@L .yz-season-row select, @L .kr-season-row select { background: #fff; color: var(--app-fg); border-color: rgba(0,0,0,.14); }
@L .yz-season-row select:focus, @L .kr-season-row select:focus { border-color: var(--accent); }
@L .yz-ep, @L .kr-ep { background: var(--app-panel); border-color: rgba(0,0,0,.08); color: var(--app-fg); }
@L .yz-ep:hover { border-color: color-mix(in srgb, var(--accent) 60%, transparent); }
@L .kr-ep:hover { border-color: var(--accent); }
@L .yz-ep-still, @L .kr-ep-still { background: var(--app-card); }
@L .yz-ep-still-fb { background: linear-gradient(135deg, #e4e1ea, #cfcbd8); color: rgba(22,19,29,.3); }
@L .kr-ep-still-fb { background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, #e4e1ea), #e4e1ea); color: rgba(22,19,29,.3); }
@L .yz-ep-name, @L .kr-ep-name { color: var(--app-fg); }
@L .yz-ep-meta, @L .kr-ep-meta { color: var(--app-dim); }
"""
css = css.replace("@L", ':root[data-theme="light"]')

shutil.copy(CSS, CSS + ".bak-lightapps")
open(CSS, "a", encoding="utf-8").write(css)
print("done. backup: styles.css.bak-lightapps")
