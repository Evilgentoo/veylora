import os, sys, shutil

ROOT = os.path.expanduser("~/Downloads/veylora/src")
JSX = os.path.join(ROOT, "Veylora.jsx")
CSS = os.path.join(ROOT, "styles.css")
MARK = "VEYLORA_THEME_MODE"

jsx = open(JSX, encoding="utf-8").read()
css_src = open(CSS, encoding="utf-8").read()

if MARK in css_src or "veylora.theme" in jsx:
    sys.exit("ABORT: already applied")

STATE_ANCHOR = "  const [accent, setAccent] = useState(() => {\n"
EFFECT_ANCHOR = "  }, [accent]);\n"
UI_ANCHOR = '<div className="accent-grid">'

for a in (STATE_ANCHOR, EFFECT_ANCHOR, UI_ANCHOR):
    if jsx.count(a) != 1:
        sys.exit("ABORT: anchor not found exactly once:\n" + a)

STATE = """  const [theme, setTheme] = useState(() => {
    try { const v = localStorage.getItem('veylora.theme'); return ['dark', 'light', 'auto'].includes(v) ? v : 'dark'; } catch { return 'dark'; }
  });
"""

EFFECT = """  }, [accent]);
  useEffect(() => {
    try { localStorage.setItem('veylora.theme', theme); } catch {}
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
    const apply = () => {
      const resolved = theme === 'auto' ? (mq && mq.matches ? 'light' : 'dark') : theme;
      document.documentElement.setAttribute('data-theme', resolved);
    };
    apply();
    if (theme === 'auto' && mq) {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);
"""

UI = """<div className="theme-label">COLOR MODE</div>
                    <div className="theme-row" role="group" aria-label="Color mode">
                      {[['dark', 'Dark'], ['light', 'Light'], ['auto', 'Auto']].map(([id, label]) => (
                        <button key={id} type="button" className={`theme-option ${theme === id ? 'chosen' : ''}`} aria-pressed={theme === id} onClick={() => setTheme(id)}>{label}</button>
                      ))}
                    </div>
                    <div className="accent-grid">"""

new_jsx = (jsx.replace(STATE_ANCHOR, STATE + STATE_ANCHOR)
              .replace(EFFECT_ANCHOR, EFFECT)
              .replace(UI_ANCHOR, UI))

L = ':root[data-theme="light"]'
W = ".window:not(.yz-window):not(.kr-window)"
css = """
/* VEYLORA_THEME_MODE */
.theme-label { font-size: 8px; letter-spacing: 1px; color: var(--muted); margin: 0 0 10px; }
.theme-row { display: flex; gap: 8px; margin-bottom: 20px; }
.theme-option { padding: 9px 16px; font-size: 8px; letter-spacing: .8px; border-radius: 8px; background: transparent; border: 1px solid var(--line); }
.theme-option.chosen { color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); border-color: color-mix(in srgb, var(--accent) 40%, transparent); }
L { color: #1d1a26; background: #e9e6ee; --glass: rgba(246,244,250,.78); --line: rgba(0,0,0,.14); --muted: #6b6677; }
L .taskbar { background: rgba(246,244,250,.72); border-color: rgba(0,0,0,.14); box-shadow: 0 12px 36px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.6); }
L .dock-separator, L .dock-divider { background: rgba(0,0,0,.18); }
L .tray-icon { color: rgba(29,26,38,.82); }
L W { background: rgba(247,246,251,.92); border-color: rgba(0,0,0,.14); box-shadow: 0 28px 90px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.7); }
L W .window-titlebar { border-bottom-color: rgba(0,0,0,.1); background: rgba(0,0,0,.025); }
L W .window-title { color: #3a3544; }
L W .settings-sidebar { background: rgba(0,0,0,.035); border-right-color: rgba(0,0,0,.09); }
L W .sidebar-caption { color: #6f6a7a; }
L W .sidebar-link { color: #5a5465; }
L W .sidebar-link:hover { background: rgba(0,0,0,.05); color: #1d1a26; }
L W .sidebar-footer { border-top-color: rgba(0,0,0,.09); color: #6f6a7a; }
L W .settings-card { border-color: rgba(0,0,0,.11); background: rgba(0,0,0,.03); }
""".replace("L W", L + " " + W).replace("L ", L + " ", 0)

# expand the shorthand "L" safely, one token at a time
import re
css = re.sub(r"^L(?= )", L, css, flags=re.M)
css = css.replace("L .", L + " .")

shutil.copy(JSX, JSX + ".bak-theme")
shutil.copy(CSS, CSS + ".bak-theme")
open(JSX, "w", encoding="utf-8").write(new_jsx)
open(CSS, "a", encoding="utf-8").write(css)
print("done. backups: *.bak-theme")
