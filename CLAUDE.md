# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Monorepo for a master's thesis project. Two independent sub-projects:

- **`classmate-ai---智慧班級經營系統/`** — The main ClassMate AI application (classroom management SPA for Taiwan elementary teachers). Has its own detailed `CLAUDE.md` inside.
- **`guide/`** — Tutorial/documentation website deployed at `/guide/` subpath.

Both projects are built and deployed together to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

## Development Commands

Each project has its own `package.json`. Run commands from their respective directories.

### Main App (`classmate-ai---智慧班級經營系統/`)

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # Output: ./dist
npx tsc --noEmit     # Type-check (no lint/test configured)
```

See `classmate-ai---智慧班級經營系統/CLAUDE.md` for full architecture, environment setup, and conventions.

### Guide Website (`guide/`)

```bash
npm install
npm run dev          # http://localhost:3001
npm run build        # Output: ./dist
npm run capture      # Generate animated WebP screenshots (requires main app at localhost:3000)
```

## Guide Architecture

React 19 + TypeScript + Vite + Tailwind CSS 4 + React Router 7. Base path is `/guide/` (set in `vite.config.ts`).

| Path | Purpose |
|------|---------|
| `guide/pages/` | Route-level pages (landing, quick start, FAQ, 9 feature tutorials) |
| `guide/components/` | Shared layout components (`Layout`, `GuideSidebar`, `TutorialStep`, `CalloutBox`, `FeatureCard`, `ImageViewer`) |
| `guide/scripts/` | Puppeteer screenshot automation (`capture.ts` orchestrates `seedData.ts` + `scenes/`) |
| `guide/public/images/` | Generated animated WebP images used in tutorial pages |
| `guide/contexts/ThemeContext.tsx` | Same light/dark theme system as the main app |
| `guide/constants/theme.ts` | Same `ThemePalette` definitions as the main app |

### Screenshot Generation Flow (`npm run capture`)

1. Logs in to test account (`test_demo@school.com` / `123456`) against the main app at `localhost:3000`
2. Clears all existing Firestore data (students + whiteboard)
3. Seeds 8 sample students with behavior records
4. Iterates through `scripts/scenes/` — each scene captures animated WebP frames for one feature
5. Outputs to `public/images/`

### Routing

Uses `HashRouter` (not `BrowserRouter`) so GitHub Pages serves the single HTML file correctly at `/guide/`.

## Deployment

GitHub Actions builds both projects and merges outputs:
- Main app (`classmate-ai---智慧班級經營系統/dist/`) → root of GitHub Pages
- Guide (`guide/dist/`) → `/guide/` subpath of GitHub Pages

All AI/Firebase secrets are injected as build-time env vars in CI.
