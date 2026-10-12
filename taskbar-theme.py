import os, sys, shutil

ROOT = os.path.expanduser("~/Downloads/veylora/src")
JSX = os.path.join(ROOT, "Veylora.jsx")
CSS = os.path.join(ROOT, "styles.css")
MARK = "VEYLORA_TASKBAR_THEME"

jsx = open(JSX, encoding="utf-8").read()
css_src = open(CSS, encoding="utf-8").read()

if MARK in css_src:
    sys.exit("ABORT: already applied")
if "VEYLORA_THEME_MODE" not in css_src:
    sys.exit("ABORT: run add-theme.py first")

old = "backgroundColor: `rgba(17,16,23,${taskbarOpacity / 100})`"
new = "backgroundColor: `rgba(var(--tb-rgb, 17,16,23), ${taskbarOpacity / 100})`"
if jsx.count(old) != 1:
    sys.exit("ABORT: taskbar background line not found exactly once")

css = """
/* VEYLORA_TASKBAR_THEME */
:root { --tb-rgb: 17,16,23; }
:root[data-theme="light"] { --tb-rgb: 246,244,250; }
"""

shutil.copy(JSX, JSX + ".bak-tbtheme")
shutil.copy(CSS, CSS + ".bak-tbtheme")
open(JSX, "w", encoding="utf-8").write(jsx.replace(old, new))
open(CSS, "a", encoding="utf-8").write(css)
print("done. backups: *.bak-tbtheme")
