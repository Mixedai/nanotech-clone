# DISCOVER Section Redesign — "Floating Cards Galaxy"

**Date:** 2026-02-17
**Status:** Approved
**Style:** Glassmorphism/3D + Animated Particles

## Overview

Complete redesign of the DISCOVER section from a beige bento grid layout to a dark, immersive glassmorphism experience with canvas-based particle animations and 3D card interactions.

## Background Layer: Canvas Particle System

- Full-section `<canvas>` element, positioned absolute behind content
- ~120 white/cyan particles (1-3px), varying opacity
- Connection lines between nearby particles (distance < 150px, rgba white)
- Mouse repel effect: particles within ~80px of cursor gently push away
- Colors: white dots with subtle cyan tint, lines in `rgba(255,255,255,0.1)`
- Background: `#0b0b0b` (matches site dark theme, replaces beige)
- Performance: `requestAnimationFrame` loop, pauses when section is outside viewport via IntersectionObserver
- Mobile: particle count reduced to ~60

## Typography

- "DISCOVER" — large bold centered text (clamp size matching project-title-text)
- Glassmorphism pill below: "Browse 1,000+ AI Tools with smart filters"
  - `backdrop-filter: blur(20px)`
  - Semi-transparent white border
  - `scale(0.8) → scale(1)` entrance animation

## Glassmorphism Cards

### Common Card Style
- `background: rgba(255, 255, 255, 0.05)`
- `backdrop-filter: blur(20px)`
- `border: 1px solid rgba(255, 255, 255, 0.1)`
- `border-radius: 20px`
- Brand-colored soft glow (box-shadow) underneath each card

### Card Layout (2-column grid)

| Card | Size | Content | Glow Color |
|------|------|---------|------------|
| Featured | span 2 | ChatGPT 4o — icon, name, description, "Featured" badge | Green (#10a37f) |
| Tool | 1 col | Midjourney V6 — icon, name, category tag | Orange (#FF6D1F) |
| Stats | 1 col | Animated counter "1,200+" + "AI Tools Indexed" | Cyan (#00d4ff) |
| Categories | span 2 | Category chips: Image, Code, Video, Audio, Writing | Purple (#9b59b6) |

### 3D Tilt Effect (hover)
- `perspective(1000px) rotateX(±8deg) rotateY(±8deg)` based on mouse position
- Glow shifts with mouse position
- Smooth return to flat on mouse leave
- Disabled on touch devices

## Animations

### Entrance (ScrollTrigger)
1. Particles fade-in (0.5s)
2. "DISCOVER" slides down + fades (0.6s, power4.out)
3. Pill scales up + fades (0.4s delay)
4. Cards stagger from below — 0.15s stagger, y:80→0, opacity 0→1

### Scroll Parallax
- Title: normal scroll speed
- Cards: each card different parallax speed (upper slower, lower even slower) for depth
- Canvas: slight upward shift relative to scroll

### Mouse Interactions
- Particles: repel within 80px of cursor
- Cards: 3D tilt perspective
- Category chips: `scale(1.05)` + glow increase on hover

## Responsive Breakpoints

- **Desktop (>1024px):** 2-column grid, full particle count, all interactions
- **Tablet (768-1024px):** 2 columns narrower, reduced particles
- **Mobile (<768px):** single column, 60 particles, tilt disabled

## Files Changed

- `index.html` — discover-section HTML rewritten
- `style.css` — remove bento/discover CSS, add glassmorphism styles
- `src/components/bento.js` → `src/components/discover.js` (particle canvas + 3D tilt + animations)
- `src/main.js` — update import from bento to discover
