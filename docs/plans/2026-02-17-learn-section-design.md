# LEARN Section Design — "Clean Course Carousel"

**Date:** 2026-02-17
**Status:** Approved
**Style:** Light theme, horizontal carousel, minimal color

## Overview

Full redesign of the LEARN section from a simple title+subtitle to a light-themed course showcase with horizontal scrolling carousel, drag interaction, and scroll-driven entrance animations.

## Background & Layout

- Background: light grey (#f8f8f8) — strong contrast with dark DISCOVER section
- Split header: left-aligned title area + right "View All" link
- Below header: full-width horizontal carousel of course cards

## Header

- "LEARN" — large bold dark text (#1a1a1a), clamp sized
- Description: "Master AI tools with step-by-step tutorials and hands-on courses."
- Right side: "View All →" text link

## Course Cards (5 cards)

### Card Structure
- Top: dark grey gradient thumbnail (16:9), centered play icon (semi-transparent white circle + triangle), duration badge top-right
- Bottom: white body — title, short description, level badge

### Card Data

| # | Title | Duration | Level |
|---|-------|----------|-------|
| 1 | Prompt Engineering Mastery | 2h 30m | Beginner |
| 2 | AI Image Generation | 1h 45m | Intermediate |
| 3 | ChatGPT for Business | 3h 15m | Beginner |
| 4 | AI Video & Audio Tools | 2h 00m | Advanced |
| 5 | Building AI Workflows | 4h 00m | Intermediate |

### Card Style
- White card, border-radius: 16px, subtle shadow
- Min-width: 320px (fixed width in carousel)
- Hover: translateY(-6px) + shadow increase
- Play icon: semi-transparent white circle, hover scale(1.1)
- Duration badge: dark pill, top-right of thumbnail
- Level badge: color-coded small pill (Beginner=green, Intermediate=blue, Advanced=purple)
- Minimal color — only level badges have color, rest is black/white/grey

### Carousel Behavior
- CSS overflow-x: auto + scroll-snap-type: x mandatory
- Each card: scroll-snap-align: start
- Hidden scrollbar (scrollbar-width: none)
- JS drag-to-scroll (mousedown → mousemove → mouseup)
- Native touch swipe on mobile

## Animations

### Entrance (ScrollTrigger)
1. "LEARN" title slides down + fades (0.6s, power4.out)
2. Description fades in (0.4s delay)
3. Cards stagger from right (0.15s stagger, x: 60 → 0)

### Card Hover
- translateY(-6px) + shadow increase
- Play icon scale(1.1) + opacity increase

## Responsive

- Desktop (>1024px): ~3.5 cards visible
- Tablet (768-1024px): ~2.5 cards visible
- Mobile (<768px): ~1.2 cards visible, title smaller

## Files Changed

- `index.html` — learn section HTML rewritten
- `style.css` — learn section CSS added
- `src/components/learn.js` — new component (carousel drag + scroll animations)
- `src/main.js` — import added
