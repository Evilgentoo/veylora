# Veylora patchers

Patcher scripts are intentionally small and scoped.

- `01-scaffold.sh` copies this starter into `~/Downloads/veylora` and refuses to overwrite an existing path.
- `02-check.sh` checks the core files and runs a production build when dependencies are installed.

Before future patchers modify existing files, they should create timestamped backups under `backups/` and stop if a target file does not match the expected baseline.
