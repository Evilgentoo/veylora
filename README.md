# Veylora — starter shell

Early Vite + React desktop shell for the Veylora project.

## Run

```bash
npm install
npm run dev
```

## Current scope

- Desktop surface with basic selectable desktop items and a context menu.
- Floating glass taskbar with launcher, Settings entry, simulated system tray, and clock.
- Settings window with Silkscreen typography, sidebar navigation, draggable title bar, close/minimize/maximize controls, and local wallpaper selection.
- Configuration categories are visual placeholders for later phases.

The wallpaper is intentionally not bundled. Choose a starting wallpaper when you have it, or use Settings → Appearance → Choose Image.

## Patcher workflow

Run `bash patchers/02-check.sh` after changes. Keep each future patch focused and backup-aware.
