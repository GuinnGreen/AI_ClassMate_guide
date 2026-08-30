# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Tutorial/documentation website for [ClassMate AI 智慧班級經營系統](https://ai-classmate.com), a master's thesis project. Deployed at [ai-classmate.com/guide](https://ai-classmate.com/guide).

The main ClassMate AI app lives in a **separate repo** — the `classmate-ai---智慧班級經營系統/` directory exists locally but is `.gitignore`'d. This repo only tracks the guide website under `guide/`.

## Development Commands

Run from the `guide/` directory:

```bash
npm install
npm run dev          # http://localhost:3001
npm run build        # Output: guide/dist
npx tsc --noEmit     # Type-check (no lint/test configured)
npm run capture      # Generate animated WebP screenshots (requires main app running at localhost:3000)
```

## Architecture

React 19 + TypeScript + Vite + Tailwind CSS 4 (`@tailwindcss/vite` plugin, no `tailwind.config.js`) + React Router 7.

### Key Decisions

- **HashRouter** (not BrowserRouter) — required for GitHub Pages to serve the single HTML file at `/guide/`.
- **Base path** `/guide/` — set in `vite.config.ts`. All assets resolve relative to this.
- **Path alias** `@guide` maps to the `guide/` directory root.
- **Theme system** — mirrors the main app: `constants/theme.ts` defines `LIGHT_THEME`/`DARK_THEME` palettes, consumed via `ThemeContext`. Components use `useTheme()` for colors rather than Tailwind color classes.
- **No backend** — static site, no Firebase or API calls in the guide itself.

### Source Layout

| Path | Purpose |
|------|---------|
| `guide/App.tsx` | Root: HashRouter with all routes |
| `guide/pages/` | Route-level pages (landing, quick start, FAQ, 9 feature tutorials at `/tutorial/*`) |
| `guide/components/` | Shared layout: `Layout`, `GuideSidebar`, `TutorialStep`, `CalloutBox`, `FeatureCard`, `ImageViewer` |
| `guide/scripts/` | Puppeteer screenshot automation |
| `guide/public/images/` | Generated animated WebP images used in tutorials |

### Screenshot Generation (`npm run capture`)

Uses Puppeteer via `tsx scripts/capture.ts` to automate the **main app** (must be running at `localhost:3000`):

1. Logs in with test account (`test_demo@school.com` / `123456`)
2. Clears all existing Firestore data (students + whiteboard)
3. Seeds 8 sample students with behavior records (`scripts/seedData.ts`)
4. Runs each scene in `scripts/scenes/` — each captures animated WebP frames for one feature
5. Outputs to `public/images/`

## Conventions

- All UI text is in **Traditional Chinese (繁體中文)**.
- Commit messages are in Chinese with conventional-commit-style prefixes (`feat:`, `fix:`, `chore:`, `docs:`).

## Deployment

GitHub Actions auto-deploys to GitHub Pages on push to `main`. The guide site is served at the `/guide/` subpath.
