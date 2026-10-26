# Dota Grid Studio

A desktop editor for native Dota 2 hero grid categories.

## Live desktop preview (no EXE build)

Install dependencies once, then run `pnpm desktop:dev`. This opens the editor in an Electron window and hot reloads after source edits. It does not package or compile an EXE. The development window bypasses VPN proxy settings for its local preview connection.

## Build the Windows app

Run `pnpm desktop:build` to create a portable ZIP in `release/`.

## Automatic local scan

The desktop app scans Steam `userdata` profiles at startup, reads existing `hero_grid_config.json` category sizes, and detects the current monitor resolution and Windows scale. Scan results appear in the editor and installation window.

## Install a grid into Dota 2

1. Open **Установить в Dota**.
2. Choose a detected Steam account, or select its folder under `Steam\userdata` (or its `570\remote\cfg` folder).
3. Close Dota 2, then install the grid. Existing files are backed up before replacement.
