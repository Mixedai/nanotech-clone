# USE THEM Section Design — "Floating Dashboard"

**Date:** 2026-02-17
**Status:** Approved
**Style:** Dark background + light floating dashboard mockup, 3D perspective

## Overview

Replace the "Unbreak" section with a "USE THEM" section — completing the AI tools journey: DISCOVER → LEARN → USE THEM. Features a floating dashboard/workspace mockup on a dark background with dot-grid pattern.

## Layout

- Two-column split layout (like DISCOVER but mirrored)
- Left: "USE THEM" title + description + CTA button
- Right: Dashboard mockup with 3D perspective tilt
- Background: dark (#0a0a0f) with subtle gradient + dot-grid pattern (opacity 0.03-0.05)
- Min-height: 100vh, vertically centered content

## Left Side — Text

- "USE THEM" — large bold light text, clamp sized
- Description: "Bring all your AI tools into one workspace. Write prompts, get results, track everything."
- CTA button: "Open Workspace →" (light outline button with hover glow)

## Right Side — Dashboard Mockup

Static HTML/CSS mockup of an AI workspace application:

```
┌─────────────────────────────────────────────┐
│  ● ● ●   AI Workspace          ☰  👤       │  Window bar
├────────┬────────────────────────────────────┤
│        │  Good morning! What would you      │
│  🤖 C  │  like to create today?             │
│  🎨 M  │                                    │
│  ✨ G  │  ┌────────────────────────────┐    │
│  🔊 E  │  │ 💬 Write a prompt...       │    │  Prompt input
│  📝 N  │  └────────────────────────────┘    │
│        │                                    │
│        │  ┌─────┐ ┌─────┐ ┌─────┐         │
│        │  │ 1.2K│ │  47 │ │ 98% │         │  Mini stat cards
│        │  │tasks│ │tools│ │score│         │
│        │  └─────┘ └─────┘ └─────┘         │
├────────┴────────────────────────────────────┤
│  Recent: Blog Post ✓  Image Gen ✓  Code... │  Bottom bar
└─────────────────────────────────────────────┘
```

### Dashboard Elements
- Window bar: traffic light dots (red/yellow/green) + title + menu/avatar icons
- Left sidebar: 5-6 colored tool icons (ChatGPT, Midjourney, Gemini, ElevenLabs, Notion) with active highlight
- Main area: greeting text + prompt input field
- Stats row: 3 clean stat cards (tasks completed, tools used, efficiency score)
- Bottom bar: recent activity items

### 3D Effect
- Default: `perspective(1200px) rotateY(-8deg) rotateX(3deg)`
- Hover: smoothly transitions to `rotateY(0) rotateX(0)` (flattens)
- Multi-layer box-shadow for floating depth effect

## Animations

### Scroll Entrance (ScrollTrigger)
1. "USE THEM" title slides from left (x: -60 → 0, fade in, 0.7s)
2. Description + CTA fade in with stagger (0.3s delay)
3. Dashboard slides from right (x: 100 → 0) with rotation (3deg → 0, 0.8s)
4. Dashboard inner elements appear with stagger (sidebar icons, prompt bar, stats — 0.1s stagger)

### Scroll Parallax
- Dashboard moves up slightly as user scrolls past (scrub parallax)

### Hover Effects
- Dashboard: 3D tilt flattens, shadow grows
- CTA button: scale(1.05) + glow
- No hover on inner dashboard elements

## Dot-Grid Background
- CSS `radial-gradient` pattern
- Very low opacity (0.03-0.05) — subtle texture, not dominant

## Responsive

- Desktop (>1024px): side-by-side, full 3D effect
- Tablet (768-1024px): side-by-side, reduced perspective
- Mobile (<768px): stacked (title on top, dashboard below, smaller), no 3D tilt

## Files Changed

- `index.html` — replace Unbreak section HTML with USE THEM
- `style.css` — add USE THEM section CSS
- `src/components/use-them.js` — new component (3D tilt, scroll animations, inner stagger)
- `src/main.js` — import added
