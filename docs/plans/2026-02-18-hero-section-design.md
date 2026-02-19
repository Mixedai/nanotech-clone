# Hero Section Full Revamp — Ambient Glow Design

**Date:** 2026-02-18
**Approach:** Koyu & Minimal — Ambient Glow Hero
**Status:** Approved

## Overview

Full revamp of the hero section with ambient background effects, mouse-interactive spotlight, glassmorphism CTA button, typing subtitle animation, and animated scroll indicator. Premium, Apple/Nanotech-inspired dark aesthetic.

## Background Effects

### Breathing Glow
- Centered radial gradient behind title area
- Color: `rgba(0, 255, 255, 0.03)` — matches existing lens/glasses cyan accent
- Animation: 6s loop, scale 1→1.15 + opacity 0.03→0.05
- Implementation: CSS `::before` pseudo-element on `.hero-section`

### Mouse Spotlight
- Large soft radial gradient follows cursor position
- `pointer-events: none` overlay div positioned via JS `mousemove` + `transform: translate()`
- Gradient: `radial-gradient(circle 250px, rgba(255,255,255,0.04), transparent)`
- GPU-accelerated (transform only, no repaints)
- Disabled on mobile (touch devices)

## Title & Subtitle

### Title
- Keep existing "AI TOOLOGIST" text + lens/glasses OO effect
- Add subtle text-shadow: `0 0 80px rgba(0, 255, 255, 0.08)`
- Entrance: existing slide-up animation, slightly slower for drama

### Subtitle
- Keep existing text: "Discover and become master of AI Tools."
- Typing effect: characters appear one by one with blinking cursor
- Cursor character: `|`, blinks after typing completes

## CTA Button

- Text: "Explore Tools →"
- Style: glassmorphism — `backdrop-filter: blur(20px)`, semi-transparent border
- Matches existing `discover-cta` design language
- Hover: glow effect + `translateY(-2px)` + box-shadow
- Click action: Lenis smooth scroll to `.discover-section`
- Position: below subtitle, centered

## Scroll Indicator

- Replace "SCROLL DOWN" text with animated SVG chevron (˅)
- Bounce animation: `translateY(0→8px)` infinite loop
- "EST 2024" stays on right side of bottom bar

## Entrance Animation Timeline

1. Background breathing glow fade-in (0.5s)
2. Title slide-up (1.5s) — existing but slower
3. Subtitle typing effect (1s, starts 0.5s after title)
4. CTA button slide-up + fade (0.5s)
5. Bottom bar + scroll indicator appear (0.5s)

## Files to Change

| File | Change |
|------|--------|
| `index.html` | Add spotlight div, CTA button, SVG chevron in hero |
| `src/components/hero.js` | Mouse spotlight tracking, typing effect, CTA scroll, enhanced timeline |
| `style.css` | Breathing glow, spotlight, CTA, chevron animation styles |

## Constraints

- No canvas elements (CSS + JS only for performance)
- Mobile: spotlight disabled, typing effect still plays
- Existing parallax scroll effects preserved
- Existing lens/glasses OO effect untouched
