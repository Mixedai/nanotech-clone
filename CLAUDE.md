# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A vanilla JavaScript creative portfolio/landing page clone with scroll-driven background transitions and interactive animations. No framework — pure HTML + CSS + JS with Vite as the bundler.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

No test runner is configured in this project.

## Architecture

### Entry Points
- `index.html` — Single-page HTML. All sections are statically declared here.
- `style.css` — Global styles + imports component CSS files (`@import './src/components/separator.css'`, `@import './src/components/light-switch.css'`)
- `src/main.js` — Registers GSAP plugins and calls `init*()` functions from each component on `DOMContentLoaded`

### Component Pattern
Each file in `src/components/` exports a single `init*()` named function (e.g., `initCursor`, `initHero`). Components are imperative — they query DOM elements and attach GSAP animations or event listeners. There is no reactive state or component lifecycle.

| File | Responsibility |
|------|---------------|
| `cursor.js` | Custom cursor element follows mouse via GSAP; scales on hover |
| `hero.js` | GSAP timeline entrance animation for header + hero text |
| `projects.js` | ScrollTrigger watches `.project-title-item` elements; activates matching `.project-bg` background |
| `bento.js` | Entrance stagger + scroll-scrub parallax on `.bento-grid-panel` |
| `light-switch.js` | GSAP Draggable cord that toggles `body.light-on` class; adds DOM elements dynamically |
| `ui.js` | `initPreloader` and `initMenu` helpers (currently not imported in `main.js`) |

### Scroll Effect Architecture (Critical)
The layered scroll illusion depends on z-index stacking:

```
z-index 1    → #project-backgrounds   (position: fixed, full viewport, background images)
z-index 5    → .hero-section / .site-footer   (opaque, covers the fixed bg)
z-index 5    → .project-list-section  (transparent — reveals fixed bg when scrolled)
z-index 10   → #main-content wrapper
z-index 15   → .separator-section     (fixed background-attachment parallax)
z-index 40   → .dark-overlay          (light-switch overlay)
z-index 100  → .site-header
z-index 2000 → .menu-overlay
```

When the transparent `.project-list-section` scrolls over the fixed `#project-backgrounds`, ScrollTrigger (in `projects.js`) fades in the corresponding `.project-bg` div, creating the illusion of a background swap.

### GSAP Plugins in Use
- `ScrollTrigger` — registered globally in `main.js`; also re-registered in `bento.js` (redundant but harmless)
- `Draggable` — registered inside `light-switch.js` only

### CSS Organization
- Global layout, typography, and section-level styles: `style.css`
- Component-specific styles co-located as `.css` files in `src/components/` and imported from `style.css`
- Dark/light mode: `body.light-on` class toggled by `light-switch.js`; affects `.lamp-bulb`, `.dark-overlay`, `.hero-title`
